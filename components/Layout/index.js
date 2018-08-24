//@flow
import Head from 'next/head';
import * as React from 'react';
import styled, { css } from 'styled-components';
import LoadingIndicator from '../LoadingIndicator';
import { HeaderMenu } from '../Header';
import { itdageneBlue } from '../../utils/colors';

import Footer from '../Footer';

const MainFlex = styled('div')`
  display: flex;
  min-height: 100vh;
  justify-content: center;
  flex-flow: column wrap;
`;

const Content = styled('div')`
  min-height: 50vh;
  flex: 1;
  ${({ center = false }: { center?: boolean }) =>
    center &&
    css`
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    `};
  ${({ responsive = false }: { responsive?: boolean }) =>
    responsive &&
    css`
      @media only screen and (min-width: 1200px) {
        width: 1127px;
        margin-left: auto !important;
        margin-right: auto !important;
      }
      @media only screen and (max-width: 1199px) and (min-width: 992px) {
        width: 933px;
        margin-left: auto !important;
        margin-right: auto !important;
      }
      @media only screen and (max-width: 991px) and (min-width: 768px) {
        width: 723px;
        margin-left: auto !important;
        margin-right: auto !important;
      }
      @media only screen and (max-width: 767px) {
        width: auto !important;
        margin-left: 1em !important;
        margin-right: 1em !important;
      }
    `};
`;

export const BlueSection = styled.div`
  background: ${itdageneBlue};
`;

export const Wrapper = (props: any) => <MainFlex {...props} />;

const defaultDescription =
  'itDAGENE er en arbeidslivsmesse hvor studenter blir kjent med fremtidige arbeidsgivere. Messen arrangeres av studenter for studenter, overskuddet går til studentenes ekskursjon i tredjeklasse. itDAGENE arrangeres en gang i året av data- og kommunikasjonsteknologi ved NTNU i Trondheim.';
const defaultSharingImage = '/static/itdagene_facebookshare.png';

const OpengraphRenderer = ({
  object
}: {
  object?: ?{
    +title?: ?string,
    +description?: ?string,
    +sharingImage?: ?string
  }
}) => {
  const {
    title,
    description = defaultDescription,
    sharingImage = defaultSharingImage
  } =
    object || {};
  return (
    <Head>
      <title> itDAGENE {title && `| ${title}`}</title>
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title || 'itDAGENE'} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={sharingImage} />
    </Head>
  );
};

export const Layout = <T>({
  props,
  error,
  shouldCenter,
  noLoading,
  responsive,
  contentRenderer: ContentRenderer,
  opengraphMetadata,
  children
}: {
  props?: ?T,
  error?: ?Error,
  shouldCenter?: boolean,
  responsive?: boolean,
  contentRenderer?: (props: { props: T, error: ?Error }) => React.Node,
  opengraphMetadata?: (props: { props: T, error: ?Error }) => ?{
    +title?: ?string,
    +sharingImage?: ?string,
    +description?: ?string
  },
  children?: React.Node,
  noLoading?: boolean
}) => {
  if (error) return <div>Error</div>;

  if (!props && !noLoading)
    return (
      <Wrapper>
        <OpengraphRenderer />
        <HeaderMenu />
        <Content center>
          <LoadingIndicator />
        </Content>
      </Wrapper>
    );

  return (
    <div>
      <Wrapper>
        <HeaderMenu />
        <OpengraphRenderer
          object={
            opengraphMetadata && props
              ? opengraphMetadata({ props, error })
              : null
          }
        />
        <Content center={shouldCenter} responsive={responsive}>
          {ContentRenderer ? <ContentRenderer {...{ error, props }} /> : null}
          {children ? children : null}
        </Content>
        <Footer />
      </Wrapper>
    </div>
  );
};
export default Layout;
