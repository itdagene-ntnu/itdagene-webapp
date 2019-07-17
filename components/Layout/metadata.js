//@flow
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import Head from 'next/head';
import { type metadata_metadata } from './__generated__/metadata_metadata.graphql';
const defaultDescription: string =
  'itDAGENE er en arbeidslivsmesse hvor studenter blir kjent med fremtidige arbeidsgivere. Messen arrangeres av studenter for studenter, overskuddet går til studentenes ekskursjon i tredjeklasse. itDAGENE arrangeres en gang i året av data- og kommunikasjonsteknologi ved NTNU i Trondheim.';
const defaultSharingImage = '/static/itdagene_facebookshare.png';
const defaultTitle = 'itDAGENE';

export const CustomOpengraphRenderer = ({
  object
}: {
  object?: ?{
    +title?: ?string,
    +description?: ?string,
    +sharingImage?: ?string
  }
}) => {
  const {
    title,
    description = defaultDescription,
    sharingImage = defaultSharingImage
  } =
    object || {};
  return (
    <Head>
      <title> {title || defaultTitle}</title>
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title || defaultTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={sharingImage} />
    </Head>
  );
};

type Props = {
  metadata: metadata_metadata
};
const OpengraphFragmentRenderer = ({
  metadata: { title, description, sharingImage } = {}
}: Props) => (
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

export default createFragmentContainer(
  OpengraphFragmentRenderer,
  {
    metadata: graphql`fragment metadata_metadata on OpengraphMetadata {
  title
  description
  sharingImage
}`
  }
);
