import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {templateAPI} from '../../api/client'
import { BASE_URL } from '../../config';

const clients = {
  issue:          templateAPI(`${BASE_URL}/templates/issues/`),
  investigation:  templateAPI(`${BASE_URL}/templates/investigations/`),
}

const getClient = c => clients[c] 

export const fetchTemplates = createAsyncThunk(
  'templates/fetchTemplates',
  async (arg,{rejectWithValue}) => {
    console.log(`fetching templas ; ${JSON.stringify(arg)}`)
    const keys = Reflect.ownKeys(arg)
    if(!keys.includes('kind')) {
      console.error(`fetchTemplates requires an object argument with field 'kind' assigned value: issue or investigation`)
      return null
    }
    try {
      const resp = await getClient(arg.kind).fetchAll(); 
      return resp.data
    } catch(err) {
      return rejectWithValue(err)
    }
  }
)

export const fetchTemplate = createAsyncThunk(
  'templates/fetchTemplate',
  async (arg,{rejectWithValue}) => {
    const keys = Reflect.ownKeys(arg)
    if(!keys.includes('kind') || !keys.includes('id')) {
      console.error(`fetchTemplates an object argument with fields 'kind' and 'id'`)
      return null
    }
    try {
      const resp = await getClient(arg.kind).fetch(arg.id); 
      return resp.data
    } catch(err) {
      return rejectWithValue(err)
    }
  }
)

export const fetchTemplateByName = createAsyncThunk(
  'templates/fetchTemplateByName',
  async (arg,{rejectWithValue}) => {
    const keys = Reflect.ownKeys(arg)
    if(!keys.includes('kind') || !keys.includes('title')) {
      console.error(`fetchTemplates an object argument with fields 'kind' and 'title'`)
    return null
    }
    try {
      const resp = await getClient(arg.kind).fetchTemplateByName(arg.title); 
      return resp.data
    } catch(err) {
      return rejectWithValue(err)
    }
  }
)
export const createTemplate = createAsyncThunk(
  'templates/createTemplate',
  async (arg,{rejectWithValue}) => {
    const keys = Reflect.ownKeys(arg)
    if(!keys.includes('kind') || !keys.includes('data')) {
      console.error(`createTemplate an object argument with fields 'kind' and 'data'`)
      return null
    }
    try {
      const resp = await getClient(arg.kind).create(arg.data); 
      return resp.data
    } catch(err) {
      return rejectWithValue(err)
    }
  }
)

export const updateTemplate = createAsyncThunk(
  'templates/updateTemplate',
  async (arg,{rejectWithValue}) => {
    const keys = Reflect.ownKeys(arg)
    if(!keys.includes('kind') || !keys.includes('data')) {
      console.error(`updateTemplate an object argument with fields 'kind' and 'data'`)
      return null
    }
    try {
      const resp = await getClient(arg.kind).update(arg.data); 
      return resp.data
    } catch(err) {
      return rejectWithValue(err)
    }
  }
)

export const deleteTemplate = createAsyncThunk(
  'templates/deleteTemplate',
  async (arg,{rejectWithValue}) => {
    const keys = Reflect.ownKeys(arg)
    if(!keys.includes('kind') || !keys.includes('data')) {
      console.error(`deleteTemplate an object argument with fields 'kind' and 'data'`)
      return null
    }
    try {
      const resp = await getClient(arg.kind).delete(arg.data.id); 
      return resp.data
    } catch(err) {
      return rejectWithValue(err)
    }
  }
)

const templatesSlice = createSlice({
  name: "templates",
  initialState: {
    loading: false,  
    activeTemplate: null,  
  },
  reducers: {
  },
  extraReducers: {
    [fetchTemplates.pending]: (state, action) => { state.loading = true },
    [fetchTemplates.rejected]: (state, action) => {console.log(`fetchTemplates failed: ${JSON.stringify(action)}`); state.loading = false },
    [fetchTemplates.fulfilled]: (state,{payload,meta}) => {
      console.log(`fetched templates: ${JSON.stringify(payload)} - ${JSON.stringify(meta)}}`)  
      //state.all = payload
      state.loading = false
    },
    [fetchTemplate.rejected]: (state, action) => console.log(`fetchTemplates failed: ${JSON.stringify(action)}`),
    [fetchTemplate.fulfilled]: (state,{payload,meta}) => {
      //console.log(`fetched template: ${JSON.stringify(payload)} - ${JSON.stringify(meta)}}`)  
      state.activeTemplate = payload
    },
    [fetchTemplateByName.rejected]: (state, action) => console.log(`fetchTemplateByName failed: ${JSON.stringify(action)}`),
    [fetchTemplateByName.fulfilled]: (state,{payload,meta}) => {
    //  console.log(`fetchTemplateByName slice: ${JSON.stringify(payload)} - ${JSON.stringify(meta)}}`)  
      if(payload instanceof Array && payload.length > 0)
        state.activeTemplate = payload[0]
      else 
        state.activeTemplate = null
    },
    [createTemplate.fulfilled]: (state,action) => {
     // state.all.unshift(action.payload)
    },
    [createTemplate.rejected]: (state,{payload}) => {
      console.error(payload.response.data)
    },
    [updateTemplate.fulfilled]: (state,{payload}) => {
      //state.all = state.all.map( p => p.id === payload.id?payload:p)
      //console.error(payload.response.data)
    },
    [updateTemplate.rejected]: (state,{payload}) => {
      console.error(payload.response.data)
    },
    [deleteTemplate.fulfilled]: (state,{meta}) => {
      //state.all = state.all.filter( p => p.id !== meta.arg.id)
      
    },
    [deleteTemplate.rejected]: (state,{payload}) => {
      //state.all = state.all.filter( p => p.id !== meta.arg.id)
      console.error(payload.response.data)
    }
  }
})

//export const {setActiveTemplate, setActiveJson, addTag, deleteTag} = templatesSlice.actions

export default templatesSlice.reducer