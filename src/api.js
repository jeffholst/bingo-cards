import { v4 as uuidv4 } from 'uuid';
import { API, graphqlOperation} from 'aws-amplify'
//import { Item } from './models'
import { listItems, listCards, listNickNames, getScore, listScores, cardsByOwner } from './graphql/queries';
import { createItem, deleteItem, createCard, updateCard, deleteCard, createNickName, deleteNickName, createScore, updateScore, deleteScore} from './graphql/mutations'
import * as helper from "./helper"

const getItemsAPI = async () => {
  const result = await API.graphql(graphqlOperation(listItems, {limit: 1000}))
  return result.data.listItems.items
}

const addItemAPI = async (item) => {
  await API.graphql(graphqlOperation(createItem, {input: item}))
}

const deleteItemAPI = async (itemId) => {
  await API.graphql(graphqlOperation(deleteItem, {input: {id: itemId}}))
}

const addCardAPI = async (card) => {
  await API.graphql(graphqlOperation(createCard, {input: card}))
}

const syncCardAPI = async (id, selected) => {
  let rval = false
  try {
    const res = await API.graphql(graphqlOperation(updateCard, {input: {id: id, selected: selected, synced: true}}))
    rval = true
  } catch {
  }
  return rval
}

const getCardByOwnerAPI = async (owner) => {
  try {
    //const result = await API.graphql(graphqlOperation(cardsByOwner, {owner: owner, limit: 1000})) // limit should not be needed?
    const result = await API.graphql(graphqlOperation(cardsByOwner, {owner: owner}))
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
  const result = await API.graphql(graphqlOperation(getScore, {id: id}))
  return result.data.getScore
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
  const result = await API.graphql(graphqlOperation(listScores, {limit: 1000}))
  return result.data.listScores.items
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
          localStorage.setItem(userName, JSON.stringify(cardItems))
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
  const tmp = localStorage.getItem(`${userName}-profile`)
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
          localStorage.setItem(`${userName}-profile`, JSON.stringify(json))
         }
       })
     }
  }
}

const deleteScoreAPI = async (scoreId) => {
  await API.graphql(graphqlOperation(deleteScore, {input: {id: scoreId}}))
}

export {
  getItemsAPI, addItemAPI, deleteItemAPI, addCardAPI, syncCardAPI, getCardAPI, getNickNamesAPI, addNickNameAPI, deleteNickNameAPI,
  getScoreAPI, addScoreAPI, syncScoreAPI, getScoresAPI, deleteCardAPI, syncPendingItems, deleteScoreAPI, syncPendingScores, getCardByOwnerAPI
}