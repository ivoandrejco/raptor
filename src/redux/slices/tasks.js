import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {restAPI} from '../../api/client'
import { BASE_URL } from '../../config';

const client = restAPI(`${BASE_URL}/tasks/`)

export const fetchTasksByPid = createAsyncThunk(
  'tasks/fetchTasksByPid',
  async (pid,thunkApi) => {
    const resp = await client.fetchByPatientId(pid); 
    return resp.data  
  }
)

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (arg,{rejectWithValue}) => {
    try {
      const resp = await client.fetchAll(); 
      return resp.data
    } catch(err) {
      return rejectWithValue(err)
    }
  }
)

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (arg,thunkApi) => {
    const resp = await client.create(arg); 
    return resp.data
  }
)

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async (arg,{rejectWithValue}) => {
    try {
      const resp = await client.update(arg); 
      return resp.data
    } catch(err) {
      return rejectWithValue(err)
    }
  }
)

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (arg,thunkApi) => {
    const resp = await client.delete(arg.id); 
    return resp.data
  }
)

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    all: null,
    allByPid: {},
    pulled: false,
    loading: false,
    error: null,
    activeTask: {}
  },
  reducers: {
    setActiveTask: (state, action) => {
        console.log(`setActiveTask: ${JSON.stringify(action)}`)
        state.activeTask = action.payload
    }
  },
  extraReducers: {
    [fetchTasksByPid.rejected]: (state, action) => console.log(`fetchTasksByPid failed: ${JSON.stringify(action)}`),
    [fetchTasksByPid.fulfilled]: (state,{payload,meta}) => {
      console.log(`${JSON.stringify(payload)} - ${JSON.stringify(meta)}}`)  
      if(!state.allByPid[meta.arg]){
        state.allByPid[meta.arg] = payload
      }
    },
    [fetchTasks.rejected]: (state, {payload}) => console.error(`fetchTasks failed: ${JSON.stringify(payload.response.data)}`),
    [fetchTasks.fulfilled]: (state,{payload,meta}) => {
      console.log(`${JSON.stringify(payload)} - ${JSON.stringify(meta)}}`)  
      state.all = payload
    },
    [createTask.fulfilled]: (state,action) => {
      if(!state.allByPid[action.payload.pid]){
        state.allByPid[action.payload.pid] = []
      }
      state.allByPid[action.payload.pid].unshift(action.payload)
    },
    [updateTask.fulfilled]: (state,{payload}) => {
     // console.log(`updateTask slice: ${JSON.stringify(payload)} + ${state.patients}`)
      if(state.allByPid[payload.pid]){
        state.allByPid[payload.pid] = state.allByPid[payload.pid].map( (p) => { 
          if(p.id === payload.id) 
            return payload;  
          return p 
        })
      }
      
    },
    [updateTask.rejected]: (state,{payload}) => {
      console.error(JSON.stringify(payload))
    },
    [deleteTask.fulfilled]: (state,action) => {
      state.allByPid[action.meta.arg.pid] = state.allByPid[action.meta.arg.pid].filter( p => p.id !== action.meta.arg.id)
    }
  }
})

export const {setActiveTask} = tasksSlice.actions

export default tasksSlice.reducer