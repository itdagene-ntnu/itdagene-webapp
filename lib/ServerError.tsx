import React from 'react';
import NextError from 'next/error';

type Props = {
  statusCode: number;
  title: string;
  errorCode: string;
};

const ServerError = ({ statusCode, title, errorCode }: Props): JSX.Element => {
  if (process.browser) {
    return <NextError statusCode={statusCode} title={title} />;
  }
  const error = new Error() as NodeJS.ErrnoException;
  error.code = errorCode;
  throw error;
};

export default ServerError;
