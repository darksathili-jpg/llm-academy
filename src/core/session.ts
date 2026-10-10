export interface Clock {
  elapsed: number;
  started: number | null;
}
export interface Session {
  version: 1;
  duration: 60 | 120 | 180 | 360;
  step: number;
  revealed: boolean;
  zoom: number;
  sessionClock: Clock;
  activityClock: Clock;
}
export const SESSION_KEY = 'llm-academy.studio.v1';
export const PRIVATE_KEY = 'llm-academy.studio.private.v1';
export const emptyClock = (): Clock => ({ elapsed: 0, started: null });
export function elapsed(clock: Clock, now = Date.now()) {
  return clock.elapsed + (clock.started === null ? 0 : Math.max(0, now - clock.started));
}
export function toggle(clock: Clock, now = Date.now()): Clock {
  return clock.started === null
    ? { ...clock, started: now }
    : { elapsed: elapsed(clock, now), started: null };
}
export function freshSession(duration: Session['duration']): Session {
  return {
    version: 1,
    duration,
    step: 0,
    revealed: false,
    zoom: 100,
    sessionClock: emptyClock(),
    activityClock: emptyClock(),
  };
}
export function parseSession(raw: string): Session {
  if (raw.length > 2000) throw Error('Séance trop volumineuse.');
  const x = JSON.parse(raw) as Session;
  const clock = (c: Clock) =>
    c &&
    Number.isFinite(c.elapsed) &&
    c.elapsed >= 0 &&
    c.elapsed <= 86400000 &&
    (c.started === null ||
      (Number.isFinite(c.started) && c.started > 0 && c.started <= Date.now() + 60000));
  if (
    !x ||
    x.version !== 1 ||
    ![60, 120, 180, 360].includes(x.duration) ||
    !Number.isInteger(x.step) ||
    x.step < 0 ||
    x.step > 30 ||
    typeof x.revealed !== 'boolean' ||
    ![100, 125, 150].includes(x.zoom) ||
    !clock(x.sessionClock) ||
    !clock(x.activityClock)
  )
    throw Error('Séance enregistrée invalide.');
  // Whitelist explicitly excludes private notes and imported object properties.
  return {
    version: 1,
    duration: x.duration,
    step: x.step,
    revealed: x.revealed,
    zoom: x.zoom,
    sessionClock: { elapsed: x.sessionClock.elapsed, started: x.sessionClock.started },
    activityClock: { elapsed: x.activityClock.elapsed, started: x.activityClock.started },
  };
}
