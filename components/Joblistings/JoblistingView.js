//@flow
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import type { JoblistingView_joblisting } from './__generated__/JoblistingView_joblisting.graphql.js';
import Flex, { FlexItem } from 'styled-flex-component';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import { NoBulletUl } from '../Styled';
import dayjs from 'dayjs';

type Props = {
  joblisting: JoblistingView_joblisting
};

const Sidebar = styled('div')`
  display: flex;
  text-align: center;
  flex-direction: column;
  align-items: center;
  #border-left: 1px solid #e2e9f1;
  margin: 20px 20px 20px 20px;
  padding: 0 20px;
`;

const List = ({ joblisting }: { joblisting: JoblistingView_joblisting }) => (
  <NoBulletUl style={{ width: '100%' }}>
    {metaExtractor(joblisting)
      .filter(Boolean)
      .filter(e => !!e.value)
      .map(({ key, value }) => (
        <li key={key}>
          <Flex justifyBetween>
            <span style={{ marginRight: 5, color: 'gray ' }}>{key}:</span>
            <strong>{value}</strong>
          </Flex>
        </li>
      ))}
  </NoBulletUl>
);
const typeExtractor = (type: string) => {
  switch (type) {
    case 'SI':
      return 'Sommerjobb';
    case 'PP':
      return 'Fast stilling';
  }
};
function joinValues(values) {
  if (values.length < 2) {
    return values[0] || '';
  }

  return (
    <span>
      {values.map((el, i) => (
        <span key={i}>
          {i > 0 && i !== values.length - 1 && ', '}
          {i === values.length - 1 && ' og '}
          {el}
        </span>
      ))}
    </span>
  );
}

const isCurrentYear = day => dayjs(day).year() === dayjs().year();
const onlyOneYear = ({ fromYear, toYear }) => fromYear === toYear;

const metaExtractor = (joblisting: JoblistingView_joblisting) => [
  {
    key: 'Frist',
    value:
      joblisting.deadline &&
      dayjs(joblisting.deadline).format(
        `D. MMMM ${isCurrentYear(joblisting.deadline) ? '' : 'YYYY'}`
      )
  },
  {
    key: 'Type',
    value: typeExtractor(joblisting.type)
  },
  {
    key: 'Klassetrinn',
    value: onlyOneYear(joblisting)
      ? ''
      : `${joblisting.fromYear}. - ` + `${joblisting.toYear}. trinn`
  },
  {
    key: 'Sted',
    value: joinValues(joblisting.towns)
  }
];
const GrayText = styled('div')`
  color: gray;
`;

const CompanyDesc = styled(GrayText)`
  font-style: italic;
  text-align: left;
`;

const Joblisting = ({ joblisting }: Props) => (
  <>
    <h1>{joblisting.title}</h1>
    <GrayText>
      Publisert: {dayjs(joblisting.dateCreated).format('D. MMMM YYYY')}
    </GrayText>
    <Flex wrapReverse>
      <FlexItem basis="600px" grow={3}>
        <Flex column>
          <ReactMarkdown source={joblisting.description} />
        </Flex>
      </FlexItem>
      <FlexItem center basis="300px" grow={1}>
        <Sidebar>
          <div style={{ width: '100%' }}>
            <h3>{joblisting.company.name}</h3>
            <img
              width={200}
              src={joblisting.company.logo}
              alt={`Logo til ${joblisting.company.name}`}
            />
            <List joblisting={joblisting} />
            {joblisting.url && (
              <a href={joblisting.url}>
                <h3>Søk her</h3>
              </a>
            )}
          </div>

          <CompanyDesc>
            <ReactMarkdown source={joblisting.company.description} />
          </CompanyDesc>
        </Sidebar>
      </FlexItem>
    </Flex>
  </>
);

export default createFragmentContainer(
  Joblisting,
  graphql`
    fragment JoblistingView_joblisting on Joblisting {
      id
      company {
        name
        logo
        description
        url
        id
      }
      towns
      deadline
      title
      type
      description
      fromYear
      toYear
      url
      dateCreated
    }
  `
);
