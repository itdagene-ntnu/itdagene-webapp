import React, { useState } from 'react';
import Link from 'next/link';
import { createFragmentContainer, graphql } from 'react-relay';
import { StandView_stand } from '../../__generated__/StandView_stand.graphql';
import Flex, { FlexItem } from 'styled-flex-component';
import styled from 'styled-components';
import { BorderlessSection } from '../Styled';
import NavBar from '../Navbar';
import AboutPage from './AboutStand';
import ProgramPage from './StandProgram';
import JobListingsPage from './StandJoblistings';

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

const LiveContainer = styled.div`
  display: flex;
  margin-bottom: 30px;
  max-width: 2000px;
  margin: auto;
  @media only screen and (max-width: 993px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

const Player = styled('div')`
  height: 800px;
  width: 70%;
  background-color: #222;
  color: white;
  text-align: center;
  vertical-align: middle;
  position: relative;
  @media only screen and (max-width: 993px) {
    width: 100%;
    height: 400px;
  }
  @media only screen and (max-width: 767px) {
    height: 250px;
  }
`;

const QAView = styled.div`
  height: 800px;
  width: 30%;
  background-color: #222;
  color: white;
  @media only screen and (max-width: 993px) {
    width: 100%;
    height: 300px;
  }
`;

const BackLink = styled.a`
  font-size: 25px;
  cursor: pointer;
`;

const Back = (): JSX.Element => (
  <Flex>
    <FlexItem>
      <Link href="/stands">
        <BackLink>{'< Tilbake til stands'}</BackLink>
      </Link>
    </FlexItem>
  </Flex>
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

  return (
    <>
      <BorderlessSection noPadding>
        <Back />
        <div>
          <img
            src={stand.company.logo || undefined}
            style={{ display: 'block', margin: '25px 0 25px' }}
            alt={`${stand.company.name} logo`}
          />
        </div>
      </BorderlessSection>
      <LiveContainer>
        <Player>
          {stand.livestreamUrl ? (
            <iframe
              title="livestreamEmbed"
              src={`${stand.livestreamUrl}?autoplay=true`}
              style={{ position: 'absolute', top: '0', left: '0' }}
              allowFullScreen
              frameBorder="no"
              width="100%"
              height="100%"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          ) : (
            <h3>Ingen stream for øyeblikket</h3>
          )}
        </Player>
        <QAView>
          {stand.qaUrl ? (
            <iframe
              title="slidoEmbed"
              src={stand.qaUrl}
              height="100%"
              width="100%"
              frameBorder="0"
            ></iframe>
          ) : (
            <h3>Ingen Q&A for øyeblikket</h3>
          )}
        </QAView>
      </LiveContainer>

      <BorderlessSection noPadding>
        <NavBar items={navBarItems} />
        <Flex wrapReverse>
          <FlexItem basis="600px" grow={3}>
            <Flex column>
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
          name
          value
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
