//@flow
import React from 'react';
import { Menu } from 'semantic-ui-react';
import type { NextUrl } from '../../utils/types';
import Link from 'next/link';

const items = [
  { key: 'home', name: 'Hjem', to: '/' },
  { key: 'about-us', name: 'Om oss', to: '/Page' },
  { key: 'joblistings', name: 'Jobbannonser', to: '/#' }
];

const MenuItem = ({ item, url }: { item: Object, url: NextUrl }) => {
  const { to, ...rest } = item;
  return (
    <Link href={to}>
      <a>
        <Menu.Item {...rest} active={item.to === url.pathname} />
      </a>
    </Link>
  );
};
type Props = {
  url: NextUrl
};

export const HeaderMenu = ({ url }: Props) => (
  <Menu inverted secondary borderless>
    {items.map(item => <MenuItem url={url} key={item.key} item={item} />)}
  </Menu>
);

export default HeaderMenu;
