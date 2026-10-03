import {
  FiPlus,
  FiEdit2,
  FiArchive,
  FiTrash2,
  FiRotateCcw,
  FiUpload,
  FiBox,
  FiCheckCircle,
  FiLayers,
} from "react-icons/fi";
import { useAdmin, localName, money } from "../../util/help";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";
import styles from "./Admin.module.css";
export default function Admin({ model: m }) {
  const a = useAdmin(m);
  const products = a.query.data || [];
  if (m.user?.role !== "admin")
    return <Button onClick={() => m.setModal("auth")}>{m.t("login")}</Button>;
  return (
    <section className={styles.admin}>
      <div className={styles.heading}>
        <div>
          <span>{localName(m.shop, "name", m.lang)}</span>
          <h1>{m.t("admin")}</h1>
          <p>{m.t("adminDesc")}</p>
        </div>
        <Button onClick={() => a.edit()}>
          <FiPlus />
          {m.t("addProduct")}
        </Button>
      </div>
      <div className={styles.stats}>
        {[
          [FiBox, "statsProducts", products.length],
          [
            FiCheckCircle,
            "statsActive",
            products.filter((p) => !p.archived).length,
          ],
          [
            FiLayers,
            "statsStock",
            products.reduce((sum, p) => sum + p.stock, 0),
          ],
        ].map(([Icon, label, value]) => (
          <div key={label}>
            <Icon />
            <span>
              {m.t(label)}
              <strong>{value}</strong>
            </span>
          </div>
        ))}
      </div>
      {a.query.isPending ? (
        <p>{m.t("loading")}</p>
      ) : a.query.error ? (
        <div role="alert">
          <p>{m.t("error")}</p>
          <Button onClick={() => a.query.refetch()}>{m.t("retry")}</Button>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                {[
                  "product",
                  "category",
                  "price",
                  "inventory",
                  "status",
                  "actions",
                ].map((key) => (
                  <th key={key}>{m.t(key)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className={styles.productCell}>
                      <img src={p.image} alt="" />
                      <span>
                        {localName(p, "name", m.lang)}
                        <small>{p.id.slice(0, 12)}</small>
                      </span>
                    </div>
                  </td>
                  <td>{localName(p, "category", m.lang)}</td>
                  <td>{money(p.price, m.lang)}</td>
                  <td>{p.stock}</td>
                  <td>
                    <span
                      className={p.archived ? styles.archived : styles.active}
                    >
                      {m.t(p.archived ? "archived" : "active")}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        disabled={a.busy}
                        title={m.t("edit")}
                        aria-label={`${m.t("edit")} ${p.name}`}
                        onClick={() => a.edit(p)}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        disabled={a.busy}
                        title={m.t(p.archived ? "restore" : "archive")}
                        aria-label={`${m.t(p.archived ? "restore" : "archive")} ${p.name}`}
                        onClick={() => a.mutate(p, "archive")}
                      >
                        {p.archived ? <FiRotateCcw /> : <FiArchive />}
                      </button>
                      <button
                        disabled={a.busy}
                        title={m.t("delete")}
                        aria-label={`${m.t("delete")} ${p.name}`}
                        onClick={() => a.mutate(p, "delete")}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {a.editing && (
        <Modal
          title={m.t(a.editing.id ? "editProduct" : "addProduct")}
          onClose={() => a.setEditing(null)}
          closeLabel={m.t("close")}
          wide
        >
          <form onSubmit={a.save} className={styles.editor}>
            <div className={styles.imageEditor}>
              <img src={a.image} alt={m.t("image")} />
              <label className={styles.upload}>
                <FiUpload />
                {m.t("imageUpload")}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={a.upload}
                  disabled={a.busy}
                />
              </label>
              <small>JPG / PNG / WebP · 5 MB</small>
            </div>
            <div className={styles.fields}>
              {[
                ["name", "productName"],
                ["nameAr", "productNameAr"],
                ["category", "category"],
                ["categoryAr", "categoryAr"],
                ["price", "price"],
                ["stock", "inventory"],
                ["finish", "finish"],
                ["badge", "badge"],
              ].map(([field, label]) => (
                <label key={field}>
                  {m.t(label)}
                  <input
                    name={field}
                    required={["name", "category", "price", "stock"].includes(
                      field,
                    )}
                    type={
                      ["price", "stock"].includes(field) ? "number" : "text"
                    }
                    min={field === "price" ? "0.01" : "0"}
                    max={
                      ["price", "stock"].includes(field) ? "100000" : undefined
                    }
                    step={field === "price" ? "0.01" : "1"}
                    maxLength={120}
                    defaultValue={
                      a.editing[field] ?? (field === "stock" ? 0 : "")
                    }
                  />
                </label>
              ))}
              {["description", "descriptionAr"].map((field) => (
                <label key={field} className={styles.fullWidth}>
                  {m.t(field)}
                  <textarea
                    required={field === "description"}
                    name={field}
                    maxLength={2000}
                    defaultValue={a.editing[field] || ""}
                  />
                </label>
              ))}
              {a.error && (
                <p role="alert" className={styles.error}>
                  {a.error}
                </p>
              )}
              <div className={styles.formActions}>
                <Button
                  type="button"
                  secondary
                  onClick={() => a.setEditing(null)}
                >
                  {m.t("cancel")}
                </Button>
                <Button disabled={a.busy}>{a.busy ? "…" : m.t("save")}</Button>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </section>
  );
}
