import { NextPageContext } from 'next';

export const setNotFoundWhenFieldIsNull = ({
  response,
  queryProps,
  field,
}: {
  response: NextPageContext['res'];
  queryProps?: Record<string, unknown> | null;
  field: string;
}): void => {
  if (
    response &&
    queryProps &&
    Object.prototype.hasOwnProperty.call(queryProps, field) &&
    queryProps[field] === null
  ) {
    response.statusCode = 404;
  }
};
