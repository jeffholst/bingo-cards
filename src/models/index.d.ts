import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type ItemMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type CardMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ScoreMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Item {
  readonly id: string;
  readonly text: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Item, ItemMetaData>);
  static copyOf(source: Item, mutator: (draft: MutableModel<Item, ItemMetaData>) => MutableModel<Item, ItemMetaData> | void): Item;
}

export declare class Card {
  readonly id: string;
  readonly text?: string;
  readonly selected?: boolean;
  readonly sortOrder?: number;
  readonly owner?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Card, CardMetaData>);
  static copyOf(source: Card, mutator: (draft: MutableModel<Card, CardMetaData>) => MutableModel<Card, CardMetaData> | void): Card;
}

export declare class Score {
  readonly id: string;
  readonly owner?: string;
  readonly score?: number;
  readonly bingo?: boolean;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Score, ScoreMetaData>);
  static copyOf(source: Score, mutator: (draft: MutableModel<Score, ScoreMetaData>) => MutableModel<Score, ScoreMetaData> | void): Score;
}