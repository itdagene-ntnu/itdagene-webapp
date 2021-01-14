import React from 'react';
import styled from 'styled-components';

const LiveContainer = styled.div`
  display: flex;
  /* padding: 0 75px 30px 75px; */
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
  height: 600px;
  width: 70%;
  background-color: #222;
  color: white;
  text-align: center;
  vertical-align: middle;
  position: relative;
  margin-bottom: 50px;
  @media only screen and (max-width: 993px) {
    width: 100%;
    height: 400px;
  }
  @media only screen and (max-width: 767px) {
    height: 250px;
  }
`;

const QAView = styled.div`
  height: 600px;
  width: 30%;
  background-color: #222;
  color: white;
  @media only screen and (max-width: 993px) {
    width: 100%;
    height: 300px;
  }
`;

interface Props {
  livestreamUrl: string;
  qaUrl: string;
}
const LivePlayer = ({ livestreamUrl, qaUrl }: Props): JSX.Element => (
  <LiveContainer>
    <Player>
      {livestreamUrl ? (
        <iframe
          title="livestreamEmbed"
          src={`${livestreamUrl}?autoplay=true`}
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
      {qaUrl ? (
        <iframe
          title="slidoEmbed"
          src={qaUrl}
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

export default LivePlayer;
