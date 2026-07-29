import Image from 'next/image';
import React from 'react';
import { ContentState, EventPhase } from '../../config/edition';
import { homepageMedia } from '../../config/homepage';
import { standMapManifest } from '../Stands/standsData';
import { ActionLink, SiteSection } from '../DesignSystem';
import { CurrentEventPreview, PreviewEvent } from './CurrentEventPreview';
import { DocumentaryBand } from './DocumentaryBand';
import { VisitPlanner } from './VisitPlanner';

export const HomeBriefing = ({
  edition,
  endDate,
  events,
  phase,
  programState,
  standState,
  startDate,
}: {
  edition: number;
  endDate: string;
  events: ReadonlyArray<PreviewEvent>;
  phase: EventPhase;
  programState: ContentState;
  standState: ContentState;
  startDate: string;
}): JSX.Element => {
  const mapDay = standMapManifest.days[0];
  const historicalMap = standMapManifest.edition !== edition;

  return (
    <>
      <VisitPlanner programState={programState} standState={standState} />

      <CurrentEventPreview
        edition={edition}
        endDate={endDate}
        events={events}
        phase={phase}
        programState={programState}
        startDate={startDate}
      />

      <SiteSection className="home-stand-section">
        <div className="home-stand-feature">
          <figure className="home-stand-feature__map">
            <Image
              alt={`Standkart for ${mapDay.label.toLowerCase()} under itDAGENE ${
                standMapManifest.edition
              }`}
              height={1131}
              sizes="(max-width: 800px) 100vw, 62vw"
              src={mapDay.mapImage}
              width={1600}
            />
            <figcaption>
              {historicalMap
                ? `Eksempel fra ${standMapManifest.edition}`
                : `Standkart ${standMapManifest.edition}`}
            </figcaption>
          </figure>
          <div className="home-stand-feature__copy">
            <p className="home-stand-feature__location">Realfagbygget, U1</p>
            <h2>Finn bedriftene du vil møte</h2>
            <p>
              Bruk bedriftslisten og kartet sammen for å finne riktig stand og
              planlegge hvem du vil snakke med.
            </p>
            {historicalMap && (
              <p className="home-stand-feature__status">
                Kartet er et tydelig merket eksempel fra{' '}
                {standMapManifest.edition}. Standfordelingen for {edition}{' '}
                publiseres når den er klar.
              </p>
            )}
            {!historicalMap && standState !== 'published' && (
              <p className="home-stand-feature__status">
                Årets standfordeling publiseres når plasseringene er bekreftet.
              </p>
            )}
            <ActionLink href="/stands">Utforsk stands</ActionLink>
          </div>
        </div>
      </SiteSection>

      <DocumentaryBand
        items={homepageMedia.documentary}
        title="Fra messegulvet"
      />
    </>
  );
};
