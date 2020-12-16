import * as React from 'react';
import { graphql } from 'react-relay';
import { withDataAndLayout, WithDataAndLayoutProps } from '../../lib/withData';
import PageView from '../../components/PageView';
import { program_QueryResponse } from '../../__generated__/program_Query.graphql';
import styled from 'styled-components';
import { useRouter } from 'next/router';

import * as _ from 'lodash';

const DigitalStand = ({
  error,
  props,
}: WithDataAndLayoutProps<program_QueryResponse>): JSX.Element => {
  const router = useRouter();
  const companyID = _.last(router.asPath.split('/'));

  return (
    <>
      {props.programPage && <PageView hideContent page={props.programPage} />}
      {companyID}
    </>
  );
};

export default withDataAndLayout(DigitalStand, {
  query: graphql`
    query program_Query {
      programPage: page(slug: "program") {
        ...PageView_page
        ...metadata_metadata
      }
    }
  `,
  variables: {},
  layout: ({ props, error }) => ({
    responsive: true,
    metadata: props && props.programPage,
  }),
});
