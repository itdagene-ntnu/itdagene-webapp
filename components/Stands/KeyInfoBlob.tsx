import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import styled from 'styled-components';
import { KeyInfoBlob_keyInformation } from '../../__generated__/KeyInfoBlob_keyInformation.graphql';
import {
  itdageneLightBlue,
  itdageneRed,
  itdageneYellow,
} from '../../utils/colors';
import { EllipseOverflowDiv } from '../Styled';

const KeyInfoContainer = styled.div`
  width: 200px;
  height: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
`;

const InfoKey = styled.h3`
  text-align: center;
  margin: 0 0 12px 0;
`;
const InfoValue = styled.h3`
  font-size: 18px;
  margin: 0;
`;

const InfoCircle = styled.div`
  --diameter: 190px;

  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: var(--diameter);
  width: var(--diameter);
  border-radius: 4%;
  box-shadow: 0px 0px 6px 1.5px rgba(0, 0, 0, 0.15);
`;

const IconContainer = styled.span<{ color: string }>`
  color: ${(props): string => props.color};
  font-size: 3.7em;
  margin: 0;
`;

const ValueInfoContainer = styled.div`
  height: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 0;
`;

const InfoValueContainer = styled(EllipseOverflowDiv)`
  text-align: center;
  margin: 0 10px;
`;

const FlexCenter = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
`;

type KeyType = 'it-ansatte' | 'hovedkontor' | 'bedrift-type' | 'ett-ord';

interface ValueType {
  title: string;
  color: string;
  icon: string;
}
type KeyInfoType = {
  [key in KeyType]: ValueType;
};

const keyInfoObject: KeyInfoType = {
  'it-ansatte': {
    title: 'Antall IT-ansatte',
    color: itdageneYellow,
    icon: 'far fa-smile-wink',
  },
  hovedkontor: {
    title: 'Hovedkontor',
    color: itdageneRed,
    icon: 'fas fa-building',
  },
  'bedrift-type': {
    title: 'Type bedrift',
    color: itdageneLightBlue,
    icon: 'fas fa-briefcase',
  },
  'ett-ord': {
    title: 'Beskriver seg selv med ett ord:',
    color: itdageneYellow,
    icon: 'fas fa-medal',
  },
};

interface KeyInfoProps {
  keyInfo: KeyInfoBlob_keyInformation;
}

const KeyInfoBlob = ({ keyInfo }: KeyInfoProps): JSX.Element => {
  // The casting can be removed when the backend has implemented types

  return (
    <KeyInfoContainer>
      <InfoKey>{keyInfoObject[keyInfo.name as KeyType].title}</InfoKey>
      <InfoCircle>
        <ValueInfoContainer>
          <IconContainer color={keyInfoObject[keyInfo.name as KeyType].color}>
            <i className={keyInfoObject[keyInfo.name as KeyType].icon} />
          </IconContainer>
          <FlexCenter>
            <InfoValueContainer maxLines={3}>
              <InfoValue>{keyInfo.value}</InfoValue>
            </InfoValueContainer>
          </FlexCenter>
        </ValueInfoContainer>
      </InfoCircle>
    </KeyInfoContainer>
  );
};

export default createFragmentContainer(KeyInfoBlob, {
  keyInformation: graphql`
    fragment KeyInfoBlob_keyInformation on KeyInformation {
      id
      name
      value
    }
  `,
});
