import React from 'react';
import { ActionLink, PageHeader } from '../DesignSystem';
import Layout from '../Layout';

type PublicErrorProps = {
  statusCode: number;
  title: string;
  description: string;
};

export const PublicErrorContent = ({
  statusCode,
  title,
  description,
}: PublicErrorProps): JSX.Element => (
  <PageHeader
    description={description}
    eyebrow={String(statusCode)}
    title={title}
  >
    <ActionLink href="/">Til forsiden</ActionLink>
  </PageHeader>
);

export const PublicErrorPage = (props: PublicErrorProps): JSX.Element => (
  <Layout noLoading responsive>
    <PublicErrorContent {...props} />
  </Layout>
);
