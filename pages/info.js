import React, { useEffect } from 'react';
import Router from 'next/router';

// In order to keep backward compatibility urls like /info?side=zyx

// For client redirects
const Redirect = props => {
  // some hooks here that need to be before the condition
  useEffect(() => {
    Router.replace(props.newLocation);
  }, []);
  return null;
};

// For SSR redirects
Redirect.getInitialProps = ({ res, query }) => {
  const newLocation = `/info/${query.side}`;
  if (res) {
    res.writeHead(301, { Location: newLocation });
    res.end();
  }
  return { newLocation };
};
export default Redirect;
