//@flow
import React from 'react';
import { withRouter } from 'next/router';
import type { NextRouter } from '../../utils/types';
import Flex, { FlexItem } from 'styled-flex-component';
import Link from 'next/link';
import styled, { css } from 'styled-components';

const StyledMenuItem = styled('span')`
  color: white;
  font-size: 20px;
  padding: 0 10px;
  ${({ active = false }: { active?: boolean }) =>
    active &&
    css`
      font-weight: bold;
    `};
`;

const items = [
  { key: 'home', name: 'Hjem', to: '/' },
  { key: 'about-us', name: 'Om oss', to: '/styret' },
  { key: 'joblistings', name: 'Jobbannonser', to: '/jobbannonser' }
];

const MenuItem = withRouter(
  ({ item, router }: { item: Object, router: NextRouter }) => {
    const { to, name } = item;
    return (
      <Link href={to}>
        <a>
          <StyledMenuItem active={item.to === router.pathname}>
            {name}
          </StyledMenuItem>
        </a>
      </Link>
    );
  }
);

export const HeaderMenu = () => (
  <Flex justifyBetween style={{ padding: '20px 20px' }}>
    <FlexItem>
      <Link href="/">
        <a>
          <img
            style={{ width: 100 }}
            src="/static/itdagene-white.png"
            alt="Hvit itDAGENE logo"
          />
        </a>
      </Link>
    </FlexItem>
    <Flex>{items.map(item => <MenuItem key={item.key} item={item} />)}</Flex>
  </Flex>
);

export default HeaderMenu;
