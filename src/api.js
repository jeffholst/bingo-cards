import { v4 as uuidv4 } from 'uuid';
import { API, graphqlOperation} from 'aws-amplify'
//import { Item } from './models'
import { listItems, listCards, listNickNames, getScore, listScores, cardsByOwner, listGames, getGame } from './graphql/queries';
import { createItem, deleteItem, createCard, updateCard, deleteCard, createNickName, deleteNickName, createScore, 
updateScore, deleteScore, createGame, deleteGame, updateGame} from './graphql/mutations'
import * as helper from "./helper"
import { get, set } from 'idb-keyval';

const getItemsAPI = async () => {
  const result = await API.graphql(graphqlOperation(listItems, {limit: 1000}))
  return result.data.listItems.items
}

const addItemAPI = async (item) => {
  try {
    await API.graphql(graphqlOperation(createItem, {input: item}))
  }
  catch(error) {
    console.log(error)
  }
}

const deleteItemAPI = async (itemId) => {
  await API.graphql(graphqlOperation(deleteItem, {input: {id: itemId}}))
}

const addCardAPI = async (card) => {
  try {
    await API.graphql(graphqlOperation(createCard, {input: card}))
  }
  catch(error) {
    console.log(error)
  }
}

const syncCardAPI = async (id, selected, gameId) => {
  let rval = false
  try {
    const res = await API.graphql(graphqlOperation(updateCard, {input: {id: id, gameId: gameId, selected: selected, synced: true}}))
    rval = true
  } catch {
  }
  return rval
}

const getCardByOwnerAPI = async (owner, gameId) => {
  try {
    //const result = await API.graphql(graphqlOperation(cardsByOwner, {owner: owner, limit: 1000})) // limit should not be needed?
    const result = await API.graphql(graphqlOperation(cardsByOwner, {owner: owner, filter: {gameID: {eq: gameId}}, limit: 1000}))
    return result.data.cardsByOwner.items
  } catch(error) {
    console.log(error)
    return null
  }
}

const getCardAPI = async (owner) => {
  try {
    const result = await API.graphql(graphqlOperation(listCards, {filter: {owner: {eq: owner}}, limit: 1000}))
    return result.data.listCards.items
  } catch(error) {
    console.log(error)
    return null
  }
}

const getNickNamesAPI = async () => {
  try {
    const result = await API.graphql(graphqlOperation(listNickNames, {limit: 1000}))
    helper.shuffle(result.data.listNickNames.items)
    return result.data.listNickNames.items
  }
  catch(error) {
    console.log(error)
    return null
  }
}

const addNickNameAPI = async (item) => {
  await API.graphql(graphqlOperation(createNickName, {input: item}))
}

const deleteNickNameAPI = async (itemId) => {
  await API.graphql(graphqlOperation(deleteNickName, {input: {id: itemId}}))
}

const getScoreAPI = async (id) => {
  try {
  const result = await API.graphql(graphqlOperation(getScore, {id: id}))
  return result.data.getScore
  } catch(error) {
    console.log(error)
    return null
  }
}

const addScoreAPI = async (score) => {
  await API.graphql(graphqlOperation(createScore, {input: score}))
}

const syncScoreAPI = async (score) => {
  let rval = false
  try {
    score.synced = true
    const res = await API.graphql(graphqlOperation(updateScore, {input: score}))
    rval = true
  } catch {
  }
  return rval
}

const getScoresAPI = async () => {
  try {
    const result = await API.graphql(graphqlOperation(listScores, {limit: 1000}))
    return result.data.listScores.items
  } catch(error) {
    console.log(error)
    return null
  }
}

const deleteCardAPI = async (itemId) => {
  await API.graphql(graphqlOperation(deleteCard, {input: {id: itemId}}))
}

const syncPendingItems = async (cardItems, userName) => {
  let hadSync = false
  for (let loop = 0; loop < cardItems.length; loop++) {
    if (!cardItems[loop].synced) {
      hadSync = true
      await syncCardAPI(cardItems[loop].id, cardItems[loop].selected).then((res) => {
        if (res) {
          cardItems[loop].synced = true
          //localStorage.setItem(userName, JSON.stringify(cardItems))
          set(userName, JSON.stringify(cardItems))
        }
      })
    }
  }
  if (hadSync){
    helper.reScore(userName, cardItems)
  }

  syncPendingScores(userName)
}

const syncPendingScores = async (userName) => {
  //const tmp = localStorage.getItem(`${userName}-profile`)
  const tmp = await get(`${userName}-profile`)
  if (tmp) {
    let json = JSON.parse(tmp)
     if (!json.synced) {
       const newScore = {
         id: json.id,
         firstName: json.firstName,
         nickName: json.nickName,
         lastName: json.lastName,
       }
       await syncScoreAPI(newScore).then((res) => {
         if (res) {
          json.synced = true
          //localStorage.setItem(`${userName}-profile`, JSON.stringify(json))
          set(`${userName}-profile`, JSON.stringify(json))
         }
       })
     }
  }
}

const deleteScoreAPI = async (scoreId) => {
  await API.graphql(graphqlOperation(deleteScore, {input: {id: scoreId}}))
}

const getGamesAPI = async () => {
  const result = await API.graphql(graphqlOperation(listGames, {limit: 1000}))
  return result.data.listGames.items
}

const deleteGameAPI = async (id) => {
  await API.graphql(graphqlOperation(deleteGame, {input: {id: id}}))
}

const addGameAPI = async (game) => {
  await API.graphql(graphqlOperation(createGame, {input: game}))
}

const syncGameAPI = async (id, gameOver) => {
  let rval = false
  try {
    const res = await API.graphql(graphqlOperation(updateGame, {input: {id: id, gameOver: gameOver}}))
    rval = true
  } catch {
  }
  return rval
}

const getGameAPI = async (id) => {
  try {
  const result = await API.graphql(graphqlOperation(getGame, {id: id}))
  return result.data.getGame
  } catch(error) {
    console.log(error)
    return null
  }
}

export {
  getItemsAPI, addItemAPI, deleteItemAPI, addCardAPI, syncCardAPI, getCardAPI, getNickNamesAPI, addNickNameAPI, deleteNickNameAPI,
  getScoreAPI, addScoreAPI, syncScoreAPI, getScoresAPI, deleteCardAPI, syncPendingItems, deleteScoreAPI, syncPendingScores, getCardByOwnerAPI,
  getGamesAPI, deleteGameAPI, addGameAPI, syncGameAPI, getGameAPI
}