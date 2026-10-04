import React from 'react';
import Icon from '../Icon/Icon';
import { formatNumber } from '../../util/help';
import styles from './LevelCard.module.css';
export default function LevelCard({
  level,
  index,
  adventure: { state, t, language, action },
  compact = false,
}) {
  const locked = index + 1 > state.unlocked;
  const current = index + 1 === state.level;
  return (
    <button
      className={`${styles.levelCard} ${current ? styles.current : ''} ${locked ? styles.locked : ''} ${compact ? styles.compact : ''}`}
      onClick={() => action('selectLevel', index + 1)}
      disabled={locked}
      aria-label={`${t.level} ${index + 1}: ${language === 'en' ? level.name : level.ar}${locked ? `, ${t.locked}` : ''}`}
    >
      <div
        className={styles.landscape}
        style={{ '--landColor': level.color, '--skyColor': level.sky }}
      >
        <svg viewBox="0 0 230 94" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <circle cx={index % 2 ? 166 : 176} cy="22" r="12" fill="#fff9db" opacity=".65" />
          <path
            d={`M0 70 L45 ${index % 3 ? 37 : 20} L95 62 L147 28 L192 66 L230 46 V94 H0Z`}
            fill={level.color}
            opacity=".35"
          />
          <path d="M0 76 Q56 40 113 68 Q162 46 230 74 V94 H0Z" fill={level.color} opacity=".62" />
          <path d="M0 90 Q57 58 139 82 Q199 53 230 77 V94 H0Z" fill={level.color} />
          {[18, 37, 195, 214].map((x, i) => (
            <g key={x} transform={`translate(${x} ${35 + (i % 2) * 12})`} opacity={0.75}>
              <path d="M0 0 L-11 22 H-7 L-17 35 H-3 V50 H3 V35 H17 L7 22 H11Z" fill={level.color} />
            </g>
          ))}
          <path
            d="M80 94 Q130 80 110 71 Q99 65 131 59"
            stroke="#ede8c4"
            strokeWidth="7"
            fill="none"
            opacity=".55"
          />
        </svg>
        <span className={styles.levelNumber}>{String(index + 1).padStart(2, '0')}</span>
        {locked ? (
          <span className={styles.lock}>
            <Icon name="lock" size={13} />
          </span>
        ) : current ? (
          <span className={styles.here}>
            <span />
            {t.current}
          </span>
        ) : (
          <span className={styles.lock}>
            <Icon name="check" size={14} />
          </span>
        )}
      </div>
      <div className={styles.cardDescription}>
        <small>
          {t.level} {formatNumber(index + 1, language)}
        </small>
        <h3>{language === 'en' ? level.name : level.ar}</h3>
        <p>{language === 'en' ? level.short : level.shortAr}</p>
        {current && <Icon name="arrow" size={13} />}
      </div>
    </button>
  );
}
