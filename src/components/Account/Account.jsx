import { FiLogOut, FiSettings, FiPackage } from "react-icons/fi";
import { useOrders, money } from "../../util/help";
import Button from "../Button/Button";
import styles from "./Account.module.css";
export default function Account({ model: m }) {
  const orders = useOrders(m);
  return (
    <div className={styles.account}>
      <div className={styles.avatar}>{m.user.name[0].toUpperCase()}</div>
      <h2>{m.user.name}</h2>
      <p>{m.user.email}</p>
      {m.user.role === "admin" && (
        <Button onClick={() => m.navigate("admin")}>
          <FiSettings />
          {m.t("admin")}
        </Button>
      )}
      <section className={styles.orders}>
        <h3>
          <FiPackage />
          {m.t("viewOrders")}
        </h3>
        {orders.isPending ? (
          <p>{m.t("loading")}</p>
        ) : orders.isError ? (
          <p role="alert">
            {m.t("error")}
            <button onClick={() => orders.refetch()}>{m.t("retry")}</button>
          </p>
        ) : orders.data?.length ? (
          orders.data.map((order) => (
            <div key={order.id}>
              <span>
                #{order.id.slice(0, 8).toUpperCase()}
                <small>
                  {new Date(order.createdAt).toLocaleDateString(m.lang)}
                </small>
              </span>
              <strong>{money(order.totalCents / 100, m.lang)}</strong>
            </div>
          ))
        ) : (
          <p>{m.t("noOrders")}</p>
        )}
      </section>
      <Button secondary onClick={m.logout}>
        <FiLogOut />
        {m.t("logout")}
      </Button>
    </div>
  );
}
