import * as React from 'react';
import { Range } from 'rc-slider';
import { withRouter, NextRouter } from 'next/router';

import Select, { ValueType, OptionTypeBase, Styles } from 'react-select';

import AsyncSelect from 'react-select/async';
import { fetchQuery, GraphQLTaggedNode } from 'relay-runtime';
import Router from 'next/router';
import { graphql, Variables, Environment } from 'react-relay';
import debounce from '../../utils/debounce';
import styled from 'styled-components';
import { lightGrey } from '../../utils/colors';
import {
  JoblistingsSidebar_company_search_QueryResponse,
  JoblistingsSidebar_company_search_Query,
} from '../../__generated__/JoblistingsSidebar_company_search_Query.graphql';
import {
  JoblistingsSidebar_town_search_Query,
  JoblistingsSidebar_town_search_QueryResponse,
} from '../../__generated__/JoblistingsSidebar_town_search_Query.graphql';

const Sidebar = styled('div')`
  display: flex;
  text-align: center;
  flex-direction: column;
  align-items: center;
  #border-left: 1px solid ${lightGrey};
  margin: 10px;
  padding: 0 20px;
`;

const customStyles: Styles = {
  option: (base, state: any) => ({
    ...base,
  }),
  control: (base, { isDisabled, isFocused }) => ({
    ...base,
    //boxShadow: isFocused ? `0 0 0 1px ${itdageneBlue} !important` : null
  }),
  container: (base) => ({
    ...base,
    borderColor: 'pink',
  }),
  singleValue: (base, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';

    return { ...base, opacity, transition };
  },
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

const onQueryChange = (newQuery: JoblistingsQuery): void => {
  Router.replace({
    pathname: '/jobb',
    query: { ...Router.query, ...newQuery },
  });
};

export const orderByOptions = [
  { value: 'DEADLINE', label: 'Søknadsfrist' },
  { value: 'CREATED', label: 'Publisert' },
  { value: 'COMPANY_NAME', label: 'Bedrift' },
  { value: 'TYPE', label: 'Type' },
];

const OrderBySelector = withRouter(({ router }) => (
  <div style={{ width: '100%' }}>
    <Select
      isClearable
      placeholder="Ikke valgt"
      styles={customStyles}
      defaultValue={orderByOptions.find(
        (el) => el.value === router.query.orderBy
      )}
      onChange={(el: ValueType<Option>): void =>
        // See https://github.com/DefinitelyTyped/DefinitelyTyped/issues/32553
        // and https://github.com/JedWatson/react-select/issues/2902
        // for why we have to assert here.
        onQueryChange({ orderBy: (el as Option)?.value })
      }
      options={orderByOptions}
    />
  </div>
));

export const jobTypeOptions = [
  { value: '', label: 'Alle' },
  { value: 'pp', label: 'Fastjobb' },
  { value: 'si', label: 'Sommerjobb' },
];

const JobTypeSelector = withRouter(({ router }) => (
  <div style={{ width: '100%' }}>
    <Select
      isClearable={false}
      placeholder="Ikke valgt"
      styles={customStyles}
      defaultValue={jobTypeOptions.find(
        (el) => el.value === (router.query.type || '')
      )}
      onChange={(el: ValueType<Option>): void =>
        onQueryChange({ type: (el as Option)?.value })
      }
      options={jobTypeOptions}
    />
  </div>
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

  // See https://github.com/microsoft/TypeScript/issues/33591
  const options = (data.search as SearchType)
    .filter(
      (result): result is GraphQLOption => result !== null && 'name' in result
    )
    .map((result) => ({
      value: result.id,
      label: result.name,
    }));
  return options;
};

const CompanySelector = withRouter(
  ({
    router,
    environment,
  }: {
    router: NextRouter;
    environment: Environment;
  }) => (
    <div style={{ width: '100%' }}>
      <AsyncSelect
        isClearable
        loadOptions={debounce(
          (input) => loadOptions(input, environment, companySearchQuery),
          150
        )}
        styles={customStyles}
        defaultValue={
          router.query.companyName ? { label: router.query.companyName } : null
        }
        placeholder="Ikke valgt"
        noOptionsMessage={(input): string =>
          input.inputValue ? 'Fant ingen på bedrifter... :(' : 'Søk her!'
        }
        cacheOptions
        filterOptions={(options: any, filter: any, currentValues: any): any => {
          /* Do no filtering, just return all options
    // https://github.com/JedWatson/react-select#note-about-filtering-async-options */
          return options;
        }}
        onChange={(el): void =>
          onQueryChange({
            company: (el as Option)?.value,
            companyName: (el as Option)?.label,
          })
        }
      />
    </div>
  )
);

const TownSelector = withRouter(
  ({
    router,
    environment,
  }: {
    router: NextRouter;
    environment: Environment;
  }) => (
    <div style={{ width: '100%' }}>
      <AsyncSelect
        isClearable
        isMulti
        loadOptions={debounce(
          (input) => loadOptions(input, environment, townSearchQuery),
          150
        )}
        cacheOptions
        placeholder="Ikke valgt"
        noOptionsMessage={(input): string =>
          input.inputValue ? 'Fant ingen steder... :(' : 'Søk her!'
        }
        styles={customStyles}
        defaultValue={
          (router.query.towns as unknown) as ValueType<OptionTypeBase>
        }
        filterOptions={(
          options: Option[],
          filter: any,
          currentValues: any
        ): any => options}
        onChange={(el): void =>
          onQueryChange({
            towns: JSON.stringify(el),
          })
        }
      />
    </div>
  )
);

const YearSelector = ({ variables }: { variables: Variables }): JSX.Element => (
  <Range
    onAfterChange={(el): void => {
      const [fromYear, toYear] = el;
      onQueryChange({ fromYear, toYear });
    }}
    marks={{
      '1': '1.klasse',
      '2': '2.klasse',
      '3': '3.klasse',
      '4': '4.klasse',
      '5': '5.klasse',
    }}
    dots
    min={1}
    max={5}
    defaultValue={[
      (variables && variables.fromYear) || 1,
      (variables && variables.toYear) || 5,
    ]}
  />
);
const JoblistingsSidebar = ({
  environment,
  variables,
}: {
  environment: Environment;
  variables: Variables;
}): JSX.Element => (
  <Sidebar>
    <h4> Type </h4>
    <JobTypeSelector />
    <h4> Bedrift</h4>
    <CompanySelector environment={environment} />
    <h4> Sted</h4>
    <TownSelector environment={environment} />
    <h4> Sortér på</h4>
    <OrderBySelector />
    <h4> Årstrinn </h4>
    <YearSelector variables={variables} />
  </Sidebar>
);

export default JoblistingsSidebar;
