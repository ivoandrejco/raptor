import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {restAPI} from '../../api/client'
import {BASE_URL} from '../../config'

const client = restAPI(`${BASE_URL}/comorbidities/`)

export const fetchComorbiditiesByPid = createAsyncThunk(
  'comorbidities/fetchComorbiditiesByPid',
  async (arg,{rejectWithValue}) => {
    try {
      const resp = await client.fetchByPatientId(arg); 
      return resp.data  
    } catch (err) {
      rejectWithValue(err)
    }
  }
)
export const createComorbidity = createAsyncThunk(
  'comorbidities/createComorbidity',
  async (arg,{rejectWithValue}) => {
    try {
      const resp = await client.create(arg); 
      return resp.data
    } catch(err) {
      return rejectWithValue(err)
    }
  }
)

export const updateComorbidity = createAsyncThunk(
  'comorbidities/updateComorbidity',
  async (arg,thunkApi) => {
    const resp = await client.update(arg); 
    return resp.data
  }
)

export const deleteComorbidity = createAsyncThunk(
  'comorbidities/deleteComorbidity',
  async (arg,thunkApi) => {
    const resp = await client.delete(arg.id); 
    return resp.data
  }
)

const comorbiditiesSlice = createSlice({
  name: "comorbidities",
  initialState: {
    allByPid: {},
    pulled: false,
    loading: false,
    error: null,
    activeComorbidity: {}
  },
  reducers: {

    setActiveComorbidity: (state, {payload}) => {
        console.log(`setActiveComorbidity: ${JSON.stringify(payload)}`)
        state.activeComorbidity = payload
    }
  },
  extraReducers: {
    [fetchComorbiditiesByPid.fulfilled]: (state,{payload, meta}) => {
      if( !payload ) {
        state.allByPid[meta.arg] = []
      } else {
         state.allByPid[meta.arg] = payload
      }
    },
    [createComorbidity.rejected]: (state,{payload}) => console.log(`rejected ${payload}`),
    [createComorbidity.fulfilled]: (state,{payload}) => {
      if(!state.allByPid[payload.pid]){
        state.allByPid[payload.pid] = []
      }
      state.allByPid[payload.pid].push(payload)
    },
    [updateComorbidity.fulfilled]: (state,{type,payload}) => {
      console.log(`updateComorbidity slice: ${JSON.stringify(payload)}`)
      state.allByPid[payload.pid].map( (p,i) => { if(p.id === payload.id) {state.allByPid[payload.pid][i] = payload}; } )
      state.activeComorbidity = payload
    },
    [deleteComorbidity.rejected]: (state,action) => alert("ERROR: delete comorbidity"),
    [deleteComorbidity.fulfilled]: (state,action) => {
      state.allByPid[action.meta.arg.pid] = state.allByPid[action.meta.arg.pid].filter( p => p.id !== action.meta.arg.id)
    }
  }
})

export const {setActiveComorbidity} = comorbiditiesSlice.actions

export default comorbiditiesSlice.reducer