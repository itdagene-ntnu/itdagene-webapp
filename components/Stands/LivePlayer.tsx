import React from 'react';
import styled from 'styled-components';

// Copied from 'stand-detail'

const LivePlayer = ({ stand }: any) => {
  return (
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
  );
};

const LiveContainer = styled.div`
  display: flex;
  margin-bottom: 30px;
  @media only screen and (max-width: 993px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

const Player = styled('div')`
  height: 400px;
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
  height: 400px;
  width: 30%;
  background-color: #222;
  color: white;
  @media only screen and (max-width: 993px) {
    width: 100%;
    height: 300px;
  }
`;

export default LivePlayer;
