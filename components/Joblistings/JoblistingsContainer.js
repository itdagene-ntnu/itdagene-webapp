import { createPaginationContainer, graphql } from 'react-relay';
import Link from 'next/link';
import * as React from 'react';

import type { JoblistingsContainer_root } from './__generated__/JoblistingsContainer_root.graphql';

export const query = graphql`
  query JoblistingsContainer_Query(
    $count: Int
    $cursor: String
    $type: String
    $company: ID
  ) {
    ...JoblistingsContainer_root
      @arguments(count: $count, cursor: $cursor, type: $type, company: $company)
  }
`;
const JoblistigsContainer = (props: { root: JoblistingsContainer_root }) => (
  <div>
    <ol>
      {props.root.joblistings.edges.map(({ node }) => (
        <li key={node.id}>
          <Link href={`/joblistings/${node.id}`}>
            <a>
              {node.title} - {node.company.name}
            </a>
          </Link>
        </li>
      ))}
    </ol>
    {props.relay.hasMore() && (
      <button
        onClick={() => {
          if (!props.relay.hasMore() || props.relay.isLoading()) {
            return;
          }

          props.relay.loadMore(
            10, // Fetch the next 10 feed items
            error => {}
          );
        }}
      >
        Load More
      </button>
    )}
  </div>
);

export default createPaginationContainer(
  JoblistigsContainer,
  {
    root: graphql`
      fragment JoblistingsContainer_root on Query
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String" }
          type: { type: "String" }
          company: { type: "ID" }
        ) {
        joblistings(
          first: $count
          after: $cursor
          type: $type
          company: $company
        ) @connection(key: "Joblistings_joblistings") {
          edges {
            node {
              id
              type
              title
              url
              company {
                name
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `
  },
  {
    direction: 'forward',
    getConnectionFromProps(props) {
      return props.root.joblistings;
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount
      };
    },
    getVariables(props, { cursor, count }, fragmentVariables) {
      const { type, company } = fragmentVariables;
      return {
        count,
        cursor,
        type,
        company
      };
    },
    query
  }
);
