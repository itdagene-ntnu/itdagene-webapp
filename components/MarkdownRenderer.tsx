import React from 'react';
import styled from 'styled-components';

// Add more custom renderers as needed

interface MarkdownListProps {
  ordered: string;
  depth: number;
}

interface HeadingProps {
  level: number;
}

type Header = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

const Heading: React.FC<HeadingProps> = ({ children, level }) => {
  const TagName = `h${level + 1}` as Header;
  return <TagName style={{ margin: '3px' }}>{children}</TagName>;
};

const Blockquote: React.FC = ({ children }) => (
  <StyledBlockquote>{children}</StyledBlockquote>
);

const MarkdownList: React.FC<MarkdownListProps> = ({ ordered, children }) => {
  const TagName = ordered ? 'ol' : 'ul';
  return (
    <TagName style={{ margin: '0.3em 0em', paddingLeft: '20px' }}>
      {children}
    </TagName>
  );
};

const ThematicBreak: React.FC = () => <StyledThematicBreak />;

const Paragraph: React.FC = ({ children }) => (
  <StyledParagraph>{children}</StyledParagraph>
);

export { Heading, Blockquote, ThematicBreak, MarkdownList, Paragraph };

// Styled Components

const StyledBlockquote = styled.div`
  background: #0d7bb420;
  border-left: 6px solid #0d7bb460;
  margin: 10px 0px;
  width: 100%;
  padding: 0.5em 10px;
  border-radius: 0px 10px 10px 0px;
  & * {
    font-style: italic;
    margin: 0px;
  }
`;

const StyledThematicBreak = styled.hr`
  width: 100%;
  border: none;
  height: 1.5px;
  background-color: #0d7bb420;
`;

const StyledParagraph = styled.p`
  margin: 5px 0px;
`;
