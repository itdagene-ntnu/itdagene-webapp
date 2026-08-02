import { NextRouter } from 'next/router';
import React from 'react';
import { graphql } from 'react-relay';
import { stands_new_QueryResponse } from '../../__generated__/stands_new_Query.graphql';
import {
  ContentStatePanel,
  MetadataList,
  PageHeader,
  SegmentedControl,
} from '../../components/DesignSystem';
import { StandMap } from '../../components/Stands/StandMap';
import {
  standMapManifest as historicalStandMap,
  StandMapDayId,
  StandMapManifest,
  validateStandMapManifest,
} from '../../components/Stands/standsData';
import { editionConfig } from '../../config/edition';
import { withDataAndLayout, WithDataAndLayoutProps } from '../../lib/withData';
import { resolveContentState } from '../../utils/eventLifecycle';
import { toStandMapManifest } from '../../utils/standMap';

const isStandMapDay = (
  value: string,
  manifest: StandMapManifest
): value is StandMapDayId => manifest.days.some((day) => day.id === value);

const updateStandQuery = (
  router: NextRouter,
  changes: { day?: StandMapDayId; company?: string }
): void => {
  const query = { ...router.query, ...changes };
  if (!changes.company) {
    delete query.company;
  }
  router.push({ pathname: router.pathname, query }, undefined, {
    shallow: true,
    scroll: false,
  });
};

const Index = ({
  optionalEventConfiguration,
  props,
  router,
}: WithDataAndLayoutProps<stands_new_QueryResponse>): JSX.Element => {
  const currentStandMap = toStandMapManifest(
    optionalEventConfiguration.currentStandMap
  );
  const standMapManifest = currentStandMap || historicalStandMap;
  const validationErrors = validateStandMapManifest(standMapManifest);
  if (validationErrors.length > 0) {
    return (
      <ContentStatePanel
        description="Kartdataene må rettes før de kan vises på en trygg måte."
        state="error"
        title="Standkartet har ugyldige plasseringer."
      />
    );
  }

  const currentEdition = props.currentMetaData?.year || editionConfig.edition;
  const contentState = resolveContentState({
    lifecycle: editionConfig.modules.stands,
    currentEdition,
    sourceEdition: standMapManifest.edition,
    itemCount: standMapManifest.days.length,
    isPublished: Boolean(currentStandMap),
  });
  const requestedDay =
    typeof router.query.day === 'string' &&
    isStandMapDay(router.query.day, standMapManifest)
      ? router.query.day
      : standMapManifest.days[0].id;
  const activeDay =
    standMapManifest.days.find((day) => day.id === requestedDay) ||
    standMapManifest.days[0];
  const selectedCompany =
    typeof router.query.company === 'string' ? router.query.company : undefined;

  return (
    <>
      <PageHeader
        description="Søk i bedriftslisten eller bruk standnumrene i plantegningen. Kart og liste fungerer sammen."
        title="Standkart"
      >
        <MetadataList
          items={[
            { label: 'Sted', value: activeDay.location },
            { label: 'Kartgrunnlag', value: standMapManifest.edition },
          ]}
        />
      </PageHeader>

      {contentState !== 'published' && (
        <div className="stand-state">
          <ContentStatePanel
            compact
            description={`Kartet nedenfor er arkivet fra ${standMapManifest.edition}. Det er kun ment som et eksempel på oppsettet, og viser ikke årets plasseringer.`}
            state={contentState}
            title={`Standfordelingen for ${currentEdition} er ikke publisert ennå.`}
          />
        </div>
      )}

      <section
        aria-labelledby="historical-map-heading"
        className="stand-content"
      >
        <div className="stand-content__heading">
          <div>
            <h2 id="historical-map-heading">
              Standplasseringer {standMapManifest.edition}
            </h2>
          </div>
          <SegmentedControl
            activeValue={activeDay.id}
            label="Velg messedag"
            onChange={(value): void => {
              if (isStandMapDay(value, standMapManifest)) {
                updateStandQuery(router, { day: value });
              }
            }}
            options={standMapManifest.days.map((day) => ({
              label: day.label,
              value: day.id,
            }))}
          />
        </div>

        <StandMap
          day={activeDay}
          onSelect={(company): void =>
            updateStandQuery(router, {
              day: activeDay.id,
              company,
            })
          }
          selectedCompany={selectedCompany}
        />
      </section>
    </>
  );
};

export default withDataAndLayout(Index, {
  includeEventConfiguration: true,
  query: graphql`
    query stands_new_Query {
      currentMetaData {
        year
        startDate
        endDate
      }
    }
  `,
  variables: {},
  layout: (): any => ({
    responsive: true,
    customOpengraphMetadata: (): { title: string; description: string } => ({
      title: 'Standkart',
      description: 'Finn bedrifter og standnumre under itDAGENE.',
    }),
  }),
});
