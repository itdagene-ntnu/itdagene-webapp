import * as React from 'react';
import { useRouter } from 'next/router';
import { ContainerProps } from 'react-relay';
import styled, { css } from 'styled-components';
import LoadingIndicator from '../LoadingIndicator';
import { HeaderMenu } from '../Header';
import { itdageneBlue } from '../../utils/colors';
import OpengraphFragmentRenderer, { CustomOpengraphRenderer } from './metadata';
import { metadata_metadata } from '../../__generated__/metadata_metadata.graphql';

import Footer from '../Footer';
import { ContentStatePanel } from '../DesignSystem';

const MainFlex = styled('div')`
  display: flex;
  min-height: 100vh;
  justify-content: center;
  flex-flow: column nowrap;
`;

const Content = styled('main')`
  min-height: 50vh;
  width: 100%;
  flex: 1;
  ${({ center = false }: { center?: boolean; responsive?: boolean }): any =>
    center &&
    css`
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    `};
  ${({ responsive = false }: { center?: boolean; responsive?: boolean }): any =>
    responsive &&
    css`
      width: min(calc(100% - 2rem), var(--site-width));
      margin: 0 auto;
      padding: clamp(2rem, 4vw, 3.75rem) 0;

      @media only screen and (max-width: 700px) {
        width: min(calc(100% - 1.25rem), var(--site-width));
      }
    `};
`;

const SkipLink = (): JSX.Element => (
  <a className="skip-link" href="#main-content">
    Hopp til hovedinnhold
  </a>
);

export const BlueSection = styled.div`
  background: ${itdageneBlue};
`;

export const Wrapper = (props: any): JSX.Element => <MainFlex {...props} />;

export type Metadata = Partial<metadata_metadata> | null;

export type LayoutSettings<T> = {
  shouldCenter?: boolean;
  responsive?: boolean;
  customOpengraphMetadata?: (props: {
    props: T;
    error: Error | null | undefined;
  }) => Metadata;
  children?: React.ReactNode;
  noLoading?: boolean;
} & ContainerProps<{
  metadata?: metadata_metadata | null;
}>;

export type ContentRendererProps<T> = {
  props: T;
  error: Error | null | undefined;
};
export type LayoutProps<T> = {
  props?: T | null | undefined;
  error?: Error | null | undefined;
  contentRenderer?: (
    props: ContentRendererProps<T>
  ) => React.ReactElement<ContentRendererProps<T>>;
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
  const router = useRouter();
  const routeName = router.pathname.startsWith('/program')
    ? 'program'
    : router.pathname.startsWith('/stands')
    ? 'stands'
    : router.pathname.startsWith('/jobb')
    ? 'jobs'
    : router.pathname.startsWith('/galleri')
    ? 'gallery'
    : 'default';

  if (error)
    return (
      <Wrapper>
        <CustomOpengraphRenderer />
        <SkipLink />
        <HeaderMenu />
        <Content center id="main-content" tabIndex={-1}>
          <ContentStatePanel
            action={{ href: 'mailto:web@itdagene.no', label: 'Kontakt web' }}
            description="Prøv å laste siden på nytt. Ta kontakt med webansvarlig dersom problemet fortsetter."
            state="error"
            title="Noe gikk galt da siden skulle lastes."
          />
        </Content>
      </Wrapper>
    );

  if (!props && !noLoading)
    return (
      <Wrapper>
        <CustomOpengraphRenderer />
        <SkipLink />
        <HeaderMenu />
        <Content center id="main-content" tabIndex={-1}>
          <LoadingIndicator />
        </Content>
      </Wrapper>
    );

  return (
    <div className="site-root" data-route={routeName}>
      <Wrapper>
        <SkipLink />
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
        <Content
          center={shouldCenter}
          id="main-content"
          responsive={responsive}
          tabIndex={-1}
        >
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
