//@Flow
import * as React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { withRouter } from 'next/router';
import Flex, { FlexItem } from 'styled-flex-component';

type Props = {
  items: {
    text: String,
    href: String,
    as: String
  }
};

const StyledNavbarItem = styled('div')`
  padding-right: 20px;
  font-weight: bold;
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

const NavbarItem = withRouter(({ item, router }) => {
  const isActive = router.asPath === item.as;
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
});

const Navbar = ({ items }: Props) => {
  return (
    <div>
      <Flex>
        {items.map(item => item && <NavbarItem key={item.key} item={item} />)}
      </Flex>
      <Hr />
    </div>
  );
};

export default Navbar;
