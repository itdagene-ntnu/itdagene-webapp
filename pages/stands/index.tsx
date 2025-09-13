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

const StandImage = styled.img`
  width: 100%; /* Makes image responsive */
  height: auto;
  display: block;
`;

const Container = styled.div`
  position: relative;
  display: inline-block; /* Wraps around the image */
  width: 100%; /* Ensures responsiveness */
  margin-bottom: 1rem;
`;

const standsPlacement = [
  { x: 24.0, y: 54.4 }, //1
  { x: 22.15, y: 51.3 },//2
  { x: 20.3, y: 51.3 }, //3
  { x: 18.4, y: 53.4 }, //4
  { x: 18.4, y: 55.8 }, //5
  { x: 15.95, y: 56.9 },//6
  { x: 13.5, y: 56.9 }, //7
  { x: 12.0, y: 51.2 }, //8
  { x: 14.5, y: 50.9 }, //9
  { x: 16.8, y: 49.7 }, //10
  { x: 22.0, y: 46.8 }, //11
  { x: 23.3, y: 44.4 }, //12
  { x: 25.8, y: 40.0 }, //13
  { x: 27.4, y: 37.1 }, //14
  { x: 29.9, y: 35.6 }, //15
  { x: 29.9, y: 41.9 }, //16
  { x: 29.9, y: 45.2 }, //17
  { x: 28.4, y: 46.7 }, //18
  { x: 26.7, y: 49.2 }, //19
  { x: 26.7, y: 51.8 }, //20
  { x: 26.7, y: 54.4 }, //21
  { x: 47.4, y: 59.2 }, //22
  { x: 49.7, y: 59.2 }, //23
  { x: 52.0, y: 59.2 }, //24
  { x: 54.8, y: 51.0 }, //25
  { x: 54.8, y: 48.4 }, //26
  { x: 56.9, y: 48.0 }, //27
  { x: 58.8, y: 48.0 }, //28
  { x: 60.5, y: 48.5 }, //29
  { x: 60.5, y: 51.1 }, //30
  { x: 72.0, y: 56.9 }, //31
  { x: 74.4, y: 56.9 }, //32
  { x: 75.3, y: 64.8 }, //33
  { x: 74.2, y: 71.2 }, //34
  { x: 72.2, y: 71.2 }, //35
  { x: 70.0, y: 71.2 }, //36
  { x: 69.7, y: 67.0 }, //37
  { x: 69.7, y: 64.2 }, //38
  { x: 69.7, y: 61.3 }, //39
  { x: 66.4, y: 61.3 }, //40
  { x: 66.4, y: 64.2 }, //41
  { x: 66.4, y: 67.0 }, //42
];

const companiesDay1TopRight: string[] = [
  'Computas',
  'Norkart',
  'Netcompany',
  'Sykehuspartner HF',
  'Thales Norway',
  'Hemit HF',
  'Kantega',
  'Netlight',
  'Gjensidige',
  'Itera',
  'Equinor',
  'NAV IT',
  'Bekk',
  'Bearingpoint',
  'Sikt',
  'Geomatikk',
  'Applica Consulting',
  'Brønnøysundregistrene',
  'Norconsult Digital',
  'Vespa.ai',
  'Bouvet',
];

const companiesDay1BottomLeft: string[] = [
  'Skatteetaten',
  'Pexip',
  'Knowit',
  'Accenture',
  'NOVA Consulting',
  'Gintel',
  'SKIPPED', //Added so that we can skip certain unused stands
  'Elliptic Labs',
  'BCG Platinion',
  'Statens Vegvesen',
  'SKIPPED', //Added so that we can skip certain unused stands
  'Atea',
  'Teledyne',
  'Capgemini',
  'H5P Group',
  'Domstolsadministrasjonen',
  'Data Nova',
  'Fremtind',
  'GE Vernova',
];

const companiesDay2TopRight: string[] = [
  'Computas',
  'Tietoevry',
  'Netcompany',
  'Sticos',
  'Forte Digital',
  'Jotron',
  'FFI',
  'Mnemonic',
  'NSM',
  'Systek',
  'Equinor',
  'Safetec',
  'Frend',
  'Appfarm',
  'NorgesGruppen',
  'twoday',
  'Clave',
  'Holte Consulting',
  'Intility',
  'TV2',
  'Bouvet',
];

const companiesDay2BottomLeft: string[] = [
  'Sopra Steria',
  'Norsk Tipping',
  'Arm',
  '24SevenOffice',
  'DNB',
  'EY',
  'Autodesk',
  'UDI',
  'Genus',
  'PwC',
  'Visma',
  'Konsberg Gruppen',
  'Sparebank 1 Utv',
  'Sparebank 1 SMN',
  'DNV',
  'KPMG',
  'Norsk Helsenett',
  'Optio Incentives',
  'GE Vernova',
  'Å Energi',
  'H5P Group',
]

const StandButton = styled.button<{ x: number; y: number; isActive: boolean }>`
  position: absolute;
  top: ${(props) => props.y}%;
  left: ${(props) => props.x}%;
  transform: translate(-50%, -50%);
  background-color: ${({ isActive }) => (isActive ? 'lightblue' : 'black')};
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
    background-color: lightblue;
  }
`;

const CompaniesListOverlayRight = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.75rem 1rem; /* bigger padding */
  border-radius: 8px;
  max-height: 80%;
  overflow-y: auto;
  display: grid;
  gap: 0.75rem; /* more spacing between columns */
  color: white;
  font-size: 1.2rem; /* bigger font */
  font-weight: 500;
`;

const CompaniesListOverlayLeft = styled.div`
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
  padding: 0.75rem 1rem; /* bigger padding */
  border-radius: 8px;
  max-height: 80%;
  overflow-y: auto;
  display: grid;
  gap: 0.75rem; /* more spacing between columns */
  color: white;
  font-size: 1.2rem; /* bigger font */
  font-weight: 500;
`;

const CompaniesText = styled.div<{ isHighlighted: boolean }>`
  color: ${({ isHighlighted }) => (isHighlighted ? 'lightblue' : 'white')};
  font-weight: ${({ isHighlighted }) => (isHighlighted ? 'bold' : 'normal')};
  transition: color 0.2s ease-in-out;
  white-space: nowrap;
  cursor: pointer;
  margin-right: 1rem;
  padding: 0.25rem 0.5rem; /* bigger padding */
  font-size: 1rem; /* bigger text */
`;

const splitIntoColumns = (arr: string[], numCols: number): string[][] => {
  const numRows = Math.ceil(arr.length / numCols);
  return Array.from({ length: numCols }, (_, colIndex) =>
    arr.slice(colIndex * numRows, (colIndex + 1) * numRows)
  );
};

const Index = (): JSX.Element => {
  const [hoveredStand, setHoveredStand] = useState<number | null>(null);
  const [hoveredClickStand, setHoveredClickStand] = useState<number | null>(null);

  const numColsOverlay = 3; 
  const companyNumbersRight = companiesDay1TopRight.map((_, index) => index + 1);
  const columnsOverlayRight = splitIntoColumns(companyNumbersRight.map(String), numColsOverlay);

  return (
    <>
      <Title>Stands</Title>
      <DateTitle>Mandag</DateTitle>
      <Container>
        <StandImage
          src="https://cdn.itdagene.no/standkart_mandag_plain.png"
          alt="Stands mandag"
        />
        <CompaniesListOverlayRight
          style={{
            display: 'inline-grid',
            gridAutoFlow: 'column',
            gridGap: '0.15rem 0.5rem',
            top: '1.5rem',
            right: '3rem',
            padding: '0.25rem 0.5rem',
          }}
        >
          {columnsOverlayRight.map((col, colIndex) => (
            <div
              key={colIndex}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.1rem',
              }}
            >
              {col.map((numberStr) => {
                const standIndex = parseInt(numberStr, 10);
                const companyName = companiesDay1TopRight[standIndex - 1];
                return (
                  <CompaniesText
                    key={standIndex}
                    isHighlighted={hoveredStand === standIndex || hoveredClickStand === standIndex}
                    onMouseEnter={() => setHoveredStand(standIndex)}
                    onMouseLeave={() => setHoveredStand(null)}
                    onClick={() => setHoveredClickStand(standIndex)}
                    style={{
                      fontWeight: ['Computas', 'Bouvet', 'Equinor', 'Netcompany'].includes(companyName)
                        ? 900
                        : 'normal',
                      fontSize: ['Computas', 'Bouvet', 'Equinor', 'Netcompany'].includes(companyName)
                        ? '1.2rem' 
                        : '1rem',
                    }}
                  >
                    {standIndex}. {companyName}
                  </CompaniesText>
                );
              })}
            </div>
          ))}
        </CompaniesListOverlayRight>

        <CompaniesListOverlayLeft
          style={{
            display: 'inline-grid',
            gridAutoFlow: 'column',
            gridGap: '0.15rem 0.5rem',
            bottom: '2rem',
            left: '3rem',
            padding: '0.25rem 0.5rem',
          }}
        >
          {splitIntoColumns(
            companiesDay1BottomLeft
              .map((_, i) => i + companyNumbersRight.length + 1)
              .filter((standIndex) => standIndex !== 28 && standIndex !== 32) // skip 28 + 32
              .map(String),
            numColsOverlay
          ).map((col, colIndex) => (
            <div
              key={colIndex}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.1rem',
              }}
            >
              {col.map((numberStr) => {
                const standIndex = parseInt(numberStr, 10);
                const companyName =
                  companiesDay1BottomLeft[standIndex - companyNumbersRight.length - 1];
                return (
                  <CompaniesText
                    key={standIndex}
                    isHighlighted={
                      hoveredStand === standIndex || hoveredClickStand === standIndex
                    }
                    onMouseEnter={() => setHoveredStand(standIndex)}
                    onMouseLeave={() => setHoveredStand(null)}
                    onClick={() => setHoveredClickStand(standIndex)}
                    style={{
                      fontWeight: ['Computas', 'Bouvet', 'Equinor', 'Netcompany'].includes(
                        companyName
                      )
                        ? 900
                        : 'normal',
                      fontSize: ['Computas', 'Bouvet', 'Equinor', 'Netcompany'].includes(
                        companyName
                      )
                        ? '1.2rem'
                        : '1rem',
                    }}
                  >
                    {standIndex}. {companyName}
                  </CompaniesText>
                );
              })}
            </div>
          ))}
        </CompaniesListOverlayLeft>

        {standsPlacement.map((stand, index) => {
          const standIndex = index + 1;
          return (
            <StandButton
              key={index}
              x={stand.x}
              y={stand.y}
              isActive={hoveredStand === standIndex || hoveredClickStand === standIndex}
              onMouseEnter={() => setHoveredStand(standIndex)}
              onMouseLeave={() => setHoveredStand(null)}
              onClick={() => setHoveredClickStand(standIndex)} 
              style={{ color: (hoveredStand || hoveredClickStand) === standIndex ? 'black' : 'white' }}
            >
              {standIndex}
            </StandButton>
          );
        })}
      </Container>
      <DateTitle>Tirsdag</DateTitle>
      <Container>
        <StandImage
          src="https://cdn.itdagene.no/standkart_mandag_plain.png"
          alt="Stands tirsdag"
        />
        <CompaniesListOverlayRight
          style={{
            display: 'inline-grid',
            gridAutoFlow: 'column',
            gridGap: '0.15rem 0.5rem',
            top: '1.5rem',
            right: '3rem',
            padding: '0.25rem 0.5rem',
          }}
        >
          {columnsOverlayRight.map((col, colIndex) => (
            <div
              key={colIndex}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.1rem',
              }}
            >
              {col.map((numberStr) => {
                const standIndex = parseInt(numberStr, 10);
                const companyName = companiesDay2TopRight[standIndex - 1];
                return (
                  <CompaniesText
                    key={standIndex}
                    isHighlighted={hoveredStand === standIndex || hoveredClickStand === standIndex}
                    onMouseEnter={() => setHoveredStand(standIndex)}
                    onMouseLeave={() => setHoveredStand(null)}
                    onClick={() => setHoveredClickStand(standIndex)}
                    style={{
                      fontWeight: ['Computas', 'Bouvet', 'Equinor', 'Netcompany'].includes(companyName)
                        ? 900
                        : 'normal',
                      fontSize: ['Computas', 'Bouvet', 'Equinor', 'Netcompany'].includes(companyName)
                        ? '1.2rem' 
                        : '1rem',
                    }}
                  >
                    {standIndex}. {companyName}
                  </CompaniesText>
                );
              })}
            </div>
          ))}
        </CompaniesListOverlayRight>

        <CompaniesListOverlayLeft
          style={{
            display: 'inline-grid',
            gridAutoFlow: 'column',
            gridGap: '0.15rem 0.5rem',
            bottom: '2rem',
            left: '3rem',
            padding: '0.25rem 0.5rem',
          }}
        >
          {splitIntoColumns(
            companiesDay2BottomLeft.map((_, i) => String(i + companyNumbersRight.length + 1)),
            numColsOverlay
          ).map((col, colIndex) => (
            <div
              key={colIndex}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.1rem',
              }}
            >
              {col.map((numberStr) => {
                const standIndex = parseInt(numberStr, 10);
                const companyName = companiesDay2BottomLeft[standIndex - companyNumbersRight.length - 1];
                return (
                  <CompaniesText
                    key={standIndex}
                    isHighlighted={hoveredStand === standIndex || hoveredClickStand === standIndex}
                    onMouseEnter={() => setHoveredStand(standIndex)}
                    onMouseLeave={() => setHoveredStand(null)}
                    onClick={() => setHoveredClickStand(standIndex)}
                    style={{
                      fontWeight: ['Computas', 'Bouvet', 'Equinor', 'Netcompany'].includes(companyName)
                        ? 900
                        : 'normal',
                      fontSize: ['Computas', 'Bouvet', 'Equinor', 'Netcompany'].includes(companyName)
                        ? '1.2rem' 
                        : '1rem',
                    }}
                  >
                    {standIndex}. {companyName}
                  </CompaniesText>
                );
              })}
            </div>
          ))}
        </CompaniesListOverlayLeft>

        {standsPlacement.map((stand, index) => {
          const standIndex = index + 1;
          return (
            <StandButton
              key={index}
              x={stand.x}
              y={stand.y}
              isActive={hoveredStand === standIndex || hoveredClickStand === standIndex}
              onMouseEnter={() => setHoveredStand(standIndex)}
              onMouseLeave={() => setHoveredStand(null)}
              onClick={() => setHoveredClickStand(standIndex)} 
              style={{ color: (hoveredStand || hoveredClickStand) === standIndex ? 'black' : 'white' }}
            >
              {standIndex}
            </StandButton>
          );
        })}

      </Container>
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
