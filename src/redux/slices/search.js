import { createSlice } from '@reduxjs/toolkit'

const searchSlice = createSlice({
  name: "search",
  initialState: {
    filter: null, 
  },
  reducers: {
    setFilter(state,{payload}) { state.filter = payload },
  },
})

export const { setFilter } = searchSlice.actions

export default searchSlice.reducer