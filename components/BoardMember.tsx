import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { BoardMember_user } from '../__generated__/BoardMember_user.graphql';
import { Image, CenterIt } from './Styled';
import styled from 'styled-components';

const Div = styled('div')`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-content: stretch;
  flex-direction: column;
`;

const DivItem = styled('div')`
  order: 0;
  flex-basis: auto;
  flex-grow: 0;
  flex-shrink: 1;
  display: block;
`;

const RoundHead = styled(Image)`
  border-radius: 2000px;
  width: 195px;
  height: 195px;
`;

const Card = styled(DivItem)`
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
      <Div>
        <h4 style={{ fontSize: 15, marginBottom: 0 }}>{fullName}</h4>
        <i>{role}</i>
        <a style={{ fontSize: '12px' }} href={`mailto:${email}`}>
          {email}
        </a>
      </Div>
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
