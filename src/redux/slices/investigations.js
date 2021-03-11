import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {issueAPI} from '../../api/client'
import { BASE_URL } from '../../config';

const client = issueAPI(`${BASE_URL}/investigations/`)

export const fetchInvestigationsByIssueID = createAsyncThunk(
  'investigations/fetchInvestigationsByIssueID',
  async (id,thunkApi) => {
    const resp = await client.fetchByIssueID(id); 
    return resp.data  
  }
)
export const fetchInvestigation = createAsyncThunk(
  'investigations/fetchInvestigation',
  async (id,thunkApi) => {
    const resp = await client.fetch(id); 
    return resp.data  
  }
)
export const createInvestigation = createAsyncThunk(
  'investigations/createInvestigation',
  async (arg,{rejectWithValue}) => {
    try {
      const resp = await client.create(arg); 
      return resp.data
    } catch(err) {
      return rejectWithValue(err)
    }
  }
)

export const updateInvestigation = createAsyncThunk(
  'investigations/updateInvestigation',
  async (arg,thunkApi) => {
    const resp = await client.update(arg); 
    return resp.data
  }
)

export const deleteInvestigation = createAsyncThunk(
  'investigations/deleteInvestigation',
  async (arg,thunkApi) => {
    const resp = await client.delete(arg.id); 
    return resp.data
  }
)

const investigationsSlice = createSlice({
  name: "investigations",
  initialState: {
    allByIid: {},
    loading: false,
    error: null,
    activeInvestigation: {},
    template_value: null
  },
  reducers: {
    setActiveInvestigation: (state, {payload}) => {
        console.log(`setActiveInvestigation: ${JSON.stringify(payload)}`)
        state.activeInvestigation = payload
    },
    setTemplateValue: (state, action) => {
      console.log(`setTemplateValue: ${JSON.stringify(action)}`)
      state.template_value = action.payload
  }
  },
  extraReducers: {
    [fetchInvestigationsByIssueID.pending]:   (state, action) => console.log('loading investigations'),
    [fetchInvestigationsByIssueID.rejected]:  (state, action) => console.log(`fetchInvestigationsByIssueID failed: ${JSON.stringify(action)}`),
    [fetchInvestigationsByIssueID.fulfilled]: (state,{payload,meta}) => {
      state.allByIid[meta.arg] = payload
    },
    [fetchInvestigation.rejected]:  (state, action) => console.log(`fetchInvestigation failed: ${JSON.stringify(action)}`),
    [fetchInvestigation.fulfilled]: (state,{payload,meta}) => {
      state.activeInvestigation = payload
    },
    [createInvestigation.fulfilled]: (state,{payload}) => {
      if(!state.allByIid[payload.iid]){
        state.allByIid[payload.iid] = []
      }
      state.allByIid[payload.iid].unshift(payload)
    },
    [createInvestigation.rejected]: (state,{payload}) => { console.error(payload) },
    [updateInvestigation.fulfilled]: (state,{payload}) => {
      console.log(`updateInvestigation slice: ${JSON.stringify(payload)} + ${state.patients}`)
      state.activeInvestigation = payload
      //state.allByIid[payload.iid] = state.allByIid[payload.iid].map( p => { if(p.id === payload.id)return payload; return p } )
    },
    [deleteInvestigation.fulfilled]: (state,{meta}) => {
      state.allByIid[meta.arg.iid] = state.allByIid[meta.arg.iid].filter( p => p.id !== meta.arg.id)
    }
  }
})

export const {setActiveInvestigation, setTemplateValue} = investigationsSlice.actions

export default investigationsSlice.reducer