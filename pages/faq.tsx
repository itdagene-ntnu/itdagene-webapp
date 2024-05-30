import { Collapse } from '@nextui-org/react';
import { graphql } from 'react-relay';
import styled from 'styled-components';
import {
  withDataAndLayout,
  WithDataAndLayoutProps,
  WithDataDataProps,
} from '../lib/withData';
import { faq_QueryResponse } from '../__generated__/faq_Query.graphql';
import ReactMarkdown from 'react-markdown';
import Flex from '../components/Styled/Flex';
import FlexItem from '../components/Styled/FlexItem';

const Title = styled('h1')`
  font-weight: bold;
  font-smoothing: antialiased;
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const Question = ({
  question,
}: {
  question: { question: string; answer: string };
}) => {
  return (
    <Collapse title={question.question}>
      <ReactMarkdown source={question.answer} />
    </Collapse>
  );
};

const Faq = ({
  error,
  props,
}: WithDataAndLayoutProps<faq_QueryResponse>): JSX.Element => {
  return (
    <>
      <Title>Ofte stilte spørsmål</Title>
      {props.questions ? (
        <Collapse.Group>
          {props.questions.map(
            (question, index) =>
              question && <Question key={index} question={question} />
          )}
        </Collapse.Group>
      ) : (
        <Flex>
          <FlexItem>
            <h1>
              Send spørsmål til{' '}
              <a href="mailto:styret@itdagene.no">styret@itdagene.no</a>!
            </h1>
          </FlexItem>
        </Flex>
      )}
    </>
  );
};

export default withDataAndLayout(Faq, {
  query: graphql`
    query faq_Query {
      questions {
        question
        answer
      }
    }
  `,
  variables: {},
  layout: ({ props, error }) => ({
    responsive: true,
    metadata: props ? props.omItdagene : undefined,
  }),
});
