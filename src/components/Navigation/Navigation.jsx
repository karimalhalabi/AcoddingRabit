import React from 'react';
import Icon from '../Icon/Icon';
import styles from './Navigation.module.css';
export default function Navigation({ adventure: { t, panel, action } }) {
  return (
    <nav className={styles.navigation} aria-label="Main navigation">
      <div className={styles.links}>
        {[
          ['adventure', 'compass', null],
          ['worldMap', 'map', 'map'],
          ['fieldGuide', 'book', 'guide'],
          ['shops', 'shop', 'shops'],
        ].map(([label, icon, value]) => (
          <button
            key={label}
            className={!panel && !value ? styles.active : panel === value ? styles.active : ''}
            onClick={() => (value ? action('panel', value) : action('close'))}
          >
            <Icon name={icon} size={12} />
            {t[label]}
            {value === 'shops' && <span className={styles.dot} />}
          </button>
        ))}
      </div>
      <span className={styles.navNote}>
        <span /> {t.tagline}
      </span>
    </nav>
  );
}
