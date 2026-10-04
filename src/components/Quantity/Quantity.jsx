import { FiMinus, FiPlus } from "react-icons/fi";
import styles from "./Quantity.module.css";
export default function Quantity({
  value,
  onChange,
  max = 99,
  label = "Quantity",
}) {
  return (
    <div className={styles.quantity} role="group" aria-label={label}>
      <button
        type="button"
        disabled={value <= 1}
        aria-label={`${label} −`}
        onClick={() => onChange(value - 1)}
      >
        <FiMinus />
      </button>
      <span aria-live="polite">{value}</span>
      <button
        type="button"
        disabled={value >= max}
        aria-label={`${label} +`}
        onClick={() => onChange(value + 1)}
      >
        <FiPlus />
      </button>
    </div>
  );
}
