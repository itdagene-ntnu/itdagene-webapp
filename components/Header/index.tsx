import * as React from 'react';
import { withRouter, NextRouter } from 'next/router';
import { ResponsiveContent } from '../Styled';
import Link from 'next/link';
import styled, { css } from 'styled-components';
import HamburgerMenu from 'react-hamburger-menu';
import Flex from '../Styled/Flex';
import FlexItem from '../Styled/FlexItem';

const Header = styled('header')`
  padding-top: 10px;
  padding-bottom: 10px;
  background: white;
`;

const StyledMenuItem = styled('span')`
  color: #3f4e59;
  font-size: 20px;
  padding: 0 20px;
  opacity: 0.75;
  transition: all 100ms ease-in-out;
  ${({ active = false }: { active?: boolean }): any =>
    active &&
    css`
      text-shadow: 0px 0px 0.25px black;
      opacity: 1;
    `};
  :hover {
    text-shadow: 0px 0px 0.25px black;
    opacity: 1;
  }
`;

type MenuItem = {
  key: string;
  name: string;
  to: string;
  as?: string;
};

const items: MenuItem[] = [
  //{ key: 'home', name: 'Hjem', to: '/' },
  { key: 'program', name: 'Program', to: '/program' },
  { key: 'joblistings', name: 'Jobb', to: '/jobb' },
  {
    key: 'info',
    name: 'Info',
    to: '/info/[side]',
    as: '/info/for-bedrifter',
  },
  { key: 'startup', name: 'Startup-land', to: '/info/startup' },
  { key: 'case', name: 'itCASE', to: '/info/case' },
  { key: 'about-us', name: 'Om oss', to: '/om-itdagene' },
];

const MenuItem = withRouter(
  ({ item, router }: { item: MenuItem; router: NextRouter }) => {
    const { to, name, as } = item;
    return (
      <Link href={to} as={as}>
        <StyledMenuItem
          active={
            item.to.split(/[/s?]+/)[1] === router.asPath.split(/[/s?]+/)[1]
          }
        >
          {name}
        </StyledMenuItem>
      </Link>
    );
  }
);

type State = {
  open: boolean;
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
class StatefulDropdown extends React.Component<{}, State> {
  state = {
    open: false,
  };
  onMenuClicked = (): void =>
    this.setState((prevState) => ({
      open: !prevState.open,
    }));

  render(): JSX.Element {
    return (
      <Header>
        <ResponsiveContent>
          <Flex justifyContent="space-between" style={{ padding: '20px 0' }}>
            <FlexItem>
              <Link href="/">
                <ItdageneLogo
                  src="/static/itdagene-gray2.png"
                  alt="Hvit itDAGENE logo"
                />
              </Link>
            </FlexItem>
            <Flex style={{ alignItems: 'center' }}>
              <OnOther>
                {items.map((item) => (
                  <MenuItem key={item.key} item={item} />
                ))}
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
            <Flex flexDirection="column" style={{ lineHeight: '42px' }}>
              {this.state.open &&
                items.map((item) => <MenuItem key={item.key} item={item} />)}
            </Flex>
          </OnMobile>
        </ResponsiveContent>
      </Header>
    );
  }
}

export const HeaderMenu = (): JSX.Element => <StatefulDropdown />;

export default HeaderMenu;
