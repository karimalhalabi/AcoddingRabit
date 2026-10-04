import React from 'react';
import Icon from '../Icon/Icon';
import { formatNumber } from '../../util/help';
import styles from './ShopCard.module.css';
export default function ShopCard({ shop, adventure: { state, t, language, action } }) {
  const locked = state.level < shop.unlock;
  const owned = shop.type === 'wings' && state.wings;
  const full = shop.type === 'strength' && state.strength === 100;
  const shield = shop.type === 'shield' && state.shield > 0;
  const poor = state.coins < shop.price;
  return (
    <article className={styles.shopCard}>
      <div className={styles.shopIcon}>
        <Icon name={shop.icon} size={34} />
        <span>✧</span>
      </div>
      <h3>{language === 'en' ? shop.name : shop.nameAr}</h3>
      <small>{language === 'en' ? shop.keeper : shop.keeperAr}</small>
      <div className={styles.itemDetails}>
        <strong>{language === 'en' ? shop.item : shop.itemAr}</strong>
        <p>{language === 'en' ? shop.description : shop.descriptionAr}</p>
      </div>
      <div className={styles.price}>
        <Icon name="fire" size={16} />
        {formatNumber(shop.price, language)}
        <span>{t.balance}</span>
      </div>
      <button
        disabled={locked || owned || full || shield || poor}
        onClick={() => action('buy', shop.id)}
      >
        {locked
          ? `${t.shopLocked} ${formatNumber(shop.unlock, language)}`
          : owned
            ? t.owned
            : full
              ? t.fullStrength
              : shield
                ? t.shieldActive
                : poor
                  ? t.insufficient
                  : t.buy}
        <Icon name={locked ? 'lock' : owned ? 'check' : 'arrow'} size={14} />
      </button>
    </article>
  );
}
