import { FiLock, FiCheck, FiArrowRight, FiCreditCard } from "react-icons/fi";
import { useCheckout, money, localName } from "../../util/help";
import Button from "../Button/Button";
import styles from "./Checkout.module.css";
export default function Checkout({ model: m }) {
  const c = useCheckout(m);
  if (m.order && m.modal === "success")
    return (
      <div className={styles.success}>
        <span>
          <FiCheck />
        </span>
        <h2>{m.t("orderSuccess")}</h2>
        <p>{m.t("orderThanks")}</p>
        <small>
          {m.t("orderRef")}: {m.order.id.slice(0, 8).toUpperCase()}
        </small>
        <strong>{money(m.order.totalCents / 100, m.lang)}</strong>
        <Button onClick={() => m.setModal(null)}>
          {m.t("continue")}
          <FiArrowRight />
        </Button>
      </div>
    );
  if (!m.user)
    return (
      <div className={styles.signIn}>
        <FiLock />
        <h2>{m.t("loginCheckout")}</h2>
        <Button onClick={() => m.setModal("auth")}>
          {m.t("login")}
          <FiArrowRight />
        </Button>
      </div>
    );
  if (!m.totals.lines.length) return <p>{m.t("emptyBag")}</p>;
  return (
    <div className={styles.checkout}>
      <form onSubmit={c.submit}>
        <h2>{m.t("payment")}</h2>
        <p className={styles.demo}>{m.t("demo")}</p>
        <div className={styles.fields}>
          {["name", "email", "address", "city", "postalCode", "country"].map(
            (field) => (
              <label
                key={field}
                className={
                  ["address", "email", "name"].includes(field)
                    ? styles.fullWidth
                    : ""
                }
              >
                {m.t(field)}
                <input
                  name={field}
                  type={field === "email" ? "email" : "text"}
                  required
                  maxLength={254}
                  defaultValue={
                    field === "name"
                      ? m.user.name
                      : field === "email"
                        ? m.user.email
                        : ""
                  }
                  autoComplete={
                    {
                      name: "name",
                      email: "email",
                      address: "street-address",
                      city: "address-level2",
                      postalCode: "postal-code",
                      country: "country-name",
                    }[field]
                  }
                />
              </label>
            ),
          )}
        </div>
        <div className={styles.payment}>
          <span>
            <FiCreditCard />
            {m.t("paymentMethod")}
          </span>
          <strong>
            <FiCheck />
            {m.t("demoMethod")}
          </strong>
        </div>
        {c.error && (
          <p className={styles.error} role="alert">
            {c.error}
          </p>
        )}
        <Button disabled={c.busy}>
          {c.busy ? "…" : m.t("placeOrder")}
          <FiArrowRight />
        </Button>
      </form>
      <aside className={styles.summary}>
        <h3>{m.t("bag")}</h3>
        {m.totals.lines.map(({ id, quantity, product: p }) => (
          <div className={styles.line} key={id}>
            <img src={p.image} alt="" />
            <div>
              <span>{localName(p, "name", m.lang)}</span>
              <small>
                {quantity} × {money(p.price, m.lang)}
              </small>
            </div>
          </div>
        ))}
        <div className={styles.totals}>
          <p>
            {m.t("subtotal")}
            <span>{money(m.totals.subtotal, m.lang)}</span>
          </p>
          <p>
            {m.t("shippingFee")}
            <span>
              {m.totals.shipping
                ? money(m.totals.shipping, m.lang)
                : m.t("free")}
            </span>
          </p>
          <strong>
            {m.t("total")}
            <span>{money(m.totals.total, m.lang)}</span>
          </strong>
        </div>
      </aside>
    </div>
  );
}
