//@flow
import React from 'react';
import { Menu } from 'semantic-ui-react';
import Link from 'next/link';

const items = [
  { key: 'home', active: true, name: 'Hjem', to: '/' },
  { key: 'about-us', name: 'Om oss', to: '/Page' },
  { key: 'joblistings', name: 'Jobbannonser', to: '/' }
];

const MenuItem = ({ item }: Object) => {
  const { to, ...rest } = item;
  return (
    <Link href={to}>
      <a>
        <Menu.Item {...rest} />
      </a>
    </Link>
  );
};

export const HeaderMenu = () => (
  <Menu inverted secondary borderless>
    {items.map(item => <MenuItem key={item.key} item={item} />)}
  </Menu>
);

export default HeaderMenu;
