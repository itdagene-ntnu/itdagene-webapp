import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { BoardMember_user } from '../__generated__/BoardMember_user.graphql';
import Flex, { FlexItem } from 'styled-flex-component';

import { Image, CenterIt } from './Styled';
import styled from 'styled-components';

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
  user: { role, fullName, photo, email },
}: Props): JSX.Element => (
  <Card>
    <CenterIt text>
      <RoundHead src={photo || ''} />
      <Flex column>
        <h4 style={{ fontSize: 15, marginBottom: 0 }}>{fullName}</h4>
        <i>{role}</i>
        <a style={{ fontSize: '12px' }} href={`mailto:${email}`}>
          {email}
        </a>
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
    }
  `,
});
