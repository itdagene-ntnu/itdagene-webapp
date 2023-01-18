import React from 'react';
import * as Sentry from '@sentry/node';
import { NextPageContext } from 'next';
import NextError, { ErrorProps } from 'next/error';
import Layout from '../components/Layout';
import { CenterIt } from '../components/Styled';
import styled from 'styled-components';

const Div = styled('div')`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: stretch;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  flex-basis: 100%;
`;

const DivItem = styled('div')`
  order: 0;
  flex-basis: auto;
  flex-grow: 0;
  flex-shrink: 1;
  display: block;
`;

type Props = {
  statusCode: number;
  title: string;
  hasGetInitialPropsRun?: boolean;
  err?: NextPageContext['err'];
};

type ExtendedErrorProps = ErrorProps & {
  hasGetInitialPropsRun?: boolean;
};

const ERROR_TITLES: Record<string, string> = {
  '404': 'Fant ikke siden :(',
  '500': 'Noe har gått fryktelig galt.',
};

const H1 = styled('h1')`
  font-size: 8em;
  margin-bottom: 10px;
  font-weight: 100;
`;

const MyError = ({
  statusCode,
  title,
  hasGetInitialPropsRun,
  err,
}: Props): JSX.Element => {
  if (!hasGetInitialPropsRun && err) {
    Sentry.captureException(err);
  }
  return (
    <Layout noLoading>
      <Div>
        <DivItem>
          <CenterIt text>
            <H1>{statusCode}</H1>
            <h2>{title || ERROR_TITLES[statusCode] || 'En feil oppsto'}</h2>
          </CenterIt>
        </DivItem>
      </Div>
    </Layout>
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
