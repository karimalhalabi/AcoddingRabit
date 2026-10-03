import { FiTruck, FiArrowUpRight } from "react-icons/fi";
import styles from "./Navigation.module.css";
export default function Navigation({ model: m }) {
  return (
    <nav className={styles.navigation} aria-label="Main navigation">
      <div className={styles.links}>
        {[
          ["home", "discover"],
          ["collection", "collection"],
          ["story", "story"],
        ].map(([page, key]) => (
          <button
            key={page}
            className={m.page === page ? styles.active : ""}
            onClick={() => m.navigate(page)}
          >
            {m.t(key)}
          </button>
        ))}
        {m.user?.role === "admin" && (
          <button
            className={m.page === "admin" ? styles.active : ""}
            onClick={() => m.navigate("admin")}
          >
            {m.t("admin")}
            <FiArrowUpRight />
          </button>
        )}
      </div>
      <span className={styles.shipping}>
        <FiTruck />
        {m.t("shippingTop")}
      </span>
    </nav>
  );
}
