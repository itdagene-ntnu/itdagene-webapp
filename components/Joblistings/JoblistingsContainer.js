import { createPaginationContainer, graphql } from 'react-relay';
import Link from 'next/link';
import Router from 'next/router';
import * as React from 'react';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import type { JoblistingsContainer_root } from './__generated__/JoblistingsContainer_root.graphql';
import { withRouter } from 'next/router';

export const query = graphql`
  query JoblistingsContainer_Query(
    $count: Int
    $cursor: String
    $type: String
    $fromYear: Float
    $toYear: Float
    $company: ID
  ) {
    ...JoblistingsContainer_root
      @arguments(
        count: $count
        cursor: $cursor
        type: $type
        company: $company
        fromYear: $fromYear
        toYear: $toYear
      )
  }
`;
const JoblistigsContainer = withRouter(
  (props: { root: JoblistingsContainer_root }) => (
    <div>
      <Range
        onAfterChange={ee => {
          Router.push({
            pathname: '/jobbannonser',
            query: { fromYear: ee[0], toYear: ee[1] }
          });
        }}
        min={1}
        max={5}
        defaultValue={[
          parseInt(props.router.query.fromYear, 10) || 1,
          parseInt(props.router.query.toYear, 10) || 5
        ]}
      />
      <ol>
        {props.root.joblistings.edges.map(({ node }) => (
          <li key={node.id}>
            <Link href={{ pathname: '/jobbannonse', query: { id: node.id } }}>
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
          Hent flere
        </button>
      )}
    </div>
  )
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
          fromYear: { type: "Float" }
          toYear: { type: "Float" }
          company: { type: "ID" }
        ) {
        joblistings(
          first: $count
          after: $cursor
          type: $type
          company: $company
          fromYear: $fromYear
          toYear: $toYear
        )
          @connection(
            key: "Joblistings_joblistings"
            filters: ["toYear", "fromYear", "company", "type"]
          ) {
          edges {
            node {
              id
              __typename
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
      const { type, company, fromYear, toYear } = fragmentVariables;
      return {
        count,
        fromYear,
        toYear,
        cursor,
        type,
        company
      };
    },
    query
  }
);
