import { FiArrowRight, FiLock } from "react-icons/fi";
import { PiFlowerThin } from "react-icons/pi";
import { useAuth, localName } from "../../util/help";
import Button from "../Button/Button";
import styles from "./Auth.module.css";
export default function Auth({ model: m }) {
  const a = useAuth(m);
  return (
    <div className={styles.auth}>
      <PiFlowerThin />
      <span className={styles.eyebrow}>
        {localName(m.shop, "name", m.lang)}
      </span>
      <h2>
        {m.t(a.register ? "register" : "signIn")}
        <span>.</span>
      </h2>
      <p>{m.t("accountNote")}</p>
      <form onSubmit={a.submit}>
        {a.register && (
          <label>
            {m.t("name")}
            <input name="name" required maxLength={100} autoComplete="name" />
          </label>
        )}
        <label>
          {m.t("email")}
          <input
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            placeholder="you@example.com"
          />
        </label>
        <label>
          {m.t("password")}
          <input
            name="password"
            type="password"
            required
            minLength={10}
            maxLength={200}
            autoComplete={a.register ? "new-password" : "current-password"}
            placeholder={m.t("passwordHint")}
          />
        </label>
        {a.error && (
          <p className={styles.error} role="alert">
            {a.error}
          </p>
        )}
        <Button disabled={a.busy} type="submit">
          {a.busy ? "…" : m.t(a.register ? "register" : "login")}
          <FiArrowRight />
        </Button>
      </form>
      <div className={styles.toggle}>
        {m.t(a.register ? "hasAccount" : "noAccount")}
        <button onClick={() => a.setRegister(!a.register)}>
          {m.t(a.register ? "login" : "register")}
        </button>
      </div>
      <p className={styles.privacy}>
        <FiLock />
        {m.t("accountNote")}
      </p>
    </div>
  );
}
