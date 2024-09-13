import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createFragmentContainer, graphql } from 'react-relay';
import { StandView_stand } from '../../__generated__/StandView_stand.graphql';
import { ChatwootSDK, Chatwoot, ChatwootSettings } from '../../types/chatwoot';
import styled from 'styled-components';
import { BorderlessSection } from '../Styled';
import NavBar from '../Navbar';
import AboutPage from './AboutStand';
import ProgramPage from './StandProgram';
import JobListingsPage from './StandJoblistings';
import LivePlayer from './LivePlayer';
import KeyInfo from './KeyInfo';
import Flex from '../Styled/Flex';
import FlexItem from '../Styled/FlexItem';

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
  font-family: Roboto;
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

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 2000px;
  margin: auto;

  @media only screen and (max-width: 993px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

const LiveContentSection = styled.div`
  margin: 0 2em 30px 2em;

  @media only screen and (max-width: 767px) {
    margin: 0 1em 30px 1em;
  }
`;

const Back = (): JSX.Element => (
  <Link href="/stands" legacyBehavior>
    <BackLink>
      <i className="fas fa-arrow-left" />
      {' Tilbake til stands'}
    </BackLink>
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
      return (
        <>
          <AboutPage stand={stand} />
          {stand.company.keyInformation && (
            <KeyInfo keyInformation={stand.company.keyInformation} />
          )}
        </>
      );
    case 'program':
      return <ProgramPage />;
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
        <Header style={{ marginBottom: '1em' }}>
          <Back />
          <CompanyImg
            src={stand.company.logo || undefined}
            alt={`${stand.company.name} logo`}
          />
        </Header>
        <LivePlayer qaUrl={stand.qaUrl} livestreamUrl={stand.livestreamUrl} />
      </LiveContentSection>
      <BorderlessSection noPadding style={{ margin: '30px 0' }}>
        <NavBar items={navBarItems} />
        <Flex flexWrap="wrap-reverse">
          <FlexItem flexBasis="600px" flexGrow="3">
            <Flex flexDirection="column">
              <SubPage stand={stand} page={currentPage} />
            </Flex>
          </FlexItem>
        </Flex>
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
          ...KeyInfo_keyInformation
        }
        ...StandJoblistings_joblistings
      }
      livestreamUrl
      qaUrl
      chatUrl
      ...AboutStand_stand
    }
  `,
});
