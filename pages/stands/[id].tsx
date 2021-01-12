import React from 'react';
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
