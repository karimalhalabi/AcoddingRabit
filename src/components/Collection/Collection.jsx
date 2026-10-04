import { FiSearch, FiGrid, FiColumns, FiArrowRight } from "react-icons/fi";
import ProductCard from "../ProductCard/ProductCard";
import ProductDetail from "../ProductDetail/ProductDetail";
import Button from "../Button/Button";
import styles from "./Collection.module.css";
export default function Collection({ model: m }) {
  const categories = [
    ...new Map(
      m.products.map((p) => [
        p.category,
        m.lang === "ar" && p.categoryAr ? p.categoryAr : p.category,
      ]),
    ).entries(),
  ];
  return (
    <section id="collection" className={styles.collection}>
      <div className={styles.sectionHeading}>
        <div>
          <span className={styles.eyebrow}>{m.t("curated")}</span>
          <h2>
            {m.t(m.savedOnly ? "favorites" : "heading")}
            <span>
              {m.filtered.length} {m.t("pieces")}
            </span>
          </h2>
          <p>{m.t(m.savedOnly ? "savedEmpty" : "subtitle")}</p>
        </div>
        <div className={styles.tools}>
          <div className={styles.search}>
            <FiSearch />
            <input
              aria-label={m.t("search")}
              placeholder={m.t("search")}
              value={m.search}
              onChange={(e) => m.setSearch(e.target.value)}
            />
          </div>
          <div className={styles.viewButtons}>
            <button
              className={!m.compact ? styles.activeView : ""}
              aria-label={m.t("gallery")}
              aria-pressed={!m.compact}
              onClick={() => m.setCompact(false)}
            >
              <FiGrid />
            </button>
            <button
              className={m.compact ? styles.activeView : ""}
              aria-label={m.t("compact")}
              aria-pressed={m.compact}
              onClick={() => m.setCompact(true)}
            >
              <FiColumns />
            </button>
          </div>
        </div>
      </div>
      <div className={styles.filterRow}>
        <div className={styles.categories}>
          <button
            className={m.category === "all" ? styles.selectedCategory : ""}
            onClick={() => m.setCategory("all")}
          >
            {m.t("all")}
          </button>
          {categories.map(([key, label]) => (
            <button
              className={m.category === key ? styles.selectedCategory : ""}
              key={key}
              onClick={() => m.setCategory(key)}
            >
              {label}
            </button>
          ))}
        </div>
        <label className={styles.sort}>
          <span>{m.t("sort")}:</span>
          <select
            aria-label={m.t("sort")}
            value={m.sort}
            onChange={(e) => m.setSort(e.target.value)}
          >
            <option value="featured">{m.t("featured")}</option>
            <option value="low">{m.t("priceLow")}</option>
            <option value="high">{m.t("priceHigh")}</option>
            <option value="new">{m.t("new")}</option>
          </select>
        </label>
      </div>
      {m.productsQuery.isPending ? (
        <div className={styles.loading}>{m.t("loading")}</div>
      ) : m.productsQuery.isError ? (
        <div className={styles.loading}>
          <p>{m.t("error")}</p>
          <Button onClick={() => m.productsQuery.refetch()}>
            {m.t("retry")}
          </Button>
        </div>
      ) : (
        <div className={styles.catalogLayout}>
          <div>
            <div
              className={`${styles.productGrid} ${m.compact ? styles.compactGrid : ""}`}
            >
              {m.filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} model={m} index={i} />
              ))}
            </div>
            {m.filtered.length === 0 && (
              <div className={styles.empty}>
                <FiSearch />
                <h3>{m.t("noResults")}</h3>
                <Button
                  secondary
                  onClick={() => {
                    m.setSearch("");
                    m.setCategory("all");
                    if (m.savedOnly) m.showFavorites();
                  }}
                >
                  {m.t("clear")}
                </Button>
              </div>
            )}
            <div className={styles.collectionEnd}>
              <span>{m.t("values")}</span>
              <button onClick={() => m.navigate("story")}>
                {m.t("story")}
                <FiArrowRight />
              </button>
            </div>
          </div>
          <div className={styles.detailColumn}>
            <ProductDetail model={m} />
          </div>
        </div>
      )}
    </section>
  );
}
