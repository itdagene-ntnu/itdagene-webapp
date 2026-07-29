import * as React from 'react';
import { Range } from 'rc-slider';
import { withRouter, NextRouter } from 'next/router';
import Select, { ValueType, Styles } from 'react-select';
import AsyncSelect from 'react-select/async';
import { fetchQuery, GraphQLTaggedNode } from 'relay-runtime';
import Router from 'next/router';
import { graphql, Variables, Environment } from 'react-relay';
import debounce from '../../utils/debounce';
import {
  JoblistingsSidebar_company_search_QueryResponse,
  JoblistingsSidebar_company_search_Query,
} from '../../__generated__/JoblistingsSidebar_company_search_Query.graphql';
import {
  JoblistingsSidebar_town_search_Query,
  JoblistingsSidebar_town_search_QueryResponse,
} from '../../__generated__/JoblistingsSidebar_town_search_Query.graphql';

const customStyles: Styles = {
  control: (base, state) => ({
    ...base,
    minHeight: 46,
    borderColor: state.isFocused ? '#0778bc' : '#d8e2e8',
    borderRadius: 8,
    boxShadow: state.isFocused ? '0 0 0 3px rgba(7, 120, 188, 0.2)' : 'none',
    ':hover': {
      borderColor: state.isFocused ? '#0778bc' : '#9fb4c0',
    },
  }),
  menu: (base) => ({
    ...base,
    zIndex: 20,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? '#123962'
      : state.isFocused
      ? '#dff3fb'
      : '#fff',
    color: state.isSelected ? '#fff' : '#172733',
  }),
};

const companySearchQuery = graphql`
  query JoblistingsSidebar_company_search_Query($query: String) {
    search(query: $query, types: [COMPANY_WITH_JOBLISTING]) {
      ... on Company {
        name
        id
      }
      __typename
    }
  }
`;

const townSearchQuery = graphql`
  query JoblistingsSidebar_town_search_Query($query: String) {
    search(query: $query, types: [TOWNS_WITH_JOBLISTING]) {
      ... on Town {
        name
        id
      }
      __typename
    }
  }
`;

type JoblistingsQuery = {
  orderBy?: string;
  company?: string;
  companyName?: string;
  type?: string;
  towns?: string;
  fromYear?: number;
  toYear?: number;
};

type Option = {
  label: string;
  value: string;
};

const compactQuery = (
  query: Record<string, string | string[] | number | undefined>
): Record<string, string | string[] | number> =>
  Object.fromEntries(
    Object.entries(query).filter(
      ([, value]) => value !== undefined && value !== '' && value !== '[]'
    )
  ) as Record<string, string | string[] | number>;

const onQueryChange = (newQuery: JoblistingsQuery): void => {
  Router.replace(
    {
      pathname: '/jobb',
      query: compactQuery({ ...Router.query, ...newQuery }),
    },
    undefined,
    { shallow: true, scroll: false }
  );
};

export const orderByOptions = [
  { value: 'DEADLINE', label: 'Søknadsfrist' },
  { value: 'CREATED', label: 'Publisert' },
  { value: 'COMPANY_NAME', label: 'Bedrift' },
  { value: 'TYPE', label: 'Type' },
];

const OrderBySelector = withRouter(({ router }) => (
  <Select
    inputId="job-order"
    isClearable
    onChange={(option: ValueType<Option>): void =>
      onQueryChange({ orderBy: (option as Option)?.value })
    }
    options={orderByOptions}
    placeholder="Ingen sortering"
    styles={customStyles}
    value={
      orderByOptions.find((option) => option.value === router.query.orderBy) ||
      null
    }
  />
));

export const jobTypeOptions = [
  { value: '', label: 'Alle' },
  { value: 'pp', label: 'Fast stilling' },
  { value: 'si', label: 'Sommerjobb' },
  { value: 'ot', label: 'Andre' },
];

const JobTypeSelector = withRouter(({ router }) => (
  <Select
    inputId="job-type"
    isClearable={false}
    onChange={(option: ValueType<Option>): void =>
      onQueryChange({ type: (option as Option)?.value })
    }
    options={jobTypeOptions}
    placeholder="Alle"
    styles={customStyles}
    value={
      jobTypeOptions.find(
        (option) => option.value === (router.query.type || '')
      ) || jobTypeOptions[0]
    }
  />
));

type SearchQuery =
  | JoblistingsSidebar_company_search_Query
  | JoblistingsSidebar_town_search_Query;

type SearchQueryResponse =
  | JoblistingsSidebar_town_search_QueryResponse
  | JoblistingsSidebar_company_search_QueryResponse;

type GraphQLOption = Exclude<
  SearchQueryResponse['search'][0],
  null | { readonly __typename: '%other' }
>;

type SearchType = Array<SearchQueryResponse['search'][0]>;

const loadOptions = async (
  inputValue: string,
  environment: Environment,
  searchQuery: GraphQLTaggedNode
): Promise<Option[]> => {
  const data = await fetchQuery<SearchQuery>(environment, searchQuery, {
    query: inputValue,
  });

  return (data.search as SearchType)
    .filter(
      (result): result is GraphQLOption => result !== null && 'name' in result
    )
    .map((result) => ({
      value: result.id,
      label: result.name,
    }));
};

const CompanySelector = withRouter(
  ({
    router,
    environment,
  }: {
    router: NextRouter;
    environment: Environment;
  }) => (
    <AsyncSelect
      cacheOptions
      inputId="job-company"
      isClearable
      loadOptions={debounce(
        (input) => loadOptions(input, environment, companySearchQuery),
        150
      )}
      noOptionsMessage={({ inputValue }): string =>
        inputValue ? 'Fant ingen bedrifter' : 'Skriv for å søke'
      }
      onChange={(option): void =>
        onQueryChange({
          company: (option as Option)?.value,
          companyName: (option as Option)?.label,
        })
      }
      placeholder="Søk etter bedrift"
      styles={customStyles}
      value={
        router.query.company && router.query.companyName
          ? {
              value: router.query.company as string,
              label: router.query.companyName as string,
            }
          : null
      }
    />
  )
);

const parseTownOptions = (value: NextRouter['query']['towns']): Option[] => {
  if (typeof value !== 'string') {
    return [];
  }
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const TownSelector = withRouter(
  ({
    router,
    environment,
  }: {
    router: NextRouter;
    environment: Environment;
  }) => (
    <AsyncSelect
      cacheOptions
      inputId="job-town"
      isClearable
      isMulti
      loadOptions={debounce(
        (input) => loadOptions(input, environment, townSearchQuery),
        150
      )}
      noOptionsMessage={({ inputValue }): string =>
        inputValue ? 'Fant ingen steder' : 'Skriv for å søke'
      }
      onChange={(option): void =>
        onQueryChange({
          towns: JSON.stringify(option || []),
        })
      }
      placeholder="Søk etter sted"
      styles={customStyles}
      value={parseTownOptions(router.query.towns)}
    />
  )
);

const YearSelector = ({ variables }: { variables: Variables }): JSX.Element => {
  const fromGrade = Number(variables.fromGrade) || 1;
  const toGrade = Number(variables.toGrade) || 5;
  return (
    <div className="job-year-range">
      <Range
        defaultValue={[fromGrade, toGrade]}
        dots
        key={`${fromGrade}-${toGrade}`}
        marks={{
          '1': '1.',
          '2': '2.',
          '3': '3.',
          '4': '4.',
          '5': '5.',
        }}
        max={5}
        min={1}
        onAfterChange={([fromYear, toYear]): void =>
          onQueryChange({ fromYear, toYear })
        }
      />
      <p>
        {fromGrade === toGrade
          ? `${fromGrade}. trinn`
          : `${fromGrade}. til ${toGrade}. trinn`}
      </p>
    </div>
  );
};

const JoblistingsSidebar = ({
  environment,
  variables,
}: {
  environment: Environment;
  variables: Variables;
}): JSX.Element => (
  <aside aria-labelledby="job-filter-heading" className="job-filters">
    <div className="job-filters__heading">
      <div>
        <p className="site-eyebrow">Avgrens resultatene</p>
        <h2 id="job-filter-heading">Filtrer</h2>
      </div>
      <button
        onClick={(): void => {
          Router.replace('/jobb');
        }}
        type="button"
      >
        Nullstill
      </button>
    </div>

    <div className="job-filter-field">
      <label htmlFor="job-type">Type stilling</label>
      <JobTypeSelector />
    </div>
    <div className="job-filter-field">
      <label htmlFor="job-company">Bedrift</label>
      <CompanySelector environment={environment} />
    </div>
    <div className="job-filter-field">
      <label htmlFor="job-town">Sted</label>
      <TownSelector environment={environment} />
    </div>
    <div className="job-filter-field">
      <label htmlFor="job-order">Sorter etter</label>
      <OrderBySelector />
    </div>
    <fieldset className="job-filter-field">
      <legend>Aktuelt årstrinn</legend>
      <YearSelector variables={variables} />
    </fieldset>
  </aside>
);

export default JoblistingsSidebar;
