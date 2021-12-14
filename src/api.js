import { v4 as uuidv4 } from 'uuid';
import { API, graphqlOperation} from 'aws-amplify'
//import { Item } from './models'
import { listItems, listCards } from './graphql/queries';
import { createItem, deleteItem, createCard, updateCard } from './graphql/mutations'


const getItemsAPI = async () => {
  //const result = await API.graphql(graphqlOperation(listItems))
  const result = await API.graphql(graphqlOperation(listItems))
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
  await API.graphql(graphqlOperation(updateCard, {input: {id: id, selected: selected}}))
}

const getCardAPI = async (owner) => {
  const result = await API.graphql(graphqlOperation(listCards, {filter: {owner: {eq: owner}}}))
  return result.data.listCards.items
}

/* update a todo */
// await API.graphql(graphqlOperation(updateTodo, { input: { id: todoId, name: "Updated todo info" }}));


export {
  getItemsAPI, addItemAPI, deleteItemAPI, addCardAPI, syncCardAPI, getCardAPI
}