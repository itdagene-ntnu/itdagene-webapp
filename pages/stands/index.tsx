import { graphql } from 'react-relay';
import styled from 'styled-components';
import { withDataAndLayout } from '../../lib/withData';

const Title = styled.h1`
  font-weight: bold;
  font-smoothing: antialiased;
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const DateTitle = styled.h2`
  font-weight: 500;
  margin: 0 0 3rem;
`;

const StandImage = styled.img`
  margin-bottom: 3rem;
`;

const Index = (): JSX.Element => {
  return (
    <>
      <Title>Stands</Title>
      <DateTitle>Mandag</DateTitle>
      <StandImage
        src="https://cdn.itdagene.no/mandag_oppdatert.png"
        alt="Stands mandag"
      />
      <DateTitle>Tirsdag</DateTitle>
      <StandImage
        src="https://cdn.itdagene.no/stands_tirsdag.png"
        alt="Stands tirsdag"
      />
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
  layout: ({ props, error }) => ({
    responsive: true,
  }),
});
