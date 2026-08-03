import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { BoardMember_user } from '../__generated__/BoardMember_user.graphql';

type Props = {
  user: BoardMember_user;
};

const linkedinUrl = (linkedin: string): string => {
  if (linkedin.startsWith('https://')) {
    return linkedin;
  }
  if (linkedin.startsWith('http://')) {
    return linkedin.replace('http://', 'https://');
  }
  if (linkedin.includes('linkedin.com/')) {
    return `https://${linkedin}`;
  }
  return `https://www.linkedin.com/in/${linkedin}`;
};

const initials = (fullName: string): string =>
  fullName
    .split(' ')
    .slice(0, 2)
    .map((name) => name[0])
    .join('');

const BoardMember = ({
  user: { role, fullName, photo, email, linkedin },
}: Props): JSX.Element => {
  const displayName = fullName || 'Styremedlem';
  return (
    <article className="board-member">
      <div className="board-member__portrait">
        {photo ? (
          <img
            alt={`Portrett av ${displayName}`}
            height="400"
            loading="lazy"
            src={photo}
            width="400"
          />
        ) : (
          <div aria-hidden="true" className="board-member__placeholder">
            {initials(displayName)}
          </div>
        )}
      </div>
      <div className="board-member__copy">
        <p>{role || 'Medlem'}</p>
        <h3>{displayName}</h3>
        <div className="board-member__links">
          {email && <a href={`mailto:${email}`}>E-post</a>}
          {linkedin && (
            <a href={linkedinUrl(linkedin)} rel="noreferrer" target="_blank">
              LinkedIn
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

export default createFragmentContainer(BoardMember, {
  user: graphql`
    fragment BoardMember_user on User {
      id
      photo(width: 400, height: 400)
      fullName
      role
      email
      linkedin
    }
  `,
});
