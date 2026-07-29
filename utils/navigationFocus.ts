const MAIN_FOCUS_KEY = 'itdagene:focus-main-after-navigation';

export const requestMainFocusAfterNavigation = (): void => {
  try {
    window.sessionStorage.setItem(MAIN_FOCUS_KEY, 'true');
  } catch {
    // Storage can be disabled. The navigation must still work normally.
  }
};

export const consumeMainFocusRequest = (): boolean => {
  try {
    if (window.sessionStorage.getItem(MAIN_FOCUS_KEY) !== 'true') return false;
    window.sessionStorage.removeItem(MAIN_FOCUS_KEY);
    return true;
  } catch {
    return false;
  }
};

export const focusRouteContent = (): void => {
  const main = document.getElementById('main-content');
  if (!main) return;

  const heading = main.querySelector<HTMLElement>('h1');
  if (heading) {
    heading.tabIndex = -1;
    heading.focus();
    return;
  }

  main.focus();
};
