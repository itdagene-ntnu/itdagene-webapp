import React from 'react';
import Link from 'next/link';
import { createFragmentContainer, graphql } from 'react-relay';
import { StandView_stand } from '../../__generated__/StandView_stand.graphql';
import Flex, { FlexItem } from 'styled-flex-component';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import { lightGrey } from '../../utils/colors';
import { Player } from 'video-react';

import NavBar from '../Navbar';

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
`

const PlayerView = styled('div')`
  margin-bottom: 30px;
  height: 500px;
  width: 800px;
  background-color: #222;
  color: white;
  text-align: center;
  vertical-align: middle;
`;

const QAView = styled.div`
  height: 500px;
  width: 400px;
  background-color: #222;
  border: 1px solid #ddd;
  color: white;
`

const GrayText = styled('div')`
  color: gray;
`;

const CompanyDesc = styled(GrayText)`
  font-style: italic;
  text-align: left;
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

const navBarItems = (stand: StandView_stand) => [
  {
    text: `Om ${stand.company.name}`,
    href: "",
    as: "",
    key: "om",
  }
]

const Stand = ({ stand }: Props): JSX.Element => (
  <>
    <Back />
    <div>
      <img
        src={stand.company.logo || undefined}
        style={{ display: 'block', margin: '25px 0 25px' }}
        alt={`${stand.company.name} logo`}
      />
    </div>
    <LiveContainer>
      <PlayerView>
        <h3>{stand.company.name}</h3>
        {/*<Player playsInline src={stand.videoUrl} />*/}
      </PlayerView>
    <QAView>
      {/*TODO: Slido here*/}
      Slido
      </QAView>
      </LiveContainer>
    <CompanyDesc style={{ maxWidth: 960, fontSize: '1.3rem' }}>
      <ReactMarkdown source={stand.description} />
    </CompanyDesc>

    <NavBar items={navBarItems(stand)}/>

    <Flex wrapReverse>
      <FlexItem basis="600px" grow={3}>
        <Flex column>
          <ReactMarkdown>{stand.description || ''}</ReactMarkdown>
        </Flex>
      </FlexItem>
    </Flex>
  </>
);

export default createFragmentContainer(Stand, {
  stand: graphql`
    fragment StandView_stand on Stand {
      id
      company {
        name
        logo(width: 300, height: 100)
        description
        url
        keyInformation {
          name
          value
        }
      }
      description
      livestreamUrl
      qaUrl
      chatUrl
    }
  `,
});
