import { combineReducers, createStore } from "redux";
import { reducerObject } from "./reducerObject";
import { reducerOwner } from "./reducerOwner";

const combineReducer = combineReducers({
  object: reducerObject,
  owner: reducerOwner,
});

export const store = createStore(combineReducer);

store.subscribe(() => {
  console.log(store.getState());
});
