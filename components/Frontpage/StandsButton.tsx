import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { Header } from '../Stands/FeaturedEvents';
import { NudgeDiv } from '../Styled';

const StandsButton = (): JSX.Element => {
  return (
    <Link href={'/stands'} legacyBehavior>
      <AnnouncementContainer scale={1.03}>
        <Header shadow>TIL STANDSSIDEN</Header>
      </AnnouncementContainer>
    </Link>
  );
};
const AnnouncementContainer = styled(NudgeDiv)`
  display: flex;
  border-radius: 15px;
  width: auto;
  height: 100px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  cursor: pointer;
  background-image: repeating-linear-gradient(
    -45deg,
    #007bb4,
    #007bb4 35px,
    #008fd1 35px,
    #008fd1 70px
  );

  border: 4px solid white;
  transition: 0.2s;
`;

export default StandsButton;
