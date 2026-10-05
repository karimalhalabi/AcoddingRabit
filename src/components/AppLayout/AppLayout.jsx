import { useApp } from "../../context/AppContext.jsx";
import { initials, api } from "../../util/helpers.js";
import toast from "react-hot-toast";
import Icon from "../Icon/Icon.jsx";
import s from "./AppLayout.module.css";
export default function AppLayout({ children }) {
  const { page, navigate, language, setLanguage, t, user, setUser } = useApp();
  return (
    <div className={s.appShell}>
      <header className={s.header}>
        <button
          className={s.brand}
          onClick={() => navigate("home")}
          aria-label="Tarteeb home"
        >
          <span className={s.brandMark}>
            <i />
            <i />
            <i />
          </span>
          <span>
            tarteeb<span className={s.brandDot}>.</span>
            <small>{t("A PLACE FOR EVERY CLASS", "مكان لكل محاضرة")}</small>
          </span>
        </button>
        <div className={s.headerRight}>
          <span className={s.workspaceLabel}>
            <span className={s.workspaceDot} />
            {t("Academic workspace", "مساحة العمل الأكاديمية")}
          </span>
          <button
            className={s.languageButton}
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
          >
            <Icon name="globe" />
            {language === "en" ? "العربية" : "English"}
          </button>
          <span className={s.headerDivider} />
          <button className={s.profileButton} onClick={() => navigate("auth")}>
            <span className={s.avatar}>{user ? initials(user.name) : "A"}</span>
            <span>
              {user ? user.name : t("Your workspace", "مساحة العمل")}
              <small>
                {user
                  ? t("Administrator", "مسؤول")
                  : t("Guest administrator", "مسؤول ضيف")}
              </small>
            </span>
            <Icon name="chevron" />
          </button>
          {user && (
            <button
              className={s.logoutButton}
              aria-label={t("Sign out", "تسجيل الخروج")}
              onClick={async () => {
                try {
                  await api("/auth/logout", { method: "POST" });
                  setUser(null);
                  toast.success(t("Signed out", "تم تسجيل الخروج"));
                } catch (e) {
                  toast.error(e.message);
                }
              }}
            >
              <Icon name="logout" />
            </button>
          )}
        </div>
      </header>
      <nav
        className={s.navBar}
        aria-label={t("Main navigation", "التنقل الرئيسي")}
      >
        <div className={s.navLinks}>
          {[
            ["home", "grid", "Overview", "نظرة عامة"],
            ["setup", "calendar", "Create schedule", "إنشاء جدول"],
            ["import", "edit", "Edit a schedule", "تعديل جدول"],
            ["about", "info", "About Tarteeb", "عن ترتيب"],
          ].map(([id, icon, en, ar]) => (
            <button
              key={id}
              className={`${s.navLink} ${page === id ? s.activeLink : ""}`}
              onClick={() => navigate(id)}
            >
              <Icon name={icon} />
              {t(en, ar)}
            </button>
          ))}
        </div>
        <span className={s.navNote}>
          {t("Less planning. More possibility.", "تخطيط أسهل. إمكانيات أكثر.")}
          <span>✦</span>
        </span>
      </nav>
      <main className={s.mainContent}>{children}</main>
      <footer className={s.footer}>
        <div>
          <span className={s.footerLogo}>
            tarteeb<span>.</span>
          </span>
          <span className={s.footerSeparator} />
          <span>
            {t(
              "Thoughtfully organized. Beautifully simple.",
              "تنظيم مدروس. بساطة جميلة.",
            )}
          </span>
        </div>
        <div className={s.footerRight}>
          <span className={s.savedDot} />
          {t(
            "Your changes stay in this browser",
            "تُحفظ تغييراتك في هذا المتصفح",
          )}
          <span className={s.copyright}>
            © {new Date().getFullYear()} Tarteeb
          </span>
        </div>
      </footer>
    </div>
  );
}
