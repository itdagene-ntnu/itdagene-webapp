//@flow
import * as React from 'react';
import { withRouter } from 'next/router';
import Head from 'next/head';
import type { NextRouter } from '../../utils/types';
import { ResponsiveContent } from '../Styled';
import Flex, { FlexItem } from 'styled-flex-component';
import Link from 'next/link';
import styled, { css } from 'styled-components';
import HamburgerMenu from 'react-hamburger-menu';

// background: #f7f9fb;
const Header = styled('header')`
  #border-bottom: 1px solid #e2e9f1;
  #border-bottom: 3px solid #027cb5;
  padding-top: 20px;
  padding-bottom: 20px;
  background: white;
`;

const StyledMenuItem = styled('span')`
  color: #232323;
  font-size: 20px;

  padding: 0 10px;
  ${({ active = false }: { active?: boolean }) =>
    active &&
    css`
      font-weight: bold;
    `};
`;

const items = [
  { key: 'home', name: 'HJEM', to: '/' },
  { key: 'about-us', name: 'OM itDAGENE', to: '/om-itdagene' },
  { key: 'program', name: 'PROGRAM', to: '/info?side=program' },
  { key: 'joblistings', name: 'JOBBANNONSER', to: '/jobbannonser' }
];

const MenuItem = withRouter(
  ({ item, router }: { item: Object, router: NextRouter }) => {
    const { to, name } = item;
    return (
      <Link href={to}>
        <a>
          <StyledMenuItem active={item.to === router.asPath}>
            {name}
          </StyledMenuItem>
        </a>
      </Link>
    );
  }
);

type State = {
  open: boolean
};

export const OnOther = styled('div')`
  @media only screen and (max-width: 767px) {
    display: none;
  }
`;
export const OnMobile = styled('div')`
  display: none;

  @media only screen and (max-width: 767px) {
    display: block;
  }
`;
class StatefulDropdown extends React.Component<{||}, State> {
  state = {
    open: false
  };
  onMenuClicked = () =>
    this.setState(prevState => ({
      open: !prevState.open
    }));

  render() {
    return (
      <Header>
        <Head>
          <title> itDAGNE </title>
          <meta property="og:type" content="website" />
          <meta property="og:title" content="itDAGENE" />
          <meta
            property="og:description"
            content="itDAGENE er en arbeidslivsmesse hvor studenter blir kjent med fremtidige arbeidsgivere. Messen arrangeres av studenter for studenter, overskuddet går til studentenes ekskursjon i tredjeklasse. itDAGENE arrangeres en gang i året av data- og kommunikasjonsteknologi ved NTNU i Trondheim."
          />
          <meta
            property="og:image"
            content="/static/itdagene_facebookshare.png"
          />
        </Head>
        <ResponsiveContent>
          <Flex justifyBetween style={{ padding: '20px 0' }}>
            <FlexItem>
              <Link href="/">
                <a>
                  <img
                    style={{ height: '35px' }}
                    src="/static/itdagene-gray2.png"
                    alt="Hvit itDAGENE logo"
                  />
                </a>
              </Link>
            </FlexItem>
            <Flex style={{ alignItems: 'center' }}>
              <OnOther>
                {items.map(item => <MenuItem key={item.key} item={item} />)}
              </OnOther>
              <OnMobile>
                <HamburgerMenu
                  aria-label="Meny"
                  isOpen={this.state.open}
                  menuClicked={this.onMenuClicked}
                  width={18}
                  height={15}
                  strokeWidth={2}
                  rotate={0}
                  color="black"
                  borderRadius={0}
                  animationDuration={0.5}
                />
              </OnMobile>
            </Flex>
          </Flex>
          <OnMobile>
            <Flex column style={{ lineHeight: '42px' }}>
              {this.state.open &&
                items.map(item => <MenuItem key={item.key} item={item} />)}
            </Flex>
          </OnMobile>
        </ResponsiveContent>
      </Header>
    );
  }
}

export const HeaderMenu = () => <StatefulDropdown />;

export default HeaderMenu;
