import { useEffect } from 'react';
import Router from 'next/router';
import { NextPageContext } from 'next';

// In order to keep backward compatibility urls like /info?side=zyx

type Props = {
  newLink: string;
  newLocation: string;
};

// For client redirects
const Redirect = (props: Props): null => {
  useEffect(() => {
    Router.replace(props.newLink, props.newLocation);
  }, [props.newLink, props.newLocation]);
  return null;
};

// For SSR redirects
Redirect.getInitialProps = ({ res, query }: NextPageContext): Props => {
  const newLocation = `/info/${query.side}`;
  const newLink = `/info/[side]`;
  if (res) {
    res.writeHead(301, { Location: newLocation });
    res.end();
  }
  return { newLocation, newLink };
};
export default Redirect;
