import { FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import { PiSparkleThin } from "react-icons/pi";
import Button from "../Button/Button";
import { localName } from "../../util/help";
import styles from "./Hero.module.css";
export default function Hero({ model: m }) {
  return (
    <section className={styles.hero}>
      <img
        src={m.shop?.hero}
        alt={
          m.shopId === "terra"
            ? "A warm, naturally furnished living room"
            : localName(m.shop, "name", m.lang)
        }
        className={styles.heroImage}
      />
      <div className={styles.fade} />
      <div className={styles.content}>
        <span className={styles.eyebrow}>
          <span />
          {localName(m.shop, "name", m.lang)} — {m.t("collection")}
        </span>
        <h1>
          {m.shopId === "terra" ? (
            <>
              {m.lang === "en" ? "For a home that" : ""}
              <br className={styles.titleBreak} />
              <em>{m.lang === "en" ? "feels like you." : m.t("heroTitle")}</em>
            </>
          ) : (
            localName(m.shop, "tagline", m.lang)
          )}
        </h1>
        <p>{localName(m.shop, "description", m.lang)}</p>
        <Button
          onClick={() =>
            document
              .getElementById("collection")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          {m.t("explore")}
          <FiArrowRight />
        </Button>
        <div className={styles.heroNote}>
          <PiSparkleThin />
          {m.t("handcrafted")}
        </div>
      </div>
      <div className={styles.imageCaption}>
        <span>THE ART OF SLOW LIVING</span>
        <FiArrowUpRight />
      </div>
      <span className={styles.heroNumber}>
        01 <span>/ 03</span>
      </span>
    </section>
  );
}
