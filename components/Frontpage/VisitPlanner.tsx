import Link from 'next/link';
import React from 'react';
import { ContentState } from '../../config/edition';
import { SiteSection } from '../DesignSystem';

const stateLabel = (
  state: ContentState,
  published: string,
  pending: string
): string | undefined => {
  if (state === 'published') return published;
  if (state === 'error') return 'Status kunne ikke hentes';
  if (state === 'stale') return undefined;
  return pending;
};

export const VisitPlanner = ({
  programState,
  standState,
}: {
  programState: ContentState;
  standState: ContentState;
}): JSX.Element => {
  const routes = [
    {
      key: 'program',
      title: 'Program',
      description: 'Finn arrangementer, tider og rom.',
      state: stateLabel(
        programState,
        'Programmet er publisert',
        'Programmet publiseres senere'
      ),
      href: '/program',
    },
    {
      key: 'stands',
      title: 'Stands',
      description: 'Søk etter bedrifter og standnummer.',
      state: stateLabel(
        standState,
        'Årets standkart er klart',
        'Årets standkart kommer'
      ),
      href: '/stands',
    },
    {
      key: 'jobs',
      title: 'Jobb',
      description: 'Se jobb- og sommerjobbmuligheter.',
      href: '/jobb',
    },
    {
      key: 'practical',
      title: 'Praktisk',
      description: 'Finn sted, datoer og svar før besøket.',
      href: '/faq',
    },
  ];

  return (
    <SiteSection className="visit-planner" id="planlegg-besoket">
      <div className="visit-planner__heading">
        <h2>Planlegg besøket</h2>
      </div>
      <nav aria-label="Planlegg besøket">
        <ul>
          {routes.map((route) => (
            <li className={`visit-planner__item--${route.key}`} key={route.key}>
              <Link href={route.href}>
                <span aria-hidden="true" className="visit-planner__marker" />
                <h3>{route.title}</h3>
                <p>{route.description}</p>
                {route.state && <small>{route.state}</small>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </SiteSection>
  );
};
