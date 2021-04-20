import {createSlice, createAsyncThunk, isRejectedWithValue} from '@reduxjs/toolkit'
import {restAPI} from '../../api/client'

const claimsAPI         = restAPI("http://127.0.0.1:8000/billings/claims/")
const claimsPaidClient  = restAPI("http://127.0.0.1:8000/billings/claimspaid/")
const pnClient          = restAPI("http://127.0.0.1:8000/providernumbers/")

export const fetchClaims = createAsyncThunk(
  'billings/fetchClaims',
  async (arg,thunkApi) => {
    const resp = await claimsAPI.fetchAll(); 
    return resp.data
   
  }
)

export const fetchClaimsPaid = createAsyncThunk(
  'billings/fetchClaimsPaid',
  async (arg,thunkApi) => {
    const resp = await claimsPaidClient.fetchAll(); 
    return resp.data
   
  }
)



export const fetchProviderNumbers = createAsyncThunk(
  'billings/fetchProviderNumbers',
  async (arg,thunkApi) => {
    const resp = await pnClient.fetchAll(); 
    return resp.data
  }
)

export const fetchProviders = createAsyncThunk(
  'billings/fetchProviderNumbers',
  async (arg,{rejectWithValue}) => {
    try {
      const resp = await pnClient.fetchAll(); 
      return resp.data
    } catch(e) {
      rejectWithValue(e.response.data)
    }
  }
)


export const createClaim = createAsyncThunk(
  'billings/createClaim',
  async (arg,{rejectWithValue}) => {
    try {
      const resp = await claimsAPI.create(arg)
      return resp.data
    } catch(err) {
      return rejectWithValue(err.response.data)
    }
  }
)

export const createClaimPaid = createAsyncThunk(
  'billings/createClaimPaid',
  async (arg,{rejectWithValue}) => {
    try {
      const resp = await claimsPaidClient.create(arg)
      return resp.data
    } catch(err) {
      return rejectWithValue(err.response.data)
    }
  }
)

export const updateBilling = createAsyncThunk(
  'billings/updateBilling',
  async (arg,thunkApi) => {
    const resp = await claimsAPI.update(arg); 
    return resp.data
   
  }
)

export const deleteClaim = createAsyncThunk(
  'billings/deleteClaim',
  async (arg,{rejectWithValue}) => {
    const resp = await claimsAPI.delete(arg.id); 
    return resp.data
  }
)

const billingsSlice = createSlice({
  name: "billings",
  initialState: {
    claims: [],
    claimsPaid: [],
    providerNumbers: [],
    providers: [],
    claimsPulled: false,
    claimsPaidPulled: false,
    providerNumbersPulled: false,
    loading: false,
  },
  extraReducers: {
    [fetchClaims.pending]: (state,action) => {
      state.loading = true;
    },
    [fetchClaims.fulfilled]: (state,{payload}) => {
      if(!state.claimsPulled)
        state.claims.push(...payload)
      state.claimsPulled = true  
      state.loading = false
    },
    [fetchClaimsPaid.fulfilled]: (state,action) => {
      if(!state.claimsPaidPulled)
        state.claimsPaid.push(...action.payload)
      state.claimsPaidPulled = true  
    },
    [fetchProviderNumbers.fulfilled]: (state,{payload}) => {
      if(!state.providerNumbersPulled)
        state.providerNumbers.push(...payload)
      state.providerNumbersPulled = true  
    },
    [fetchProviderNumbers.rejected]: (state,action) => {
      console.log(`fetchProviderNumbers rejected: ${JSON.stringify(action.error)}`)
    },
    [fetchProviders.fulfilled]: (state,{payload}) => {
      state.providers = payload.map( p => ({value: p.id, name: `${p.doctor} ${p.practice}`}) )
    },
    [fetchProviders.rejected]: (state,{payload}) => {
      console.error(`fetchProviders rejected: ${JSON.stringify(payload.response.data)}`)
    },
    [createClaim.fulfilled]: (state,{payload}) => {
      state.claims.unshift(payload)
      state.success = `The claim for ${payload.fname} ${payload.lname} created successfully`
      
    },
    [createClaim.rejected]: (state,{meta,payload}) => {
      state.error = `The claim for ${meta.arg.fname} ${meta.arg.lname} could not be deleted. ERROR: ${payload}`
    },
    [createClaimPaid.fulfilled]: (state,{payload}) => {
      state.claimsPaid.unshift(payload)
    },
    [createClaimPaid.rejected]: (state,{payload}) => {
      console.log(`createClaimPaid error: ${JSON.stringify(payload)}`)
    },
 
    [updateBilling.fulfilled]: (state,action) => {
      //console.log(`updateBilling slice: ${JSON.stringify(action)}`)
      state.claims.map( (p,i) => { if(p.id === action.payload.id) {state.claims[i] = action.payload} })
    },
    [deleteClaim.fulfilled]: (state,{meta}) => {
      state.claims  = state.claims.filter( p => p.id !== meta.arg.id)
      state.success = `The claim for ${meta.arg.fname} ${meta.arg.lname} deleted successfully`
    },
    [deleteClaim.rejected]: (state,{payload,meta}) => {
      state.error = `The claim for ${meta.arg.fname} ${meta.arg.lname} could not be deleted. ERROR: ${payload}`
    },
  }
})

export const {setActiveBilling} = billingsSlice.actions

export default billingsSlice.reducer
