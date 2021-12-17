/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getItem = /* GraphQL */ `
  query GetItem($id: ID!) {
    getItem(id: $id) {
      id
      text
      createdAt
      updatedAt
    }
  }
`;
export const listItems = /* GraphQL */ `
  query ListItems(
    $filter: ModelItemFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        text
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getCard = /* GraphQL */ `
  query GetCard($id: ID!) {
    getCard(id: $id) {
      id
      text
      selected
      sortOrder
      owner
      synced
      createdAt
      updatedAt
    }
  }
`;
export const listCards = /* GraphQL */ `
  query ListCards(
    $filter: ModelCardFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCards(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        text
        selected
        sortOrder
        owner
        synced
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getScore = /* GraphQL */ `
  query GetScore($id: ID!) {
    getScore(id: $id) {
      id
      firstName
      nickName
      lastName
      email
      owner
      score
      bingo
      createdAt
      updatedAt
    }
  }
`;
export const listScores = /* GraphQL */ `
  query ListScores(
    $filter: ModelScoreFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listScores(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        firstName
        nickName
        lastName
        email
        owner
        score
        bingo
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getNickName = /* GraphQL */ `
  query GetNickName($id: ID!) {
    getNickName(id: $id) {
      id
      text
      createdAt
      updatedAt
    }
  }
`;
export const listNickNames = /* GraphQL */ `
  query ListNickNames(
    $filter: ModelNickNameFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listNickNames(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        text
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
