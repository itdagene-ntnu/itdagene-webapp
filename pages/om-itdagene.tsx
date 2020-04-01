
import * as React from "react";
import { graphql } from "react-relay";
import { withDataAndLayout, WithDataAndLayoutProps, WithDataDataProps } from "../lib/withData";
import BoardMember from "../components/BoardMember";
import { omItdagene_QueryResponse } from "./__generated__/omItdagene_Query.graphql";
import PageView from "../components/PageView";
import Flex from "styled-flex-component";
import { sortBy } from "lodash";

const ROLES = ['Leder', 'Nestleder', 'Økonomi', 'Bedrift', 'Bankett', 'Logistikk', 'Markedsføring', 'Web'];

const Index = ({
  error,
  props: props
}: WithDataAndLayoutProps<omItdagene_QueryResponse>) => <>
    {props.omItdagene && <PageView page={props.omItdagene} />}
    <h1>Styret {props.currentMetaData && props.currentMetaData.year}</h1>
    <Flex wrap center>
      {sortBy(props.currentMetaData.boardMembers, m => ROLES.indexOf(m.role)).map(user => <BoardMember key={user.id} user={user} />)}
    </Flex>
  </>;

export default withDataAndLayout(Index, {
  query: graphql`
    query omItdagene_Query {
      currentMetaData {
        year
        id
        boardMembers {
          ...BoardMember_user
          id
          role
          fullName
        }
      }

      omItdagene: page(slug: "om-itdagene") {
        ...PageView_page
        ...metadata_metadata
      }
    }
  `,
  variables: {},
  layout: ({
    props,
    error
  }: WithDataDataProps<omItdagene_QueryResponse>) => ({
    responsive: true,
    metadata: !!props && props.omItdagene
  })
});