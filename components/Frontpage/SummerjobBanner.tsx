import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const AnnouncementBanner = (): JSX.Element => {
  return (
    <Link href="/sommerjobb" as="/sommerjobb">
      <AnnouncementContainer>
        <a>
          <InfoContainer>
            <StyledRow>
              <StyledImg src="/static/GraduationHat.svg" />
              <Info>
                <StyledHeader>
                  Få en introduksjon til neste års sommerjobber gjennom årets
                  sommmerjobb-maraton
                </StyledHeader>
              </Info>
            </StyledRow>
            <StyledLink>Trykk for å se mer</StyledLink>
          </InfoContainer>
        </a>
      </AnnouncementContainer>
    </Link>
  );
};

const StyledImg = styled.img`
  max-width: 130px;
  flex-grow: 1;
`;

const StyledRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`;

const AnnouncementContainer = styled.div`
  display: flex;
  border-radius: 15px;
  margin: 20px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  box-shadow: 0px 0px 8px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  background-image: repeating-linear-gradient(
    -45deg,
    #007bb4,
    #007bb4 35px,
    #008fd1 35px,
    #008fd1 70px
  );
  transition: 0.2s;
  &:hover {
    transform: scale(1.01);
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 10;
  text-align: center;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 15px 10px 15px;
`;

const StyledLink = styled.a`
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  &:hover {
    color: white;
  }
`;

const StyledHeader = styled.h1`
  color: white;
  font-weight: 700;
`;

export default AnnouncementBanner;
