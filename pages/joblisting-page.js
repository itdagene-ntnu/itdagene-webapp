//@flow

import cowsay from 'cowsay-browser';
import 'semantic-ui-css/semantic.min.css';
import 'semantic-ui-css/themes/default/assets/fonts/icons.eot';
import 'semantic-ui-css/themes/default/assets/fonts/icons.woff';
import ReactMarkdown from 'react-markdown';
import 'semantic-ui-css/themes/default/assets/fonts/icons.woff2';

import React from 'react';
import { QueryRenderer } from 'react-relay';
import withData, { type WithDataProps } from '../lib/withData';

import { graphql } from 'react-relay';
import { type joblistingPage_QueryResponse } from './__generated__/joblistingPage_Query.graphql';

import Flex from 'styled-flex-component';
import { ResponsiveContent } from '../components/Styled';
import Layout from '../components/Layout';

type RenderProps = {
  error: ?Error,
  props: ?joblistingPage_QueryResponse
};

const Index = ({
  variables,
  query,
  environment,
  queryProps
}: WithDataProps) => (
  <QueryRenderer
    query={query}
    environment={environment}
    dataFrom={'STORE_THEN_NETWORK'}
    variables={variables}
    render={({ error, props }: RenderProps) => {
      if (!props || !props.joblisting) return null;
      return (
        <Layout
          {...{ error, props }}
          contentRenderer={() => (
            <ResponsiveContent>
              <Flex center column>
                {/* //$FlowFixMe */}
                <h1>{props.joblisting.company.name}</h1>
                {/* //$FlowFixMe */}
                <pre>{cowsay.say({ text: props.joblisting.title })}</pre>
                <ReactMarkdown
                  source={props.joblisting && props.joblisting.description}
                />
              </Flex>
            </ResponsiveContent>
          )}
        />
      );
    }}
  />
);
export default withData(Index, ({ query: { id } }) => ({
  query: graphql`
    query joblistingPage_Query($id: ID!) {
      joblisting: node(id: $id) {
        ... on Joblisting {
          title
          description
          company {
            name
            logo
          }
        }
      }
    }
  `,
  variables: { id }
}));
