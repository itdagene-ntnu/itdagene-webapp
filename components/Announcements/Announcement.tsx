import React from 'react';
import styled from 'styled-components';

const Announcement: React.FC = () => {
  return (
    <AnnouncementContainer>
      <InfoContainer>
        <img
          src="/static/outline_info_white_48dp.png"
          alt="InfoIcon"
          style={{
            marginRight: '20px',
            marginLeft: '20px',
            alignSelf: 'flex-start',
          }}
        />
        <AnnouncementHeader>
          Grunnet Covid-19 blir itDAGENE dessverre utsatt til over nyttår
        </AnnouncementHeader>
      </InfoContainer>
      <a href="vg.no">Les mer</a>
    </AnnouncementContainer>
  );
};

const InfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  text-align: center;
  justify-content: center;
`;

const AnnouncementContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 70px;
  justify-content: center;
  text-align: center;
  padding: 10px;
  background-color: #f4c20ecc;
  border-radius: 20px;
  box-shadow: 0px 0px 10px 3px rgba(0, 0, 0, 0.15);
`;

const AnnouncementHeader = styled.h1`
  color: white;
`;

export default Announcement;
