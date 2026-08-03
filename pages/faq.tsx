import { graphql } from 'react-relay';
import { withDataAndLayout, WithDataAndLayoutProps } from '../lib/withData';
import { faq_QueryResponse } from '../__generated__/faq_Query.graphql';
import ReactMarkdown from 'react-markdown';
import { groupBy } from 'lodash';
import {
  ActionLink,
  ContentStatePanel,
  PageHeader,
} from '../components/DesignSystem';
import { SmoothDisclosure } from '../components/DesignSystem/SmoothDisclosure';

type QuestionType = NonNullable<
  NonNullable<faq_QueryResponse['questions']>[number]
>;

const Question = ({
  contentId,
  question,
}: {
  contentId: string;
  question: QuestionType;
}): JSX.Element => (
  <SmoothDisclosure
    className="faq-item"
    contentClassName="faq-item__answer"
    contentId={contentId}
    summary={question.question || 'Spørsmål'}
  >
    <ReactMarkdown source={question.answer || ''} />
  </SmoothDisclosure>
);

const QuestionGroup = ({
  title,
  eyebrow,
  idPrefix,
  questions,
}: {
  title: string;
  eyebrow: string;
  idPrefix: string;
  questions: ReadonlyArray<QuestionType | null>;
}): JSX.Element | null => {
  const availableQuestions = questions.filter(
    (question): question is QuestionType => question !== null
  );
  if (availableQuestions.length === 0) {
    return null;
  }
  return (
    <section className="faq-group">
      <div className="faq-group__heading">
        <p className="site-eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      <div>
        {availableQuestions.map((question, index) => (
          <Question
            contentId={`faq-${idPrefix}-${index}`}
            key={question.question || `question-${index}`}
            question={question}
          />
        ))}
      </div>
    </section>
  );
};

const Faq = ({
  props,
}: WithDataAndLayoutProps<faq_QueryResponse>): JSX.Element => {
  const questions = props.questions || [];
  const groupedQuestions = groupBy(questions, 'isForCompanies');

  return (
    <>
      <PageHeader
        description="Finn praktiske svar om messen, deltakelse, påmelding og bedriftsreisen."
        title="Ofte stilte spørsmål"
      />

      {questions.length > 0 ? (
        <div className="faq-content">
          <QuestionGroup
            eyebrow="For studenter og besøkende"
            idPrefix="general"
            questions={groupedQuestions.false || []}
            title="Generelle spørsmål"
          />
          <QuestionGroup
            eyebrow="Deltakelse og samarbeid"
            idPrefix="companies"
            questions={groupedQuestions.true || []}
            title="For bedrifter"
          />
        </div>
      ) : (
        <div className="faq-content">
          <ContentStatePanel
            action={{
              href: 'mailto:styret@itdagene.no',
              label: 'Send oss et spørsmål',
            }}
            description="Vi hjelper gjerne dersom du ikke finner svaret på nettsiden."
            state="empty"
            title="Spørsmålene er ikke publisert ennå."
          />
        </div>
      )}

      <aside className="faq-contact">
        <div>
          <h2>Snakk med arrangørene.</h2>
          <p>Finner du ikke svaret, hjelper vi deg gjerne direkte.</p>
        </div>
        <ActionLink href="mailto:styret@itdagene.no">
          styret@itdagene.no
        </ActionLink>
      </aside>
    </>
  );
};

export default withDataAndLayout(Faq, {
  query: graphql`
    query faq_Query {
      questions {
        question
        answer
        isForCompanies
      }
    }
  `,
  variables: {},
  layout: {
    responsive: true,
    customOpengraphMetadata: (): { title: string; description: string } => ({
      title: 'Ofte stilte spørsmål',
      description: 'Praktiske svar for studenter og bedrifter om itDAGENE.',
    }),
  },
});
