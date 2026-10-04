import React from 'react';
import Header from './components/Header/Header';
import Navigation from './components/Navigation/Navigation';
import GameStage from './components/GameStage/GameStage';
import StatCard from './components/StatCard/StatCard';
import DragonCard from './components/DragonCard/DragonCard';
import Journey from './components/Journey/Journey';
import Shop from './components/Shop/Shop';
import Modal from './components/Modal/Modal';
import Footer from './components/Footer/Footer';
import Icon from './components/Icon/Icon';
import { useAdventure } from './util/help';
import styles from './App.module.css';
export default function App() {
  const adventure = useAdventure();
  const { t, state, language, action, panel } = adventure;
  return (
    <>
      <Header adventure={adventure} />
      <Navigation adventure={adventure} />
      <main id="adventure" className={styles.main}>
        <div className={styles.intro}>
          <div>
            <span className={styles.eyebrow}>
              <span />
              {t.chapter}
            </span>
            <h1>
              {t.heading}
              <span className={styles.headingSpark}>✧</span>
            </h1>
            <p>{t.subtitle}</p>
          </div>
          <button className={styles.newAdventure} onClick={() => action('panel', 'reset')}>
            <Icon name="reset" size={14} />
            {t.newAdventure}
          </button>
        </div>
        <div className={styles.playLayout}>
          <div className={styles.gameColumn}>
            <div className={styles.stats}>
              <StatCard label={t.score} value={state.score} icon="fire" language={language} />
              <StatCard
                label={t.strength}
                value={state.strength}
                icon="heart"
                meter={state.strength}
                language={language}
              />
              <StatCard
                label={t.collected}
                value={state.collected}
                icon="sparkles"
                language={language}
              />
            </div>
            <GameStage adventure={adventure} />
          </div>
          <div className={styles.sideColumn}>
            <StatCard label={t.best} value={state.best} icon="trophy" language={language} />
            <DragonCard adventure={adventure} />
          </div>
        </div>
        <div className={styles.lowerLayout}>
          <div>
            <Journey adventure={adventure} />
            <Shop adventure={adventure} />
          </div>
          <aside className={styles.tipCard}>
            <span>
              <Icon name="leaf" size={15} />
              {t.tip}
            </span>
            <p>{t.tipText}</p>
            <div className={styles.tipArt}>
              <Icon name="fire" size={29} />
              <span>+</span>
              <Icon name="heart" size={23} />
            </div>
            <button onClick={() => action('panel', 'guide')}>
              {t.fieldGuide}
              <Icon name="arrow" size={12} />
            </button>
          </aside>
        </div>
        <div className={styles.bottomNote}>
          <Icon name="leaf" size={12} />
          <span>{t.made}</span>
        </div>
      </main>
      {panel && <Modal key={panel} adventure={adventure} />}
      <Footer adventure={adventure} />
    </>
  );
}
