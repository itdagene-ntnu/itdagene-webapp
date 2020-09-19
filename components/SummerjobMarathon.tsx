import {
  createPaginationContainer,
  graphql,
  Environment,
  Variables,
  RelayPaginationProp,
} from 'react-relay';
import { Image } from './Styled';
import Link from 'next/link';
import * as React from 'react';
import Flex, { FlexItem } from 'styled-flex-component';
import styled from 'styled-components';
import { SummerjobMarathon_root } from '../__generated__/SummerjobMarathon_root.graphql';
import LoadingIndicator from './LoadingIndicator';
import InfiniteScroll from 'react-infinite-scroller';

const CompanyImage = styled(Image)`
  width: 95%;
  max-width: 232px;
  object-fit: contain;
  margin: 20px auto 15px auto;
  @media only screen and (max-width: 767px) {
    max-width: none;
  }
`;

export const query = graphql`
  query SummerjobMarathon_Query($count: Int, $cursor: String) {
    ...SummerjobMarathon_root @arguments(count: $count, cursor: $cursor)
  }
`;

const JoblistingGrid = styled(Flex)`
  width: 100%;
  grid-template-columns: repeat(auto-fill, minmax(239px, 1fr));
  display: grid;
`;

const CompanyElement = styled('div')`
  cursor: pointer;
  padding: 60px 15px 15px;
  @media only screen and (max-width: 767px) {
    max-width: none;
  }
`;

const NudgeDiv = styled('div')`
  transition: 0.3s;
  &:hover {
    transform: scale(1.1);
  }
`;

/**
 * For some reason, a node in a joblistingconnection can be null, and TS is not smart enough
 * to know that we filter it from the array, so
 * we define the type here, without `null`.
 */
export type JoblistingNode = NonNullable<
  NonNullable<
    NonNullable<SummerjobMarathon_root['joblistings']>['edges'][0]
  >['node']
>;

type Props = {
  root: SummerjobMarathon_root;
  environment: Environment;
  variables: Variables;
  loading: boolean;
  loadingEnd: () => void;
  loadingStart: () => void;
  setCurrentNode: (open: JoblistingNode | null) => void;
  relay: RelayPaginationProp;
};

const ListRenderer = (props: Props): JSX.Element => (
  <>
    {!props.root && <LoadingIndicator />}
    <InfiniteScroll
      element="div"
      hasMore={props.relay.hasMore()}
      loadMore={(): void => {
        if (
          props.loading ||
          !props.relay.hasMore() ||
          props.relay.isLoading()
        ) {
          return;
        }

        props.loadingStart();
        props.relay.loadMore(
          30, // Fetch the next 30 feed items
          (error) => {
            props.loadingEnd();
          }
        );
      }}
      threshold={50}
      loader={<LoadingIndicator hideText noMargin />}
    >
      <JoblistingGrid>
        {props.root &&
          props.root.joblistings &&
          props.root.joblistings.edges
            .filter((e): e is { node: JoblistingNode } => e !== null)
            .map(({ node }) => (
              <CompanyElement key={node.id}>
                <NudgeDiv onClick={(): void => props.setCurrentNode(node)}>
                  <CompanyImage
                    src={node.company.logo || '/static/itdagene-gray.png'}
                  />
                </NudgeDiv>
                <Link
                  key={node.id}
                  href={'/jobb/[slug]'}
                  as={`/jobb/${node.slug}`}
                >
                  <a>
                    <h3
                      style={{
                        fontWeight: 'normal',
                        fontSize: 20,
                        lineHeight: '24px',
                        color: 'black',
                        margin: '5px 0',
                        textAlign: 'center',
                      }}
                    >
                      {`👨‍🎓 ${node.company.name}`}
                    </h3>
                  </a>
                </Link>
              </CompanyElement>
            ))}

        {props.root?.joblistings?.edges.length === 0 && (
          <h2> Ingen annonser :( </h2>
        )}
      </JoblistingGrid>
    </InfiniteScroll>
  </>
);

export const SummerjobMarathon = createPaginationContainer(
  ListRenderer,
  {
    root: graphql`
      fragment SummerjobMarathon_root on Query
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 50 }
          cursor: { type: "String" }
        ) {
        joblistings(first: $count, after: $cursor, isSummerjobMarathon: true)
          @connection(key: "Joblistings_joblistings") {
          edges {
            node {
              slug
              id
              __typename
              type
              title
              url
              deadline
              videoUrl
              towns {
                name
              }
              company {
                name
                logo(width: 800, height: 260)
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `,
  },
  {
    direction: 'forward',
    getConnectionFromProps(props) {
      return props.root && props.root.joblistings;
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      };
    },
    getVariables(props, { cursor, count }, fragmentVariables) {
      return {
        count,
        cursor,
      };
    },
    query,
  }
);

type ContainerProps = {
  environment: Environment;
  variables: Variables;
  children: React.ReactNode;
};

const SummerjobMarathonContainer = ({
  environment,
  variables,
  children,
}: ContainerProps): JSX.Element => (
  <div>
    <Flex wrapReverse>
      <FlexItem basis="700px" grow={26}>
        {children}
      </FlexItem>
    </Flex>
  </div>
);

export default SummerjobMarathonContainer;
