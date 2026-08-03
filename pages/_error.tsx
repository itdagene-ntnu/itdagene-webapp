import React from 'react';
import * as Sentry from '@sentry/node';
import { NextPageContext } from 'next';
import NextError, { ErrorProps } from 'next/error';
import { PublicErrorPage } from '../components/PublicErrorPage';

type Props = {
  statusCode: number;
  title: string;
  hasGetInitialPropsRun?: boolean;
  err?: NextPageContext['err'];
};

type ExtendedErrorProps = ErrorProps & {
  hasGetInitialPropsRun?: boolean;
};

const ERROR_CONTENT: Record<string, { title: string; description: string }> = {
  '404': {
    title: 'Vi finner ikke siden.',
    description:
      'Lenken kan være utdatert, eller siden kan ha fått en ny adresse.',
  },
  '500': {
    title: 'Siden kunne ikke lastes.',
    description:
      'Prøv å laste siden på nytt. Ta kontakt med webansvarlig dersom problemet fortsetter.',
  },
};

const MyError = ({
  statusCode,
  title,
  hasGetInitialPropsRun,
  err,
}: Props): JSX.Element => {
  if (!hasGetInitialPropsRun && err) {
    Sentry.captureException(err);
  }
  const content = ERROR_CONTENT[String(statusCode)] || {
    title: title || 'En feil oppsto.',
    description: 'Prøv igjen om litt.',
  };

  return (
    <PublicErrorPage
      description={content.description}
      statusCode={statusCode}
      title={content.title}
    />
  );
};

MyError.getInitialProps = async ({
  res,
  err,
  asPath,
  ...props
}: NextPageContext): Promise<{ statusCode: number | undefined }> => {
  const errorInitialProps: ExtendedErrorProps = await NextError.getInitialProps(
    {
      res,
      err,
      ...props,
    }
  );

  errorInitialProps.hasGetInitialPropsRun = true;

  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;

  if (statusCode && statusCode === 404) {
    return { statusCode };
  }
  if (err) {
    Sentry.captureException(err);
    return errorInitialProps;
  }

  // Should never reach here, as we should have err or res.
  Sentry.captureException(
    new Error(`_error.tsx getInitialProps missing data at path ${asPath}`)
  );

  return errorInitialProps;
};

export default MyError;
