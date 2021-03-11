import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {restAPI} from '../../api/client'
import { BASE_URL } from '../../config';


const client = restAPI(`${BASE_URL}/medications/`)

//console.log(JSON.stringify(client))
export const fetchMedicationsByPid = createAsyncThunk(
  'medications/fetchMedicationsByPid',
  async (arg,thunkApi) => {
    const resp = await client.fetchAll(); 
    return resp.data  
  }
)
export const createMedication = createAsyncThunk(
  'medications/createMedication',
  async (arg,{rejectWithValue}) => {
    try {
      const resp = await client.create(arg); 
      return resp.data
    } catch(err) {
      return rejectWithValue(err)
    }
  }
)

export const updateMedication = createAsyncThunk(
  'medications/updateMedication',
  async (arg,thunkApi) => {
    const resp = await client.update(arg); 
    return resp.data
  }
)

export const deleteMedication = createAsyncThunk(
  'medications/deleteMedication',
  async (arg,thunkApi) => {
    const resp = await client.delete(arg.id); 
    return resp.data
  }
)

const medicationsSlice = createSlice({
  name: "medications",
  initialState: {
    allByPid: [],
    pulled: false,
    loading: false,
    changed: false,
    error: null,
    activeMedication: {}
  },
  reducers: {
    /*
    addNewMedication: {
      reducer: (state,action) => {
        console.log(`Reducer addNewMedication: ${JSON.stringify(action)}`)
        state.all.push(action.payload)
      },
      prepare: (payload) => {
        console.log(`Prepare addNewMedication: ${JSON.stringify(payload)}`)
        return {payload:{...payload,id: nanoid()}}
      }
    },*/
    setActiveMedication: (state, action) => {
        //console.log(`setActiveMedication: ${JSON.stringify(action)}`)
        state.activeMedication = action.payload
    }
  },
  extraReducers: {
    [fetchMedicationsByPid.fulfilled]: (state,{type,payload}) => {
      let cons = {}
      
      if(!state.pulled) {
        payload.map( con => {   
          if(!cons[con.pid]){
            cons[con.pid] = []
          //  alert(`${con.pid} \n\n\n ${JSON.stringify(cons)} -\n\n ${JSON.stringify(con)}`)
          }
          cons[con.pid].push(con)
          return con
        }) 
        state.allByPid = cons
      }
      state.pulled = true  
      state.changed = false 
    },
    [createMedication.fulfilled]: (state,action) => {
      if(!state.allByPid[action.payload.pid]){
        state.allByPid[action.payload.pid] = []
      }
      state.allByPid[action.payload.pid].push(action.payload)
      state.changed = true
    },
    [createMedication.rejected]: (state,{payload}) => {
      console.error(payload.response.data)
    },
    [updateMedication.fulfilled]: (state,{payload}) => {
      //console.log(`updateMedication slice: ${JSON.stringify(state.allByPid[payload.pid])}`)
      state.allByPid[payload.pid].map( (p,i) => { 
        if(p.id === payload.id) {
          state.allByPid[payload.pid][i] = payload
        }
        return state.allByPid[payload.pid][i]
      })
      state.activeMedication = payload
    },
    [deleteMedication.fulfilled]: (state,action) => {
      state.allByPid[action.meta.arg.pid] = state.allByPid[action.meta.arg.pid].filter( p => p.id !== action.meta.arg.id)
      if(state.activeMedication.id === action.meta.arg.id) {
        state.activeMedication = null
      }
    }
  }
})

export const {setActiveMedication} = medicationsSlice.actions

export default medicationsSlice.reducer