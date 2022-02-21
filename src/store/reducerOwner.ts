const initialState = "";

export const reducerOwner = (state: string = initialState, action: any) => {
  if (action.type === "ADD_OWNER_STATUS") {
    state = action.payload;
  }

  return state;
};
