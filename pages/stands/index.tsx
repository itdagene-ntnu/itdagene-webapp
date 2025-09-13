import { graphql } from 'react-relay';
import { withDataAndLayout } from '../../lib/withData';
import { Title, DateTitle } from '../../components/Stands/styledStands';
import MondayMap from './mondayMap';
import TuesdayMap from './tuesdayMap';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const StandImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const Index = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1200);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <Title>Stands</Title>

      <DateTitle>Mandag</DateTitle>
      {isMobile ? (
        <StandImage
          src="https://cdn.itdagene.no/standkart_mandag.png"
          alt="Stands mandag"
        />
      ) : (
        <MondayMap />
      )}

      <DateTitle>Tirsdag</DateTitle>
      {isMobile ? (
        <StandImage
          src="https://cdn.itdagene.no/standkart_tirsdag.png"
          alt="Stands tirsdag"
        />
      ) : (
        <TuesdayMap />
      )}
    </>
  );
};

export default withDataAndLayout(Index, {
  query: graphql`
    query stands_new_Query {
      currentMetaData {
        startDate
        endDate
      }
    }
  `,
  variables: {},
  layout: () => ({ responsive: true }),
});
