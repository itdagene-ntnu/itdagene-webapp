import { graphql } from 'react-relay';
import styled from 'styled-components';
import { withDataAndLayout } from '../../lib/withData';
import { useState } from 'react';

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

const InfoIngress = styled.h2`
  font-weight: 400;
  margin-bottom: 2rem;
`;

const StandImage = styled.img`
  width: 100%; /* Makes image responsive */
  height: auto;
  display: block;
`;

const Container = styled.div`
  position: relative;
  display: inline-block; /* Wraps around the image */
  width: 100%; /* Ensures responsiveness */
`;

const StandButton = styled.button<{ x: number; y: number }>`
  position: absolute;
  top: ${(props) => props.y}%;
  left: ${(props) => props.x}%;
  transform: translate(-50%, -50%);
  background-color: black;
  color: white;
  width: 1.8%; /* Slightly wider */
  height: 2.5%;
  border: none;
  border-radius: 50%;
  font-size: 0.6vw; /* Scales text size */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap; /* Prevents text from wrapping */
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #333;
  }
`;

const CompaniesStyling = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  background-color: #1e40af; /* Equivalent to bg-blue-700 */
  color: white;
  padding: 1.5rem;
  font-size: 1.125rem; /* Equivalent to text-lg */
  font-weight: 500; /* Equivalent to font-medium */
`;

const CompaniesText = styled.div<{ isHighlighted: boolean }>`
  color: ${({ isHighlighted }) => (isHighlighted ? 'yellow' : 'white')};
  font-weight: ${({ isHighlighted }) => (isHighlighted ? 'bold' : 'normal')};
  transition: color 0.2s ease-in-out;
`;

const standsPlacement = [
  { x: 10.7, y: 60.7 }, //1
  { x: 12.555, y: 60.7 }, //2
  { x: 14.4, y: 60.7 }, //3
  { x: 16.8, y: 59.4 }, //4
  { x: 16.8, y: 56.8 }, //5
  { x: 18.6, y: 54.6 }, //6
  { x: 20.4, y: 54.6 }, //7
  { x: 22.7, y: 58.2 }, //8
  { x: 10.6, y: 55.4 }, //9
  { x: 12.5, y: 55.2 }, //10
  { x: 14.4, y: 54.2 }, //11
  { x: 20.3, y: 50.3 }, //12
  { x: 21.4, y: 48.1 }, //13
  { x: 25.0, y: 49.4 }, //14
  { x: 25.0, y: 52.1 }, //15
  { x: 25.0, y: 55.1 }, //16
  { x: 26.9, y: 46.7 }, //17
  { x: 29.0, y: 44.5 }, //18
  { x: 29.0, y: 41.9 }, //19
  { x: 29.0, y: 36.7 }, //20
  { x: 26.3, y: 35.3 }, //21
  { x: 26.3, y: 38.4 }, //22
  { x: 24.1, y: 41.1 }, //23
  { x: 47.7, y: 64.4 }, //24
  { x: 50.2, y: 64.4 }, //25
  { x: 52.6, y: 64.4 }, //26
  { x: 55.0, y: 55.7 }, //27
  { x: 55.0, y: 52.3 }, //28
  { x: 57.1, y: 52.0 }, //29
  { x: 59.4, y: 52.0 }, //30
  { x: 61.2, y: 53.4 }, //31
  { x: 61.2, y: 55.9 }, //32
  { x: 67.5, y: 66.7 }, //33
  { x: 67.5, y: 69.4 }, //34
  { x: 67.5, y: 72.1 }, //35
  { x: 71.1, y: 66.7 }, //36
  { x: 71.1, y: 69.4 }, //37
  { x: 71.1, y: 72.1 }, //38
  { x: 71.3, y: 76.3 }, //39
  { x: 73.1, y: 76.3 }, //40
  { x: 74.9, y: 76.3 }, //41
  { x: 76.7, y: 70.8 }, //42
  { x: 75.5, y: 61.8 }, //43
  { x: 73.6, y: 61.8 }, //44
  { x: 65.1, y: 68.9 }, //34
];

const companies: string[] = [
  'Omegapoint Norge',
  'Eika Gruppen',
  'NorgesGruppen',
  'Brønnøysundregistrene',
  'Palantir Technologies',
  'Genus',
  'Bekk',
  'Bouvet',
  'Capgemini',
  'Knowit',
  'Vespa.ai',
  'Equinor',
  'Visma',
  'Computas',
  'Twoday',
  'Hemit HF',
  'DNV',
  'Politiets sikkerhetstjeneste',
  'Accelerate at Iver',
  'Elliptic Laboratories ASA',
  'NAV IT',
  '24SevenOffice AS',
  'Sopra Steria',
  'Nova Consulting Group',
  'Gjensidige',
  'EY',
  'Intility',
  'Thales Norway AS',
  'Clave Consulting AS',
  'PwC',
  'Arm',
  'Sykehuspartner',
  'Appfarm',
  'Gintel',
  'Holte Consulting',
  'Telenor Cyberdefence',
  'Sparebank 1 Utvikling',
  'Norges Bank',
  'Domstoladministrasjonen',
  'BCG Platinion',
  'OBOS',
  'Aboveit',
  'Exsitec AS',
  'Airthings ASA',
  'fahiuewfg',
];

const StandNameButton = styled.button<{ x: number; y: number; isHighlighted: boolean }>`
  position: absolute;
  top: ${(props) => props.y}%;
  left: ${(props) => props.x}%;
  transform: translate(-50%, -50%);
  background-color: ${({ isHighlighted }) => (isHighlighted ? 'yellow' : 'black')};
  color: white;
  width: 1.8%;
  height: 2.5%;
  border: none;
  border-radius: 50%;
  font-size: 0.6vw;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #333;
  }
`;

const splitIntoColumns = (arr: string[], numCols: number): string[][] => {
  const numRows = Math.ceil(arr.length / numCols);
  return Array.from({ length: numCols }, (_, colIndex) =>
    arr.slice(colIndex * numRows, (colIndex + 1) * numRows)
  );
};

const Index = (): JSX.Element => {
  const [hoveredStand, setHoveredStand] = useState<number | null>(null);
  const [hoveredName, setHoveredName] = useState<number | null>(null);

  const numCols = 3;
  const columns = splitIntoColumns(companies, numCols);

  return (
    <>
      {/*
      <Title>Stands</Title>
      <InfoIngress>Oversikt over standplasser</InfoIngress>
      <StandImage src="/static/standkart_uten_bedrifter.png" />
      /*}
      {/* Fjern kommentar når standsoversikt er ferdig */}
      <Title>Stands</Title>
      <DateTitle>Mandag</DateTitle>
      <CompaniesStyling>
        {columns.map((col, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-2">
            {col.map((company, rowIndex) => {
              const index =
                colIndex * Math.ceil(companies.length / numCols) + rowIndex + 1;
              return (
                <CompaniesText
                  key={index}
                  isHighlighted={index === hoveredStand}
                  onMouseEnter={() => setHoveredStand(index)}   // highlight button on text hover
                  onMouseLeave={() => setHoveredStand(null)}   // reset when leaving text
                >
                  {index}. {company}
                </CompaniesText>
              );
            })}
          </div>
        ))}
      </CompaniesStyling>
      <Container>
        <StandImage
          src="https://cdn.itdagene.no/mandag_oppdatert.png"
          alt="Stands mandag"
        />
        {standsPlacement.map((stand, index) => (
          <StandNameButton
            key={index}
            x={stand.x}
            y={stand.y}
            isHighlighted={hoveredStand === index + 1}
            onMouseEnter={() => setHoveredStand(index + 1)}
            onMouseLeave={() => setHoveredStand(null)}
            onClick={() => setHoveredStand(index + 1)}
          >
            {index + 1}
          </StandNameButton>
        ))}
      </Container>
      <DateTitle>Tirsdag</DateTitle>
      <StandImage
        src="https://cdn.itdagene.no/standkart_tirsdag.png"
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
