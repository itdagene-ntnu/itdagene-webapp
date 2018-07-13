//@flow
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { Card, Icon, Image, List } from 'semantic-ui-react';
import { type BoardMember_user } from './__generated__/BoardMember_user.graphql';

type Props = {
  user: BoardMember_user
};

const BoardMember = ({ user }: Props) => (
  <Card style={{ margin: '1em 0' }}>
    <Image src={user.photo || ''} />
    <Card.Content>
      <Card.Header>{user.fullName}</Card.Header>
      <Card.Meta>{user.role}</Card.Meta>
    </Card.Content>
    <Card.Content extra>
      <List>
        <List.Item>
          <a href={`mailto:${user.email}`}>
            <Icon name="user" />
            Epost
          </a>
        </List.Item>
        <List.Item>
          <a href={`mailto:${user.email}`}>
            <Icon name="linkedin" />
            Linkedin
          </a>
        </List.Item>
        <List.Item>
          <a href={`mailto:${user.email}`}>
            <Icon name="github" />
            github
          </a>
        </List.Item>
      </List>
    </Card.Content>
  </Card>
);

export default createFragmentContainer(
  BoardMember,
  graphql`
    fragment BoardMember_user on User {
      id
      photo(width: 290, height: 290)
      fullName
      role
      email
    }
  `
);
