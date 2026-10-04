import React from 'react';
import Icon from '../Icon/Icon';
import styles from './Footer.module.css';
export default function Footer({ adventure: { t, saved, action } }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerBrand}>
        <Icon name="fire" size={19} />
        <span>
          emberquest <small>© {new Date().getFullYear()}</small>
        </span>
      </div>
      <span className={styles.footerNote}>
        {t.made}
        <Icon name="heart" size={11} />
      </span>
      <div className={styles.footerRight}>
        {saved && (
          <span>
            <i />
            {t.saved}
          </span>
        )}
        <button onClick={() => action('panel', 'help')} aria-label={t.howToPlay}>
          <Icon name="help" size={16} />
        </button>
      </div>
    </footer>
  );
}
