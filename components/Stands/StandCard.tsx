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
}

interface ILive {
  active: boolean;
}

const StandCard: React.FC<IStandCard> = ({ active, company, id }) => {
  const router = useRouter();

  const handleRedirect = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    router.push(`/stands/[id]`, `/stands/${id}`);
  };

  return (
    <CardContainer scale={1.03} onClick={handleRedirect}>
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
          <TimeSlot>12:30-14:00</TimeSlot>
          <span>
            {_.truncate('Småprat med CEO', {
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
  height: 150px;

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

export default StandCard;
