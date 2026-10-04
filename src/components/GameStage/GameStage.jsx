import React, { useRef } from 'react';
import Icon from '../Icon/Icon';
import Controls from '../Controls/Controls';
import { levels, useGameMount, toggleFullscreen, formatNumber } from '../../util/help';
import styles from './GameStage.module.css';
export default function GameStage({ adventure }) {
  const { state, t, language, action } = adventure;
  const mount = useRef(null);
  const frame = useRef(null);
  const { loaded, error } = useGameMount(mount, adventure);
  const level = levels[state.level - 1];
  const overlays = {
    ready: ['ready', 'readySub', 'play', 'start'],
    paused: ['paused', 'pausedSub', 'resume', 'resume'],
    lost: ['lost', 'lostSub', 'retry', 'retry'],
    complete: ['complete', 'completeSub', 'next', 'next'],
    victory: ['victory', 'victorySub', 'playAgain', 'reset'],
    needWings: [
      'wings',
      'finalHint',
      state.wings ? 'resume' : 'browseShops',
      state.wings ? 'resume' : 'shops',
    ],
  };
  const overlay = overlays[state.status];
  return (
    <section className={styles.gameStage} ref={frame} aria-label="Ember Quest game">
      <div className={styles.stageHeader}>
        <span className={styles.levelBadge}>
          {t.level} {formatNumber(state.level, language)}
        </span>
        <span className={styles.levelName}>{language === 'en' ? level.name : level.ar}</span>
        <span className={styles.difficulty}>
          <i />
          {state.level < 4
            ? t.beginner
            : state.level < 7
              ? t.intermediate
              : state.level < 10
                ? t.hard
                : t.final}
        </span>
        <div className={styles.stageActions}>
          <button
            onClick={() => action(state.status === 'paused' ? 'resume' : 'pause')}
            aria-label={state.status === 'paused' ? t.resume : t.pause}
            disabled={!['playing', 'paused'].includes(state.status)}
          >
            <Icon name={state.status === 'paused' ? 'play' : 'pause'} size={16} />
          </button>
          <span />
          <button onClick={() => toggleFullscreen(frame.current)} aria-label={t.fullscreen}>
            <Icon name="expand" size={15} />
          </button>
        </div>
      </div>
      <div className={styles.canvasWrap}>
        <div
          ref={mount}
          className={styles.gameCanvas}
          tabIndex={0}
          aria-label={`${t.controlsText} ${t.goalText}`}
        />
        {loaded && (
          <div className={styles.gameHud}>
            <span>
              <Icon name="flag" size={12} />
              {t.level} {formatNumber(state.level, language)} <span>/ 10</span>
            </span>
            <div className={styles.progressTrack}>
              <span style={{ width: `${state.distance * 100}%` }} />
            </div>
            <span className={styles.destination}>
              <Icon name="home" size={13} />
            </span>
          </div>
        )}
        {!loaded && (
          <div className={styles.loading}>
            <Icon name="fire" size={35} />
            <span>{error ? t.error : t.loading}</span>
            {error && <button onClick={() => window.location.reload()}>{t.reload}</button>}
          </div>
        )}
        {loaded && overlay && (
          <div
            className={`${styles.overlay} ${state.status === 'ready' ? styles.readyOverlay : styles.centerOverlay}`}
          >
            <div className={styles.overlayCard}>
              {state.status === 'ready' ? (
                <span className={styles.welcomeLabel}>
                  <span />
                  {language === 'en' ? level.name.toUpperCase() : level.ar}
                </span>
              ) : (
                <Icon
                  name={
                    state.status === 'victory'
                      ? 'wings'
                      : state.status === 'complete'
                        ? 'flag'
                        : 'fire'
                  }
                  size={25}
                />
              )}
              <h2>{t[overlay[0]]}</h2>
              <p>{t[overlay[1]]}</p>
              {state.status === 'complete' && (
                <small className={styles.reward}>{t.chapterReward}</small>
              )}
              <button
                className={styles.startButton}
                onClick={() =>
                  overlay[3] === 'shops' ? action('panel', 'shops') : action(overlay[3])
                }
              >
                <Icon name={state.status === 'ready' ? 'play' : 'arrow'} size={15} />
                {t[overlay[2]]}
                <Icon name="arrow" size={15} />
              </button>
            </div>
            {state.status === 'ready' && (
              <div className={styles.startNote}>
                <span className={styles.noteLine} />
                <span style={{ whiteSpace: 'pre-line' }}>{t.courage}</span>
              </div>
            )}
          </div>
        )}
      </div>
      <Controls adventure={adventure} />
    </section>
  );
}
