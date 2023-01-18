import * as React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { withRouter, NextRouter } from 'next/router';
import { lightGrey, itdageneBlue, itdageneLightBlue } from '../utils/colors';
import { Divider } from './Styled';

const Div = styled('div')`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-content: stretch;
`;

const DivItem = styled('div')`
  order: 0;
  flex-basis: auto;
  flex-grow: 0;
  flex-shrink: 1;
  display: block;
`;

type ItemProps = {
  text: string;
  key: any;
};

type LinkItem = {
  href: string;
  as: string;
} & ItemProps;
type HandledItem = {
  active: (key: any) => boolean;
  onClick: (key: any) => void;
} & ItemProps;

type Item = LinkItem | HandledItem;

type Props = {
  items: Item[];
};

const StyledNavbarItem = styled('div')`
  font-size: 20px;
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

const StyledFlex = styled(Div)`
  @media only screen and (max-width: 767px) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    grid-gap: 5px;
  }
  & > * {
    padding-right: 20px;
  }
  &:last-child {
    padding-right: 0;
  }
`;

const Item = styled.div`
  cursor: pointer;
  color: ${itdageneBlue};
  &:hover {
    color: ${itdageneLightBlue};
  }
`;

const ItemWrapper = ({
  item,
  children,
}: React.PropsWithChildren<{ item: Item }>): JSX.Element => {
  const isLink = (item as LinkItem).href !== undefined;
  return isLink ? (
    <Link href={(item as LinkItem).href} as={(item as LinkItem).as}>
      {children}
    </Link>
  ) : (
    <Item onClick={(): void => (item as HandledItem).onClick(item.key)}>
      {children}
    </Item>
  );
};

const NavbarItem = withRouter(
  ({ item, router }: { item: Item; router: NextRouter }) => {
    const isLink = (item as LinkItem).href !== undefined;
    const isActive = isLink
      ? router.asPath === (item as LinkItem).as
      : (item as HandledItem).active(item.key);
    return (
      <DivItem>
        {!isActive ? (
          <ItemWrapper item={item}>
            <StyledNavbarItem>{item.text}</StyledNavbarItem>
          </ItemWrapper>
        ) : (
          <StyledNavbarItem>{item.text}</StyledNavbarItem>
        )}
      </DivItem>
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
      <Divider />
    </div>
  );
};

export default Navbar;
