import { useState } from "react";
import toast from "react-hot-toast";
import { useApp } from "../../context/AppContext.jsx";
import { api } from "../../util/helpers.js";
import Icon from "../../components/Icon/Icon.jsx";
import p from "../page.module.css";
import s from "./AuthPage.module.css";
export default function AuthPage() {
  const { user, setUser, navigate, t } = useApp();
  const [register, setRegister] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const response = await api(`/auth/${register ? "register" : "login"}`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      setUser(response.user);
      toast.success(t("Welcome to your workspace", "مرحباً بك في مساحة عملك"));
      navigate("home");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className={p.page}>
      <div className={s.authLayout}>
        <section className={s.authStory}>
          <span className={s.storyLabel}>
            {t("YOUR NEXT CHAPTER, ORGANIZED.", "فصلك القادم، منظماً.")}
          </span>
          <h1>
            {t("A little less admin.", "إدارة أقل.")}
            <br />
            <span>{t("A little more impact.", "تأثير أكبر.")}</span>
          </h1>
          <p>
            {t(
              "One thoughtful workspace for your teachers, your students, and all the possibilities ahead.",
              "مساحة عمل مدروسة لمعلميك وطلابك وكل الإمكانيات القادمة.",
            )}
          </p>
          <div className={s.storyCards}>
            <div>
              <Icon name="calendar" />
              <span>{t("Plans in one place", "خططك في مكان واحد")}</span>
              <Icon name="check" />
            </div>
            <div>
              <Icon name="users" />
              <span>{t("Made around your people", "صُممت حول فريقك")}</span>
              <Icon name="check" />
            </div>
            <div>
              <Icon name="lock" />
              <span>{t("Saved to your account", "محفوظة في حسابك")}</span>
              <Icon name="check" />
            </div>
          </div>
          <span className={s.storyBottom}>
            tarteeb<span>.</span>
          </span>
        </section>
        <section className={s.authForm}>
          {user ? (
            <>
              <span className={s.authIcon}>
                <Icon name="checkCircle" />
              </span>
              <h2>
                {t("You’re right where you belong.", "أنت في مكانك الصحيح.")}
              </h2>
              <p>
                {user.name} · {user.email}
              </p>
              <button
                className={p.primaryButton}
                onClick={() => navigate("home")}
              >
                {t("Go to your workspace", "انتقل إلى مساحة العمل")}
                <Icon name="arrow" />
              </button>
            </>
          ) : (
            <>
              <span className={s.authIcon}>
                <Icon name={register ? "users" : "login"} />
              </span>
              <h2>
                {register
                  ? t("Make room for better plans.", "افسح المجال لخطط أفضل.")
                  : t("Welcome back.", "مرحباً بعودتك.")}
              </h2>
              <p>
                {register
                  ? t(
                      "Create an account to keep your schedules together.",
                      "أنشئ حساباً للاحتفاظ بجداولك معاً.",
                    )
                  : t(
                      "Your next well-planned semester is waiting.",
                      "فصلك الدراسي المنظم ينتظرك.",
                    )}
              </p>
              <form onSubmit={submit}>
                {register && (
                  <label>
                    {t("Your name", "اسمك")}
                    <input
                      required
                      name="name"
                      maxLength={100}
                      autoComplete="name"
                      placeholder={t("e.g. Sarah Mitchell", "مثال: سارة أحمد")}
                    />
                  </label>
                )}
                <label>
                  {t("Email address", "البريد الإلكتروني")}
                  <input
                    type="email"
                    name="email"
                    required
                    maxLength={254}
                    autoComplete="email"
                    placeholder="you@college.edu"
                  />
                </label>
                <label>
                  {t("Password", "كلمة المرور")}
                  <input
                    type="password"
                    name="password"
                    required
                    minLength={register ? 10 : 1}
                    maxLength={128}
                    autoComplete={
                      register ? "new-password" : "current-password"
                    }
                    placeholder={
                      register
                        ? t("At least 10 characters", "١٠ أحرف على الأقل")
                        : "••••••••••"
                    }
                  />
                </label>
                {error && (
                  <div role="alert" className={p.error}>
                    {error}
                  </div>
                )}
                <button disabled={busy} className={p.primaryButton}>
                  {busy
                    ? t("One moment…", "لحظة واحدة…")
                    : register
                      ? t("Create account", "إنشاء حساب")
                      : t("Sign in", "تسجيل الدخول")}
                  <Icon name="arrow" />
                </button>
              </form>
              <div className={s.switchAuth}>
                {register
                  ? t("Already have an account?", "لديك حساب بالفعل؟")
                  : t("New to Tarteeb?", "جديد في ترتيب؟")}{" "}
                <button
                  onClick={() => {
                    setRegister(!register);
                    setError("");
                  }}
                >
                  {register
                    ? t("Sign in", "تسجيل الدخول")
                    : t("Create an account", "إنشاء حساب")}
                </button>
              </div>
              <button className={s.guestLink} onClick={() => navigate("home")}>
                {t(
                  "Continue with the local workspace",
                  "متابعة باستخدام مساحة العمل المحلية",
                )}
                <Icon name="arrow" />
              </button>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
