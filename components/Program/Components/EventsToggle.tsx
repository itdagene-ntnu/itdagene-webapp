import dayjs from 'dayjs';
import { capitalize } from 'lodash';
import React from 'react';
import { SegmentedControl } from '../../DesignSystem';

type EventsToggleProps = {
  options: string[];
  activeOption: string;
  setActiveOption: (value: string) => void;
  label?: string;
};

const EventsToggle = ({
  options,
  activeOption,
  setActiveOption,
  label = 'Velg dag',
}: EventsToggleProps): JSX.Element => {
  return (
    <SegmentedControl
      activeValue={activeOption}
      label={label}
      onChange={setActiveOption}
      options={options.map((option) => ({
        value: option,
        label: dayjs(option).isValid()
          ? capitalize(dayjs(option).format('dddd DD.MM'))
          : option,
      }))}
    />
  );
};

export default EventsToggle;
