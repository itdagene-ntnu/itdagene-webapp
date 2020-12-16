import * as React from 'react';
import { graphql } from 'react-relay';
import { withDataAndLayout, WithDataAndLayoutProps } from '../../lib/withData';
import styled from 'styled-components';
import { useRouter } from 'next/router';

import * as _ from 'lodash';
import Layout from '../../components/Layout';

const DigitalStand = (): JSX.Element => {
  const router = useRouter();
  const companyID = _.last(router.asPath.split('/'));

  return (
    <Layout noLoading responsive>
      {companyID}
    </Layout>
  );
};

export default DigitalStand;

// TODO: Add a query to the respective stand