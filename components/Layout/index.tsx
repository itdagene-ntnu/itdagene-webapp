import * as React from 'react';
import styled, { css } from 'styled-components';
import LoadingIndicator from '../LoadingIndicator';
import { HeaderMenu } from '../Header';
import { itdageneBlue } from '../../utils/colors';
import Router from 'next/router';
import OpengraphFragmentRenderer, { CustomOpengraphRenderer } from './metadata';

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

export const Wrapper = (props: any): JSX.Element => <MainFlex {...props} />;

const pageview = (url: string) => {
  window.__GA_TRACKING_ID__ &&
    window.gtag('config', window.__GA_TRACKING_ID__, {
      page_location: url,
    });
};

Router.onRouteChangeComplete = (url: string) => pageview(url);

export type LayoutSettings<T> = {
  shouldCenter?: boolean;
  responsive?: boolean;
  metadata?: Record<string, any> | null | undefined;
  customOpengraphMetadata?: (props: {
    props: T;
    error: Error | null | undefined;
  }) =>
    | {
        readonly title?: string | null | undefined;
        readonly sharingImage?: string | null | undefined;
        readonly description?: string | null | undefined;
      }
    | null
    | undefined;
  children?: React.ReactNode;
  noLoading?: boolean;
};

export type ContentRenererProps<T> = {
  props: T;
  error: Error | null | undefined;
};
export type LayoutProps<T> = {
  props?: T | null | undefined;
  error?: Error | null | undefined;
  contentRenderer?: (props: ContentRenererProps<T>) => React.ReactNode;
};

export const Layout = <T extends {}>({
  props,
  error,
  shouldCenter,
  noLoading,
  responsive,
  contentRenderer: ContentRenderer,
  customOpengraphMetadata,
  metadata,
  children,
}: LayoutProps<T> & LayoutSettings<T>): JSX.Element => {
  if (error)
    return (
      <Wrapper>
        <CustomOpengraphRenderer />
        <HeaderMenu />
        <Content center>
          <h1>Det har skjedd en feil...</h1>
          <h2>Dette er absolutt ikke bra :(</h2>
        </Content>
      </Wrapper>
    );

  if (!props && !noLoading)
    return (
      <Wrapper>
        <CustomOpengraphRenderer />
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
        {customOpengraphMetadata ? (
          <CustomOpengraphRenderer
            object={
              customOpengraphMetadata && props
                ? customOpengraphMetadata({ props, error })
                : null
            }
          />
        ) : metadata ? (
          <OpengraphFragmentRenderer metadata={metadata} />
        ) : (
          <CustomOpengraphRenderer />
        )}
        <Content center={shouldCenter} responsive={responsive}>
          {props && ContentRenderer ? (
            <ContentRenderer error={error} props={props} />
          ) : null}
          {children ? children : null}
        </Content>
        <Footer />
      </Wrapper>
    </div>
  );
};
export default Layout;
