import React from 'react';
import Icon from '../Icon/Icon';
import styles from './Header.module.css';
export default function Header({ adventure: { t, language, sound, action } }) {
  return (
    <header className={styles.header}>
      <a href="#adventure" className={styles.brand} aria-label="Ember Quest home">
        <span className={styles.brandMark}>
          <Icon name="fire" size={28} />
        </span>
        <span className={styles.brandName}>
          ember<span>quest</span>
          <small>{t.tagline}</small>
        </span>
      </a>
      <div className={styles.headerActions}>
        <button
          className={styles.soundButton}
          onClick={() => action('sound')}
          aria-label={sound ? t.soundOn : t.soundOff}
        >
          <Icon name={sound ? 'sound' : 'muted'} />
          <span>{sound ? t.soundOn : t.soundOff}</span>
        </button>
        <span className={styles.divider} />
        <button className={styles.languageButton} onClick={() => action('language')}>
          <Icon name="globe" size={16} />
          {language === 'en' ? 'English' : 'العربية'}
          <Icon name="right" size={12} />
        </button>
        <button
          className={styles.helpButton}
          aria-label={t.howToPlay}
          onClick={() => action('panel', 'help')}
        >
          <Icon name="help" size={17} />
          <span>{t.howToPlay}</span>
        </button>
      </div>
    </header>
  );
}
