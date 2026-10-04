import { FiHeart, FiPlus, FiArrowUpRight } from "react-icons/fi";
import { localName, money, badgeLabel } from "../../util/help";
import styles from "./ProductCard.module.css";
export default function ProductCard({ product: p, model: m, index }) {
  const selected = m.selected?.id === p.id;
  return (
    <article
      className={`${styles.card} ${selected ? styles.selected : ""}`}
      style={{ animationDelay: `${index * 45}ms` }}
    >
      <button
        className={styles.imageButton}
        aria-label={`${localName(p, "name", m.lang)} — ${money(p.price, m.lang)}`}
        aria-pressed={selected}
        onClick={() => m.selectProduct(p.id)}
      >
        <img
          src={p.image}
          alt={localName(p, "name", m.lang)}
          loading={index < 3 ? "eager" : "lazy"}
        />
        <div className={styles.overlay}>
          <span>{localName(p, "category", m.lang)}</span>
          <div>
            <h3>{localName(p, "name", m.lang)}</h3>
            <FiArrowUpRight />
          </div>
        </div>
      </button>
      {p.badge && (
        <span className={styles.badge}>{badgeLabel(p.badge, m.t)}</span>
      )}
      <button
        className={`${styles.favorite} ${m.favorites.includes(p.id) ? styles.saved : ""}`}
        aria-label={`${m.t("favorites")}: ${localName(p, "name", m.lang)}`}
        aria-pressed={m.favorites.includes(p.id)}
        onClick={() => m.toggleFavorite(p.id)}
      >
        <FiHeart />
      </button>
      <div className={styles.cardFooter}>
        <span>
          {money(p.price, m.lang)}
          <small>{p.stock === 0 ? m.t("soldOut") : m.t("colors")}</small>
        </span>
        <button
          className={styles.quickAdd}
          disabled={!p.stock}
          aria-label={`${m.t("add")}: ${localName(p, "name", m.lang)}`}
          onClick={() => m.addToCart(p)}
        >
          <FiPlus />
        </button>
      </div>
    </article>
  );
}
