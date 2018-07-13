import React from 'react';
import styled, { css } from 'styled-components';
import LoadingIndicator from '../LoadingIndicator';
import { HeaderMenu } from '../Header';
import { Container } from 'semantic-ui-react';
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

export const Layout = (props: any) => {
  const { shouldCenter, responsive, contentRenderer: ContentRenderer } = props;

  const { props: gqlProps, error } = props;
  if (error) return <div>Error</div>;

  if (!gqlProps)
    return (
      <Wrapper>
        <Content center>
          <LoadingIndicator />
        </Content>
      </Wrapper>
    );

  return (
    <div>
      <Wrapper>
        <BlueSection>
          <div className="ui vertical segment">
            <Container>
              <HeaderMenu />
            </Container>
          </div>
        </BlueSection>
        <Content center={shouldCenter} responsive={responsive}>
          <ContentRenderer />
        </Content>
        <Footer />
      </Wrapper>
    </div>
  );
};
export default Layout;
