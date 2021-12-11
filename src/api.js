import { v4 as uuidv4 } from 'uuid';
import { API, graphqlOperation} from 'aws-amplify'
//import { Item } from './models'
import { listItems } from './graphql/queries';
import { createItem, deleteItem } from './graphql/mutations'


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

/* update a todo */
// await API.graphql(graphqlOperation(updateTodo, { input: { id: todoId, name: "Updated todo info" }}));


export {
  getItemsAPI, addItemAPI, deleteItemAPI
}