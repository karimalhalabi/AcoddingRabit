import Header from "./components/Header/Header";
import Navigation from "./components/Navigation/Navigation";
import Footer from "./components/Footer/Footer";
import Hero from "./components/Hero/Hero";
import Collection from "./components/Collection/Collection";
import Modal from "./components/Modal/Modal";
import ProductDetail from "./components/ProductDetail/ProductDetail";
import Cart from "./components/Cart/Cart";
import Auth from "./components/Auth/Auth";
import Checkout from "./components/Checkout/Checkout";
import Admin from "./components/Admin/Admin";
import Home from "./components/Home/Home";
import Story from "./components/Story/Story";
import Account from "./components/Account/Account";
import Button from "./components/Button/Button";
import { useShopApp } from "./util/help";
import styles from "./App.module.css";
export default function App() {
  const m = useShopApp();
  return (
    <div className={styles.app}>
      <Header model={m} />
      <Navigation model={m} />
      <main ref={m.mainRef} className={styles.main} id="mainContent">
        <div className={styles.container}>
          {m.shopError ? (
            <div className={styles.error}>
              {m.t("error")}
              <Button
                onClick={() =>
                  m.client.invalidateQueries({ queryKey: ["shops"] })
                }
              >
                {m.t("retry")}
              </Button>
            </div>
          ) : !m.shop ? (
            <div className={styles.error}>{m.t("loading")}</div>
          ) : m.page === "collection" ? (
            <>
              <Hero model={m} />
              <Collection model={m} />
            </>
          ) : m.page === "home" ? (
            <Home model={m} />
          ) : m.page === "story" ? (
            <Story model={m} />
          ) : (
            <Admin key={m.shopId} model={m} />
          )}
        </div>
      </main>
      <Footer model={m} />
      {m.modal && !["shops"].includes(m.modal) && (
        <Modal
          key={`${m.modal}-${m.shopId}`}
          title={m.t(
            {
              cart: "bag",
              checkout: "payment",
              success: "payment",
              auth: "account",
              detail: "selected",
            }[m.modal],
          )}
          closeLabel={m.t("close")}
          wide={m.modal === "checkout" && !!m.user}
          onClose={() => m.setModal(null)}
        >
          {m.modal === "cart" ? (
            <Cart model={m} />
          ) : m.modal === "auth" ? (
            m.user ? (
              <Account model={m} />
            ) : (
              <Auth model={m} />
            )
          ) : m.modal === "detail" ? (
            <ProductDetail model={m} />
          ) : (
            <Checkout model={m} />
          )}
        </Modal>
      )}
    </div>
  );
}
