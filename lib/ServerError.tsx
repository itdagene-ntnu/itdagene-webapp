import React from "react";
import Error from "next/error";

const ServerError = ({
  statusCode,
  title,
  errorCode
}) => {
  if (process.browser) {
    return <Error statusCode={statusCode} title={title} />;
  }
  const error = new Error();
  error.code = errorCode;
  throw error;
};

export default ServerError;