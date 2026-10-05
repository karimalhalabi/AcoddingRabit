import { useApp } from "../../context/AppContext.jsx";
import Icon from "../../components/Icon/Icon.jsx";
import p from "../page.module.css";
import s from "./AboutPage.module.css";
export default function AboutPage() {
  const { t, navigate } = useApp();
  return (
    <div className={p.page}>
      <div className={p.eyebrow}>
        <Icon name="info" />
        {t("About Tarteeb", "عن ترتيب")}
      </div>
      <section className={s.aboutHero}>
        <span className={s.overline}>
          {t(
            "A LITTLE ORDER. A WORLD OF POSSIBILITY.",
            "قليل من التنظيم. عالم من الإمكانيات.",
          )}
        </span>
        <h1>
          {t("More room for", "مساحة أكبر")}
          <br />
          <span>{t("what matters.", "لما يهمّ حقاً.")}</span>
        </h1>
        <p>
          {t(
            "Tarteeb means order. We bring it to the moving parts of campus life, so educators can spend less time coordinating and more time inspiring.",
            "ترتيب يجمع تفاصيل الحياة الجامعية، ليقضي المعلمون وقتاً أقل في التنسيق ووقتاً أكثر في الإلهام.",
          )}
        </p>
        <button className={p.goldButton} onClick={() => navigate("setup")}>
          {t("Plan your next semester", "خطط لفصلك القادم")}
          <Icon name="arrow" />
        </button>
        <span className={s.heroSpark} aria-hidden="true">
          ✦
        </span>
      </section>
      <div className={s.featureGrid}>
        {[
          [
            "users",
            "Built around people",
            "صُمم حول الأشخاص",
            "Full-time, part-time, or a little more flexibility. Each teacher’s available days guide every placement.",
            "دوام كامل أو جزئي أو ظروف خاصة. تُراعى أيام توافر كل معلم.",
          ],
          [
            "grid",
            "A place for every class",
            "مكان لكل محاضرة",
            "Classrooms, laboratories, and student groups come together with capacity and conflict checks.",
            "تجتمع القاعات والمختبرات والمجموعات مع التحقق من السعة والتعارضات.",
          ],
          [
            "file",
            "Plans that travel with you",
            "خطط ترافقك",
            "Import your faculty from Excel, export a colorful timetable, and bring it back when things change.",
            "استورد المعلمين من إكسل وصدّر جدولاً ملوناً وأعد استيراده عندما تتغير الخطط.",
          ],
        ].map(([icon, en, ar, desc, arabic]) => (
          <article className={p.panel} key={icon}>
            <span className={s.featureIcon}>
              <Icon name={icon} />
            </span>
            <h2>{t(en, ar)}</h2>
            <p>{t(desc, arabic)}</p>
          </article>
        ))}
      </div>
      <section className={p.panel}>
        <h2 className={p.panelTitle}>
          {t("A clear view of how it works", "صورة واضحة لطريقة العمل")}
        </h2>
        <p className={s.explanation}>
          {t(
            "Define rooms and students, add teacher availability, and select the subjects each student group takes. Tarteeb prioritizes teachers with fewer available days, then searches for placements without teacher, group, or room overlaps. Lab groups are split to fit laboratory capacity.",
            "حدد القاعات والطلاب وتوافر المعلمين والمواد التي تدرسها كل مجموعة. يعطي ترتيب الأولوية للمعلمين ذوي الأيام المحدودة ويبحث عن توزيع دون تداخل المعلمين أو المجموعات أو القاعات. تُقسّم مجموعات المختبر وفق سعته.",
          )}
        </p>
        <p className={s.explanation}>
          {t(
            "The scheduler uses a bounded heuristic, so it may leave sessions unplaced even when a more complex arrangement could fit them. It always shows these sessions for review. Weekly teaching runs Saturday–Wednesday; exams can also use Thursday across up to eight weeks, with explicit teacher availability.",
            "يستخدم المجدول خوارزمية تقريبية محدودة، لذا قد يترك محاضرات غير موزعة حتى إن وُجد ترتيب أكثر تعقيداً. يعرضها دائماً للمراجعة. الدراسة من السبت إلى الأربعاء، ويمكن استخدام الخميس في الامتحانات لثمانية أسابيع حسب توافر المعلمين.",
          )}
        </p>
      </section>
    </div>
  );
}
