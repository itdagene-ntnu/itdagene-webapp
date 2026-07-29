export const HERO_HEADER_ACTION_EVENT = 'itdagene:hero-header-action';

export type HeroHeaderAction = {
  external: boolean;
  href: string;
  label: string;
};

export type HeroHeaderActionEvent = {
  action: HeroHeaderAction;
  visible: boolean;
};

export const announceHeaderActionVisibility = (
  visible: boolean,
  action: HeroHeaderAction
): void => {
  window.dispatchEvent(
    new CustomEvent<HeroHeaderActionEvent>(HERO_HEADER_ACTION_EVENT, {
      detail: { action, visible },
    })
  );
};
