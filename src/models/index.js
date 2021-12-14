// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Item, Card, Score, NickName } = initSchema(schema);

export {
  Item,
  Card,
  Score,
  NickName
};