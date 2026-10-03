import { PiFlowerThin, PiHandHeartLight, PiPlantLight } from "react-icons/pi";
import { FiArrowRight } from "react-icons/fi";
import Button from "../Button/Button";
import styles from "./Story.module.css";
export default function Story({ model: m }) {
  return (
    <section className={styles.story}>
      <div className={styles.image}>
        <img src="/images/interior.jpg" alt={m.t("story")} />
        <span>THE ATELIER WAY</span>
      </div>
      <div className={styles.content}>
        <PiFlowerThin />
        <span>{m.t("story")}</span>
        <h1>{m.t("storyTitle")}</h1>
        <p>{m.t("storyText")}</p>
        <p>{m.t("storyFoot")}</p>
        <div className={styles.values}>
          <span>
            <PiHandHeartLight />
            {m.t("makers")}
          </span>
          <span>
            <PiPlantLight />
            {m.t("planet")}
          </span>
        </div>
        <Button onClick={() => m.navigate("collection")}>
          {m.t("shopAll")}
          <FiArrowRight />
        </Button>
      </div>
    </section>
  );
}
