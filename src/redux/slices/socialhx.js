import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import { socialHxAPI } from '../../api/client'
import { BASE_URL } from '../../config';

const client = socialHxAPI(`${BASE_URL}/socialhx/`)

export const fetchSocialHxByPid = createAsyncThunk(
  'socialhx/fetchSocialHxByPid',
  async (pid,thunkApi) => {
    const resp = await client.fetchByPatientId(pid); 
    return resp.data  
  }
)

export const fetchSocialHx = createAsyncThunk(
  'socialhx/fetchSocialHx',
  async (pid,thunkApi) => {
    const resp = await client.fetch(pid); 
    return resp.data  
  }
)

export const createSocialHx = createAsyncThunk(
  'socialhx/createSocialHx',
  async (arg,thunkApi) => {
    const resp = await client.create(arg); 
    return resp.data
  }
)

export const updateSocialHx = createAsyncThunk(
  'socialhx/updateSocialHx',
  async (arg,thunkApi) => {
    const resp = await client.update(arg); 
    return resp.data
  }
)

export const deleteSocialHx = createAsyncThunk(
  'socialhx/deleteSocialHx',
  async (arg,thunkApi) => {
    const resp = await client.delete(arg.id); 
    return resp.data
  }
)

const socialhxSlice = createSlice({
  name: "socialhx",
  initialState: {
    allByPid: {},
    loading: false,
    activeSocialHx: null
  },
  reducers: {
    setActiveSocialHx: (state, {payload}) => {
        console.log(`setActiveSocialhx: ${JSON.stringify(payload)}`)
        state.activeSocialHx = payload
    }
  },
  extraReducers: {
   
    [fetchSocialHxByPid.fulfilled]: (state,{payload}) => {
     // console.log(JSON.stringify(payload))
      if(payload instanceof Array && payload.length > 0) {
        state.activeSocialHx = payload[0]
        state.allByPid[payload.pid] = payload[0]
      } else {
        console.log('No socialhx received')
        state.activeSocialHx = null
      }
      
      
       
    },
    [fetchSocialHx.fulfilled]: (state,{payload}) => {
      console.log(JSON.stringify(payload))
      state.activeSocialHx = payload
        
     },
    [createSocialHx.fulfilled]: (state,{payload}) => {
    //  alert(JSON.stringify(action))
      state.allByPid[payload.pid] = payload
      state.activeSocialHx = payload
    },
    [updateSocialHx.fulfilled]: (state,{payload}) => {
      console.log(`updateSocialhx slice: ${JSON.stringify(payload)}`)
      state.allByPid[payload.pid] = payload
      state.activeSocialHx = payload
    },
    [deleteSocialHx.fulfilled]: (state,{meta}) => {
      delete state.allByPid[meta.arg.pid] 
      state.activeSocialHx = null
    }
  }
})

export const {setActiveSocialhx} = socialhxSlice.actions

export default socialhxSlice.reducer