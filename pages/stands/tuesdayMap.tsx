import { useState } from "react";
import {
  StandImage,
  Container,
  CompaniesListOverlayRight,
  CompaniesListOverlayLeft,
  CompaniesText,
  StandButton,
} from "./styledStands";
import { standsPlacement, companiesDay2TopRight, companiesDay2BottomLeft } from "./standsData";

const splitIntoColumns = (arr: string[], numCols: number): string[][] => {
  const numRows = Math.ceil(arr.length / numCols);
  return Array.from({ length: numCols }, (_, colIndex) =>
    arr.slice(colIndex * numRows, (colIndex + 1) * numRows)
  );
};

const MondayMap = () => {
  const [hoveredStand, setHoveredStand] = useState<number | null>(null);
  const [hoveredClickStand, setHoveredClickStand] = useState<number | null>(null);

  const numColsOverlay = 3;
  const companyNumbersRight = companiesDay2TopRight.map((_, index) => index + 1);
  const columnsOverlayRight = splitIntoColumns(companyNumbersRight.map(String), numColsOverlay);

  return (
    <Container>
      <StandImage
        src="https://cdn.itdagene.no/standkart_tirsdag_plain.png"
        alt="Stands mandag"
      />

      {/* Right side list */}
      <CompaniesListOverlayRight
        style={{
          display: "inline-grid",
          gridAutoFlow: "column",
          gridGap: "0.15rem 0.5rem",
          top: "1.5rem",
          right: "3rem",
          padding: "0.25rem 0.5rem",
        }}
      >
        {columnsOverlayRight.map((col, colIndex) => (
          <div key={colIndex} style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
            {col.map((numberStr) => {
              const standIndex = parseInt(numberStr, 10);
              const companyName = companiesDay2TopRight[standIndex - 1];
              return (
                <CompaniesText
                  key={standIndex}
                  isHighlighted={hoveredStand === standIndex || hoveredClickStand === standIndex}
                  onMouseEnter={() => setHoveredStand(standIndex)}
                  onMouseLeave={() => setHoveredStand(null)}
                  onClick={() => setHoveredClickStand(standIndex)}
                  style={{
                    fontWeight: ["Computas", "Bouvet", "Equinor", "Netcompany"].includes(companyName)
                      ? 900
                      : "normal",
                    fontSize: ["Computas", "Bouvet", "Equinor", "Netcompany"].includes(companyName)
                      ? "1.2rem"
                      : "1rem",
                  }}
                >
                  {standIndex}. {companyName}
                </CompaniesText>
              );
            })}
          </div>
        ))}
      </CompaniesListOverlayRight>

      {/* Left side list */}
      <CompaniesListOverlayLeft
        style={{
          display: "inline-grid",
          gridAutoFlow: "column",
          gridGap: "0.15rem 0.5rem",
          bottom: "2rem",
          left: "3rem",
          padding: "0.25rem 0.5rem",
        }}
      >
        {splitIntoColumns(
        companiesDay2BottomLeft
            .map((_, i) => i + companyNumbersRight.length + 1) 
            .map(String),
        numColsOverlay
        ).map((col, colIndex) => (
          <div key={colIndex} style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
            {col.map((numberStr) => {
              const standIndex = parseInt(numberStr, 10);
              const companyName = companiesDay2BottomLeft[standIndex - companyNumbersRight.length - 1];
              return (
                <CompaniesText
                  key={standIndex}
                  isHighlighted={hoveredStand === standIndex || hoveredClickStand === standIndex}
                  onMouseEnter={() => setHoveredStand(standIndex)}
                  onMouseLeave={() => setHoveredStand(null)}
                  onClick={() => setHoveredClickStand(standIndex)}
                  style={{
                    fontWeight: ["Computas", "Bouvet", "Equinor", "Netcompany"].includes(companyName)
                      ? 900
                      : "normal",
                    fontSize: ["Computas", "Bouvet", "Equinor", "Netcompany"].includes(companyName)
                      ? "1.2rem"
                      : "1rem",
                  }}
                >
                  {standIndex}. {companyName}
                </CompaniesText>
              );
            })}
          </div>
        ))}
      </CompaniesListOverlayLeft>

      {/* Stand buttons */}
      {standsPlacement.map((stand, index) => {
        const standIndex = index + 1;
        return (
          <StandButton
            key={index}
            x={stand.x}
            y={stand.y}
            isActive={hoveredStand === standIndex || hoveredClickStand === standIndex}
            onMouseEnter={() => setHoveredStand(standIndex)}
            onMouseLeave={() => setHoveredStand(null)}
            onClick={() => setHoveredClickStand(standIndex)}
            style={{ color: (hoveredStand || hoveredClickStand) === standIndex ? "black" : "white" }}
          >
            {standIndex}
          </StandButton>
        );
      })}
    </Container>
  );
};

export default MondayMap;
