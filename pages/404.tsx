import React from 'react';
import { PublicErrorPage } from '../components/PublicErrorPage';

const NotFoundPage = (): JSX.Element => (
  <PublicErrorPage
    description="Lenken kan være utdatert, eller siden kan ha fått en ny adresse."
    statusCode={404}
    title="Vi finner ikke siden."
  />
);

export default NotFoundPage;
