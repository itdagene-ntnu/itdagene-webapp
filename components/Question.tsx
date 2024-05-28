import { Collapse } from '@nextui-org/react';
import { createFragmentContainer, graphql } from 'react-relay';
import ReactMarkdown from 'react-markdown';
import { Question_query } from '../__generated__/Question_query.graphql';

type Props = {
  question: Question_query;
};

const Question = ({ question }: Props) => {
  return (
    <Collapse title={question.question}>
      <ReactMarkdown source={question.answer} />
    </Collapse>
  );
};

export default createFragmentContainer(Question, {
  query: graphql`
    fragment Question_query on Question {
      question
      answer
    }
  `,
});
