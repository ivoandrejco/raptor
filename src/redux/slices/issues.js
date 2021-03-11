import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {issueAPI} from '../../api/client'
import { BASE_URL } from '../../config';

const client = issueAPI(`${BASE_URL}/issues/`)

export const fetchIssuesByCid = createAsyncThunk(
  'issues/fetchIssuesByCid',
  async (id,thunkApi) => {
    const resp = await client.fetchByConsultationId(id); 
    return resp.data  
  }
)

export const fetchIssue = createAsyncThunk(
  'issues/fetchIssue',
  async (id,thunkApi) => {
    const resp = await client.fetch(id); 
    return resp.data  
  }
)

export const createIssue = createAsyncThunk(
  'issues/createIssue',
  async (arg,{rejectWithValue}) => {
    try {
      const resp = await client.create(arg); 
      return resp.data
    } catch(err) {
      return rejectWithValue(err)
    }
  }
)

export const updateIssue = createAsyncThunk(
  'issues/updateIssue',
  async (arg,thunkApi) => {
    const resp = await client.update(arg); 
    return resp.data
  }
)

export const deleteIssue = createAsyncThunk(
  'issues/deleteIssue',
  async (arg,thunkApi) => {
    const resp = await client.delete(arg.id); 
    return resp.data
  }
)

const issuesSlice = createSlice({
  name: "issues",
  initialState: {
    allByCid: {},
    pulled: false,
    loading: false,
    error: null,
    activeIssue: {},
    activeIssueValues: {},
    template_value: null
  },
  reducers: {
    setActiveIssue: (state, {payload}) => {
        console.log(`setActiveIssue: ${JSON.stringify(payload)}`)
        state.activeIssue = payload
    },
    setTemplateValue: (state, action) => {
      console.log(`setTemplateValue: ${JSON.stringify(action)}`)
      state.template_value = action.payload
  }
  },
  extraReducers: {
    [fetchIssuesByCid.rejected]: (state, action) => console.log(`fetchIssuesByCid failed: ${JSON.stringify(action)}`),
    [fetchIssuesByCid.fulfilled]: (state,{payload,meta}) => {
      state.allByCid[meta.arg] = payload
    },
    [fetchIssue.pending]:   (state,{payload}) => { state.loading = true },
    [fetchIssue.fulfilled]: (state,{payload}) => { state.activeIssue = payload; state.loading = false },
    [fetchIssue.rejected]:  (state,{payload}) => { console.error(payload) },

    [createIssue.fulfilled]: (state,action) => {
      //if(!state.allByCid[action.payload.cid]){
      //  state.allByCid[action.payload.cid] = []
      //}
      //state.allByCid[action.payload.cid].unshift(action.payload)
    },
    [updateIssue.fulfilled]: (state,{payload}) => {
    //  console.log(`updateIssue slice: ${JSON.stringify(payload)}`)
      state.activeIssue = payload
      //state.allByCid[payload.cid] = state.allByCid[payload.cid].map( p => { if(p.id === payload.id)return payload; return p } )
    },
    [deleteIssue.fulfilled]: (state,action) => {
      //state.allByCid[action.meta.arg.cid] = state.allByCid[action.meta.arg.cid].filter( p => p.id !== action.meta.arg.id)
    }
  }
})

export const {setActiveIssue, setTemplateValue} = issuesSlice.actions

export default issuesSlice.reducer