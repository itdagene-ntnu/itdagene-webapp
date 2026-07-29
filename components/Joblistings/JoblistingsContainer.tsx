import {
  createPaginationContainer,
  graphql,
  Environment,
  Variables,
  RelayPaginationProp,
} from 'react-relay';
import { useFragment } from 'relay-hooks';
import Link from 'next/link';
import * as React from 'react';
import { JoblistingsContainer_root } from '../../__generated__/JoblistingsContainer_root.graphql';
import { JoblistingsContainer_joblisting$key } from '../../__generated__/JoblistingsContainer_joblisting.graphql';
import LoadingIndicator from '../LoadingIndicator';
import Sidebar, { jobTypeOptions } from './JoblistingsSidebar';
import InfiniteScroll from 'react-infinite-scroller';
import dayjs from 'dayjs';
import { ContentStatePanel } from '../DesignSystem';

function joinValues(values: string[]): string {
  if (values.length < 2) {
    return values[0] || 'Ikke oppgitt';
  }
  return `${values.slice(0, -1).join(', ')} og ${values[values.length - 1]}`;
}

export const query = graphql`
  query JoblistingsContainer_Query(
    $count: Int
    $cursor: String
    $type: String
    $fromGrade: Float
    $toGrade: Float
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
        fromGrade: $fromGrade
        toGrade: $toGrade
        towns: $towns
        orderBy: $orderBy
      )
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

const isCurrentYear = (date: string): boolean =>
  dayjs(date).year() === dayjs().year();

export const JoblistingItem = ({
  node,
}: {
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
    node
  );
  const jobType =
    jobTypeOptions.find(
      (option) => option.value === joblisting.type.toLowerCase()
    )?.label || 'Stilling';
  const towns = joblisting.towns.map(({ name }) => name);

  return (
    <article className="job-card">
      <Link href={`/jobb/${joblisting.slug}`}>
        <div className="job-card__logo">
          <img
            alt={`${joblisting.company.name} logo`}
            loading="lazy"
            src={joblisting.company.logo || '/static/itdagene-gray.png'}
          />
        </div>
        <div className="job-card__body">
          <p className="job-card__type">{jobType}</p>
          <h2>{joblisting.title}</h2>
          <p className="job-card__company">{joblisting.company.name}</p>
          <dl>
            <div>
              <dt>Frist</dt>
              <dd>
                {joblisting.deadline ? (
                  <time dateTime={joblisting.deadline}>
                    {dayjs(joblisting.deadline).format(
                      `D. MMMM ${
                        isCurrentYear(joblisting.deadline) ? '' : 'YYYY'
                      }`
                    )}
                  </time>
                ) : (
                  'Løpende'
                )}
              </dd>
            </div>
            <div>
              <dt>Sted</dt>
              <dd>{joinValues(towns)}</dd>
            </div>
          </dl>
        </div>
      </Link>
    </article>
  );
};

const hasActiveFilters = (variables: Variables): boolean =>
  Boolean(
    variables.type ||
      variables.company ||
      (Array.isArray(variables.towns) && variables.towns.length > 0) ||
      Number(variables.fromGrade) > 1 ||
      Number(variables.toGrade) < 5
  );

const ListRenderer = (props: Props): JSX.Element => {
  const edges = props.root?.joblistings?.edges || [];
  const isFiltered = hasActiveFilters(props.variables);
  const showFilters = edges.length > 0 || isFiltered;

  return (
    <div
      className={
        showFilters ? 'jobs-layout' : 'jobs-layout jobs-layout--single'
      }
    >
      <section aria-label="Jobbannonser" className="jobs-results">
        {!props.root && <LoadingIndicator />}
        {edges.length > 0 && (
          <p className="job-results-count">
            Viser {edges.length} {edges.length === 1 ? 'annonse' : 'annonser'}
            {props.relay.hasMore() ? ' så langt' : ''}
          </p>
        )}
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
            props.relay.loadMore(30, (): void => props.loadingEnd());
          }}
          loader={<LoadingIndicator hideText key="job-loader" noMargin />}
          threshold={160}
        >
          <div className="job-grid">
            {edges.map(
              (edge) =>
                edge?.node && (
                  <JoblistingItem key={edge.node.id} node={edge.node} />
                )
            )}
          </div>
          {edges.length === 0 && (
            <ContentStatePanel
              action={
                isFiltered
                  ? { href: '/jobb', label: 'Nullstill filtrene' }
                  : { href: '/#for-bedrifter', label: 'Meld interesse' }
              }
              description={
                isFiltered
                  ? 'Prøv færre filtre, et annet sted eller et bredere årstrinn.'
                  : 'Når bedriftene publiserer nye muligheter, blir de samlet her.'
              }
              state="empty"
              compact
              title={
                isFiltered
                  ? 'Ingen annonser matcher filtrene dine.'
                  : 'Det finnes ingen aktive jobbannonser akkurat nå.'
              }
            />
          )}
        </InfiniteScroll>
      </section>
      {showFilters && (
        <Sidebar environment={props.environment} variables={props.variables} />
      )}
    </div>
  );
};

export const JoblistingsList = createPaginationContainer(
  ListRenderer,
  {
    root: graphql`
      fragment JoblistingsContainer_root on Query
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 30 }
        cursor: { type: "String" }
        type: { type: "String" }
        fromGrade: { type: "Float" }
        toGrade: { type: "Float" }
        company: { type: "ID" }
        towns: { type: "[ID]", defaultValue: [] }
        orderBy: { type: "[OrderByJoblistingType]" }
      ) {
        joblistings(
          first: $count
          after: $cursor
          type: $type
          company: $company
          fromGrade: $fromGrade
          toGrade: $toGrade
          towns: $towns
          orderBy: $orderBy
        )
          @connection(
            key: "Joblistings_joblistings"
            filters: [
              "toGrade"
              "fromGrade"
              "company"
              "type"
              "towns"
              "orderBy"
            ]
          ) {
          edges {
            node {
              id
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
    getFragmentVariables(previousVariables, totalCount) {
      return {
        ...previousVariables,
        count: totalCount,
      };
    },
    getVariables(props, { cursor, count }, fragmentVariables) {
      const { type, orderBy, company, fromGrade, toGrade, towns } =
        fragmentVariables;
      return {
        count,
        orderBy,
        fromGrade,
        toGrade,
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

const JoblistingsContainer = ({ children }: ContainerProps): JSX.Element => (
  <>{children}</>
);

export default JoblistingsContainer;
