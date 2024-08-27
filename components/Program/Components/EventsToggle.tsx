import dayjs from 'dayjs';
import React from 'react';
import styled from 'styled-components';
import { itdageneBlue } from '../../../utils/colors';
import { SubHeader } from '../../Styled';

type EventsToggleProps = {
  options: string[];
  activeOption: string;
  setActiveOption: (value: string) => void;
  dateOptions?: boolean;
};

const EventsToggle = ({
  options,
  activeOption,
  setActiveOption,
  dateOptions,
}: EventsToggleProps): JSX.Element => {
  return (
    <ToggleContainer>
      {options.map((opt) => (
        <ToggleItem
          key={opt}
          onClick={(): void => setActiveOption(opt)}
          active={opt === activeOption}
        >
          <SubHeader>
            {dateOptions ? dayjs(opt).format('dddd DD.MM').toUpperCase() : opt}
          </SubHeader>
        </ToggleItem>
      ))}
    </ToggleContainer>
  );
};

const ToggleContainer = styled.div`
  display: flex;
  box-shadow: 0 0 0.75rem #ddd;
  border-radius: 0.75rem;
  overflow: hidden;
  width: fit-content;
`;

const ToggleItem = styled.div<{ active?: boolean }>`
  display: flex;
  padding: 1em;
  cursor: pointer;

  color: ${(props): string => (props.active ? '#fff' : 'black')};
  background-color: ${(props): string =>
    props.active ? itdageneBlue : '#none'};
`;

export default EventsToggle;
