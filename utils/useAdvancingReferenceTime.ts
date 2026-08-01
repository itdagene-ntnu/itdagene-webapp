import { useEffect, useState } from 'react';

export const advanceReferenceTimestamp = (
  initialTimestamp: string,
  elapsedMilliseconds: number
): string =>
  new Date(
    new Date(initialTimestamp).getTime() + Math.max(0, elapsedMilliseconds)
  ).toISOString();

export const useAdvancingReferenceTime = (
  initialTimestamp: string,
  intervalMilliseconds = 30000
): string => {
  const [referenceTime, setReferenceTime] = useState(initialTimestamp);

  useEffect(() => {
    const startedAt = performance.now();
    setReferenceTime(initialTimestamp);

    const updateReferenceTime = (): void => {
      setReferenceTime(
        advanceReferenceTimestamp(
          initialTimestamp,
          performance.now() - startedAt
        )
      );
    };
    const interval = window.setInterval(
      updateReferenceTime,
      intervalMilliseconds
    );

    return (): void => window.clearInterval(interval);
  }, [initialTimestamp, intervalMilliseconds]);

  return referenceTime;
};
