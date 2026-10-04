import React from 'react';
import Icon from '../Icon/Icon';
import styles from './Shop.module.css';
export default function Shop({ adventure: { t, action } }) {
  return (
    <section className={styles.shopBanner}>
      <div className={styles.shopDrawing}>
        <svg viewBox="0 0 110 95" aria-hidden="true">
          <ellipse cx="52" cy="86" rx="46" ry="5" fill="#b9b19444" />
          <path d="M26 39H83V83H26Z" fill="#d7c6a0" stroke="#9b916e" strokeWidth="1.5" />
          <path d="M16 43L37 13H74L94 43Z" fill="#95a27b" stroke="#788568" strokeWidth="1.5" />
          <path
            d="M31 25L25 34M44 18L36 32M55 18L50 31M70 19L70 33M78 28L81 34"
            stroke="#b4bd92"
            strokeWidth="2"
          />
          <path
            d="M20 42H91V49Q85 55 79 49Q73 55 66 49Q58 55 52 49Q45 55 39 49Q31 55 24 49L20 49Z"
            fill="#e1b67d"
            stroke="#bda277"
          />
          <path d="M23 42L27 32H87L92 42Z" fill="#e5c793" />
          <path d="M38 33L36 47M55 33V49M73 33L76 48" stroke="#be8860" strokeWidth="8" />
          <path d="M44 83V60Q55 48 66 60V83Z" fill="#7c8465" />
          <path d="M28 63H38V73H28Z" fill="#f2dea8" stroke="#9c906f" />
          <circle cx="60" cy="72" r="1.5" fill="#edcf90" />
          <path d="M16 67H30L27 85H19Z" fill="#b79668" />
          <path d="M22 68Q9 55 14 51Q25 53 22 68Q24 49 31 51Q35 62 22 68" fill="#8a9a71" />
          <path d="M80 71H95L92 85H83Z" fill="#b08e65" />
          <path d="M87 73Q77 59 83 56Q91 60 88 69Q94 52 98 59Q102 68 87 73" fill="#81916a" />
        </svg>
      </div>
      <div>
        <h3>{t.visitShops}</h3>
        <p>{t.shopSub}</p>
      </div>
      <button onClick={() => action('panel', 'shops')}>
        {t.browseShops}
        <Icon name="arrow" size={14} />
      </button>
    </section>
  );
}
