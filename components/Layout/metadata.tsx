import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { metadata_metadata } from '../../__generated__/metadata_metadata.graphql';

const siteUrl = 'https://itdagene.no';
const defaultDescription =
  'itDAGENE er en arbeidslivsmesse hvor studenter blir kjent med fremtidige arbeidsgivere. Messen arrangeres én gang i året av data- og cybersikkerhetsstudenter ved NTNU i Trondheim.';
const defaultSharingImage = '/static/itdagene_facebookshare.png';
const defaultTitle = 'itDAGENE';

type MetadataObject = {
  readonly title?: string | null;
  readonly description?: string | null;
  readonly sharingImage?: string | null;
};

const absoluteUrl = (value: string): string =>
  value.startsWith('http://') || value.startsWith('https://')
    ? value
    : `${siteUrl}${value.startsWith('/') ? value : `/${value}`}`;

const MetadataTags = ({
  object,
}: {
  object?: MetadataObject | null;
}): JSX.Element => {
  const router = useRouter();
  const title = object?.title || defaultTitle;
  const description = object?.description || defaultDescription;
  const sharingImage = absoluteUrl(object?.sharingImage || defaultSharingImage);
  const canonicalPath = router.asPath.split(/[?#]/)[0] || '/';
  const canonicalUrl = `${siteUrl}${canonicalPath}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="itDAGENE" />
      <meta property="og:locale" content="nb_NO" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={sharingImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={sharingImage} />
    </Head>
  );
};

export const CustomOpengraphRenderer = ({
  object,
}: {
  object?: MetadataObject | null;
}): JSX.Element => <MetadataTags object={object} />;

type Props = {
  metadata: metadata_metadata;
};

const OpengraphFragmentRenderer = ({ metadata }: Props): JSX.Element => (
  <MetadataTags object={metadata} />
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
