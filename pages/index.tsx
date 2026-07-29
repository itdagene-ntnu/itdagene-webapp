import React from 'react';
import Head from 'next/head';
import { graphql } from 'react-relay';
import { pages_index_QueryResponse } from '../__generated__/pages_index_Query.graphql';
import {
  ContentStatePanel,
  EventMarquee,
  SiteSection,
} from '../components/DesignSystem';
import { EmployerInvitation } from '../components/Frontpage/EmployerInvitation';
import { HomeBriefing } from '../components/Frontpage/HomeBriefing';
import {
  AssociatePartnerTier,
  PrimaryPartnerTier,
} from '../components/Frontpage/PartnerTiers';
import WelcomeScreen from '../components/Frontpage/WelcomeScreen';
import { editionConfig } from '../config/edition';
import { withDataAndLayout, WithDataAndLayoutProps } from '../lib/withData';
import { resolveCompanyMarquee } from '../utils/companyMarquee';
import {
  resolveContentState,
  resolveEventPhase,
} from '../utils/eventLifecycle';

type RenderProps = WithDataAndLayoutProps<pages_index_QueryResponse>;

const Index = ({ props, error }: RenderProps): JSX.Element => {
  if (!props || !props.currentMetaData) {
    return (
      <SiteSection>
        <ContentStatePanel
          description="Last siden på nytt, eller prøv igjen om litt."
          state="error"
          title="Vi fikk ikke hentet informasjon om itDAGENE."
        />
      </SiteSection>
    );
  }

  const currentEdition = props.currentMetaData.year || editionConfig.edition;
  const phase = resolveEventPhase({
    startDate: props.currentMetaData.startDate,
    endDate: props.currentMetaData.endDate,
    publicLaunchAt: editionConfig.publicLaunchAt,
  });
  const programState = resolveContentState({
    lifecycle: editionConfig.modules.program,
    currentEdition,
    itemCount: props.events?.length || 0,
  });
  const standState = resolveContentState({
    lifecycle: editionConfig.modules.stands,
    currentEdition,
    sourceEdition:
      editionConfig.modules.stands.historicalEdition || currentEdition,
  });
  const companiesPublished =
    props.currentMetaData.companiesFirstDay !== null ||
    props.currentMetaData.companiesLastDay !== null;
  const companyMarquee = resolveCompanyMarquee({
    currentEdition,
    currentCompanies: companiesPublished
      ? [
          ...(props.currentMetaData.companiesFirstDay || []),
          ...(props.currentMetaData.companiesLastDay || []),
        ]
      : null,
    excludedCompanyNames: [
      props.currentMetaData.mainCollaborator?.name,
      ...(props.currentMetaData.collaborators || []).map(
        (partner) => partner.name
      ),
    ],
  });

  return (
    <>
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'itDAGENE',
              url: 'https://itdagene.no',
              logo: 'https://cdn.itdagene.no/itdagene.svg',
              email: 'styret@itdagene.no',
              parentOrganization: {
                '@type': 'EducationalOrganization',
                name: 'Norges teknisk-naturvitenskapelige universitet',
                alternateName: 'NTNU',
                url: 'https://www.ntnu.no',
              },
            }),
          }}
          type="application/ld+json"
        />
      </Head>
      <WelcomeScreen
        currentMetaData={props.currentMetaData}
        programState={programState}
        standState={standState}
      />

      <PrimaryPartnerTier partner={props.currentMetaData.mainCollaborator} />

      <HomeBriefing
        edition={currentEdition}
        endDate={props.currentMetaData.endDate}
        events={props.events || []}
        phase={phase}
        programState={programState}
        standState={standState}
        startDate={props.currentMetaData.startDate}
      />

      <EmployerInvitation edition={currentEdition} />

      <AssociatePartnerTier
        partners={props.currentMetaData.collaborators || []}
      />

      {companyMarquee && (
        <EventMarquee
          items={companyMarquee.items}
          label={companyMarquee.label}
        />
      )}
    </>
  );
};

export default withDataAndLayout(Index, {
  query: graphql`
    query pages_index_Query {
      currentMetaData {
        ...WelcomeScreen_currentMetaData
        id
        year
        startDate
        endDate
        interestForm
        collaborators {
          id
          name
          logo(width: 459, height: 170)
          url
          description
        }
        companiesFirstDay {
          id
          name
          logo(width: 320, height: 120)
        }
        companiesLastDay {
          id
          name
          logo(width: 320, height: 120)
        }
        mainCollaborator {
          id
          name
          logo(width: 1000, height: 320)
          url
          description
        }
      }
      events {
        id
        title
        date
        timeStart
        timeEnd
        location
      }
    }
  `,
  variables: {},
});
