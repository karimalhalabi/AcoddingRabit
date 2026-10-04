import {
  FiHeart,
  FiShoppingBag,
  FiTruck,
  FiRefreshCw,
  FiChevronDown,
} from "react-icons/fi";
import { PiSparkleThin } from "react-icons/pi";
import { localName, money, badgeLabel } from "../../util/help";
import Button from "../Button/Button";
import Quantity from "../Quantity/Quantity";
import styles from "./ProductDetail.module.css";
export default function ProductDetail({ model: m }) {
  const p = m.selected;
  if (!p) return null;
  return (
    <aside className={styles.detail} key={p.id}>
      <div className={styles.heading}>
        <span>
          <PiSparkleThin />
          {m.t("selected")}
        </span>
        <span>01 — {String(m.products.length).padStart(2, "0")}</span>
      </div>
      <div className={styles.detailImage}>
        <img src={p.image} alt={localName(p, "name", m.lang)} />
        {p.badge && <span>{badgeLabel(p.badge, m.t)}</span>}
        <button
          aria-label={m.t("favorites")}
          aria-pressed={m.favorites.includes(p.id)}
          onClick={() => m.toggleFavorite(p.id)}
        >
          <FiHeart fill={m.favorites.includes(p.id) ? "#a54c3240" : "none"} />
        </button>
      </div>
      <div className={styles.body}>
        <span className={styles.category}>
          {localName(p, "category", m.lang)}
        </span>
        <div className={styles.title}>
          <h2>{localName(p, "name", m.lang)}</h2>
          <strong>{money(p.price, m.lang)}</strong>
        </div>
        <p className={styles.description}>
          {localName(p, "description", m.lang)}
        </p>
        <div className={styles.finish}>
          <span>
            {m.t("finish")} <strong>{p.finish}</strong>
          </span>
          <div className={styles.swatches}>
            <span className={styles.swatchSelected} />
            <span />
            <span />
          </div>
        </div>
        <div className={styles.quantityRow}>
          <span>{m.t("quantity")}</span>
          <Quantity
            label={m.t("quantity")}
            value={m.quantity}
            max={Math.min(p.stock, 99)}
            onChange={m.setQuantity}
          />
        </div>
        <Button
          className={styles.addButton}
          disabled={p.stock === 0}
          onClick={() => m.addToCart(p, m.quantity)}
        >
          <FiShoppingBag />
          {m.t(p.stock ? "add" : "soldOut")}
          <span>{money(p.price * m.quantity, m.lang)}</span>
        </Button>
        <span className={styles.stock}>
          <i className={p.stock ? styles.inStock : styles.outOfStock} />
          {m.t(p.stock ? "stock" : "soldOut")}
        </span>
        <div className={styles.shipping}>
          <p>
            <FiTruck />
            {m.t("delivery")}
          </p>
          <p>
            <FiRefreshCw />
            {m.t("returns")}
          </p>
        </div>
        {[
          ["details", "care"],
          ["shipping", "shippingInfo"],
        ].map(([title, text]) => (
          <details key={title} className={styles.accordion}>
            <summary>
              {m.t(title)}
              <FiChevronDown />
            </summary>
            <p>{m.t(text)}</p>
          </details>
        ))}
      </div>
    </aside>
  );
}
