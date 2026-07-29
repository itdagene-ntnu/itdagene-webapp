import { resolveEmployerAction, resolveHeroActions } from './homepageActions';

describe('homepage actions', () => {
  it('does not send visitors to an unpublished program', () => {
    expect(
      resolveHeroActions({
        phase: 'upcoming',
        programState: 'unpublished',
        standState: 'stale',
      })
    ).toEqual({
      primary: {
        href: '#planlegg-besoket',
        label: 'Se hva som skjer',
      },
    });
  });

  it('uses the published program and current stands when available', () => {
    expect(
      resolveHeroActions({
        phase: 'upcoming',
        programState: 'published',
        standState: 'published',
      })
    ).toEqual({
      primary: { href: '/program', label: 'Se programmet' },
      secondary: { href: '/stands', label: 'Finn stands' },
    });
  });

  it('uses event-day language during the fair', () => {
    expect(
      resolveHeroActions({
        phase: 'live',
        programState: 'published',
        standState: 'published',
      }).primary
    ).toEqual({ href: '/program', label: 'Dagens program' });
  });

  it('uses the gallery after the event', () => {
    expect(
      resolveHeroActions({
        phase: 'postEvent',
        programState: 'published',
        standState: 'stale',
      }).primary
    ).toEqual({ href: '/galleri', label: 'Se høydepunktene' });
  });

  it('reflects whether company interest registration is open', () => {
    expect(resolveEmployerAction('https://interesse.itdagene.no')).toEqual({
      href: 'https://interesse.itdagene.no',
      label: 'Meld interesse',
    });
    expect(resolveEmployerAction(null)).toEqual({
      href: '/faq',
      label: 'Les om deltakelse',
    });
  });
});
