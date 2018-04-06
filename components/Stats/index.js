//@flow
import * as React from 'react';
import { Statistic, Icon } from 'semantic-ui-react';

const statsStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center'
};
const statStyle = {
  minWidth: 280
};
const Stats = () => (
  <Statistic.Group style={statsStyle} widths="3">
    <Statistic style={statStyle}>
      <Statistic.Value>57</Statistic.Value>
      <Statistic.Label>IT-bedrifter</Statistic.Label>
    </Statistic>
    <Statistic style={statStyle}>
      <Statistic.Value>
        <Icon name="student" />
        1500
      </Statistic.Value>
      <Statistic.Label>IT-Studenter</Statistic.Label>
    </Statistic>
    <Statistic style={statStyle}>
      <Statistic.Value>To</Statistic.Value>
      <Statistic.Label>dager</Statistic.Label>
    </Statistic>
  </Statistic.Group>
);
export default Stats;
