import React from 'react';
import Icon from '../Icon/Icon';
import { formatNumber } from '../../util/help';
import styles from './StatCard.module.css';
export default function StatCard({ label, value, icon, note, meter, language }) {
  return (
    <div className={`${styles.statCard} ${meter !== undefined ? styles.strengthCard : ''}`}>
      <span className={styles.statIcon}>
        <Icon name={icon} size={18} />
      </span>
      <div className={styles.statBody}>
        <span className={styles.statLabel}>{label}</span>
        <strong>
          {formatNumber(value, language)}
          {meter !== undefined && <small>/ 100</small>}
        </strong>
        {meter !== undefined ? (
          <div
            className={styles.meter}
            role="meter"
            aria-label={label}
            aria-valuenow={meter}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <span style={{ width: `${meter}%`, background: meter < 35 ? '#d78156' : undefined }} />
          </div>
        ) : (
          note && <span className={styles.note}>{note}</span>
        )}
      </div>
      {meter !== undefined && <span className={styles.liveDot} />}
    </div>
  );
}
