//@flow
import React from 'react';
import { withRouter } from 'next/router';
import type { NextRouter } from '../../utils/types';
import { ResponsiveContent } from '../Styled';
import Flex, { FlexItem } from 'styled-flex-component';
import Link from 'next/link';
import styled, { css } from 'styled-components';

const Header = styled('header')`
  background: #f7f9fb;
  border-bottom: 1px solid #e2e9f1;
`;

const StyledMenuItem = styled('span')`
  color: #232323;
  font-size: 16px;

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
  { key: 'joblistings', name: 'JOBBANNONSER', to: '/jobbannonser' }
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
  <Header>
    <ResponsiveContent>
      <Flex justifyBetween style={{ padding: '20px 0' }}>
        <FlexItem>
          <Link href="/">
            <a>
              <img src="/static/itdagene-gray.png" alt="Hvit itDAGENE logo" />
            </a>
          </Link>
        </FlexItem>
        <Flex style={{ alignItems: 'center' }}>
          {items.map(item => <MenuItem key={item.key} item={item} />)}
        </Flex>
      </Flex>
    </ResponsiveContent>
  </Header>
);

export default HeaderMenu;
