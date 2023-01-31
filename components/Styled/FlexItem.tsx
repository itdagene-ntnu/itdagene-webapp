import styled from 'styled-components';

interface Props {
  flexBasis?: string;
  flexGrow?: string;
}
const FlexItem = styled.div<Props>`
  order: 0;
  flex-basis: ${(p) => p.flexBasis || 'auto'};
  flex-grow: ${(p) => p.flexGrow || '0'};
  flex-shrink: 1;
  display: block;
`;

export default FlexItem;
