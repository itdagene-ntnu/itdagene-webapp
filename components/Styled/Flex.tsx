import styled from 'styled-components';

interface Props {
  flexDirection?: string;
  alignContent?: string;
  flexWrap?: string;
  justifyContent?: string;
  alignItems?: string;
  gap?: string;
}
const Flex = styled.div<Props>`
  display: flex;
  flex-direction: ${(p): string => p.flexDirection || 'row'};
  flex-wrap: ${(p): string => p.flexWrap || 'nowrap'};
  justify-content: ${(p): string => p.justifyContent || 'flex-start'};
  align-content: ${(p): string => p.alignContent || 'stretch'};
  align-items: ${(p): string => p.alignItems || 'normal'};
  gap: ${(p): string => p.gap || 'normal'};
`;

export default Flex;
