import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {restAPI} from '../../api/client'
import { BASE_URL } from '../../config';

const client = restAPI(`${BASE_URL}/examinations/`)

export const fetchExamination = createAsyncThunk(
  'examinations/fetchExamination',
  async (id, {rejectWithValue}) => {
    try {
      const resp = await client.fetchExamination(id); 
      return resp.data  
    } catch(e) {
      return rejectWithValue(e)
    }
  }
)
export const createExamination = createAsyncThunk(
  'examinations/createExamination',
  async (arg,{rejectWithValue}) => {
    try {
      const resp = await client.create(arg); 
      return resp.data
    } catch(e){
      return rejectWithValue(e)
    }
  }
)

export const updateExamination = createAsyncThunk(
  'examinations/updateExamination',
  async (arg,thunkApi) => {
    const resp = await client.update(arg); 
    return resp.data
  }
)

export const deleteExamination = createAsyncThunk(
  'examinations/deleteExamination',
  async (arg,thunkApi) => {
    const resp = await client.delete(arg.id); 
    return resp.data
  }
)

const examinationsSlice = createSlice({
  name: "examinations",
  initialState: {
    loading: false,
  },
  reducers: {
    setActiveExamination: (state, action) => {
        console.log(`setActiveExamination: ${JSON.stringify(action)}`)
        state.activeExamination = action.payload
    }
  },
  extraReducers: {
    [fetchExamination.rejected]: (state, {payload}) => console.error(`fetchExamination failed: ${JSON.stringify(payload.response.data)}`),
    [fetchExamination.fulfilled]: (state,{payload,meta}) => {
      console.log(`${JSON.stringify(payload)} - ${JSON.stringify(meta)}}`)  
    },
    [createExamination.fulfilled]: (state,action) => {},
    [createExamination.rejected]: (state,{payload}) => { console.error(JSON.stringify(payload.response.data)) },
    [updateExamination.fulfilled]: (state,{payload}) => {
      console.log(`updateExamination slice: ${JSON.stringify(payload)} + ${state.patients}`)
      state.allByPid[payload.pid].map( (p,i) => { if(p.id === payload.id) {state.allByPid[payload.pid][i] = payload; return payload}; return p } )
    },
    [deleteExamination.fulfilled]: (state,action) => {
      state.allByPid[action.meta.arg.pid] = state.allByPid[action.meta.arg.pid].filter( p => p.id !== action.meta.arg.id)
    }
  }
})

export const {setActiveExamination} = examinationsSlice.actions

export default examinationsSlice.reducer
