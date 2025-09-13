import styled from "styled-components";

export const StandImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

export const Container = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
  margin-bottom: 1rem;
`;

export const CompaniesListOverlayRight = styled.div`
  position: absolute;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  max-height: 80%;
  overflow-y: auto;
  display: grid;
  gap: 0.75rem;
  color: white;
  font-size: 1.2rem;
  font-weight: 500;
`;

export const CompaniesListOverlayLeft = styled(CompaniesListOverlayRight)`
  left: 0.5rem;
  bottom: 0.5rem;
`;

export const CompaniesText = styled.div<{ isHighlighted: boolean }>`
  color: ${({ isHighlighted }) => (isHighlighted ? "black" : "white")};
  background-color: ${({ isHighlighted }) => (isHighlighted ? "lightblue" : "")};
  border-radius: ${({ isHighlighted }) => (isHighlighted ? "2rem" : "")};
  transition: color 0.2s ease-in-out;
  white-space: nowrap;
  cursor: pointer;
  margin-right: 1rem;
  padding: 0.25rem 0.5rem;
  font-size: 1rem;
`;

export const StandButton = styled.button<{ x: number; y: number; isActive: boolean }>`
  position: absolute;
  top: ${(props) => props.y}%;
  left: ${(props) => props.x}%;
  transform: translate(-50%, -50%);
  background-color: ${({ isActive }) => (isActive ? "lightblue" : "black")};
  color: white;
  width: 1.8%;
  height: 2.5%;
  border: none;
  border-radius: 50%;
  font-size: 0.6vw;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: lightblue;
  }
`;

export const Title = styled.h1`
  font-weight: bold;
  font-smoothing: antialiased;
  font-size: 3rem;
  margin-bottom: 1rem;
`;

export const DateTitle = styled.h2`
  font-weight: 500;
  margin: 0 0 3rem;
`;
