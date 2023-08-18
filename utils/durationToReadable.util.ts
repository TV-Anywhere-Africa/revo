/**
 * Converts movie duration to the format 0h 0m 0s
 * @param duration
 * @returns Duration in 0h 0m 0s
 */
export default function durationToReadable(duration: string | number) {
  const hours = Math.floor(Number(duration) / 60);
  const minutes = Math.floor(Number(duration) % 60);
  const seconds = Math.floor((Number(duration) * 60) % 60);

  const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

  return `${formattedHours}h ${formattedMinutes}m ${formattedSeconds}s`;
}
