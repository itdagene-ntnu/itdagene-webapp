//@flow
import React from 'react';
import { Menu } from 'semantic-ui-react';
import { withRouter } from 'next/router';
import type { NextRouter } from '../../utils/types';
import Link from 'next/link';

const items = [
  { key: 'home', name: 'Hjem', to: '/' },
  { key: 'about-us', name: 'Om oss', to: '/Page' },
  { key: 'joblistings', name: 'Jobbannonser', to: '/#' }
];

const MenuItem = withRouter(
  ({ item, router }: { item: Object, router: NextRouter }) => {
    const { to, ...rest } = item;
    return (
      <Link href={to}>
        <a>
          <Menu.Item {...rest} active={item.to === router.pathname} />
        </a>
      </Link>
    );
  }
);

export const HeaderMenu = () => (
  <Menu inverted secondary borderless>
    {items.map(item => <MenuItem key={item.key} item={item} />)}
  </Menu>
);

export default HeaderMenu;
