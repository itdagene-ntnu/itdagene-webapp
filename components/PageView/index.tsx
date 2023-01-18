import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import Link from 'next/link';
import { PageView_page } from '../../__generated__/PageView_page.graphql';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import dayjs from 'dayjs';

const Div = styled('div')`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-content: stretch;
`;

type Props = {
  page: PageView_page;
  hideDate?: boolean;
  hideContent?: boolean;
  hideTitle?: boolean;
};

const Title = styled('h1')`
  font-weight: bold;
  font-smoothing: antialiased;
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const LastUpdate = styled('div')`
  font-weight: bold;
  font-family: Roboto;
  font-size: 0.8rem;
  color: #222;
  text-transform: uppercase;
  letter-spacing: 1.25px;
  margin-bottom: 1.5rem;
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
  hideDate,
  hideContent,
  hideTitle,
}: Props): JSX.Element => (
  <>
    {!hideTitle && <Title>{page.title}</Title>}
    {!hideDate && (
      <LastUpdate>
        {dayjs(page.dateSaved as string).format(`DD. MMMM, YYYY`)}
      </LastUpdate>
    )}
    {!hideContent && (
      <Div>
        <ReactMarkdown renderers={renderers} source={page.content} />
      </Div>
    )}
  </>
);

export default createFragmentContainer(PageView, {
  page: graphql`
    fragment PageView_page on Page {
      id
      content
      slug
      title
      dateSaved
      dateCreated
    }
  `,
});
