import { v4 as uuidv4 } from 'uuid';
import { API, graphqlOperation} from 'aws-amplify'
//import { Item } from './models'
import { listItems, listCards, listNickNames, getScore, listScores } from './graphql/queries';
import { createItem, deleteItem, createCard, updateCard, deleteCard, createNickName, deleteNickName, createScore, updateScore } from './graphql/mutations'

const debugNoNetwork = false; // true will simulate network error

const getItemsAPI = async () => {
  if (!debugNoNetwork) {
    const result = await API.graphql(graphqlOperation(listItems))
    return result.data.listItems.items
  }
  else return null
}

const addItemAPI = async (item) => {
  if (!debugNoNetwork) {
    await API.graphql(graphqlOperation(createItem, {input: item}))
  }
}

const deleteItemAPI = async (itemId) => {
  if (!debugNoNetwork) {
    await API.graphql(graphqlOperation(deleteItem, {input: {id: itemId}}))
  }
}

const addCardAPI = async (card) => {
  if (!debugNoNetwork) {
    await API.graphql(graphqlOperation(createCard, {input: card}))
  }
}

const syncCardAPI = async (id, selected) => {
  if (!debugNoNetwork) {
    await API.graphql(graphqlOperation(updateCard, {input: {id: id, selected: selected}}))
  }
}

const getCardAPI = async (owner) => {
  if (!debugNoNetwork) {
    const result = await API.graphql(graphqlOperation(listCards, {filter: {owner: {eq: owner}}}))
    return result.data.listCards.items
  }
  else return null
}

const getNickNamesAPI = async () => {
  if (!debugNoNetwork) {
    const result = await API.graphql(graphqlOperation(listNickNames))
    return result.data.listNickNames.items
  }
  else return null
}

const addNickNameAPI = async (item) => {
  if (!debugNoNetwork) {
    await API.graphql(graphqlOperation(createNickName, {input: item}))
  }
}

const deleteNickNameAPI = async (itemId) => {
  if (!debugNoNetwork) {
    await API.graphql(graphqlOperation(deleteNickName, {input: {id: itemId}}))
  }
}

const getScoreAPI = async (id) => {
  if (!debugNoNetwork) {
    const result = await API.graphql(graphqlOperation(getScore, {id: id}))
    return result.data.getScore
  }
  else return null
}

const addScoreAPI = async (score) => {
  if (!debugNoNetwork) {
    await API.graphql(graphqlOperation(createScore, {input: score}))
  }
}

const syncScoreAPI = async (score) => {
  if (!debugNoNetwork) {
    await API.graphql(graphqlOperation(updateScore, {input: score}))
  }
}

const getScoresAPI = async () => {
  if (!debugNoNetwork) {
    const result = await API.graphql(graphqlOperation(listScores))
    return result.data.listScores.items
  }
  else return null
}

const deleteCardAPI = async (itemId) => {
  if (!debugNoNetwork) {
    await API.graphql(graphqlOperation(deleteCard, {input: {id: itemId}}))
  }
}

/* update a todo */
// await API.graphql(graphqlOperation(updateTodo, { input: { id: todoId, name: "Updated todo info" }}));

export {
  getItemsAPI, addItemAPI, deleteItemAPI, addCardAPI, syncCardAPI, getCardAPI, getNickNamesAPI, addNickNameAPI, deleteNickNameAPI,
  getScoreAPI, addScoreAPI, syncScoreAPI, getScoresAPI, deleteCardAPI
}