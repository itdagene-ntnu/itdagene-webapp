import Image from 'next/image';
import React from 'react';
import { ContentState, EventPhase } from '../../config/edition';
import { homepageMedia } from '../../config/homepage';
import { StandMapManifest } from '../Stands/standsData';
import { ActionLink, SiteSection } from '../DesignSystem';
import { CurrentEventPreview, PreviewEvent } from './CurrentEventPreview';
import { DocumentaryBand } from './DocumentaryBand';
import { VisitPlanner } from './VisitPlanner';

export const HomeBriefing = ({
  edition,
  events,
  phase,
  programState,
  referenceTime,
  standMap,
  standState,
}: {
  edition: number;
  events: ReadonlyArray<PreviewEvent>;
  phase: EventPhase;
  programState: ContentState;
  referenceTime: string;
  standMap: StandMapManifest;
  standState: ContentState;
}): JSX.Element => {
  const mapDay = standMap.days[0];
  const historicalMap = standMap.edition !== edition;

  return (
    <>
      <VisitPlanner programState={programState} standState={standState} />

      <CurrentEventPreview
        events={events}
        phase={phase}
        programState={programState}
        referenceTime={referenceTime}
      />

      <SiteSection className="home-stand-section">
        <div className="home-stand-feature">
          <figure className="home-stand-feature__map">
            <Image
              alt={`Standkart for ${mapDay.label.toLowerCase()} under itDAGENE ${
                standMap.edition
              }`}
              height={1131}
              sizes="(max-width: 800px) 100vw, 62vw"
              src={mapDay.mapImage}
              width={1600}
            />
            <figcaption>
              {historicalMap
                ? `Eksempel fra ${standMap.edition}`
                : `Standkart ${standMap.edition}`}
            </figcaption>
          </figure>
          <div className="home-stand-feature__copy">
            <p className="home-stand-feature__location">{standMap.location}</p>
            <h2>Finn bedriftene du vil møte</h2>
            <p>
              Bruk bedriftslisten og kartet sammen for å finne riktig stand og
              planlegge hvem du vil snakke med.
            </p>
            {historicalMap && (
              <p className="home-stand-feature__status">
                Kartet er et tydelig merket eksempel fra {standMap.edition}.
                Standfordelingen for {edition} publiseres når den er klar.
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
