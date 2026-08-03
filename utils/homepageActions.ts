import { ContentState, EventPhase } from '../config/edition';

export type HomepageAction = {
  href: string;
  label: string;
};

export type HeroActions = {
  primary: HomepageAction;
  secondary?: HomepageAction;
};

export const resolveHeroActions = ({
  phase,
  programState,
  standState,
}: {
  phase: EventPhase;
  programState: ContentState;
  standState: ContentState;
}): HeroActions => {
  if (phase === 'postEvent') {
    return {
      primary: { href: '/galleri', label: 'Se høydepunktene' },
    };
  }

  if (phase === 'live') {
    if (programState === 'published') {
      return {
        primary: { href: '/program', label: 'Dagens program' },
        secondary:
          standState === 'published'
            ? { href: '/stands', label: 'Finn stands' }
            : undefined,
      };
    }

    if (standState === 'published') {
      return {
        primary: { href: '/stands', label: 'Finn stands' },
      };
    }

    return {
      primary: { href: '/faq', label: 'Praktisk informasjon' },
    };
  }

  if (programState === 'published') {
    return {
      primary: { href: '/program', label: 'Se programmet' },
      secondary:
        standState === 'published'
          ? { href: '/stands', label: 'Finn stands' }
          : undefined,
    };
  }

  return {
    primary: { href: '#planlegg-besoket', label: 'Se hva som skjer' },
    secondary:
      standState === 'published'
        ? { href: '/stands', label: 'Finn stands' }
        : undefined,
  };
};

export const resolveEmployerAction = (
  interestForm?: string | null
): HomepageAction =>
  interestForm
    ? { href: interestForm, label: 'Meld interesse' }
    : { href: '/faq', label: 'Les om deltakelse' };
