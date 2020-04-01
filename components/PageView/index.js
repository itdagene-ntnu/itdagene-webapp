//@flow
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import Link from 'next/link';
import type { PageView_page } from './__generated__/PageView_page.graphql.js';
import Flex from 'styled-flex-component';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import dayjs from 'dayjs';

type Props = {
  page: PageView_page,
  hideDate?: boolean,
  hideContent?: boolean,
  hideTitle?: boolean,
};

const GrayText = styled('div')`
  color: gray;
`;
const LinkRenderer = ({ href, children }) => {
  // Use next.js router for internal urls
  if (href.startsWith('/')) {
    return (
      <Link href={href}>
        <a> {children}</a>
      </Link>
    );
  }
  return <a href={href}> {children}</a>;
};

const renderers = { link: LinkRenderer };

const PageView = ({ page, hideDate, hideContent, hideTitle }: Props) => (
  <>
    {!hideTitle && <h1>{page.title}</h1>}
    {!hideDate && (
      <GrayText>
        Sist oppdatert: {dayjs(page.dateSaved).format(`D. MMMM YYYY`)}
      </GrayText>
    )}
    {!hideContent && (
      <Flex column>
        <ReactMarkdown renderers={renderers} source={page.content} />
      </Flex>
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
