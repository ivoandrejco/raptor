import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {restAPI} from '../../api/client'
import { BASE_URL } from '../../config';

const client = restAPI(`${BASE_URL}/allergies/`)

export const fetchAllergiesByPid = createAsyncThunk(
  'allergies/fetchAllergiesByPid',
  async (pid,thunkApi) => {
    const resp = await client.fetchByPatientId(pid); 
    return resp.data  
  }
)
export const createAllergy = createAsyncThunk(
  'allergies/createAllergy',
  async (arg,thunkApi) => {
    const resp = await client.create(arg); 
    return resp.data
  }
)

export const updateAllergy = createAsyncThunk(
  'allergies/updateAllergy',
  async (arg,thunkApi) => {
    const resp = await client.update(arg); 
    return resp.data
  }
)

export const deleteAllergy = createAsyncThunk(
  'allergies/deleteAllergy',
  async (arg,thunkApi) => {
    const resp = await client.delete(arg.id); 
    return resp.data
  }
)

const allergiesSlice = createSlice({
  name: "allergies",
  initialState: {
    allByPid: {},
    pulled: false,
    loading: false,
    error: null,
    activeAllergy: {}
  },
  reducers: {
    setActiveAllergy: (state, action) => {
        console.log(`setActiveAllergy: ${JSON.stringify(action)}`)
        state.activeAllergy = action.payload
    }
  },
  extraReducers: {
    [fetchAllergiesByPid.rejected]: (state, action) => console.log(`fetchAllergiesByPid failed: ${JSON.stringify(action)}`),
    [fetchAllergiesByPid.fulfilled]: (state,{payload,meta}) => {
      console.log(`${JSON.stringify(payload)} - ${JSON.stringify(meta)}}`)  
      if(!state.allByPid[meta.arg]){
        state.allByPid[meta.arg] = payload
      }
    },
    [createAllergy.fulfilled]: (state,action) => {
      if(!state.allByPid[action.payload.pid]){
        state.allByPid[action.payload.pid] = []
      }
      state.allByPid[action.payload.pid].unshift(action.payload)
    },
    [updateAllergy.fulfilled]: (state,{payload}) => {
      console.log(`updateAllergy slice: ${JSON.stringify(payload)} + ${state.patients}`)
      state.allByPid[payload.pid].map( (p,i) => { if(p.id === payload.id) {state.allByPid[payload.pid][i] = payload; return payload}; return p } )
    },
    [deleteAllergy.fulfilled]: (state,action) => {
      state.allByPid[action.meta.arg.pid] = state.allByPid[action.meta.arg.pid].filter( p => p.id !== action.meta.arg.id)
    }
  }
})

export const {setActiveAllergy} = allergiesSlice.actions

export default allergiesSlice.reducer