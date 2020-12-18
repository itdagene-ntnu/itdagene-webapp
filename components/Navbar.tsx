import * as React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { withRouter, NextRouter } from 'next/router';
import Flex, { FlexItem } from 'styled-flex-component';
import { lightGrey } from '../utils/colors';

type Item = {
  text: string;
  href: string;
  as: string;
  key: any;
  active?: (key: any) => boolean;
  onClick?: (key: any) => void;
};

type Props = {
  items: Item[];
};

const StyledNavbarItem = styled('div')`
  padding-right: 20px;
  font-weight: bold;
  @media only screen and (max-width: 767px) {
    text-align: center;
    border: 1px solid ${lightGrey};
    border-radius: 20px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: 0;
  }
`;

const Hr = styled('hr')`
  background-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.1),
    rgba(0, 0, 0, 0.7),
    rgba(0, 0, 0, 0.1)
  );
  height: 1px;
  border: 0;
`;

const StyledFlex = styled(Flex)`
  @media only screen and (max-width: 767px) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    grid-gap: 5px;
  }
`;

const NavbarItem = withRouter(
  ({ item, router }: { item: Item; router: NextRouter }) => {
    const isActive = item.active? item.active(item.key) :  router.asPath === item.as;
    return (
      <FlexItem>
        {!isActive ? (
          <Link href={item.href} as={item.as}>
            <a>
              <StyledNavbarItem>{item.text}</StyledNavbarItem>
            </a>
          </Link>
        ) : (
          <StyledNavbarItem>{item.text}</StyledNavbarItem>
        )}
      </FlexItem>
    );
  }
);

const Navbar = ({ items }: Props): JSX.Element => {
  return (
    <div>
      <StyledFlex>
        {items.map(
          (item: Item) => item && <NavbarItem key={item.key} item={item} />
        )}
      </StyledFlex>
      <Hr />
    </div>
  );
};

export default Navbar;
