import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import { letterAPI } from '../../api/client'
import { BASE_URL } from '../../config';

const client = letterAPI(`${BASE_URL}/letters/`)

export const fetchLettersByCid = createAsyncThunk(
  'letters/fetchLettersByCid',
  async (id,thunkApi) => {
    const resp = await client.fetchByConsultationId(id); 
    return resp.data  
  }
)


export const fetchLetter = createAsyncThunk(
  'letters/fetchLetter',
  async (id,{rejectWithValue}) => {
    try {
      const resp = await client.fetch(id); 
      console.log('fetching letter')
      return resp.data
    } catch(err) {
      return rejectWithValue(err)
    }
  }
)

export const createLetter = createAsyncThunk(
  'letters/createLetter',
  async (arg,{rejectWithValue}) => {
    try {
      const resp = await client.create(arg); 
      return resp.data
    } catch(err) {
      return rejectWithValue(err)
    }
  }
)

export const updateLetter = createAsyncThunk(
  'letters/updateLetter',
  async (arg,{rejectWithValue}) => {
    try {
      const resp = await client.update(arg); 
      return resp.data
    } catch(err) {
      return rejectWithValue(err)
    }
  }
)

export const deleteLetter = createAsyncThunk(
  'letters/deleteLetter',
  async (arg,thunkApi) => {
    const resp = await client.delete(arg.id); 
    return resp.data
  }
)

const lettersSlice = createSlice({
  name: "letters",
  initialState: {
    allByCid: {},
    activeLetter: null,
  },
  reducers: {
    setActiveLetter: (state, action) => {
        console.log(`setActiveLetter: ${JSON.stringify(action)}`)
        state.activeLetter = action.payload
    }
  },
  extraReducers: {
    [fetchLettersByCid.rejected]: (state, action) => console.log(`fetchLettersByCid failed: ${JSON.stringify(action)}`),
    [fetchLettersByCid.fulfilled]: (state,{payload,meta}) => {
      state.allByCid[meta.arg] = payload
    },
    [fetchLetter.rejected]: (state, {payload}) => console.log(`fetchLetter failed: ${payload}`),
    [fetchLetter.fulfilled]: (state,{payload,meta}) => {
      console.log(`fetched letter: ${JSON.stringify(payload)}`)
      state.activeLetter = payload
    },
    [createLetter.fulfilled]: (state,{payload}) => {
      if(!state.allByCid[payload.cid]){
        state.allByCid[payload.cid] = []
      }
      state.activeLetter = payload
      state.allByCid[payload.cid].unshift(payload)
    },
    [createLetter.rejected]: (state,{payload}) => {
      console.error(JSON.stringify(payload))
    },
    [updateLetter.fulfilled]: (state,{payload}) => {
      console.log(`updateLetter slice: ${JSON.stringify(payload)}`)
      /*
      state.activeLetter = payload
      if(state.allByCid[payload.cid]) {
        state.allByCid[payload.cid] = state.allByCid[payload.cid].map( (p,i) => { 
          if(p.id === payload.id) {
            return payload; 
          }
          return p 
        })
      }*/
    },
    [updateLetter.rejected]: (state,{payload}) => {
      console.error(JSON.stringify(payload))
    },
   [deleteLetter.fulfilled]: (state,{meta}) => {
      state.activeLetter = null
      state.allByCid[meta.arg.cid] = state.allByCid[meta.arg.cid] && state.allByCid[meta.arg.cid].filter( p => p.id !== meta.arg.id)
    }
  }
})

export const {setActiveLetter} = lettersSlice.actions

export default lettersSlice.reducer