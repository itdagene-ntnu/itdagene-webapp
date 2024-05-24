import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { BoardMember_user } from '../__generated__/BoardMember_user.graphql';
import { Image, CenterIt } from './Styled';
import styled from 'styled-components';
import Flex from './Styled/Flex';
import FlexItem from './Styled/FlexItem';

const RoundHead = styled(Image)`
  border-radius: 2000px;
  width: 195px;
  height: 195px;
`;

const Card = styled(FlexItem)`
  margin: 15px;
`;

type Props = {
  user: BoardMember_user;
};

const BoardMember = ({
  user: { role, fullName, photo, email, linkedin },
}: Props): JSX.Element => (
  <Card>
    <CenterIt text>
      <RoundHead src={photo || ''} />
      <Flex flexDirection="column">
        <h4 style={{ fontSize: 15, marginBottom: 0 }}>{fullName}</h4>
        <i>{role}</i>
        <Flex justifyContent="center" alignItems="center" gap="10px">
          <a
            style={{ height: '40px', fontSize: '40px' }}
            href={`mailto:${email}`}
          >
            {/* @ts-ignore*/}
            <ion-icon name="mail" />
          </a>
          {linkedin && (
            <a
              style={{ height: '32px', fontSize: '32px' }}
              href={`https://${
                linkedin.includes('www.linkedin.com/in/')
                  ? linkedin
                  : `www.linkedin.com/in/${linkedin}`
              }`}
            >
              {/* @ts-ignore*/}
              <ion-icon name="logo-linkedin" />
            </a>
          )}
        </Flex>
      </Flex>
    </CenterIt>
  </Card>
);

export default createFragmentContainer(BoardMember, {
  user: graphql`
    fragment BoardMember_user on User {
      id
      photo(width: 250, height: 250)
      fullName
      role
      email
      linkedin
    }
  `,
});
