//@flow
import * as React from 'react';
import { Range } from 'rc-slider';
import { withRouter } from 'next/router';
import Select from 'react-select';
import AsyncSelect from 'react-select/lib/Async';
import { fetchQuery } from 'relay-runtime';
import Router from 'next/router';
import { graphql, type Variables, type Environment } from 'react-relay';
import debounce from '../../utils/debounce';
import styled from 'styled-components';
//import { itdageneBlue } from '../../utils/colors';

const Sidebar = styled('div')`
  display: flex;
  text-align: center;
  flex-direction: column;
  align-items: center;
  #border-left: 1px solid #e2e9f1;
  margin: 10px;
  padding: 0 20px;
`;
const customStyles = {
  option: (base, state) => ({
    ...base
  }),
  control: (base, { isDisabled, isFocused }) => ({
    ...base
    //boxShadow: isFocused ? `0 0 0 1px ${itdageneBlue} !important` : null
  }),
  container: base => ({ ...base, borderColor: 'pink' }),
  singleValue: (base, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';

    return { ...base, opacity, transition };
  }
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
const onQueryChange = newQuery => {
  Router.replace({
    pathname: '/jobbannonser',
    query: { ...Router.query, ...newQuery }
  });
};

export const jobTypeOptions = [
  { value: '', label: 'Alle' },
  { value: 'pp', label: 'Fastjobb' },
  { value: 'si', label: 'Sommerjobb' }
];

const JobTypeSelector = withRouter(({ router }) => (
  <div style={{ width: '100%' }}>
    <Select
      isClearable={false}
      placeholder="Ikke valgt"
      styles={customStyles}
      defaultValue={jobTypeOptions.find(
        el => el.value === (router.query.type || '')
      )}
      onChange={el => onQueryChange({ type: el && el.value })}
      options={jobTypeOptions}
    />
  </div>
));
const loadOptions = async (inputValue, environment, searchQuery) => {
  const data = await fetchQuery(environment, searchQuery, {
    query: inputValue
  });
  const options = data.search.map(result => ({
    value: result.id,
    label: result.name
  }));
  return options;
};

const CompanySelector = withRouter(({ router, environment }) => (
  <div style={{ width: '100%' }}>
    <AsyncSelect
      isClearable
      loadOptions={debounce(
        input => loadOptions(input, environment, companySearchQuery),
        150
      )}
      styles={customStyles}
      defaultValue={
        router.query.companyName && { label: router.query.companyName }
      }
      placeholder="Ikke valgt"
      noOptionsMessage={input =>
        input.inputValue ? 'Fant ingen på bedrifter... :(' : 'Søk her!'
      }
      cacheOptions
      filterOptions={(options, filter, currentValues) => {
        /* Do no filtering, just return all options
        // https://github.com/JedWatson/react-select#note-about-filtering-async-options */
        return options;
      }}
      onChange={el =>
        onQueryChange({
          company: el && el.value,
          companyName: el && el.label
        })
      }
    />
  </div>
));
const parseTowns = query => {
  try {
    return JSON.parse(query.towns);
  } catch (e) {
    return [];
  }
};

const TownSelector = withRouter(({ router, environment }) => (
  <div style={{ width: '100%' }}>
    <AsyncSelect
      isClearable
      isMulti
      loadOptions={debounce(
        input => loadOptions(input, environment, townSearchQuery),
        150
      )}
      cacheOptions
      placeholder="Ikke valgt"
      noOptionsMessage={input =>
        input.inputValue ? 'Fant ingen steder... :(' : 'Søk her!'
      }
      styles={customStyles}
      defaultValue={parseTowns(router.query)}
      filterOptions={(options, filter, currentValues) => options}
      onChange={el =>
        onQueryChange({
          towns: JSON.stringify(el)
        })
      }
    />
  </div>
));
const YearSelector = ({ variables }) => (
  <Range
    onAfterChange={el => {
      const [fromYear, toYear] = el;
      onQueryChange({ fromYear, toYear });
    }}
    marks={{
      '1': '1.klasse',
      '2': '2.klasse',
      '3': '3.klasse',
      '4': '4.klasse',
      '5': '5.klasse'
    }}
    dots
    min={1}
    max={5}
    defaultValue={[
      (variables && variables.fromYear) || 1,
      (variables && variables.toYear) || 5
    ]}
  />
);
const JoblistingsSidebar = ({
  environment,
  variables
}: {
  environment: Environment,
  variables: Variables
}) => (
  <Sidebar>
    <h4> Type </h4>
    <JobTypeSelector />
    <h4> Bedrift</h4>
    <CompanySelector environment={environment} />
    <h4> Sted</h4>
    <TownSelector environment={environment} />
    <h4> Årstrinn </h4>
    <YearSelector variables={variables} />
  </Sidebar>
);

export default JoblistingsSidebar;
