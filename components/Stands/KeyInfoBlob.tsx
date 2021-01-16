import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import styled from 'styled-components';

import { KeyInfoBlob_keyInformation } from '../../__generated__/KeyInfoBlob_keyInformation.graphql';

const KeyInfoContainer = styled.div`
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InfoKey = styled.h3`
  text-align: center;
`;
const InfoValue = styled.h3`
  font-size: 18px;
  margin: 0;
`;

const InfoCircle = styled.div`
  --diameter: 170px;

  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: var(--diameter);
  width: var(--diameter);
  border-radius: 50%;
  box-shadow: 0px 0px 6px 1.5px rgba(0, 0, 0, 0.15);
`;

const IconContainer = styled.span<{ color: string }>`
  color: ${(props): string => props.color};
  font-size: 3em;
  margin: 0;
`;

const ValueInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
`;

const InfoValueContainer = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  width: 150px;
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
    title: 'IT-ansatte',
    color: '#ffb5a7',
    icon: 'far fa-smile-wink',
  },
  hovedkontor: {
    title: 'Hovedkontor',
    color: '#E01E5B99',
    icon: 'fas fa-building',
  },
  'bedrift-type': {
    title: 'Type bedrift',
    color: '#43C0EB99',
    icon: 'fas fa-briefcase',
  },
  'ett-ord': {
    title: 'Utmerker seg selv ved',
    color: '#f2cc8f',
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
          <InfoValueContainer>
            <InfoValue>{keyInfo.value}</InfoValue>
          </InfoValueContainer>
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
