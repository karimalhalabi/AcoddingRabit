import React from 'react';
import Icon from '../Icon/Icon';
import Sprite from '../Sprite/Sprite';
import styles from './DragonCard.module.css';
export default function DragonCard({ adventure: { state, t, action } }) {
  return (
    <aside className={styles.dragonCard}>
      <div className={styles.cardTop}>
        <span>{t.meet}</span>
        <Icon name="sparkles" size={14} />
      </div>
      <div className={styles.portrait}>
        <div className={styles.halo} />
        <span className={styles.sparkOne}>✧</span>
        <span className={styles.sparkTwo}>✦</span>
        <span className={styles.sparkThree}>✧</span>
        <div className={styles.dragon}>
          <Sprite
            variant={state.wings ? 'winged' : state.strength < 35 ? 'weak' : 'strong'}
            label={t.dragonName}
          />
        </div>
        <div className={styles.groundShadow} />
        <span className={styles.portraitLeaf}>
          <Icon name="leaf" size={25} />
        </span>
      </div>
      <h2>
        {t.dragonName}
        <span>✧</span>
      </h2>
      <p>{t.dragonDescription}</p>
      <span className={styles.dragonStatus}>
        <span />
        {state.wings ? t.winged : state.strength < 35 ? t.weak : t.grounded}
      </span>
      <div className={styles.wingUnlock}>
        <span className={styles.wingIcon}>
          <Icon name="wings" size={28} />
        </span>
        <div>
          <small>{t.nextUnlock}</small>
          <strong>{t.wings}</strong>
          <span>{t.unlockAt}</span>
        </div>
        <Icon name={state.wings ? 'check' : 'lock'} size={13} />
      </div>
      <button className={styles.shopLink} onClick={() => action('panel', 'shops')}>
        {t.browseShops}
        <Icon name="arrow" size={13} />
      </button>
    </aside>
  );
}
