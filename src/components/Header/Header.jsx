import {
  FiChevronDown,
  FiHeart,
  FiShoppingBag,
  FiUser,
  FiArrowUpRight,
  FiCheck,
} from "react-icons/fi";
import { PiFlowerThin } from "react-icons/pi";
import { localName } from "../../util/help";
import styles from "./Header.module.css";
export default function Header({ model: m }) {
  const count = m.cart.reduce((sum, i) => sum + i.quantity, 0);
  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <span>{m.t("collective")}</span>
        <span className={styles.topMessage}>GOOD THINGS. SLOW LIVING.</span>
        <div className={styles.language}>
          <button
            aria-pressed={m.lang === "en"}
            onClick={() => m.setLang("en")}
          >
            EN
          </button>
          <span>/</span>
          <button
            aria-pressed={m.lang === "ar"}
            onClick={() => m.setLang("ar")}
          >
            العربية
          </button>
        </div>
      </div>
      <div className={styles.mainBar}>
        <button
          className={styles.brand}
          onClick={() => m.navigate("home")}
          aria-label="Atelier home"
        >
          <PiFlowerThin />
          <span>
            atelier<span className={styles.brandDot}>.</span>
          </span>
        </button>
        <span className={styles.brandCaption}>{m.t("footer")}</span>
        <div className={styles.shopWrap}>
          <button
            className={styles.shopButton}
            onClick={() => m.setModal(m.modal === "shops" ? null : "shops")}
            aria-expanded={m.modal === "shops"}
          >
            <span className={styles.shopMonogram}>{m.shop?.initials}</span>
            <span>
              <strong>{localName(m.shop, "name", m.lang)}</strong>
              <small>{localName(m.shop, "category", m.lang)}</small>
            </span>
            <FiChevronDown />
          </button>
          {m.modal === "shops" && (
            <div className={styles.shopMenu}>
              <span className={styles.menuLabel}>{m.t("shopSelect")}</span>
              {m.shops.map((shop) => (
                <button key={shop.id} onClick={() => m.changeShop(shop.id)}>
                  <span
                    className={styles.shopMonogram}
                    style={{ color: shop.accent }}
                  >
                    {shop.initials}
                  </span>
                  <span>
                    <strong>{localName(shop, "name", m.lang)}</strong>
                    <small>{localName(shop, "category", m.lang)}</small>
                  </span>
                  {shop.id === m.shopId ? <FiCheck /> : <FiArrowUpRight />}
                </button>
              ))}
              <p>{m.t("shopNote")}</p>
            </div>
          )}
        </div>
        <div className={styles.actions}>
          <button
            className={`${styles.iconButton} ${m.savedOnly ? styles.isActive : ""}`}
            aria-label={m.t("favorites")}
            onClick={m.showFavorites}
          >
            <FiHeart />
            <span className={styles.desktopText}>{m.t("favorites")}</span>
          </button>
          <button
            className={styles.iconButton}
            aria-label={m.t("bag")}
            onClick={() => m.setModal("cart")}
          >
            <FiShoppingBag />
            <span className={styles.bagCount}>{count}</span>
          </button>
          <span className={styles.divider} />
          <button
            className={styles.accountButton}
            aria-label={m.t("account")}
            onClick={() => m.setModal("auth")}
          >
            {m.user ? m.user.name[0].toUpperCase() : <FiUser />}
          </button>
        </div>
      </div>
    </header>
  );
}
