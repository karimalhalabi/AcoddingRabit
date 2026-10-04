import React from 'react';
import Icon from '../Icon/Icon';
import LevelCard from '../LevelCard/LevelCard';
import { levels } from '../../util/help';
import styles from './Journey.module.css';
export default function Journey({ adventure }) {
  const { t, action, state } = adventure;
  const start = state.level > 5 ? 5 : 0;
  return (
    <section className={styles.journey}>
      <div className={styles.sectionHeading}>
        <div>
          <h2>
            <Icon name="map" size={18} />
            {t.journey}
          </h2>
          <p>{t.journeySub}</p>
        </div>
        <button onClick={() => action('panel', 'map')}>
          {t.allLevels}
          <Icon name="arrow" size={13} />
        </button>
      </div>
      <div className={styles.levels}>
        {levels.slice(start, start + 5).map((level, i) => (
          <LevelCard
            key={level.name}
            level={level}
            index={start + i}
            adventure={adventure}
            compact
          />
        ))}
      </div>
    </section>
  );
}
