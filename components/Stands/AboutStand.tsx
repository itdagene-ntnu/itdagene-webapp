import React from 'react';
import Link from 'next/link';
import Loading from '../LoadingIndicator';
import ReactMarkdown from 'react-markdown';
import { Player, BigPlayButton } from 'video-react';
import styled from 'styled-components';
import { graphql, useFragment } from 'relay-hooks';
import { AboutStand_stand$key } from '../../__generated__/AboutStand_stand.graphql';

const VIDEO_REGEX =
  /https:\/\/cdn\.itdagene\.no\/([a-zA-Z0-9]+\/?)*.(mp4|mkv|webm)/;

type Props = {
  stand: AboutStand_stand$key;
};

const PlayerWrapper = styled.div`
  width: 50%;
  @media only screen and (max-width: 991px) {
    width: 100%;
  }
`;

const LinkRenderer = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}): JSX.Element => {
  if (href.startsWith('/')) {
    return (
      <Link href={href}>
        <a> {children}</a>
      </Link>
    );
  }
  // If the url matches a video on our cdn, render it.
  if (VIDEO_REGEX.test(href)) {
    return (
      <PlayerWrapper>
        <Player src={href}>
          <BigPlayButton position="center" />
        </Player>
      </PlayerWrapper>
    );
  }
  return <a href={href}> {children}</a>;
};

const renderers = { link: LinkRenderer };

const AboutStand = (props: Props): JSX.Element => {
  const about = useFragment(
    graphql`
      fragment AboutStand_stand on Stand {
        description
      }
    `,
    props.stand
  );

  return about ? (
    <ReactMarkdown renderers={renderers}>{about.description}</ReactMarkdown>
  ) : (
    <Loading />
  );
};

export default AboutStand;
