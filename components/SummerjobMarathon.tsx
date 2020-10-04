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
import { SummerjobMarathon_other } from '../__generated__/SummerjobMarathon_other.graphql';
import { SummerjobMarathon_collaborators } from '../__generated__/SummerjobMarathon_collaborators.graphql';
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

const CompanyName = styled('h3')`
  font-weight: normal;
  font-size: 20px;
  line-height: 24px;
  color: black;
  margin: 5px 0;
  text-align: center;
  padding: 0;
  text-decoration: underline;
  &:hover {
    color: #007bb4;
  }
`;

export const query = graphql`
  query SummerjobMarathon_Query($count: Int, $cursor: String) {
    ...SummerjobMarathon_root @arguments(count: $count, cursor: $cursor)
    ...SummerjobMarathon_other
    ...SummerjobMarathon_collaborators
  }
`;

const JoblistingGrid = styled(Flex)`
  width: 100%;
  grid-template-columns: repeat(auto-fill, minmax(239px, 1fr));
  display: ${(props): string => (props.center ? 'flex' : 'grid')};
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

const Spacing = styled('div')`
  margin-top: 20px;
  border-top: 1px solid #ccc;
  height: 30px;
  width: 100%;
`;

/**
 * For some reason, a node in a joblistingconnection can be null, and TS is not smart enough
 * to know that we filter it from the array, so
 * we define the type here, without `null`.Fant du en interessant video?
 */
export type JoblistingNode = NonNullable<
  NonNullable<
    NonNullable<SummerjobMarathon_root['joblistings']>['edges'][0]
  >['node']
>;

type Props = {
  root: SummerjobMarathon_root;
  other: SummerjobMarathon_other;
  collaborators: SummerjobMarathon_collaborators;
  environment: Environment;
  variables: Variables;
  loading: boolean;
  loadingEnd: () => void;
  loadingStart: () => void;
  setCurrentNode: (open: JoblistingNode | null) => void;
  setAllListings: (listings: Listing[] | null) => void;
  relay: RelayPaginationProp;
};

export type Listing = {
  node: JoblistingNode;
  noListing: boolean;
};

type GridProps = {
  listings: Listing[];
  setCurrentNode: Props['setCurrentNode'];
  center?: boolean;
};

const GridRenderer = ({
  listings,
  setCurrentNode,
  center,
}: GridProps): JSX.Element => (
  <JoblistingGrid center={center}>
    {listings.map(({ node, noListing }) => (
      <CompanyElement key={node.id}>
        <NudgeDiv onClick={(): void => setCurrentNode(node)}>
          <CompanyImage
            src={node.company.logo || '/static/itdagene-gray.png'}
          />
        </NudgeDiv>
        {noListing ? (
          <a
            href={node.url || node.company.url || ''}
            target="_blank"
            rel="nolink noreferrer"
          >
            <CompanyName>{node.company.name}</CompanyName>
          </a>
        ) : (
          <Link
            key={node.id}
            href={{
              pathname: '/jobb',
              query: {
                company: node.company.id,
                companyName: node.company.name,
              },
            }}
          >
            <a>
              <CompanyName>{node.company.name}</CompanyName>
            </a>
          </Link>
        )}
      </CompanyElement>
    ))}
  </JoblistingGrid>
);

const ListRenderer = (props: Props): JSX.Element => {
  const allListings =
    props.root &&
    props.root.joblistings &&
    props.root.joblistings.edges
      .filter(
        (e): e is { node: JoblistingNode; noListing: boolean } => e !== null
      )
      .concat(
        props.other
          ? (props.other.nodes as (JoblistingNode & {
              noListing: boolean;
            })[]).map((e) => ({
              node: e,
              noListing: true,
            }))
          : []
      );

  const mainCollaboratorListings = allListings?.filter(
    (e) =>
      e.node.company.id ===
      props.collaborators.currentMetaData?.mainCollaborator?.id
  );
  const collaboratorListings = allListings?.filter((e) =>
    props.collaborators.currentMetaData.collaborators?.some(
      (c) => c.id === e.node.company.id
    )
  );

  const restListings = allListings?.filter(
    (e) =>
      !mainCollaboratorListings?.concat(collaboratorListings || []).includes(e)
  );

  const { setAllListings } = props;

  React.useEffect(() => setAllListings(allListings), [props.root, props.other]);

  return (
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
        {mainCollaboratorListings && (
          <GridRenderer
            center
            listings={mainCollaboratorListings}
            setCurrentNode={props.setCurrentNode}
          />
        )}
        {collaboratorListings && (
          <>
            <GridRenderer
              listings={collaboratorListings}
              setCurrentNode={props.setCurrentNode}
            />
            <Spacing />
          </>
        )}
        {restListings && (
          <GridRenderer
            listings={restListings}
            setCurrentNode={props.setCurrentNode}
          />
        )}
        {props.root?.joblistings?.edges.length === 0 && (
          <h2> Ingen annonser :( </h2>
        )}
      </InfiniteScroll>
    </>
  );
};

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
                url
                id
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
    other: graphql`
      fragment SummerjobMarathon_other on Query {
        nodes(
          ids: [
            "Sm9ibGlzdGluZzo1MjQ="
            "Sm9ibGlzdGluZzo1MjU="
            "Sm9ibGlzdGluZzo1MjY="
          ]
        ) {
          ... on Joblisting {
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
              url
              name
              id
              logo(width: 800, height: 260)
            }
          }
        }
      }
    `,
    collaborators: graphql`
      fragment SummerjobMarathon_collaborators on Query {
        currentMetaData {
          collaborators {
            id
          }
          mainCollaborator {
            id
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
