//@flow
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { Card, Icon, Image } from 'semantic-ui-react';
import { type BoardMember_user } from './__generated__/BoardMember_user.graphql';

type Props = {
  user: BoardMember_user
};

const BoardMember = ({ user }: Props) => (
  <Card>
    <Image src={`https://itdagene.no/uploads/${user.photo || ''}`} />
    <Card.Content>
      <Card.Header>{user.fullName}</Card.Header>
      <Card.Meta>{user.role}</Card.Meta>
      <Card.Description>{user.email}</Card.Description>
    </Card.Content>
    <Card.Content extra>
      <a>
        <Icon name="user" />
        Linkedin
      </a>
    </Card.Content>
  </Card>
);

export default createFragmentContainer(
  BoardMember,
  graphql`
    fragment BoardMember_user on User {
      id
      photo
      fullName
      role
      email
    }
  `
);
