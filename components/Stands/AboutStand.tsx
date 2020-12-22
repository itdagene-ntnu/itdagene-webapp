import React from 'react';
import Loading from '../LoadingIndicator';
import ReactMarkdown from 'react-markdown';
import { graphql, useFragment } from 'relay-hooks';
import { AboutStand_stand$key } from '../../__generated__/AboutStand_stand.graphql';

type Props = {
  stand: AboutStand_stand$key;
};

const AboutStand = (props: Props): JSX.Element => {
  const about = useFragment(
    graphql`
      fragment AboutStand_stand on Stand {
        description
      }
    `,
    props.stand
  );

  return about ? (
    <ReactMarkdown>{about.description}</ReactMarkdown>
  ) : (
    <Loading />
  );
};

export default AboutStand;
