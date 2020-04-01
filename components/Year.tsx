
import React from "react";
import { createFragmentContainer, graphql } from "react-relay";
import { Year_currentMetaData } from "./__generated__/Year_currentMetaData.graphql";

type Props = {
  currentMetaData: Year_currentMetaData;
};
const Year = ({
  currentMetaData
}: Props) => <span> {currentMetaData.year} </span>;

export default createFragmentContainer(Year, {
  currentMetaData: graphql`
    fragment Year_currentMetaData on MetaData {
      year
    }
  `
});