import React, { useRef } from 'react';
import { useSprite } from '../../util/help';
import styles from './Sprite.module.css';
export default function Sprite({
  kind = 'dragon',
  variant = 'strong',
  className = '',
  label = '',
}) {
  const ref = useRef(null);
  useSprite(ref, kind, variant);
  return (
    <canvas
      ref={ref}
      width={340}
      height={kind === 'human' ? 446 : 340}
      className={`${styles.sprite} ${className}`}
      role="img"
      aria-label={label || `${variant} ${kind}`}
    />
  );
}
