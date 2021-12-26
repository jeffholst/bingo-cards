// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Game, Item, Card, Score, NickName } = initSchema(schema);

export {
  Game,
  Item,
  Card,
  Score,
  NickName
};