export const msToTime = (ms: number) => ({
  hours: Math.floor((ms / (60_000 * 60)) % 24),
  minutes: Math.floor((ms / 60_000) % 60),
  seconds: Math.floor((ms / 1_000) % 60),
});
