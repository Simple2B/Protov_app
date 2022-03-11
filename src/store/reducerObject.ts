const initialState = "";

export const reducerObject = (state: string = initialState, action: any) => {
  if (action.type === "ADD_OBJECT_STATUS") {
    state = action.payload;
  }

  return state;
};
