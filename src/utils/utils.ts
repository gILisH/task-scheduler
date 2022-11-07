export const convertTaskTimerToEpoch = (hours: number, minutes: number, seconds: number): number => {
  return convertTaskTimerToDate(hours, minutes, seconds).getTime();
};

export const convertTaskTimerToDate = (hours: number, minutes: number, seconds: number): Date => {
  const timeToAddInSeconds = hours * 60 * 60 + minutes * 60 + seconds;
  return new Date(new Date().getTime() + timeToAddInSeconds * 1000);
};

export const secondsLeftUntilTime = (time: Date): number => {
  const timeLeft = time.getTime() - new Date().getTime();
  return timeLeft > 0 ? timeLeft / 1000 : 0;
};

export const addMinutesToDate = (date: Date, minutes: number): Date => {
  return new Date(date.setMinutes(date.getMinutes() + minutes));
};

export const getEpochInSeconds = (date: Date): number => {
  return Math.floor(date.getTime() / 1000);
};

export const getEpochInSecondsAndRoundUpByX = (date: Date, x: number): number => {
  return Math.ceil(Math.floor(date.getTime() / 1000) / x) * x;
};
