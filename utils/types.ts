import { NextPageContext } from 'next';
import { OperationType } from 'relay-runtime';
import { Environment } from 'react-relay';
import { QueryProps } from '../lib/withData';

export interface PageContext<T extends OperationType> extends NextPageContext {
  queryProps?: QueryProps<T>;
  environment?: Environment;
}

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType[number];
