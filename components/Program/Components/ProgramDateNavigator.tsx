import 'dayjs/locale/nb';
import { capitalize } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { eventLocalTime } from '../../../utils/eventTime';

type ProgramDateNavigatorProps = {
  activeDate: string;
  dates: string[];
  eventCounts: Record<string, number>;
  onChange: (date: string) => void;
};

const PROGRAM_DATE_FOCUS_KEY = 'itdagene:focus-program-date';

const requestProgramDateFocus = (date: string): void => {
  try {
    window.sessionStorage.setItem(PROGRAM_DATE_FOCUS_KEY, date);
  } catch {
    // Storage can be disabled. Selection must still work normally.
  }
};

const requestedProgramDateFocus = (): string | null => {
  try {
    return window.sessionStorage.getItem(PROGRAM_DATE_FOCUS_KEY);
  } catch {
    return null;
  }
};

const clearProgramDateFocusRequest = (): void => {
  try {
    window.sessionStorage.removeItem(PROGRAM_DATE_FOCUS_KEY);
  } catch {
    // Storage can be disabled. There is nothing else to clear.
  }
};

const eventCountLabel = (count: number): string =>
  count === 1 ? '1 arrangement' : `${count} arrangementer`;

const DirectionIcon = ({
  direction,
}: {
  direction: 'left' | 'right';
}): JSX.Element => (
  <svg aria-hidden="true" focusable="false" viewBox="0 0 20 20">
    <path
      d={direction === 'left' ? 'M12.5 4 6.5 10l6 6' : 'm7.5 4 6 6-6 6'}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  </svg>
);

const ProgramDateNavigator = ({
  activeDate,
  dates,
  eventCounts,
  onChange,
}: ProgramDateNavigatorProps): JSX.Element | null => {
  const dateButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const dateItems = useRef<(HTMLLIElement | null)[]>([]);
  const track = useRef<HTMLDivElement | null>(null);
  const [indicatorPosition, setIndicatorPosition] = useState<number | null>(
    null
  );
  const activeIndex = dates.indexOf(activeDate);
  const activeCalendarDate =
    activeIndex >= 0 ? eventLocalTime(activeDate).locale('nb') : null;

  const syncIndicator = useCallback((): void => {
    const activeItem = dateItems.current[activeIndex];
    const rail = track.current;
    if (!activeItem || !rail) {
      setIndicatorPosition(null);
      return;
    }

    const activeItemBounds = activeItem.getBoundingClientRect();
    const railBounds = rail.getBoundingClientRect();
    setIndicatorPosition(
      activeItemBounds.left - railBounds.left + activeItemBounds.width / 2
    );
  }, [activeIndex]);

  useEffect(() => {
    const activeButton = dateButtons.current[activeIndex];
    if (typeof activeButton?.scrollIntoView !== 'function') return;

    activeButton.scrollIntoView({
      block: 'nearest',
      inline: 'center',
    });
  }, [activeIndex]);

  useEffect(() => {
    syncIndicator();
    window.addEventListener('resize', syncIndicator);
    return (): void => window.removeEventListener('resize', syncIndicator);
  }, [syncIndicator]);

  useEffect(() => {
    if (requestedProgramDateFocus() !== activeDate) return;

    let clearTimer: number | null = null;
    const frame = window.requestAnimationFrame(() => {
      const currentFocus = document.activeElement as HTMLElement | null;
      if (
        currentFocus &&
        currentFocus !== document.body &&
        !currentFocus.hasAttribute('data-program-date')
      ) {
        clearProgramDateFocusRequest();
        return;
      }

      dateButtons.current[activeIndex]?.focus({ preventScroll: true });
      clearTimer = window.setTimeout(clearProgramDateFocusRequest, 500);
    });
    return (): void => {
      window.cancelAnimationFrame(frame);
      if (clearTimer !== null) window.clearTimeout(clearTimer);
    };
  }, [activeDate, activeIndex]);

  if (dates.length === 0) return null;

  const monthGroups = dates.reduce<
    Array<{ key: string; label: string; dates: string[] }>
  >((groups, date) => {
    const calendarDate = eventLocalTime(date).locale('nb');
    const key = calendarDate.format('YYYY-MM');
    const currentGroup = groups[groups.length - 1];

    if (currentGroup?.key === key) {
      currentGroup.dates.push(date);
    } else {
      groups.push({
        key,
        label: capitalize(calendarDate.format('MMMM YYYY')),
        dates: [date],
      });
    }

    return groups;
  }, []);

  const selectDate = (index: number, moveFocus = false): void => {
    const date = dates[index];
    if (!date) return;

    if (moveFocus) {
      requestProgramDateFocus(date);
      dateButtons.current[index]?.focus();
    }
    onChange(date);
  };

  const handleDateKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ): void => {
    let nextIndex: number | undefined;

    if (event.key === 'ArrowLeft') nextIndex = Math.max(0, index - 1);
    if (event.key === 'ArrowRight') {
      nextIndex = Math.min(dates.length - 1, index + 1);
    }
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = dates.length - 1;
    if (nextIndex === undefined) return;

    event.preventDefault();
    if (nextIndex === index) return;
    selectDate(nextIndex, true);
  };

  return (
    <nav aria-label="Velg programdag" className="program-date-navigator">
      <div className="program-date-navigator__heading">
        <p className="site-eyebrow">Programdager</p>
        <div className="program-date-navigator__actions">
          <label className="program-date-navigator__picker">
            <span>Alle datoer</span>
            <select
              aria-label="Alle programdatoer"
              onChange={(event): void => onChange(event.target.value)}
              value={activeIndex >= 0 ? activeDate : ''}
            >
              {activeIndex < 0 && (
                <option disabled value="">
                  Velg dato
                </option>
              )}
              {monthGroups.map((group) => (
                <optgroup key={group.key} label={group.label}>
                  {group.dates.map((date) => (
                    <option key={date} value={date}>
                      {capitalize(
                        eventLocalTime(date).locale('nb').format('dddd D. MMMM')
                      )}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          {dates.length > 1 && (
            <div
              aria-label="Bytt programdag"
              className="program-date-navigator__controls"
              role="group"
            >
              <button
                aria-label="Forrige programdag"
                disabled={activeIndex <= 0}
                onClick={(): void => selectDate(activeIndex - 1)}
                type="button"
              >
                <DirectionIcon direction="left" />
              </button>
              <button
                aria-label="Neste programdag"
                disabled={activeIndex < 0 || activeIndex >= dates.length - 1}
                onClick={(): void => selectDate(activeIndex + 1)}
                type="button"
              >
                <DirectionIcon direction="right" />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="program-date-navigator__viewport">
        <div className="program-date-navigator__track" ref={track}>
          <ol>
            {dates.map((date, index) => {
              const calendarDate = eventLocalTime(date).locale('nb');
              const count = eventCounts[date] || 0;
              const isActive = date === activeDate;
              const monthKey = calendarDate.format('YYYY-MM');
              const previousMonthKey = dates[index - 1]
                ? eventLocalTime(dates[index - 1]).format('YYYY-MM')
                : null;
              const startsMonth = monthKey !== previousMonthKey;

              return (
                <li
                  data-month-start={startsMonth}
                  key={date}
                  ref={(element): void => {
                    dateItems.current[index] = element;
                  }}
                >
                  {startsMonth && (
                    <span
                      aria-hidden="true"
                      className="program-date-navigator__month-label"
                    >
                      {capitalize(calendarDate.format('MMMM YYYY'))}
                    </span>
                  )}
                  <button
                    aria-current={isActive ? 'date' : undefined}
                    aria-label={`${capitalize(
                      calendarDate.format('dddd D. MMMM')
                    )}, ${eventCountLabel(count)}`}
                    data-active={isActive}
                    data-program-date={date}
                    onClick={(): void => onChange(date)}
                    onKeyDown={(event): void => handleDateKeyDown(event, index)}
                    ref={(element): void => {
                      dateButtons.current[index] = element;
                    }}
                    tabIndex={
                      isActive || (activeIndex < 0 && index === 0) ? 0 : -1
                    }
                    type="button"
                  >
                    <time dateTime={date}>
                      <span className="program-date-navigator__weekday">
                        {calendarDate.format('ddd')}
                      </span>
                      <strong>{calendarDate.format('D')}</strong>
                    </time>
                  </button>
                </li>
              );
            })}
          </ol>
          <span
            aria-hidden="true"
            className="program-date-navigator__indicator"
            data-ready={indicatorPosition !== null}
            style={{
              transform: `translate3d(${
                indicatorPosition || 0
              }px, 0, 0) translateX(-50%)`,
            }}
          />
        </div>
      </div>
      {activeCalendarDate && activeIndex >= 0 && (
        <p aria-live="polite" className="program-date-navigator__selection">
          <time dateTime={activeDate}>
            {capitalize(activeCalendarDate.format('dddd D. MMMM'))}
          </time>{' '}
          <span>{eventCountLabel(eventCounts[activeDate] || 0)}</span>
        </p>
      )}
    </nav>
  );
};

export default ProgramDateNavigator;
