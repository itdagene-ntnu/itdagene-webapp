import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { itdageneBlue } from '../../utils/colors';

const ProgramButton = (): JSX.Element => {
  return (
    <Link href={'/program'}>
      <ProgramButtonContainer>
        <ProgramButtonText>Program itDAGENE</ProgramButtonText>
      </ProgramButtonContainer>
    </Link>
  );
};

const ProgramButtonContainer = styled.div<{ break?: boolean }>`
  display: flex;
  max-width: 300px;
  flex: 1 1 300px;
  background: #ffffff;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  border-radius: 7px;
  padding: 15px;
  border: 2px solid ${itdageneBlue};
  color: ${itdageneBlue};
  justify-content: center;
  align-items: center;
  cursor: pointer;

  @media only screen and (max-width: 992px) {
    display: ${(props): string => (props.break ? 'none' : 'block')};
  }

  @media only screen and (max-width: 1199px) {
    display: ${(props): string => (props.break ? 'none' : 'flex')};
    max-width: ${(props): string => (props.break ? '150px' : '100%')};
  } ;
`;

const ProgramButtonText = styled.h1`
  margin: 0;
  font-weight: 600;
  margin-right: 10px;
  font-size: 22px;
`;

export default ProgramButton;
