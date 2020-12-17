import React from 'react';
import styled from 'styled-components';
import { Company } from '../../testing/companyMock';
import * as _ from 'lodash';
import { NudgeDiv } from '../Styled';
import { useRouter } from 'next/router';

interface IStandCard {
  active: boolean;
  company: Company;
  id: string;
  events?: any[]
}

interface ILive {
  active: boolean;
}

const StandCard = (
  { active, company, id, events }: IStandCard,
  // { props, error }: WithDataProps<StandCard_QueryResponse>
) => {
  const router = useRouter();

  const handleRedirect = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    router.push(`/stands/[id]`, `/stands/${id}`);
  };

  // TODO: Create a utility-function to find the event between timeStart - timeEnd
  const currentEvent = events!.length !== 0 ? events!.find(event => event.timeEnd === "13:15:00") : null

  return (
    <CardContainer scale={1.03} 
    onClick={handleRedirect}
    >
      <FirstRow>
        <CompanyImgContainer>
          <CompanyImg src={company.logo} />
        </CompanyImgContainer>
        <Live active={active} />
      </FirstRow>
      <Divider />
      <CompanyInfo>
        <SubHeader>{company.name}</SubHeader>
        <CurrentEvent>
          <TimeSlot>{currentEvent ? `${currentEvent.timeStart.slice(
                        0,
                        5
                      )} - ${currentEvent.timeEnd.slice(0, 5)}` : ""}</TimeSlot>
          <span>
            {_.truncate(currentEvent ? currentEvent.title : "💁🏼‍♀️", {
              length: 24,
            })}
          </span>
        </CurrentEvent>
      </CompanyInfo>
    </CardContainer>
  );
};

const Live: React.FC<ILive> = ({ active }) => (
  <LiveContainer active={active}>LIVE</LiveContainer>
);

const Divider = styled.hr`
  width: 100%;
  border: none;
  height: 1.5px;
  background-color: #f1f1f1;
  flex-shrink: 0;
`;

const CardContainer = styled(NudgeDiv)`
  display: flex;
  flex-direction: column;
  max-width: 293px;
  height: 155px;

  background: #ffffff;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  border-radius: 7px;
  padding: 15px;
`;

const FirstRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CompanyImgContainer = styled.div`
  display: flex;
  height: 60px;
  width: 70%;
`;

const CompanyImg = styled.img`
  object-fit: contain;
`;

const CompanyInfo = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
`;

const CurrentEvent = styled.div`
  display: flex;
  flex-direction: column;
  color: #555;
`;

const SubHeader = styled.span`
  font-weight: 600;
`;

const TimeSlot = styled.span`
  font-weight: 200;
`;

const LiveContainer = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 40%;

  padding: 4px;
  border: 1px solid ${(props) => (props.active ? 'red' : 'grey')};
  border-radius: 3px;
  color: ${(props) => (props.active ? 'red' : 'grey')};
  text-align: center;

  stroke: 2px;
  text-decoration: ${(props) => (props.active ? 'none' : 'line-through')};
`;

export default StandCard

// export default withData(StandCard, {
//   query: graphql`
//     query StandCard_Query($companyName: String) {
//       events(companyName: $companyName) {
//         title
//         id
//         timeStart
//         timeEnd
//         description
//         location
//         date
//         type
//         company {
//           id
//           name
//         }
//         usesTickets
//         maxParticipants
//       }
//     }
//   `,
//   variables: ({company}: IStandCard) => ({
//     "companyName": company
//   }),
// });

