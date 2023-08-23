import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { JoblistingView_joblisting } from '../../__generated__/JoblistingView_joblisting.graphql';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import { NoBulletUl } from '../Styled';
import dayjs from 'dayjs';
import { lightGrey } from '../../utils/colors';
import { Player } from 'video-react';
import Flex from '../Styled/Flex';
import FlexItem from '../Styled/FlexItem';
import Head from 'next/head';

type Props = {
  joblisting: JoblistingView_joblisting;
};
export const Title = styled('h1')`
  text-align: center;
  font-size: 4rem;
  font-weight: 400;
  font-family: Roboto;
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

const PlayerView = styled('div')`
  margin-bottom: 30px;
`;

const List = ({
  joblisting,
}: {
  joblisting: JoblistingView_joblisting;
}): JSX.Element => (
  <NoBulletUl style={{ width: '100%' }}>
    {metaExtractor(joblisting)
      .filter(Boolean)
      .filter((e) => !!e.value)
      .map(({ key, value }) => (
        <li key={key}>
          <Flex justifyContent="space-between">
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
const typeExtractor = (type: string): string => {
  switch (type) {
    case 'SI':
      return 'Sommerjobb';
    case 'PP':
      return 'Fast stilling';
    default:
      return '';
  }
};
function joinValues(values: string[]): string | JSX.Element {
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

const isCurrentYear = (day: string): boolean =>
  dayjs(day).year() === dayjs().year();
const onlyOneYear = ({
  fromYear,
  toYear,
}: {
  fromYear: number;
  toYear: number;
}): boolean => fromYear === toYear;

const metaExtractor = (
  joblisting: JoblistingView_joblisting
): { key: string; value: string | JSX.Element }[] => [
  {
    key: 'Bedrift',
    value: joblisting.company.url ? (
      <a href={joblisting.company.url}>{joblisting.company.name}</a>
    ) : (
      ''
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

const Joblisting = ({ joblisting }: Props): JSX.Element => (
  <>
    {!joblisting.isActive && (
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
    )}
    <div style={{ maxWidth: 800, margin: 'auto' }}>
      <img
        src={
          joblisting.image
            ? 'https://itdagene.no/uploads/' + joblisting.image || undefined
            : joblisting.company.logo || undefined
        }
        style={{ display: 'block', margin: '25px auto 45px' }}
        alt={`Logo til ${
          joblisting.image ? joblisting.image : joblisting.company.name
        }`}
      />
    </div>
    <div style={{ maxWidth: 1000, margin: 'auto' }}>
      <Title>{joblisting.title}</Title>
    </div>
    <Flex flexWrap="wrap-reverse">
      <FlexItem flexBasis="600px" flexGrow="3">
        <Flex flexDirection="column">
          <ReactMarkdown>{joblisting.description || ''}</ReactMarkdown>

          {joblisting.videoUrl && (
            <PlayerView>
              <h3>
                {joblisting.company.name} sin video fra sommerjobbmaraton 2020
              </h3>
              <Player playsInline src={joblisting.videoUrl} />
            </PlayerView>
          )}
        </Flex>
      </FlexItem>
      <FlexItem flexBasis="300px" flexGrow="1">
        <Sidebar>
          <div style={{ width: '100%' }}>
            <List joblisting={joblisting} />
            {joblisting.url && (
              <a href={joblisting.url} target="_blank" rel="noreferrer">
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
      image
      deadline
      title
      type
      description
      fromYear
      toYear
      url
      dateCreated
      videoUrl
      isActive
    }
  `,
});
