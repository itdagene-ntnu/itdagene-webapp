//@flow
import * as React from 'react';
import { Statistic, Icon } from 'semantic-ui-react';
const Stats = () => (
  <Statistic.Group widths="four">
    <Statistic>
      <Statistic.Value>57</Statistic.Value>
      <Statistic.Label>IT-bedrifter</Statistic.Label>
    </Statistic>

    <Statistic>
      <Statistic.Value>To</Statistic.Value>
      <Statistic.Label>dager</Statistic.Label>
    </Statistic>

    <Statistic>
      <Statistic.Value>
        <Icon name="student" />
        1500
      </Statistic.Value>
      <Statistic.Label>IT-Studenter</Statistic.Label>
    </Statistic>

    <Statistic>
      <Statistic.Value>19</Statistic.Value>
      <Statistic.Label>Frivillige</Statistic.Label>
    </Statistic>
  </Statistic.Group>
);
export default Stats;
