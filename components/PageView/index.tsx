import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import Link from 'next/link';
import { PageView_page } from '../../__generated__/PageView_page.graphql';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import dayjs from 'dayjs';
import Flex from '../Styled/Flex';
import { Player } from 'video-react';

type Props = {
  page: PageView_page;
  hideContent?: boolean;
  hideTitle?: boolean;
  blueBackground?: boolean;
};

const Title = styled('h1')`
  font-weight: bold;
  font-smoothing: antialiased;
  font-size: 3rem;
  margin-bottom: 1rem;
  margin-top: 0.5rem;
`;

const PageContainer = styled.div<{ blueBackground?: boolean }>`
  background-color: ${(props) =>
    props.blueBackground ? 'rgb(2,123,180)' : 'transparent'};
  color: ${(props) => (props.blueBackground ? 'white' : 'black')};
  padding: 1rem;
  border-radius: 25px;
`;

const LinkRenderer = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}): JSX.Element => {
  // Use next.js router for internal urls
  if (href.startsWith('/')) {
    return <Link href={href}>{children}</Link>;
  }
  return <a href={href}> {children}</a>;
};

const renderers = { link: LinkRenderer };

const PageView = ({
  page,
  hideContent,
  hideTitle,
  blueBackground,
}: Props): JSX.Element => {
  return (
    <PageContainer blueBackground={blueBackground}>
      {!hideTitle && <Title>{page.title}</Title>}
      {!hideContent && (
        <Flex flexDirection="column">
          <ReactMarkdown renderers={renderers} source={page.content} />
        </Flex>
      )}
      {page.videoFile && (
        <Player
          fluid={false}
          height={600}
          playsInline
          src={'https://itdagene.no/uploads/' + page.videoFile}
        />
      )}
    </PageContainer>
  );
};

export default createFragmentContainer(PageView, {
  page: graphql`
    fragment PageView_page on Page {
      id
      content
      slug
      title
      dateSaved
      dateCreated
      videoFile
    }
  `,
});
