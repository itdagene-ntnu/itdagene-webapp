//@flow
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import type { PageView_page } from './__generated__/PageView_page.graphql.js';
import Flex from 'styled-flex-component';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import dayjs from 'dayjs';

type Props = {
  page: PageView_page
};

const GrayText = styled('div')`
  color: gray;
`;

const PageView = ({ page }: Props) => (
  <>
    <h1>{page.title}</h1>
    <GrayText>
      Sist oppdatert: {dayjs(page.dateSaved).format(`D. MMMM YYYY`)}
    </GrayText>

    <Flex column>
      <ReactMarkdown source={page.content} />
    </Flex>
  </>
);

export default createFragmentContainer(
  PageView,
  graphql`
    fragment PageView_page on Page {
      id
      content
      slug
      title
      dateSaved
      dateCreated
    }
  `
);
