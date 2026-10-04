process.env.NODE_ENV = "test";
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { randomUUID } = require("node:crypto");
const { createApp } = require("./app.cjs");
let server, db, base, terraAdmin, rootAdmin, customer;
const shipping = {
  name: "Test Customer",
  email: "test@example.com",
  address: "12 Test Lane",
  city: "Demo City",
  postalCode: "12345",
  country: "Test",
};
const product = {
  name: "Test Vessel",
  nameAr: "إناء تجريبي",
  category: "Ceramics",
  categoryAr: "خزف",
  description: "Synthetic test product.",
  descriptionAr: "منتج تجريبي",
  price: 12.34,
  stock: 10,
  image: "/images/vase.jpg",
  badge: "",
  finish: "Sand",
};
async function request(path, method = "GET", body, cookie, headers = {}) {
  const response = await fetch(`${base}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { cookie } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return {
    status: response.status,
    body: await response.json(),
    cookie: response.headers.get("set-cookie")?.split(";")[0],
    headers: response.headers,
  };
}
async function login(shop) {
  const result = await request(`/shops/${shop}/auth/login`, "POST", {
    email: "admin@atelier.local",
    password: "AtelierDemo2026!",
  });
  assert.equal(result.status, 200);
  return result.cookie;
}
before(async () => {
  const instance = createApp(":memory:");
  db = instance.db;
  server = instance.app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  base = `http://127.0.0.1:${server.address().port}/api`;
  terraAdmin = await login("terra");
  rootAdmin = await login("root");
  const user = await request("/shops/terra/auth/register", "POST", {
    name: "Test User",
    email: "test@example.com",
    password: "CustomerPassword2026",
    role: "admin",
  });
  customer = user.cookie;
  assert.equal(user.body.role, "customer");
});
after(async () => {
  await new Promise((resolve) => server.close(resolve));
  db.close();
});
test("three catalogs are independently scoped and unknown shops return 404", async () => {
  const shops = await request("/shops");
  assert.equal(shops.body.length, 3);
  for (const shop of shops.body) {
    const result = await request(`/shops/${shop.id}/products`);
    assert.equal(result.status, 200);
    assert.ok(result.body.length > 0);
    assert.ok(result.body.every((p) => p.shopId === shop.id));
  }
  assert.equal((await request("/shops/unknown/products")).status, 404);
});
test("sessions and admin permissions cannot cross tenant boundaries", async () => {
  assert.equal(
    (await request("/shops/root/auth/me", "GET", undefined, terraAdmin)).body,
    null,
  );
  assert.equal(
    (await request("/shops/root/products", "POST", product, terraAdmin)).status,
    401,
  );
  assert.equal(
    (await request("/shops/terra/products", "POST", product, customer)).status,
    403,
  );
  assert.equal((await request("/shops/terra/products")).status, 200);
  assert.equal(
    (await request("/shops/terra/products?includeArchived=true")).status,
    401,
  );
  assert.equal(
    (
      await request("/shops/terra/auth/login", "POST", {
        email: "test@example.com",
        password: "WrongPassword2026",
      })
    ).status,
    401,
  );
});
test("cache invalidates through create, edit, archive, restore and delete", async () => {
  await request("/shops/terra/products");
  assert.equal(
    (await request("/shops/terra/products")).headers.get("x-catalog-cache"),
    "HIT",
  );
  const created = await request(
    "/shops/terra/products",
    "POST",
    { ...product, shopId: "root" },
    terraAdmin,
  );
  assert.equal(created.status, 201);
  assert.equal(created.body.shopId, "terra");
  assert.ok(Number.isFinite(Date.parse(created.body.createdAt)));
  const id = created.body.id;
  let list = await request("/shops/terra/products");
  assert.equal(list.headers.get("x-catalog-cache"), "MISS");
  assert.ok(list.body.find((p) => p.id === id));
  assert.equal(
    (await request(`/shops/root/products/${id}`, "PUT", product, rootAdmin))
      .status,
    404,
  );
  const updated = { ...created.body, name: "Updated Test", archived: true };
  assert.equal(
    (await request(`/shops/terra/products/${id}`, "PUT", updated, terraAdmin))
      .status,
    200,
  );
  assert.ok(
    !(await request("/shops/terra/products")).body.find((p) => p.id === id),
  );
  assert.ok(
    (
      await request(
        "/shops/terra/products?includeArchived=true",
        "GET",
        undefined,
        terraAdmin,
      )
    ).body.find((p) => p.id === id),
  );
  await request(
    `/shops/terra/products/${id}`,
    "PUT",
    { ...updated, archived: false },
    terraAdmin,
  );
  assert.ok(
    (await request("/shops/terra/products")).body.find((p) => p.id === id),
  );
  assert.equal(
    (await request(`/shops/root/products/${id}`, "DELETE", {}, rootAdmin))
      .status,
    404,
  );
  assert.equal(
    (await request(`/shops/terra/products/${id}`, "DELETE", {}, terraAdmin))
      .status,
    200,
  );
  assert.ok(
    !(await request("/shops/terra/products")).body.find((p) => p.id === id),
  );
});
test("invalid product values and cross-origin writes are rejected", async () => {
  for (const change of [
    { price: -1 },
    { stock: 1.2 },
    { image: "javascript:alert(1)" },
    { name: "" },
  ])
    assert.equal(
      (
        await request(
          "/shops/terra/products",
          "POST",
          { ...product, ...change },
          terraAdmin,
        )
      ).status,
      400,
    );
  assert.equal(
    (
      await request("/shops/terra/products", "POST", product, terraAdmin, {
        origin: "https://attacker.example",
      })
    ).status,
    403,
  );
});
test("registration is tenant scoped and duplicate registration races are handled", async () => {
  const body = {
    name: "New User",
    email: "race@example.com",
    password: "CustomerPassword2026",
  };
  const results = await Promise.all([
    request("/shops/terra/auth/register", "POST", body),
    request("/shops/terra/auth/register", "POST", body),
  ]);
  assert.deepEqual(results.map((r) => r.status).sort(), [201, 409]);
  assert.equal(
    (await request("/shops/root/auth/register", "POST", body)).status,
    201,
  );
});
test("checkout ignores client prices, is idempotent, and orders are private", async () => {
  const p = (
    await request("/shops/terra/products", "POST", product, terraAdmin)
  ).body;
  const body = {
    requestId: randomUUID(),
    items: [{ id: p.id, quantity: 2, price: 0 }],
    shipping,
    totalCents: 1,
  };
  const first = await request("/shops/terra/orders", "POST", body, customer);
  assert.equal(first.status, 201);
  assert.equal(first.body.totalCents, 3268);
  const repeat = await request("/shops/terra/orders", "POST", body, customer);
  assert.equal(repeat.body.id, first.body.id);
  assert.equal(
    (await request("/shops/terra/products")).body.find((i) => i.id === p.id)
      .stock,
    8,
  );
  assert.equal(
    (await request("/shops/terra/orders", "GET", undefined, customer)).body
      .length,
    1,
  );
  assert.equal(
    (await request("/shops/terra/orders", "GET", undefined, terraAdmin)).body
      .length,
    0,
  );
  assert.equal(
    (await request("/shops/root/orders", "GET", undefined, customer)).status,
    401,
  );
});
test("checkout rollback preserves all inventory and refuses another shop product", async () => {
  const p = (
    await request("/shops/terra/products", "POST", product, terraAdmin)
  ).body;
  const foreign = (await request("/shops/root/products")).body[0];
  const bad = await request(
    "/shops/terra/orders",
    "POST",
    {
      requestId: randomUUID(),
      items: [
        { id: p.id, quantity: 1 },
        { id: foreign.id, quantity: 1 },
      ],
      shipping,
    },
    customer,
  );
  assert.equal(bad.status, 400);
  assert.equal(
    (await request("/shops/terra/products")).body.find((i) => i.id === p.id)
      .stock,
    10,
  );
  const duplicates = await request(
    "/shops/terra/orders",
    "POST",
    {
      requestId: randomUUID(),
      items: [
        { id: p.id, quantity: 1 },
        { id: p.id, quantity: 1 },
      ],
      shipping,
    },
    customer,
  );
  assert.equal(duplicates.status, 400);
  assert.equal(
    (await request("/shops/terra/products")).body.find((i) => i.id === p.id)
      .stock,
    10,
  );
});
test("concurrent orders cannot oversell the final unit", async () => {
  const p = (
    await request(
      "/shops/terra/products",
      "POST",
      { ...product, stock: 1 },
      terraAdmin,
    )
  ).body;
  const results = await Promise.all(
    Array.from({ length: 12 }, () =>
      request(
        "/shops/terra/orders",
        "POST",
        {
          requestId: randomUUID(),
          items: [{ id: p.id, quantity: 1 }],
          shipping,
        },
        customer,
      ),
    ),
  );
  assert.equal(results.filter((r) => r.status === 201).length, 1);
  assert.equal(results.filter((r) => r.status === 409).length, 11);
  assert.equal(
    (await request("/shops/terra/products")).body.find((i) => i.id === p.id)
      .stock,
    0,
  );
});
test("uploaded files require admin access and supported signatures", async () => {
  const form = new FormData();
  form.append(
    "image",
    new Blob(['<svg onload="alert(1)"></svg>'], { type: "image/svg+xml" }),
    "bad.svg",
  );
  const bad = await fetch(`${base}/shops/terra/uploads`, {
    method: "POST",
    headers: { cookie: terraAdmin },
    body: form,
  });
  assert.equal(bad.status, 400);
  const denied = await fetch(`${base}/shops/terra/uploads`, {
    method: "POST",
    headers: { cookie: customer },
    body: form,
  });
  assert.equal(denied.status, 403);
});
test("logout revokes server-side session", async () => {
  const cookie = await login("terra");
  assert.equal(
    (await request("/shops/terra/auth/logout", "POST", {}, cookie)).status,
    200,
  );
  assert.equal(
    (await request("/shops/terra/auth/me", "GET", undefined, cookie)).body,
    null,
  );
});

test("invalid JSON shapes are rejected without server errors", async () => {
  for (const body of [[], null]) {
    assert.equal(
      (await request("/shops/terra/auth/login", "POST", body)).status,
      400,
    );
  }
});
