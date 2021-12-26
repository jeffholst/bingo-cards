/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateGame = /* GraphQL */ `
  subscription OnCreateGame {
    onCreateGame {
      id
      name
      gameOver
      items {
        items {
          id
          gameID
          text
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateGame = /* GraphQL */ `
  subscription OnUpdateGame {
    onUpdateGame {
      id
      name
      gameOver
      items {
        items {
          id
          gameID
          text
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteGame = /* GraphQL */ `
  subscription OnDeleteGame {
    onDeleteGame {
      id
      name
      gameOver
      items {
        items {
          id
          gameID
          text
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreateItem = /* GraphQL */ `
  subscription OnCreateItem {
    onCreateItem {
      id
      gameID
      text
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateItem = /* GraphQL */ `
  subscription OnUpdateItem {
    onUpdateItem {
      id
      gameID
      text
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteItem = /* GraphQL */ `
  subscription OnDeleteItem {
    onDeleteItem {
      id
      gameID
      text
      createdAt
      updatedAt
    }
  }
`;
export const onCreateCard = /* GraphQL */ `
  subscription OnCreateCard {
    onCreateCard {
      id
      text
      selected
      sortOrder
      owner
      gameID
      synced
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateCard = /* GraphQL */ `
  subscription OnUpdateCard {
    onUpdateCard {
      id
      text
      selected
      sortOrder
      owner
      gameID
      synced
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteCard = /* GraphQL */ `
  subscription OnDeleteCard {
    onDeleteCard {
      id
      text
      selected
      sortOrder
      owner
      gameID
      synced
      createdAt
      updatedAt
    }
  }
`;
export const onCreateScore = /* GraphQL */ `
  subscription OnCreateScore {
    onCreateScore {
      id
      firstName
      nickName
      lastName
      email
      owner
      score
      bingo
      synced
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateScore = /* GraphQL */ `
  subscription OnUpdateScore {
    onUpdateScore {
      id
      firstName
      nickName
      lastName
      email
      owner
      score
      bingo
      synced
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteScore = /* GraphQL */ `
  subscription OnDeleteScore {
    onDeleteScore {
      id
      firstName
      nickName
      lastName
      email
      owner
      score
      bingo
      synced
      createdAt
      updatedAt
    }
  }
`;
export const onCreateNickName = /* GraphQL */ `
  subscription OnCreateNickName {
    onCreateNickName {
      id
      text
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateNickName = /* GraphQL */ `
  subscription OnUpdateNickName {
    onUpdateNickName {
      id
      text
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteNickName = /* GraphQL */ `
  subscription OnDeleteNickName {
    onDeleteNickName {
      id
      text
      createdAt
      updatedAt
    }
  }
`;
