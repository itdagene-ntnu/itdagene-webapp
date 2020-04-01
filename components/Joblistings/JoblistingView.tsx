import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { JoblistingView_joblisting } from './__generated__/JoblistingView_joblisting.graphql';
import Flex, { FlexItem } from 'styled-flex-component';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import { NoBulletUl } from '../Styled';
import dayjs from 'dayjs';
import { lightGrey } from '../../utils/colors';

type Props = {
  joblisting: JoblistingView_joblisting;
};
export const Title = styled('h1')`
  text-align: center;
  font-size: 4rem;
  font-weight: 400;
  font-family: Raleway;
  margin: 0 0 40px;
  @media only screen and (max-width: 767px) {
    font-size: 2.4rem;
  }
`;

const Sidebar = styled('div')`
  display: flex;
  text-align: center;
  flex-direction: column;
  align-items: center;
  #border-left: 1px solid ${lightGrey};
  margin: 20px 20px 20px 20px;
  padding: 0 20px;
`;

const List = ({ joblisting }: { joblisting: JoblistingView_joblisting }) => (
  <NoBulletUl style={{ width: '100%' }}>
    {metaExtractor(joblisting)
      .filter(Boolean)
      .filter((e) => !!e.value)
      .map(({ key, value }) => (
        <li key={key}>
          <Flex justifyBetween>
            <span
              style={{ marginRight: 5, wordBreak: 'normal', color: 'gray ' }}
            >
              <i>{key}</i>:
            </span>
            <strong style={{ textAlign: 'right' }}>{value}</strong>
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

const isCurrentYear = (day) => dayjs(day).year() === dayjs().year();
const onlyOneYear = ({ fromYear, toYear }) => fromYear === toYear;

const metaExtractor = (joblisting: JoblistingView_joblisting) => [
  {
    key: 'Bedrift',
    value: joblisting.company.url ? (
      <a href={joblisting.company.url}>{joblisting.company.name}</a>
    ) : (
      joblisting.company.url
    ),
  },
  {
    key: 'Frist',
    value: joblisting.deadline
      ? dayjs(joblisting.deadline).format(
          `D. MMMM ${isCurrentYear(joblisting.deadline) ? '' : 'YYYY'}`
        )
      : 'Løpende',
  },
  {
    key: 'Type',
    value: typeExtractor(joblisting.type),
  },
  {
    key: 'Klassetrinn',
    value:
      (onlyOneYear(joblisting) ? '' : `${joblisting.fromYear}. - `) +
      `${joblisting.toYear}. trinn`,
  },
  {
    key: 'Sted',
    value: joinValues(joblisting.towns.map(({ name }) => name)),
  },
  {
    key: 'Publisert',
    value: dayjs(joblisting.dateCreated).format('D. MMMM YYYY'),
  },
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
    <div style={{ maxWidth: 800, margin: 'auto' }}>
      <img
        src={joblisting.company.logo}
        style={{ display: 'block', margin: '25px auto 45px' }}
        alt={`Logo til ${joblisting.company.name}`}
      />
    </div>
    <div style={{ maxWidth: 1000, margin: 'auto' }}>
      <Title>{joblisting.title}</Title>
    </div>
    <CompanyDesc style={{ maxWith: 960, fontSize: '1.3rem' }}>
      <ReactMarkdown source={joblisting.company.description} />
    </CompanyDesc>
    <Flex wrapReverse>
      <FlexItem basis="600px" grow={3}>
        <Flex column>
          <ReactMarkdown source={joblisting.description} />
        </Flex>
      </FlexItem>
      <FlexItem center basis="300px" grow={1}>
        <Sidebar>
          <div style={{ width: '100%' }}>
            <List joblisting={joblisting} />
            {joblisting.url && (
              <a href={joblisting.url}>
                <h3>Søk her</h3>
              </a>
            )}
          </div>
        </Sidebar>
      </FlexItem>
    </Flex>
  </>
);

export default createFragmentContainer(Joblisting, {
  joblisting: graphql`
    fragment JoblistingView_joblisting on Joblisting {
      id
      company {
        name
        logo(width: 1127, height: 260)
        description
        url
        id
      }
      towns {
        name
      }
      deadline
      title
      type
      description
      fromYear
      toYear
      url
      dateCreated
    }
  `,
});
