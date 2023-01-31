import {
  createPaginationContainer,
  graphql,
  Environment,
  Variables,
  RelayPaginationProp,
} from 'react-relay';
import { useFragment } from 'relay-hooks';
import { Image } from '../Styled';
import Link from 'next/link';
import * as React from 'react';
import styled from 'styled-components';
import { JoblistingsContainer_root } from '../../__generated__/JoblistingsContainer_root.graphql';
import { JoblistingsContainer_joblisting$key } from '../../__generated__/JoblistingsContainer_joblisting.graphql';
import LoadingIndicator from '../LoadingIndicator';
import Sidebar, { jobTypeOptions } from './JoblistingsSidebar';
import InfiniteScroll from 'react-infinite-scroller';
import dayjs from 'dayjs';
import Flex from '../Styled/Flex';
import FlexItem from '../Styled/FlexItem';

function joinValues(values: string[]): string | JSX.Element {
  if (values.length < 2) {
    return values[0] || '';
  }

  return (
    <span>
      {values.map((el, i: number) => (
        <span key={i}>
          {i > 0 && i !== values.length - 1 && ', '}
          {i === values.length - 1 && ' og '}
          {el}
        </span>
      ))}
    </span>
  );
}

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
  query JoblistingsContainer_Query(
    $count: Int
    $cursor: String
    $type: String
    $fromYear: Float
    $toYear: Float
    $company: ID
    $towns: [ID]
    $orderBy: [OrderByJoblistingType]
  ) {
    ...JoblistingsContainer_root
      @arguments(
        count: $count
        cursor: $cursor
        type: $type
        company: $company
        fromYear: $fromYear
        toYear: $toYear
        towns: $towns
        orderBy: $orderBy
      )
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

type Props = {
  root: JoblistingsContainer_root;
  environment: Environment;
  variables: Variables;
  loading: boolean;
  loadingEnd: () => void;
  loadingStart: () => void;
  relay: RelayPaginationProp;
};

const isCurrentYear = (day: string): boolean =>
  dayjs(day).year() === dayjs().year();

export const JoblistingItem = (props: {
  node: JoblistingsContainer_joblisting$key;
}): JSX.Element => {
  const joblisting = useFragment(
    graphql`
      fragment JoblistingsContainer_joblisting on Joblisting {
        slug
        id
        __typename
        type
        title
        url
        deadline
        towns {
          name
        }
        company {
          name
          logo(width: 800, height: 260)
        }
      }
    `,
    props.node
  );

  return (
    <CompanyElement>
      <Link
        key={joblisting.id}
        href={'/jobb/[slug]'}
        as={`/jobb/${joblisting.slug}`}
      >
        <CompanyImage
          src={joblisting.company.logo || '/static/itdagene-gray.png'}
        />
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
          {joblisting.title}
        </h3>
        <div style={{ color: 'gray', textAlign: 'center' }}>
          {
            jobTypeOptions.find(
              (el) => el.value === joblisting.type.toLowerCase()
            )?.label
          }{' '}
          @ {joblisting.company.name}
        </div>
        <div
          style={{
            color: 'gray',
            textAlign: 'center',
            fontWeight: 'bold',
            margin: '3px',
          }}
        >
          {joblisting.deadline
            ? 'Frist: ' +
              dayjs(joblisting.deadline).format(
                `D. MMMM ${isCurrentYear(joblisting.deadline) ? '' : 'YYYY'}`
              )
            : 'Løpende søknadsfrist'}
        </div>
        <div style={{ color: 'gray', textAlign: 'center' }}>
          {joblisting.towns.length > 3
            ? `${joblisting.towns[0].name}, ${
                joblisting.towns[1].name
              }, ${joblisting.towns[2].name.slice(0, 3)}...`
            : joinValues(
                joblisting.towns.map(({ name }: { name: string }) => name)
              )}
        </div>
      </Link>
    </CompanyElement>
  );
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
          props.root.joblistings.edges.map(
            (e, i) => e?.node && <JoblistingItem node={e.node} key={i} />
          )}

        {props.root?.joblistings?.edges.length === 0 && (
          <h2> Ingen annonser :( </h2>
        )}
      </JoblistingGrid>
    </InfiniteScroll>
  </>
);

export const JoblistingsList = createPaginationContainer(
  ListRenderer,
  {
    root: graphql`
      fragment JoblistingsContainer_root on Query
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 30 }
        cursor: { type: "String" }
        type: { type: "String" }
        fromYear: { type: "Float" }
        toYear: { type: "Float" }
        company: { type: "ID" }
        towns: { type: "[ID]", defaultValue: [] }
        orderBy: { type: "[OrderByJoblistingType]" }
      ) {
        joblistings(
          first: $count
          after: $cursor
          type: $type
          company: $company
          fromYear: $fromYear
          toYear: $toYear
          towns: $towns
          orderBy: $orderBy
        )
          @connection(
            key: "Joblistings_joblistings"
            filters: [
              "toYear"
              "fromYear"
              "company"
              "type"
              "towns"
              "orderBy"
            ]
          ) {
          edges {
            node {
              ...JoblistingsContainer_joblisting
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
      const { type, orderBy, company, fromYear, toYear, towns } =
        fragmentVariables;
      return {
        count,
        orderBy,
        fromYear,
        toYear,
        cursor,
        type,
        company,
        towns,
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

const JoblistingsContainer = ({
  environment,
  variables,
  children,
}: ContainerProps): JSX.Element => (
  <div>
    <Flex flexWrap="wrap-reverse">
      <FlexItem flexBasis="700px" flexGrow="26">
        {children}
      </FlexItem>
      <FlexItem flexBasis="300px" flexGrow="1">
        <Sidebar environment={environment} variables={variables} />
      </FlexItem>
    </Flex>
  </div>
);

export default JoblistingsContainer;
