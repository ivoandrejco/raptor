import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {restAPI} from '../../api/client'
import {BASE_URL} from '../../config'

const consultationAPI = restAPI(`${BASE_URL}/consultations/`)
export const fetchConsultationsByPid = createAsyncThunk(
  'consultations/fetchConsultationsByPid',
  async (arg,thunkApi) => {
    const resp = await consultationAPI.fetchByPatientId(arg); 
    return resp.data
   
  }
)
export const fetchConsultations = createAsyncThunk(
  'consultations/fetchConsultations',
  async (arg,thunkApi) => {
    const resp = await consultationAPI.fetchAll(); 
    return resp.data
   
  }
)

export const fetchConsultation = createAsyncThunk(
  'consultations/fetchConsultation',
  async (arg,thunkApi) => {
    const resp = await consultationAPI.fetch(arg); 
    return resp.data
   
  }
)

export const createConsultation = createAsyncThunk(
  'consultations/createConsultation',
  async (arg,{rejectWithValue}) => {
    try {
      const resp = await consultationAPI.create(arg); 
      return resp.data
    } catch(err) {
      return rejectWithValue(err)
    }
  }
)

export const updateConsultation = createAsyncThunk(
  'consultations/updateConsultation',
  async (arg,{rejectWithValue}) => {
    try {
      const resp = await consultationAPI.update(arg); 
      return resp.data
    } catch(err) {
      return rejectWithValue(err)
    }
  }
)

export const deleteConsultation = createAsyncThunk(
  'consultations/deleteConsultation',
  async (arg,thunkApi) => {
    const resp = await consultationAPI.delete(arg.id); 
    return resp.data
   
  }
)

const consultationsSlice = createSlice({
  name: "consultations",
  initialState: {
    all: [],
    allByPid: {},
    pulled: false,
    loading: false,
    error: null,
    activeConsultation: null
  },
  reducers: {

    setActiveConsultation: (state, action) => {
        //console.log(`setActiveConsultation: ${JSON.stringify(action)}`)
        state.activeConsultation = action.payload
    }
  },
  extraReducers: {
    [fetchConsultationsByPid.fulfilled]: (state,{payload,meta}) => {
      state.allByPid[meta.arg] = payload
    },
    [fetchConsultation.fulfilled]: (state,{payload,meta}) => {
      state.allByPid[payload.pid.id] = state.allByPid[payload.pid.id].map( c => {
        if(c.id === payload.id)
          return payload
        return c
      })
      state.activeConsultation = payload
    },
    [fetchConsultations.pending]: (state, action) => { state.loading = true },
    [fetchConsultations.fulfilled]: (state,{payload,meta}) => {
      state.all     = payload
      state.loading = false
    },
    [createConsultation.fulfilled]: (state,{payload}) => {
      if(!state.allByPid[payload.pid.id]){
        state.allByPid[payload.pid.id] = []
      }
      state.activeConsultation = payload
      state.all.unshift(payload)
      state.allByPid[payload.pid.id].push(payload)
    },
    [createConsultation.rejected]: (state,{payload}) => { console.error(payload) },
    [updateConsultation.fulfilled]: (state,{payload}) => {
      state.allByPid[payload.pid.id] = state.allByPid[payload.pid.id].map( c => {
        if(c.id === payload.id)
          return payload
        return c
      })
      state.all = state.all.map( c => {
        if(c.id === payload.id)
          return payload
        return c
      })
      state.activeConsultation = payload
    },
    [updateConsultation.rejected]: (state,{payload}) => {
      console.error(payload.response.data)
    },
    [deleteConsultation.fulfilled]: (state,{meta}) => {
      if(state.allByPid[meta.arg.pid.id])
        state.allByPid[meta.arg.pid.id] = state.allByPid[meta.arg.pid.id].filter( p => p.id !== meta.arg.id)
      state.all = state.all.filter( p => p.id !== meta.arg.id)
    }
  }
})

export const {setActiveConsultation} = consultationsSlice.actions

export default consultationsSlice.reducer