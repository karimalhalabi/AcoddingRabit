import { FiShoppingBag, FiArrowRight, FiX, FiTruck } from "react-icons/fi";
import { localName, money } from "../../util/help";
import Quantity from "../Quantity/Quantity";
import Button from "../Button/Button";
import styles from "./Cart.module.css";
export default function Cart({ model: m }) {
  return (
    <div className={styles.cart}>
      {!m.totals.lines.length ? (
        <div className={styles.empty}>
          <FiShoppingBag />
          <h2>{m.t("emptyBag")}</h2>
          <Button onClick={() => m.setModal(null)}>
            {m.t("continue")}
            <FiArrowRight />
          </Button>
        </div>
      ) : (
        <>
          <div className={styles.shippingNote}>
            <FiTruck />
            {m.t("shippingTop")}
          </div>
          <div className={styles.lines}>
            {m.totals.lines.map(({ id, quantity, product: p }) => (
              <div className={styles.line} key={id}>
                <img src={p.image} alt={localName(p, "name", m.lang)} />
                <div>
                  <h3>{localName(p, "name", m.lang)}</h3>
                  <p>{money(p.price, m.lang)}</p>
                  <Quantity
                    label={m.t("quantity")}
                    value={quantity}
                    max={Math.min(p.stock, 99)}
                    onChange={(count) => m.updateCart(id, count)}
                  />
                </div>
                <button
                  className={styles.remove}
                  aria-label={`${m.t("remove")} ${localName(p, "name", m.lang)}`}
                  onClick={() => m.updateCart(id, 0)}
                >
                  <FiX />
                </button>
              </div>
            ))}
          </div>
          <div className={styles.totals}>
            <p>
              <span>{m.t("subtotal")}</span>
              <strong>{money(m.totals.subtotal, m.lang)}</strong>
            </p>
            <p>
              <span>{m.t("shippingFee")}</span>
              <span>
                {m.totals.shipping
                  ? money(m.totals.shipping, m.lang)
                  : m.t("free")}
              </span>
            </p>
            <p className={styles.total}>
              <span>{m.t("total")}</span>
              <strong>{money(m.totals.total, m.lang)}</strong>
            </p>
          </div>
          <Button
            className={styles.checkout}
            onClick={() => m.setModal("checkout")}
          >
            {m.t("checkout")}
            <FiArrowRight />
          </Button>
          <button className={styles.continue} onClick={() => m.setModal(null)}>
            {m.t("continue")}
          </button>
        </>
      )}
    </div>
  );
}
