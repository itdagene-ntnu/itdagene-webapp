import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import Head from 'next/head';
import { metadata_metadata } from '../../__generated__/metadata_metadata.graphql';
const defaultDescription =
  'itDAGENE er en arbeidslivsmesse hvor studenter blir kjent med fremtidige arbeidsgivere. Messen arrangeres én gang i året av data- og kommunikasjonsteknolpgi studenter ved NTNU i Trondheim. Overskuddet går til studentenes ekskursjon i tredjeklasse.';
const defaultSharingImage = '/static/itdagene_facebookshare.png';
const defaultTitle = 'itDAGENE';

export const CustomOpengraphRenderer = ({
  object,
}: {
  object?:
    | {
        readonly title?: string | null | undefined;
        readonly description?: string | null | undefined;
        readonly sharingImage?: string | null | undefined;
      }
    | null
    | undefined;
}): JSX.Element => {
  const { title, description, sharingImage } = object || {};
  return (
    <Head>
      <title>{title || defaultTitle}</title>
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title || defaultTitle} />
      <meta
        property="og:description"
        content={description || defaultDescription}
      />
      <meta property="og:image" content={sharingImage || defaultSharingImage} />
    </Head>
  );
};

type Props = {
  metadata: metadata_metadata;
};
const OpengraphFragmentRenderer = ({
  metadata: { title, description, sharingImage },
}: Props): JSX.Element => (
  <Head>
    <title>{title || defaultTitle}</title>
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title || defaultTitle} />
    <meta
      property="og:description"
      content={description || defaultDescription}
    />
    <meta property="og:image" content={sharingImage || defaultSharingImage} />
  </Head>
);

export default createFragmentContainer(OpengraphFragmentRenderer, {
  metadata: graphql`
    fragment metadata_metadata on OpengraphMetadata {
      title
      description
      sharingImage
    }
  `,
});
