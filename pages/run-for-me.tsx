import React from 'react';
import Layout from '../components/Layout';

const Index = (): JSX.Element => (
  <Layout noLoading responsive>
    <iframe
      src="https://bkf.itverket.no"
      title="Løp for meg"
      width="100%"
      height="900"
    />
  </Layout>
);

export default Index;
