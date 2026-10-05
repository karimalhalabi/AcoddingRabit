import Icon from "../Icon/Icon.jsx";
import s from "./StatCard.module.css";
export default function StatCard({ icon, label, value, detail, note, tone }) {
  return (
    <div className={s.card}>
      <div className={s.top}>
        <span>{label}</span>
        <span className={`${s.icon} ${s[tone] || ""}`}>
          <Icon name={icon} />
        </span>
      </div>
      <div className={s.value}>
        {value}
        <span>{note}</span>
      </div>
      <p>{detail}</p>
    </div>
  );
}
