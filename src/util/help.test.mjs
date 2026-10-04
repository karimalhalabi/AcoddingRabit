import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
// Load this shared browser module without a DOM, keeping CRA-compatible JSON imports.
const source = (await readFile(new URL('./help.js', import.meta.url), 'utf8'))
  .replace(/import \{ useEffect, useRef, useState \} from 'react';/, '')
  .replace(
    /import shops from '\.\.\/data\/shops.json';/,
    `const shops = ${await readFile(new URL('../data/shops.json', import.meta.url), 'utf8')};`,
  );
const helpers = await import(
  `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`
);
const {
  freshState,
  collectReward,
  waterDamage,
  purchaseItem,
  levelLayout,
  readProgress,
  saveProgress,
  levels,
  copy,
} = helpers;
const shops = JSON.parse(await readFile(new URL('../data/shops.json', import.meta.url), 'utf8'));

test('fire and unarmed travelers restore strength and award distinct rewards', () => {
  const initial = { ...freshState(), strength: 91 };
  const fire = collectReward(initial);
  assert.equal(fire.score, 25);
  assert.equal(fire.coins, 25);
  assert.equal(fire.strength, 97);
  assert.equal(fire.collected, 1);
  const human = collectReward(fire, true);
  assert.equal(human.score, 75);
  assert.equal(human.strength, 100);
  assert.equal(human.collected, 1);
  assert.equal(human.best, 75);
  assert.equal(initial.score, 0);
});
test('water consumes shields, weakens the dragon, and ends the run at zero', () => {
  let state = { ...freshState(), status: 'playing', shield: 1 };
  state = waterDamage(state);
  assert.equal(state.shield, 0);
  assert.equal(state.strength, 100);
  for (let i = 0; i < 4; i++) state = waterDamage(state);
  assert.equal(state.strength, 12);
  assert.equal(state.status, 'playing');
  state = waterDamage(state);
  assert.equal(state.strength, 0);
  assert.equal(state.status, 'lost');
});
test('all shops enforce currency, level, inventory, and strength limits', () => {
  const state = { ...freshState(), coins: 500, strength: 80 };
  const healed = purchaseItem(state, shops[0]);
  assert.equal(healed.strength, 100);
  assert.equal(healed.coins, 420);
  assert.equal(purchaseItem(healed, shops[0]), healed);
  assert.equal(purchaseItem(state, shops[1]), state);
  const shield = purchaseItem({ ...state, level: 4 }, shops[1]);
  assert.equal(shield.shield, 3);
  assert.equal(shield.coins, 380);
  assert.equal(purchaseItem(shield, shops[1]), shield);
  assert.equal(purchaseItem(state, shops[2]), state);
  const winged = purchaseItem({ ...state, level: 10 }, shops[2]);
  assert.equal(winged.wings, true);
  assert.equal(winged.coins, 200);
  assert.equal(purchaseItem(winged, shops[2]), winged);
  const poor = { ...state, coins: 79 };
  assert.equal(purchaseItem(poor, shops[0]), poor);
  assert.equal(purchaseItem(state, undefined), state);
});
test('ten worlds get harder and flying fire requires jumping in the last two', () => {
  assert.equal(levels.length, 10);
  for (let i = 1; i <= 10; i++) {
    const layout = levelLayout(i);
    assert.ok(layout.fires.every((fire) => fire.x > 0 && fire.x < layout.length));
    assert.ok(
      layout.enemies.every(
        (enemy) => enemy.x > 0 && enemy.x < layout.length && enemy.kind >= 0 && enemy.kind < 8,
      ),
    );
    if (i >= 9) assert.ok(layout.fires.every((fire) => fire.y <= 318));
    if (i > 1) {
      assert.ok(layout.speed > levelLayout(i - 1).speed);
      assert.ok(layout.throwDelay < levelLayout(i - 1).throwDelay);
    }
  }
  const variants = new Set(
    Array.from({ length: 10 }, (_, i) => levelLayout(i + 1).enemies)
      .flat()
      .map((enemy) => enemy.kind),
  );
  assert.equal(variants.size, 8);
});
test('English and Arabic have matching interface labels', () => {
  assert.deepEqual(Object.keys(copy.en).sort(), Object.keys(copy.ar).sort());
});
test('progress tolerates unavailable storage and malformed values', () => {
  globalThis.localStorage = {
    getItem: () => '{malformed',
    setItem: () => {
      throw new Error('blocked');
    },
  };
  assert.deepEqual(readProgress(), freshState());
  assert.equal(saveProgress(freshState()), false);
  localStorage.getItem = () => '{"best":-10,"unlocked":900}';
  assert.equal(readProgress().best, 0);
  assert.equal(readProgress().unlocked, 10);
  localStorage.getItem = () => '{"unlocked":2.5}';
  assert.equal(readProgress().unlocked, 2);
  let saved;
  localStorage.setItem = (_, value) => {
    saved = value;
  };
  assert.equal(saveProgress({ ...freshState(), best: 75, unlocked: 3 }), true);
  assert.deepEqual(JSON.parse(saved), { best: 75, unlocked: 3 });
  delete globalThis.localStorage;
});
