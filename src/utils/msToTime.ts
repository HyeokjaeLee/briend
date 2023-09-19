export const msToTime = (ms: number) => {
  const hours = Math.floor((ms / (60_000 * 60)) % 24);
  const minutes = Math.floor((ms / 60_000) % 60);
  const seconds = Math.floor((ms / 1_000) % 60);

  const addZero = (num: number) => (num < 10 ? `0${num}` : num);

  return {
    hours: addZero(hours),
    minutes: addZero(minutes),
    seconds: addZero(seconds),
  };
};
