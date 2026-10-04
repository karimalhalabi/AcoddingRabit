import React, { useRef } from 'react';
import Icon from '../Icon/Icon';
import Sprite from '../Sprite/Sprite';
import LevelCard from '../LevelCard/LevelCard';
import ShopCard from '../ShopCard/ShopCard';
import shops from '../../data/shops.json';
import { levels, useModalKeys, formatNumber } from '../../util/help';
import styles from './Modal.module.css';
export default function Modal({ adventure }) {
  const { panel, t, action, state } = adventure;
  const ref = useRef(null);
  useModalKeys(ref, () => action('close'), adventure);
  const title = {
    map: t.worldMap,
    shops: t.shops,
    guide: t.fieldGuide,
    help: t.howToPlay,
    reset: t.resetTitle,
  }[panel];
  return (
    <div
      className={styles.backdrop}
      onClick={(event) => {
        if (event.target === event.currentTarget) action('close');
      }}
    >
      <section
        className={`${styles.modal} ${panel === 'reset' ? styles.smallModal : ''}`}
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialogTitle"
      >
        <div className={styles.modalHeader}>
          <span className={styles.eyebrow}>EMBER QUEST · {t.adventure}</span>
          <button onClick={() => action('close')} aria-label={t.close}>
            <Icon name="close" size={20} />
          </button>
        </div>
        <h2 id="dialogTitle">{title}</h2>
        {panel === 'map' && (
          <>
            <p className={styles.intro}>{t.journeySub}</p>
            <div className={styles.mapGrid}>
              {levels.map((level, index) => (
                <LevelCard key={level.name} level={level} index={index} adventure={adventure} />
              ))}
            </div>
          </>
        )}
        {panel === 'shops' && (
          <>
            <div className={styles.shopIntro}>
              <p className={styles.intro}>{t.shopSub}</p>
              <span>
                <Icon name="fire" size={15} />
                {formatNumber(state.coins, adventure.language)} <small>{t.balance}</small>
              </span>
            </div>
            <div className={styles.shopGrid}>
              {shops.map((shop) => (
                <ShopCard key={shop.id} shop={shop} adventure={adventure} />
              ))}
            </div>
          </>
        )}
        {panel === 'guide' && (
          <>
            <p className={styles.intro}>{t.guideIntro}</p>
            <div className={styles.guideGrid}>
              <article>
                <div className={styles.orbSamples}>
                  {[1, 3, 6, 9, 10].map((level) => (
                    <Sprite
                      key={level}
                      kind="fire"
                      variant={level}
                      label={`${t.fireGuide} ${level}`}
                    />
                  ))}
                </div>
                <h3>{t.fireGuide}</h3>
                <p>{t.fireDesc}</p>
              </article>
              <article>
                <div className={styles.waterSample}>
                  <Sprite kind="water" label={t.waterGuide} />
                </div>
                <h3>{t.waterGuide}</h3>
                <p>{t.waterDesc}</p>
              </article>
              <article className={styles.humanGuide}>
                <div className={styles.humanSamples}>
                  {Array.from({ length: 8 }, (_, index) => (
                    <Sprite
                      key={index}
                      kind="human"
                      variant={index}
                      label={`${t.humanGuide} ${index + 1}`}
                    />
                  ))}
                </div>
                <h3>{t.humanGuide}</h3>
                <p>{t.humanDesc}</p>
              </article>
              <article className={styles.humanGuide}>
                <div className={styles.dragonSamples}>
                  {['weak', 'strong', 'winged'].map((variant) => (
                    <Sprite key={variant} variant={variant} />
                  ))}
                </div>
                <h3>{t.obstacleGuide}</h3>
                <p>{t.obstacleDesc}</p>
              </article>
            </div>
          </>
        )}
        {panel === 'help' && (
          <div className={styles.helpContent}>
            <div className={styles.helpHero}>
              <Sprite label={t.dragonName} />
            </div>
            <h3>{t.controlsIntro}</h3>
            <div className={styles.keyRow}>
              <kbd>←</kbd>
              <kbd>→</kbd>
              <span>{t.move}</span>
              <kbd>space</kbd>
              <span>{t.jump}</span>
              <kbd>P</kbd>
              <span>{t.pause}</span>
            </div>
            <p>{t.controlsText}</p>
            <p>{t.goalText}</p>
            <button className={styles.primaryButton} onClick={() => action('close')}>
              {t.play}
              <Icon name="arrow" size={15} />
            </button>
          </div>
        )}
        {panel === 'reset' && (
          <>
            <p className={styles.intro}>{t.resetText}</p>
            <div className={styles.confirmButtons}>
              <button onClick={() => action('close')}>{t.cancel}</button>
              <button className={styles.primaryButton} onClick={() => action('reset')}>
                {t.reset}
                <Icon name="reset" size={14} />
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
