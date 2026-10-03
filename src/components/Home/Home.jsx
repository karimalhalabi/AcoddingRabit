import { FiArrowUpRight, FiArrowRight } from "react-icons/fi";
import { PiFlowerThin } from "react-icons/pi";
import { localName } from "../../util/help";
import Button from "../Button/Button";
import styles from "./Home.module.css";
export default function Home({ model: m }) {
  return (
    <section className={styles.home}>
      <div className={styles.intro}>
        <PiFlowerThin />
        <span>{m.t("homeEyebrow")}</span>
        <h1>{m.t("homeTitle")}</h1>
        <p>{m.t("homeText")}</p>
      </div>
      <div className={styles.shops}>
        {m.shops.map((shop, i) => (
          <button
            className={styles.shop}
            key={shop.id}
            onClick={() => m.changeShop(shop.id)}
          >
            <img src={shop.hero} alt={localName(shop, "name", m.lang)} />
            <span className={styles.number}>0{i + 1}</span>
            <div>
              <span>{localName(shop, "category", m.lang)}</span>
              <h2>
                {localName(shop, "name", m.lang)}
                <FiArrowUpRight />
              </h2>
              <p>{localName(shop, "tagline", m.lang)}</p>
            </div>
          </button>
        ))}
      </div>
      <div className={styles.note}>
        <h2>{m.t("values")}</h2>
        <p>{m.t("storyFoot")}</p>
        <Button secondary onClick={() => m.navigate("story")}>
          {m.t("story")}
          <FiArrowRight />
        </Button>
      </div>
    </section>
  );
}
