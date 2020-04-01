import React from 'react';
import Layout from '../components/Layout';
import { CenterIt } from '../components/Styled';
import Flex, { FlexItem } from 'styled-flex-component';
import styled from 'styled-components';

type Props = {
  statusCode: number;
  title: string;
};

const ERROR_TITLES = {
  '404': 'Fant ikke siden :(',
  '500': 'Noe har gått fryktelig galt.',
};

const H1 = styled('h1')`
  font-size: 8em;
  margin-bottom: 10px;
  font-weight: 100;
`;

const Error = ({ statusCode, title }: Props) => {
  return (
    <Layout noLoading>
      <Flex center full>
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

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
