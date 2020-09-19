import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const AnnouncementBanner = () => {
  return (
    <AnnouncementContainer>
      <InfoContainer>
        <StyledRow>
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            width="150px"
            height="90px"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          </Svg>
          <Info>
            <StyledHeader>
              Få en introduksjon til neste års sommerjobber i
              sommmerjobb-maratonnet her🏃‍♂️
            </StyledHeader>
          </Info>
        </StyledRow>
        <Link href="/sommerjobb" as="/sommerjobb">
          <StyledLink>Les mer</StyledLink>
        </Link>
      </InfoContainer>
    </AnnouncementContainer>
  );
};

const StyledSpan = styled.span`
  text-decoration: underline;
`;

const StyledRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const AnnouncementContainer = styled.div`
  display: flex;
  /* width: 100%; */
  border-radius: 15px;
  margin: 20px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  box-shadow: 0px 0px 8px 3px rgba(0, 0, 0, 0.1);
  background-image: repeating-linear-gradient(
    -45deg,
    #007bb4,
    #007bb4 35px,
    #407bb4 35px,
    #407bb4 70px
  );
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 10;
  text-align: center;
`;

const Svg = styled.svg`
  flex-grow: 1;
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
`;

const StyledHeader = styled.h1`
  color: white;
  font-weight: 700;
`;

export default AnnouncementBanner;
