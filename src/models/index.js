// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Item, Card } = initSchema(schema);

export {
  Item,
  Card
};