import { PiFlowerThin, PiPlantLight, PiHandHeartLight } from "react-icons/pi";
import { FiLock, FiArrowUpRight } from "react-icons/fi";
import styles from "./Footer.module.css";
export default function Footer({ model: m }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.signature}>
        <PiFlowerThin />
        <div>
          <strong>Little things. Lasting joy.</strong>
          <small>{m.t("copyright")}</small>
        </div>
      </div>
      <div className={styles.values}>
        <span>
          <PiHandHeartLight />
          {m.t("makers")}
        </span>
        <span>
          <PiPlantLight />
          {m.t("planet")}
        </span>
        <span>
          <FiLock />
          {m.t("secure")}
        </span>
      </div>
      <button className={styles.storyLink} onClick={() => m.navigate("story")}>
        {m.t("story")}
        <FiArrowUpRight />
      </button>
    </footer>
  );
}
