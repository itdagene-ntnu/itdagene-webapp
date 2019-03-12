//@flow
import * as React from 'react';
import { withRouter } from 'next/router';
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
  padding-top: 10px;
  padding-bottom: 10px;
  background: white;
`;

const StyledMenuItem = styled('span')`
  color: #394b59;
  font-size: 20px;
  padding: 0 10px;
  opacity: 0.8;
  ${({ active = false }: { active?: boolean }) =>
    active &&
    css`
      text-shadow: 0px 0px 0.5px black;
      opacity: 1;
    `};
  :hover {
    text-shadow: 0px 0px 0.5px black;
    opacity: 1;
  }
`;

const items = [
  { key: 'home', name: 'HJEM', to: '/' },
  { key: 'about-us', name: 'INFO', to: '/om-itdagene' },
  { key: 'program', name: 'PROGRAM', to: '/program' },
  { key: 'joblistings', name: 'JOBB', to: '/jobbannonser' },
  {
    key: 'for-bedrifter',
    name: 'FOR BEDRIFTER',
    to: '/info?side=for-bedrifter'
  }
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
  @media only screen and (max-width: 991px) {
    display: none;
  }
`;
export const OnMobile = styled('div')`
  display: none;

  @media only screen and (max-width: 991px) {
    display: block;
  }
`;
const ItdageneLogo = styled('img')`
  height: 60px;
  @media only screen and (max-width: 991px) {
    height: 35px;
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
        <ResponsiveContent>
          <Flex justifyBetween style={{ padding: '20px 0' }}>
            <FlexItem>
              <Link href="/">
                <a>
                  <ItdageneLogo
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
