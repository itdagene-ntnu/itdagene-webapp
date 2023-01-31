import React from 'react';
import * as Sentry from '@sentry/node';
import { NextPageContext } from 'next';
import NextError, { ErrorProps } from 'next/error';
import Layout from '../components/Layout';
import { CenterIt } from '../components/Styled';
import styled from 'styled-components';
import FlexItem from '../components/Styled/FlexItem';
import Flex from '../components/Styled/Flex';

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
  '500': 'Vi jobber med siden frem mot neste itDAGENE, kom tilbake senere.',
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
      <Flex
        justifyContent="center"
        style={{
          alignItems: 'center',
          width: '100%',
          height: '100%',
          flexBasis: '100%',
        }}
      >
        <FlexItem>
          <CenterIt text>
            <H1>{statusCode}</H1>
            <h2>{title || ERROR_TITLES[statusCode] || 'En feil oppsto'}</h2>
          </CenterIt>
        </FlexItem>
      </Flex>
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
