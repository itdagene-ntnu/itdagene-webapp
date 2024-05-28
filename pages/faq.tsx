import { Collapse } from '@nextui-org/react';
import { graphql } from 'react-relay';
import styled from 'styled-components';
import {
  withDataAndLayout,
  WithDataAndLayoutProps,
  WithDataDataProps,
} from '../lib/withData';
import { faq_QueryResponse } from '../__generated__/faq_Query.graphql';
import Question from '../components/Question';
import Flex from '../components/Styled/Flex';
import FlexItem from '../components/Styled/FlexItem';

const Title = styled('h1')`
  font-weight: bold;
  font-smoothing: antialiased;
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const faq = ({
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

export default withDataAndLayout(faq, {
  query: graphql`
    query faq_Query {
      currentMetaData {
        year
        id
        boardMembers {
          ...BoardMember_user
          id
          role
          fullName
        }
      }

      questions {
        ...Question_query
        question
        answer
      }

      omItdagene: page(slug: "om-itdagene") {
        ...PageView_page
        ...metadata_metadata
      }
    }
  `,
  variables: {},
  layout: ({ props, error }) => ({
    responsive: true,
    metadata: props ? props.omItdagene : undefined,
  }),
});
