import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const copy = {
  en: {
    collective: "A collective of independent shops",
    collection: "The collection",
    discover: "Discover",
    story: "Our story",
    shippingTop: "A little extra joy. Free shipping on orders $150+",
    objects: "Objects with soul.",
    warmth: "Spaces with warmth.",
    heroTitle: "For a home that feels like you.",
    explore: "Explore the collection",
    curated: "CURATED WITH INTENTION",
    heading: "The everyday, elevated.",
    subtitle: "Considered design. Natural materials. A little character.",
    all: "All objects",
    search: "Find something beautiful…",
    sort: "Sort by",
    featured: "Featured",
    priceLow: "Price: low to high",
    priceHigh: "Price: high to low",
    new: "Newest",
    pieces: "pieces",
    selected: "A CLOSER LOOK",
    handcrafted: "Beautifully crafted. Made to belong.",
    finish: "Finish",
    quantity: "Quantity",
    add: "Add to bag",
    soldOut: "Sold out",
    stock: "In stock, ready for your home",
    delivery: "Dispatches in 2–3 business days",
    returns: "30-day thoughtful returns",
    details: "Details & care",
    care: "Wipe gently with a soft cloth. Made in small batches; subtle variations make every piece yours.",
    shipping: "Shipping & returns",
    shippingInfo:
      "Shipping is $8, or complimentary on orders of $150 or more. Returns are accepted within 30 days in original condition.",
    footer: "Thoughtfully chosen. Beautifully made.",
    secure: "Secure checkout",
    makers: "Independent makers",
    planet: "Made with intention",
    copyright: "© 2026 Atelier Collective",
    bag: "Your shopping bag",
    emptyBag: "A little room for something beautiful.",
    continue: "Continue exploring",
    subtotal: "Subtotal",
    total: "Total",
    shippingFee: "Shipping",
    free: "Complimentary",
    checkout: "Continue to checkout",
    payment: "Checkout",
    demo: "Demo checkout — no payment will be collected.",
    placeOrder: "Place demo order",
    name: "Full name",
    email: "Email address",
    password: "Password",
    address: "Street address",
    city: "City",
    postalCode: "Postal code",
    country: "Country",
    signIn: "Welcome back",
    login: "Sign in",
    register: "Create account",
    noAccount: "New to this shop?",
    hasAccount: "Already part of the family?",
    account: "Your account",
    logout: "Sign out",
    admin: "Shop manager",
    adminDesc:
      "A thoughtful collection starts here. Manage your shop’s products.",
    addProduct: "Add product",
    editProduct: "Edit product",
    save: "Save product",
    cancel: "Cancel",
    delete: "Delete",
    archive: "Archive",
    restore: "Restore",
    edit: "Edit",
    product: "Product",
    price: "Price",
    inventory: "Stock",
    status: "Status",
    actions: "Actions",
    active: "Active",
    archived: "Archived",
    productName: "Product name",
    productNameAr: "Product name (Arabic)",
    category: "Category",
    categoryAr: "Category (Arabic)",
    description: "Description",
    descriptionAr: "Description (Arabic)",
    image: "Product image",
    badge: "Badge",
    imageUpload: "Upload image",
    back: "Back to collection",
    noResults: "No pieces found",
    clear: "Clear filters",
    favorites: "Saved pieces",
    savedEmpty: "Save your favorites with the heart on each piece.",
    orderSuccess: "A lovely choice.",
    orderThanks:
      "Your demo order has been confirmed. Thank you for shopping thoughtfully.",
    orderRef: "Order reference",
    viewOrders: "Your orders",
    noOrders: "Your first discovery is still ahead.",
    shopSelect: "Explore our shops",
    shopNote: "Three unique worlds. One considered collective.",
    storyTitle: "Fewer things. More meaning.",
    storyText:
      "We believe the objects we live with should have a story. Atelier brings together independent shops with a shared appreciation for honest materials, thoughtful design, and the beauty in the everyday.",
    storyFoot:
      "Discover pieces to keep, rituals to cherish, and a home that is entirely yours.",
    loading: "Finding your next favorite…",
    retry: "Try again",
    error: "We could not load the collection.",
    remove: "Remove",
    added: "Added to your bag",
    saved: "Saved for later",
    removed: "Removed from saved pieces",
    adminDemo: "Try the demo administrator",
    adminDemoNote: "Local demo: admin@atelier.local · AtelierDemo2026!",
    passwordHint: "At least 10 characters",
    loginCheckout: "Sign in to this shop to continue checkout.",
    deleteConfirm: "Delete this product permanently?",
    gallery: "Product grid",
    compact: "Compact grid",
    close: "Close",
    selectShop: "Choose a shop",
    accountNote:
      "Your account belongs to this shop. Sign in separately when you explore another.",
    colors: "Natural finishes",
    paymentMethod: "Payment method",
    demoMethod: "Demo payment",
    featuredBadge: "Bestseller",
    newBadge: "New arrival",
    smallBadge: "Small batch",
    lastingBadge: "Made to last",
    shopAll: "Shop the collection",
    statsProducts: "Total products",
    statsActive: "Active pieces",
    statsStock: "Units in stock",
    stockUnit: "available",
    opening: "Open shop",
    values: "Good things, thoughtfully made.",
    homeTitle: "Small discoveries. Everyday joy.",
    homeText:
      "Meet independent shops with a point of view. Find the pieces that feel like you.",
    homeEyebrow: "WELCOME TO THE COLLECTIVE",
  },
  ar: {
    collective: "مجموعة متاجر مستقلة",
    collection: "المجموعة",
    discover: "اكتشف",
    story: "قصتنا",
    shippingTop: "فرح إضافي. شحن مجاني للطلبات فوق ١٥٠ دولار",
    objects: "أشياء بروح.",
    warmth: "مساحات بدفء.",
    heroTitle: "لمنزل يشبهك بكل تفاصيله.",
    explore: "اكتشف المجموعة",
    curated: "اختيارات بعناية",
    heading: "جمال يرافق يومك.",
    subtitle: "تصميم مدروس. مواد طبيعية. طابع فريد.",
    all: "كل المنتجات",
    search: "ابحث عن شيء جميل…",
    sort: "ترتيب",
    featured: "مختارات",
    priceLow: "السعر: الأقل أولاً",
    priceHigh: "السعر: الأعلى أولاً",
    new: "الأحدث",
    pieces: "قطعة",
    selected: "نظرة أقرب",
    handcrafted: "مصنوع بجمال. لينتمي إليك.",
    finish: "اللمسة",
    quantity: "الكمية",
    add: "أضف إلى الحقيبة",
    soldOut: "نفدت الكمية",
    stock: "متوفر وجاهز لمنزلك",
    delivery: "يُشحن خلال ٢–٣ أيام عمل",
    returns: "إرجاع خلال ٣٠ يوماً",
    details: "التفاصيل والعناية",
    care: "امسح بلطف بقطعة قماش ناعمة. اختلافات بسيطة تجعل كل قطعة مميزة.",
    shipping: "الشحن والإرجاع",
    shippingInfo:
      "الشحن ٨ دولارات، ومجاني للطلبات فوق ١٥٠ دولار. يمكن الإرجاع خلال ٣٠ يوماً بالحالة الأصلية.",
    footer: "مختار بعناية. مصنوع بجمال.",
    secure: "دفع آمن",
    makers: "صنّاع مستقلون",
    planet: "مصنوع بعناية",
    copyright: "© ٢٠٢٦ أتيليه",
    bag: "حقيبة التسوق",
    emptyBag: "مساحة لشيء جميل.",
    continue: "تابع الاستكشاف",
    subtotal: "المجموع الفرعي",
    total: "الإجمالي",
    shippingFee: "الشحن",
    free: "مجاني",
    checkout: "متابعة الدفع",
    payment: "إتمام الطلب",
    demo: "دفع تجريبي — لن يتم تحصيل أي مبلغ.",
    placeOrder: "تأكيد الطلب التجريبي",
    name: "الاسم الكامل",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    address: "عنوان الشارع",
    city: "المدينة",
    postalCode: "الرمز البريدي",
    country: "الدولة",
    signIn: "مرحباً بعودتك",
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
    noAccount: "جديد في هذا المتجر؟",
    hasAccount: "لديك حساب بالفعل؟",
    account: "حسابك",
    logout: "تسجيل الخروج",
    admin: "إدارة المتجر",
    adminDesc: "مجموعة مختارة تبدأ هنا. أدر منتجات متجرك.",
    addProduct: "إضافة منتج",
    editProduct: "تعديل المنتج",
    save: "حفظ المنتج",
    cancel: "إلغاء",
    delete: "حذف",
    archive: "أرشفة",
    restore: "استعادة",
    edit: "تعديل",
    product: "المنتج",
    price: "السعر",
    inventory: "المخزون",
    status: "الحالة",
    actions: "الإجراءات",
    active: "نشط",
    archived: "مؤرشف",
    productName: "اسم المنتج",
    productNameAr: "اسم المنتج بالعربية",
    category: "الفئة",
    categoryAr: "الفئة بالعربية",
    description: "الوصف",
    descriptionAr: "الوصف بالعربية",
    image: "صورة المنتج",
    badge: "الشارة",
    imageUpload: "تحميل صورة",
    back: "العودة للمجموعة",
    noResults: "لم نجد قطعاً",
    clear: "مسح الفلاتر",
    favorites: "قطعك المحفوظة",
    savedEmpty: "احفظ مفضلاتك بالضغط على القلب.",
    orderSuccess: "اختيار جميل.",
    orderThanks: "تم تأكيد طلبك التجريبي. شكراً لتسوقك بعناية.",
    orderRef: "رقم الطلب",
    viewOrders: "طلباتك",
    noOrders: "اكتشافك الأول بانتظارك.",
    shopSelect: "اكتشف متاجرنا",
    shopNote: "ثلاثة عوالم فريدة. مجموعة واحدة.",
    storyTitle: "أشياء أقل. معنى أكثر.",
    storyText:
      "نؤمن بأن للأشياء التي نعيش معها قصصاً. يجمع أتيليه متاجر مستقلة تشترك في تقدير المواد الطبيعية والتصميم المدروس وجمال الحياة اليومية.",
    storyFoot: "اكتشف قطعاً تبقى وطقوساً تُحب ومنزلاً يشبهك.",
    loading: "نبحث عن مفضلتك القادمة…",
    retry: "حاول مجدداً",
    error: "تعذر تحميل المجموعة.",
    remove: "إزالة",
    added: "أضيف إلى حقيبتك",
    saved: "حُفظ لوقت لاحق",
    removed: "أُزيل من المحفوظات",
    adminDemo: "جرّب حساب المدير التجريبي",
    adminDemoNote: "حساب تجريبي محلي",
    passwordHint: "١٠ أحرف على الأقل",
    loginCheckout: "سجّل الدخول لهذا المتجر لإتمام الطلب.",
    deleteConfirm: "حذف هذا المنتج نهائياً؟",
    gallery: "شبكة المنتجات",
    compact: "شبكة مصغرة",
    close: "إغلاق",
    selectShop: "اختر متجراً",
    accountNote:
      "حسابك خاص بهذا المتجر. سجّل دخولك بشكل منفصل في المتاجر الأخرى.",
    colors: "لمسات طبيعية",
    paymentMethod: "طريقة الدفع",
    demoMethod: "دفع تجريبي",
    featuredBadge: "الأكثر مبيعاً",
    newBadge: "جديد",
    smallBadge: "إنتاج محدود",
    lastingBadge: "صنع ليدوم",
    shopAll: "تسوق المجموعة",
    statsProducts: "كل المنتجات",
    statsActive: "المنتجات النشطة",
    statsStock: "الوحدات المتوفرة",
    stockUnit: "متوفر",
    opening: "افتح المتجر",
    values: "أشياء جميلة، مصنوعة بعناية.",
    homeTitle: "اكتشافات صغيرة. فرح يومي.",
    homeText: "تعرّف على متاجر مستقلة وابحث عن قطع تشبهك.",
    homeEyebrow: "مرحباً بك في أتيليه",
  },
};
export function translate(lang, key) {
  return copy[lang]?.[key] || copy.en[key] || key;
}
export function localName(item, field, lang) {
  return (lang === "ar" && item?.[`${field}Ar`]) || item?.[field] || "";
}
export function money(value, lang = "en") {
  return new Intl.NumberFormat(lang === "ar" ? "ar" : "en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value % 1 ? 2 : 0,
  }).format(value);
}
export async function api(path, options = {}) {
  const response = await fetch(`/api${path}`, {
    credentials: "same-origin",
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
}
export function readStored(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}
export function storeValue(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Shopping remains available when storage is disabled. */
  }
}
export function selectProducts(
  products,
  category,
  search,
  sort,
  favorites,
  savedOnly,
) {
  const query = search.trim().toLowerCase();
  const filtered = products.filter(
    (p) =>
      (category === "all" || p.category === category) &&
      (!savedOnly || favorites.includes(p.id)) &&
      `${p.name} ${p.nameAr} ${p.category} ${p.categoryAr}`
        .toLowerCase()
        .includes(query),
  );
  if (sort === "low") filtered.sort((a, b) => a.price - b.price);
  if (sort === "high") filtered.sort((a, b) => b.price - a.price);
  if (sort === "new")
    filtered.sort(
      (a, b) => (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0),
    );
  return filtered;
}
export function cartTotals(cart, products) {
  const lines = cart
    .map((item) => ({
      ...item,
      product: products.find((p) => p.id === item.id),
    }))
    .filter((item) => item.product);
  const subtotalCents = lines.reduce(
    (total, item) =>
      total + Math.round(item.product.price * 100) * item.quantity,
    0,
  );
  const shippingCents = subtotalCents >= 15000 || !lines.length ? 0 : 800;
  return {
    lines,
    subtotal: subtotalCents / 100,
    shipping: shippingCents / 100,
    total: (subtotalCents + shippingCents) / 100,
  };
}
export function badgeLabel(badge, t) {
  return t(
    {
      Bestseller: "featuredBadge",
      "New arrival": "newBadge",
      "Small batch": "smallBadge",
      "Made to last": "lastingBadge",
    }[badge] || badge,
  );
}
export function useDialog(ref, onClose) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const previous = document.activeElement;
    const panel = ref.current;
    panel?.focus();
    const handleKey = (event) => {
      if (event.key === "Escape") closeRef.current();
      if (event.key !== "Tab") return;
      const nodes = [
        ...panel.querySelectorAll(
          'button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex="0"]',
        ),
      ];
      const first = nodes[0],
        last = nodes[nodes.length - 1];
      if (
        event.shiftKey &&
        (document.activeElement === first || document.activeElement === panel)
      ) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      previous?.focus();
    };
  }, [ref]);
}
export function useShopApp() {
  const client = useQueryClient();
  const [lang, setLang] = useState(() =>
    readStored("atelierLanguage", "en") === "ar" ? "ar" : "en",
  );
  const [shopId, setShopId] = useState("terra");
  const [page, setPage] = useState("collection");
  const [modal, setModal] = useState(null);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [selectedId, setSelectedId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [compact, setCompact] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const v = readStored("atelierFavorites", []);
    return Array.isArray(v) ? v : [];
  });
  const [carts, setCarts] = useState(() => {
    const v = readStored("atelierCarts", {});
    return v && typeof v === "object" && !Array.isArray(v) ? v : {};
  });
  const [order, setOrder] = useState(null);
  const mainRef = useRef(null);
  const shopsQuery = useQuery({
    queryKey: ["shops"],
    queryFn: () => api("/shops"),
    staleTime: 60000,
  });
  const productsQuery = useQuery({
    queryKey: ["products", shopId],
    queryFn: () => api(`/shops/${shopId}/products`),
    staleTime: 15000,
  });
  const userQuery = useQuery({
    queryKey: ["user", shopId],
    queryFn: () => api(`/shops/${shopId}/auth/me`),
    staleTime: 0,
  });
  const shop = shopsQuery.data?.find((s) => s.id === shopId);
  const products = productsQuery.data || [];
  const selected = products.find((p) => p.id === selectedId) || products[0];
  const t = (key) => translate(lang, key);
  const cartKey = `${shopId}:${userQuery.data?.id || "guest"}`;
  const cart = Array.isArray(carts[cartKey])
    ? carts[cartKey].filter(
        (i) =>
          i &&
          typeof i.id === "string" &&
          Number.isInteger(i.quantity) &&
          i.quantity > 0 &&
          i.quantity <= 99,
      )
    : [];
  const totals = cartTotals(cart, products);
  const filtered = selectProducts(
    products,
    category,
    search,
    sort,
    favorites,
    savedOnly,
  );
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    storeValue("atelierLanguage", lang);
  }, [lang]);
  useEffect(() => {
    storeValue("atelierCarts", carts);
  }, [carts]);
  useEffect(() => {
    storeValue("atelierFavorites", favorites);
  }, [favorites]);
  useEffect(() => {
    if (!productsQuery.isSuccess) return;
    setCarts((previous) => {
      const stored = previous[cartKey];
      if (!Array.isArray(stored)) return previous;
      const clean = stored
        .filter(
          (item) =>
            item &&
            typeof item.id === "string" &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0,
        )
        .map((item) => ({
          id: item.id,
          quantity: Math.min(
            item.quantity,
            productsQuery.data.find((p) => p.id === item.id)?.stock || 0,
            99,
          ),
        }))
        .filter((item) => item.quantity > 0);
      return JSON.stringify(clean) === JSON.stringify(stored)
        ? previous
        : { ...previous, [cartKey]: clean };
    });
  }, [cartKey, productsQuery.data, productsQuery.isSuccess]);
  function claimCart(user) {
    setCarts((previous) => {
      const guestKey = `${shopId}:guest`,
        ownerKey = `${shopId}:${user.id}`;
      const guest = Array.isArray(previous[guestKey]) ? previous[guestKey] : [];
      const own = Array.isArray(previous[ownerKey]) ? previous[ownerKey] : [];
      const combined = new Map();
      for (const item of [...own, ...guest]) {
        const product = products.find((p) => p.id === item.id);
        if (product && Number.isInteger(item.quantity) && item.quantity > 0)
          combined.set(
            item.id,
            Math.min(
              (combined.get(item.id) || 0) + item.quantity,
              product.stock,
              99,
            ),
          );
      }
      return {
        ...previous,
        [guestKey]: [],
        [ownerKey]: [...combined]
          .filter(([, quantity]) => quantity > 0)
          .map(([id, quantity]) => ({ id, quantity })),
      };
    });
  }
  function changeShop(id) {
    setShopId(id);
    setPage("collection");
    setModal(null);
    setCategory("all");
    setSearch("");
    setSelectedId(null);
    setQuantity(1);
    setSavedOnly(false);
    setOrder(null);
    mainRef.current?.scrollTo({ top: 0 });
  }
  function navigate(target) {
    setPage(target);
    setSavedOnly(false);
    setModal(null);
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }
  function toggleFavorite(id) {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    );
  }
  function selectProduct(id) {
    setSelectedId(id);
    setQuantity(1);
    if (window.innerWidth < 1000) setModal("detail");
  }
  function addToCart(product, count = 1) {
    const current = cart.find((i) => i.id === product.id)?.quantity || 0;
    if (current + count > Math.min(product.stock, 99)) {
      toast.error(t("soldOut"));
      return;
    }
    setCarts((prev) => ({
      ...prev,
      [cartKey]: current
        ? cart.map((i) =>
            i.id === product.id ? { ...i, quantity: i.quantity + count } : i,
          )
        : [...cart, { id: product.id, quantity: count }],
    }));
    toast.success(t("added"));
  }
  function updateCart(id, count) {
    const product = products.find((p) => p.id === id);
    const clamped = Math.min(count, product?.stock || 0, 99);
    setCarts((prev) => ({
      ...prev,
      [cartKey]:
        clamped <= 0
          ? cart.filter((i) => i.id !== id)
          : cart.map((i) => (i.id === id ? { ...i, quantity: clamped } : i)),
    }));
  }
  async function logout() {
    try {
      await api(`/shops/${shopId}/auth/logout`, { method: "POST", body: "{}" });
      client.removeQueries({ queryKey: ["orders"] });
      client.setQueriesData({ queryKey: ["user"] }, null);
      setModal(null);
      setPage("collection");
    } catch (error) {
      toast.error(error.message);
    }
  }
  function showFavorites() {
    setPage("collection");
    setSavedOnly((prev) => !prev);
    mainRef.current
      ?.querySelector("#collection")
      ?.scrollIntoView({ behavior: "smooth" });
  }
  return {
    lang,
    setLang,
    t,
    shopId,
    shop,
    shops: shopsQuery.data || [],
    shopError: shopsQuery.error,
    products,
    productsQuery,
    user: userQuery.data,
    client,
    page,
    modal,
    setModal,
    navigate,
    changeShop,
    category,
    setCategory,
    search,
    setSearch,
    sort,
    setSort,
    selected,
    quantity,
    setQuantity,
    selectProduct,
    compact,
    setCompact,
    savedOnly,
    showFavorites,
    favorites,
    toggleFavorite,
    filtered,
    cart,
    totals,
    addToCart,
    updateCart,
    order,
    setOrder,
    mainRef,
    logout,
    claimCart,
    clearCart: () => setCarts((prev) => ({ ...prev, [cartKey]: [] })),
  };
}
export function useAuth(model) {
  const [register, setRegister] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const user = await api(
        `/shops/${model.shopId}/auth/${register ? "register" : "login"}`,
        { method: "POST", body: JSON.stringify(data) },
      );
      model.claimCart(user);
      model.client.removeQueries({ queryKey: ["orders"] });
      model.client.setQueriesData({ queryKey: ["user"] }, null);
      model.client.setQueryData(["user", model.shopId], user);
      model.setModal(null);
      toast.success(model.t("signIn"));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return { register, setRegister, busy, error, submit };
}
export function useCheckout(model) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const requestId = useRef(crypto.randomUUID());
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const shipping = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const order = await api(`/shops/${model.shopId}/orders`, {
        method: "POST",
        body: JSON.stringify({
          requestId: requestId.current,
          items: model.cart,
          shipping,
        }),
      });
      model.setOrder(order);
      model.clearCart();
      model.client.invalidateQueries({ queryKey: ["products", model.shopId] });
      model.client.invalidateQueries({ queryKey: ["orders", model.shopId] });
      model.setModal("success");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return { busy, error, submit };
}
export function useOrders(model) {
  return useQuery({
    queryKey: ["orders", model.shopId, model.user?.id],
    queryFn: () => api(`/shops/${model.shopId}/orders`),
    enabled: !!model.user,
  });
}
export function useAdmin(model) {
  const [editing, setEditing] = useState(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [image, setImage] = useState("/images/vase.jpg");
  const query = useQuery({
    queryKey: ["adminProducts", model.shopId],
    queryFn: () => api(`/shops/${model.shopId}/products?includeArchived=true`),
    enabled: model.user?.role === "admin",
  });
  function invalidate() {
    model.client.invalidateQueries({
      queryKey: ["adminProducts", model.shopId],
    });
    model.client.invalidateQueries({ queryKey: ["products", model.shopId] });
  }
  function edit(product) {
    setEditing(product || {});
    setImage(product?.image || "/images/vase.jpg");
    setError("");
  }
  async function mutate(product, action) {
    if (action === "delete" && !window.confirm(model.t("deleteConfirm")))
      return;
    setBusy(true);
    setError("");
    try {
      await api(`/shops/${model.shopId}/products/${product.id}`, {
        method: action === "delete" ? "DELETE" : "PUT",
        body: JSON.stringify(
          action === "delete"
            ? {}
            : { ...product, archived: !product.archived },
        ),
      });
      invalidate();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function upload(event) {
    if (!event.target.files[0]) return;
    setBusy(true);
    setError("");
    const form = new FormData();
    form.append("image", event.target.files[0]);
    try {
      const data = await api(`/shops/${model.shopId}/uploads`, {
        method: "POST",
        body: form,
      });
      setImage(data.image);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    const product = {
      ...editing,
      ...fields,
      image,
      price: Number(fields.price),
      stock: Number(fields.stock),
    };
    try {
      await api(
        `/shops/${model.shopId}/products${editing.id ? `/${editing.id}` : ""}`,
        { method: editing.id ? "PUT" : "POST", body: JSON.stringify(product) },
      );
      invalidate();
      setEditing(null);
      toast.success(model.t("save"));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return {
    query,
    editing,
    setEditing,
    busy,
    error,
    image,
    edit,
    mutate,
    upload,
    save,
  };
}
