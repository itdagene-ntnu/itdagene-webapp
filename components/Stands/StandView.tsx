import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createFragmentContainer, graphql } from 'react-relay';
import { StandView_stand } from '../../__generated__/StandView_stand.graphql';
import { ChatwootSDK, Chatwoot, ChatwootSettings } from '../../types/chatwoot';
import Flex, { FlexItem } from 'styled-flex-component';
import styled from 'styled-components';
import { BorderlessSection } from '../Styled';
import NavBar from '../Navbar';
import AboutPage from './AboutStand';
import ProgramPage from './StandProgram';
import JobListingsPage from './StandJoblistings';
import LivePlayer from './LivePlayer';
import KeyInfo from './KeyInfoBlob';

declare global {
  interface Window {
    chatwootSDK?: ChatwootSDK;
    $chatwoot?: Chatwoot;
    chatwootSettings?: ChatwootSettings;
  }
}

type Props = {
  stand: StandView_stand;
};
export const Title = styled('h1')`
  text-align: center;
  font-size: 4rem;
  font-weight: 400;
  font-family: Raleway;
  margin: 0 0 40px;
  @media only screen and (max-width: 767px) {
    font-size: 2.4rem;
  }
`;

const BackLink = styled.a`
  font-size: 20px;
  cursor: pointer;
`;

const CompanyImg = styled.img`
  max-width: 200px;
  max-height: 70px;

  @media only screen and (max-width: 767px) {
    max-width: 120px;
    max-height: 50px;
  }
`;

const LiveContentSection = styled.div`
  margin: 0 2em 30px 2em;

  @media only screen and (max-width: 767px) {
    margin: 0 1em 30px 1em;
  }
`;

const Back = (): JSX.Element => (
  <Link href="/stands">
    <BackLink>{'< Tilbake til stands'}</BackLink>
  </Link>
);

const SubPage = ({
  page,
  stand,
}: {
  page: string;
  stand: StandView_stand;
}): JSX.Element => {
  switch (page) {
    case 'om':
      return <AboutPage stand={stand} />;
    case 'program':
      return <ProgramPage stand={stand} />;
    case 'joblistings':
      return <JobListingsPage company={stand.company} />;
    default:
      return <div>Noe gikk galt. Forsøk å refresh siden</div>;
  }
};

const Stand = ({ stand }: Props): JSX.Element => {
  const commonItemObj = {
    active: (key: string): boolean => currentPage === key,
    onClick: (key: string): void => setCurrentPage(key),
  };

  const navBarItems: React.ComponentProps<typeof NavBar>['items'] = [
    {
      text: `Om ${stand.company.name}`,
      key: 'om',
      ...commonItemObj,
    },
    {
      text: `Programmet til ${stand.company.name}`,
      key: 'program',
      ...commonItemObj,
    },
    {
      text: `Jobb i ${stand.company.name}`,
      key: 'joblistings',
      ...commonItemObj,
    },
  ];

  const [currentPage, setCurrentPage] = useState(navBarItems[0].key);

  useEffect(() => {
    if (window && stand.chatUrl) {
      window.chatwootSettings = {
        type: 'expanded_bubble',
        launcherTitle: `Chat med bedriften`,
        showPopoutButton: true,
      };
      if (window.$chatwoot?.isInitialized) {
        window.$chatwoot.websiteToken = stand.chatUrl;
        window.$chatwoot.reload();
      } else {
        window.chatwootSDK &&
          window.chatwootSDK.run({
            websiteToken: stand.chatUrl,
            baseUrl: 'https://chat.itdagene.no',
          });
      }
      window.$chatwoot?.show();
    }
    return (): void => {
      window.$chatwoot?.hide();
    };
  }, [stand.chatUrl, stand.company.name]);

  return (
    <>
      <LiveContentSection>
        <Flex justifyBetween alignEnd style={{ marginBottom: '1em' }}>
          <Back />
          <CompanyImg
            src={stand.company.logo || undefined}
            alt={`${stand.company.name} logo`}
          />
        </Flex>
        <LivePlayer qaUrl={stand.qaUrl} livestreamUrl={stand.livestreamUrl} />
      </LiveContentSection>
      <BorderlessSection noPadding style={{ margin: '30px 0' }}>
        <NavBar items={navBarItems} />
        <Flex wrapReverse>
          <FlexItem basis="600px" grow={3}>
            <Flex column>
              <SubPage stand={stand} page={currentPage} />
            </Flex>
          </FlexItem>
        </Flex>
        {stand.company.keyInformation && (
          <KeyInfo keyInformation={stand.company.keyInformation} />
        )}
      </BorderlessSection>
    </>
  );
};

export default createFragmentContainer(Stand, {
  stand: graphql`
    fragment StandView_stand on Stand {
      id
      company {
        name
        logo(width: 300, height: 100, padding: false)
        description
        url
        keyInformation {
          ...KeyInfoBlob_keyInformation
        }
        ...StandJoblistings_joblistings
      }
      livestreamUrl
      qaUrl
      chatUrl
      ...AboutStand_stand
      ...StandProgram_stand
    }
  `,
});
