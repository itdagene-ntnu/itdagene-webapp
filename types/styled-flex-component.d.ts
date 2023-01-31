declare module 'styled-flex-component' {
  import * as React from 'react';

  export type FlexProps = Partial<{
    inline: boolean;
    row: boolean;
    rowReverse: boolean;
    column: boolean;
    columnReverse: boolean;
    nowrap: boolean;
    wrap: boolean;
    wrapReverse: boolean;
    justifyStart: boolean;
    justifyEnd: boolean;
    justifyCenter: boolean;
    justifyBetween: boolean;
    justifyAround: boolean;
    contentStart: boolean;
    contentEnd: boolean;
    contentCenter: boolean;
    contentSpaceBetween: boolean;
    contentSpaceAround: boolean;
    contentStretch: boolean;
    alignStart: boolean;
    alignEnd: boolean;
    alignCenter: boolean;
    alignBaselne: boolean;
    alignStretch: boolean;
    full: boolean;
    center: boolean;
  }>;

  export type FlexItemProps = Partial<{
    inlineBlock: boolean;
    inlineFlex: boolean;
    flex: boolean;
    order: number | string;
    basis: string;
    grow: number | string;
    shrink: number | string;
    noShrink: boolean;
  }>;
  const Flex: React.ElementType<
    FlexProps & React.HTMLAttributes<HTMLDivElement>
  >;
  export const FlexItem: React.ElementType<
    FlexItemProps & React.HTMLAttributes<HTMLDivElement>
  >;
  export default Flex;
}
