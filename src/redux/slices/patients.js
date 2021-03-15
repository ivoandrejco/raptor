import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {restAPI} from '../../api/client'

const patientAPI = restAPI("http://localhost:8000/patients/")

export const fetchPatients = createAsyncThunk(
  'patients/fetchAllPatients',
  async (arg,thunkApi) => {
    console.log(`fetchPatients: ${arg}`)
    const resp = await patientAPI.fetchAll(arg); 
    return resp.data
   
  }
)

export const fetchPatient = createAsyncThunk(
  'patients/fetchPatient',
  async (arg,{rejectWithValue}) => {
    try {
      var resp = await patientAPI.fetch(arg)
      
      return resp.data
    } catch(err) {
        console.log(`Rsponse: ${JSON.stringify(resp)}`)
        console.log(`ERROR fetchPatient: ${JSON.stringify(err.response.data)}`)
        return rejectWithValue(err)
    }
  }
)

export const createPatient = createAsyncThunk(
  'patients/createPatient',
  async (arg,{rejectWithValue}) => {
    try {
      const resp = await patientAPI.create(arg)
      return resp.data
    } catch(err) {
        return rejectWithValue(err.response.data)
    }
  }
)

export const updatePatient = createAsyncThunk(
  'patients/updatePatient',
  async (arg,thunkApi) => {
    console.log(`updatePatient thunk: ${arg}`)
    const resp = await patientAPI.update(arg); 
    return resp.data
   
  }
)

export const deletePatient = createAsyncThunk(
  'patients/deletePatient',
  async (arg,thunkApi) => {
    const resp = await patientAPI.delete(arg); 
    return resp.data
   
  }
)

const patientsSlice = createSlice({
  name: "patients",
  initialState: {
    all: [],
    pulled: false,
    loading: false,
    error: null,
    activePatient: null,
    filter: null,
    search: null, 
  },
  reducers: {
    setActivePatient: (state, {payload}) => {
       // console.log(`setActivePatient: ${JSON.stringify(action.payload)}`)
        state.activePatient = payload
    },
    setSearch(state,{payload}) { state.search = payload},
    setFilter(state,{payload}) { state.filter = payload},
  },
  extraReducers: {
    [fetchPatient.fulfilled]:(state,action) => {
      console.log(`fetchPatient received: ${JSON.stringify(action)}`)
      state.activePatient = action.payload
    },
    [fetchPatient.rejected]: (state,action) => console.log(`fetchPatient rejected: ${JSON.stringify(action)}`),
    [fetchPatients.rejected]: (state,action) => { state.loading = false },
    [fetchPatients.pending]: (state,action) => { state.loading = true },
    [fetchPatients.fulfilled]: (state,{payload}) => {
      state.all     = payload
      state.loading = false
    },
    [createPatient.fulfilled]: (state,{payload}) => { 
      state.all.unshift(payload) 
      state.activePatient = payload
    },
    [createPatient.rejected]: (state, {payload}) => console.log(`createPatient failed: ${JSON.stringify(payload)}`),
    [updatePatient.fulfilled]: (state,action) => {
      //console.log(`updatePatient slice: ${JSON.stringify(action)}`)
      state.all.map( (p,i) => {if(p.id === action.payload.id) state.all[i] = action.payload} )
    },
    [deletePatient.fulfilled]: (state,action) => {
      state.all = state.all.filter( p => p.id !== action.meta.arg)
      state.activePatient = null
    }
  }
})

export const {setActivePatient,setSearch} = patientsSlice.actions

export default patientsSlice.reducer
