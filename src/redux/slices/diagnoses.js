import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { API } from '../../api/client'
import { BASE_URL } from '../../config';

const client = API(`${BASE_URL}/diagnoses/`)

export const fetchDiagnosesByPid = createAsyncThunk(
  'diagnoses/fetchDiagnosesByPid',
  async (pid,thunkApi) => {
    const resp = await client.fetchByPatientId(pid); 
    return resp.data  
  }
)
export const createDiagnosis = createAsyncThunk(
  'diagnoses/createDiagnosis',
  async (arg,thunkApi) => {
    const resp = await client.create(arg); 
    return resp.data
  }
)

export const updateDiagnosis = createAsyncThunk(
  'diagnoses/updateDiagnosis',
  async (arg,thunkApi) => {
    const resp = await client.update(arg); 
    return resp.data
  }
)

export const deleteDiagnosis = createAsyncThunk(
  'diagnoses/deleteDiagnosis',
  async (arg,thunkApi) => {
    const resp = await client.delete(arg.id); 
    return resp.data
  }
)

const diagnosesSlice = createSlice({
  name: "diagnoses",
  initialState: {
    allByPid: {},
    pulled: false,
    loading: false,
    error: null,
    activeDiagnosis: {}
  },
  reducers: {
    setActiveDiagnosis: (state, action) => {
        console.log(`setActiveDiagnosis: ${JSON.stringify(action)}`)
        state.activeDiagnosis = action.payload
    }
  },
  extraReducers: {
    [fetchDiagnosesByPid.rejected]: (state, action) => console.log(`fetchDiagnosesByPid failed: ${JSON.stringify(action)}`),
    [fetchDiagnosesByPid.fulfilled]: (state,{payload,meta}) => {
      console.log(`${JSON.stringify(payload)} - ${JSON.stringify(meta)}}`)  
      if(!state.allByPid[meta.arg]){
        state.allByPid[meta.arg] = payload
      }
    },
    [createDiagnosis.fulfilled]: (state,action) => {
      if(!state.allByPid[action.payload.pid]){
        state.allByPid[action.payload.pid] = []
      }
      state.allByPid[action.payload.pid].unshift(action.payload)
    },
    [updateDiagnosis.fulfilled]: (state,{payload}) => {
      console.log(`updateDiagnosis slice: ${JSON.stringify(payload)} + ${state.patients}`)
      state.allByPid[payload.pid].map( (p,i) => { if(p.id === payload.id) {state.allByPid[payload.pid][i] = payload; return payload}; return p } )
    },
    [deleteDiagnosis.fulfilled]: (state,action) => {
      state.allByPid[action.meta.arg.pid] = state.allByPid[action.meta.arg.pid].filter( p => p.id !== action.meta.arg.id)
    }
  }
})

export const {setActiveDiagnosis} = diagnosesSlice.actions

export default diagnosesSlice.reducer