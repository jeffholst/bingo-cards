import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type GameMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ItemMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type CardMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ScoreMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type NickNameMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Game {
  readonly id: string;
  readonly name?: string;
  readonly gameOver?: boolean;
  readonly items?: (Item | null)[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Game, GameMetaData>);
  static copyOf(source: Game, mutator: (draft: MutableModel<Game, GameMetaData>) => MutableModel<Game, GameMetaData> | void): Game;
}

export declare class Item {
  readonly id: string;
  readonly gameID: string;
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
  readonly owner: string;
  readonly gameID: string;
  readonly synced?: boolean;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Card, CardMetaData>);
  static copyOf(source: Card, mutator: (draft: MutableModel<Card, CardMetaData>) => MutableModel<Card, CardMetaData> | void): Card;
}

export declare class Score {
  readonly id: string;
  readonly firstName?: string;
  readonly nickName?: string;
  readonly lastName?: string;
  readonly email?: string;
  readonly owner?: string;
  readonly score?: number;
  readonly bingo?: boolean;
  readonly synced?: boolean;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Score, ScoreMetaData>);
  static copyOf(source: Score, mutator: (draft: MutableModel<Score, ScoreMetaData>) => MutableModel<Score, ScoreMetaData> | void): Score;
}

export declare class NickName {
  readonly id: string;
  readonly text: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<NickName, NickNameMetaData>);
  static copyOf(source: NickName, mutator: (draft: MutableModel<NickName, NickNameMetaData>) => MutableModel<NickName, NickNameMetaData> | void): NickName;
}