import styled from 'styled-components';

interface Props {
  flexDirection?: string;
  alignContent?: string;
  flexWrap?: string;
  justifyContent?: string;
}
const Flex = styled.div<Props>`
  display: flex;
  flex-direction: ${(p) => p.flexDirection || 'row'};
  flex-wrap: ${(p) => p.flexWrap || 'nowrap'};
  justify-content: ${(p) => p.justifyContent || 'flex-start'};
  align-content: ${(p) => p.alignContent || 'stretch'};
`;

export default Flex;
