import React from 'react';
import Icon from '../Icon/Icon';
import styles from './Controls.module.css';
export default function Controls({ adventure: { t, state, action } }) {
  return (
    <>
      <div className={styles.controls}>
        <span>
          <kbd>A</kbd>
          <kbd>D</kbd>
          <small>{t.move}</small>
        </span>
        <span>
          <kbd className={styles.spaceKey}>space</kbd>
          <small>{state.wings ? t.doubleJump : t.jump}</small>
        </span>
        <span>
          <kbd>P</kbd>
          <small>{t.pauseKey}</small>
        </span>
        <span className={styles.controlHint}>
          <Icon name="leaf" size={13} />
          {t.tipText}
        </span>
      </div>
      <div className={styles.touchControls} aria-label="Touch controls">
        {[
          ['left', 'left'],
          ['right', 'arrow'],
          ['jump', 'jump'],
        ].map(([direction, icon]) => (
          <button
            key={direction}
            aria-label={direction === 'jump' ? t.jump : direction}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              action(`touch:${direction}:on`);
            }}
            onPointerUp={() => action(`touch:${direction}:off`)}
            onPointerCancel={() => action(`touch:${direction}:off`)}
            onLostPointerCapture={() => action(`touch:${direction}:off`)}
          >
            <Icon name={icon} />
          </button>
        ))}
      </div>
    </>
  );
}
