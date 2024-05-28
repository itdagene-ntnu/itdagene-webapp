
import { graphql } from 'react-relay';
import { withDataAndLayout } from '../lib/withData';
import FrontPage from './frontpage'


export default withDataAndLayout(FrontPage, {
  query: graphql`
    query page_Query($slugs: [String!]!) {
      currentMetaData {
        ...Year_currentMetaData
        ...WelcomeScreen_currentMetaData
        id
        interestForm
        collaborators {
          id
        }
        companiesFirstDay {
          id
        }
        companiesLastDay {
          id
        }
        mainCollaborator {
          id
          ...MainCollaborator_company
        }
        ...Companies_query
        ...Collaborators_query
      }

      pages(slugs: $slugs) {
        ...PageView_page
        title
        slug
        ingress
      }
    }
  `,
  variables: {
    slugs: [
      //TODO: Remove this when we have this year's pages
      'frontpage',
      'bankett-copy',
      'sommerjobbmaraton-copy',
      'stands-copy',
      'kurs-copy',
      'om-itdagene',
    ],
  },
});
