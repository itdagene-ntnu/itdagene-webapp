import Image from 'next/image';
import React from 'react';
import { ContentState, EventPhase } from '../../config/edition';
import { homepageMedia } from '../../config/homepage';
import { StandMapManifest } from '../Stands/standsData';
import { StandMapPlaceholder } from '../Stands/StandMapPlaceholder';
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
  standMap?: StandMapManifest;
  standState: ContentState;
}): JSX.Element => {
  const publishedStandMap =
    standMap && standState === 'published' ? standMap : undefined;
  const mapDay = publishedStandMap?.days[0];

  return (
    <>
      <VisitPlanner programState={programState} standState={standState} />

      <CurrentEventPreview
        events={events}
        phase={phase}
        programState={programState}
        referenceTime={referenceTime}
      />

      {publishedStandMap && mapDay ? (
        <SiteSection className="home-stand-section">
          <div className="home-stand-feature">
            <figure className="home-stand-feature__map">
              <Image
                alt={`Standkart for ${mapDay.label.toLowerCase()} under itDAGENE ${
                  publishedStandMap.edition
                }`}
                height={1131}
                sizes="(max-width: 800px) 100vw, 62vw"
                src={mapDay.mapImage}
                unoptimized
                width={1600}
              />
              <figcaption>Standkart {publishedStandMap.edition}</figcaption>
            </figure>
            <div className="home-stand-feature__copy">
              <p className="home-stand-feature__location">
                {publishedStandMap.location}
              </p>
              <h2>Finn bedriftene du vil møte</h2>
              <p>
                Bruk bedriftslisten og kartet sammen for å finne riktig stand og
                planlegge hvem du vil snakke med.
              </p>
              <ActionLink href="/stands">Utforsk stands</ActionLink>
            </div>
          </div>
        </SiteSection>
      ) : (
        <SiteSection className="home-stand-section" tone="muted">
          <div className="home-stand-placeholder">
            <StandMapPlaceholder edition={edition} linkToStatus />
          </div>
        </SiteSection>
      )}

      <DocumentaryBand
        items={homepageMedia.documentary}
        title="Fra messegulvet"
      />
    </>
  );
};
