import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { SchemaAPI } from "../../api/client";

const client = SchemaAPI();

export const fetchSchemas = createAsyncThunk(
  "schemas/fetchSchemas",
  async (args, { rejectWithValue }) => {
    try {
      const resp = await client.fetch();
      return resp.data;
    } catch (e) {
      rejectWithValue(e);
    }
  }
);

export const getByKind = createAsyncThunk(
  "schemas/getByKind",
  async (kind, { rejectWithValue }) => {
    try {
      const resp = await client.fetchByKind(kind);
      return resp.data;
    } catch (e) {
      rejectWithValue(e);
    }
  }
);

export const createSchema = createAsyncThunk(
  "schemas/createSchema",
  async (arg, { rejectWithValue }) => {
    try {
      const resp = await client.create(arg);
      return resp.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const updateSchema = createAsyncThunk(
  "schemas/updateSchema",
  async (arg, { rejectWithValue }) => {
    try {
      const resp = await client.update(arg);
      return resp.data;
    } catch (e) {
      rejectWithValue(e);
    }
  }
);

export const deleteSchema = createAsyncThunk(
  "schemas/deleteSchema",
  async (arg, { rejectWithValue }) => {
    try {
      const resp = await client.delete(arg.id);
      return resp.data;
    } catch (e) {
      rejectWithValue(e);
    }
  }
);

const schemasSlice = createSlice({
  name: "schemas",
  initialState: {
    schemas: [],
    byKind: [],
    activeSchema: {},
  },
  reducers: {
    setActiveSchema: (state, { payload }) => {
      state.activeSchema = payload;
    },
  },
  extraReducers: {
    [fetchSchemas.rejected]: (state, { payload }) =>
      console.error(
        `fetchSchemas failed: ${JSON.stringify(payload.response.data)}`
      ),
    [fetchSchemas.fulfilled]: (state, { payload, meta }) => {
      state.schemas = payload;
    },
    [getByKind.rejected]: (state, { payload }) =>
      console.error(JSON.stringify(payload.response.data)),
    [getByKind.fulfilled]: (state, { payload, meta }) => {
      console.log(JSON.stringify(meta));
      state.byKind = payload;
    },
    [createSchema.rejected]: (state, { payload }) =>
      console.error(
        `createSchema failed: ${JSON.stringify(payload.response.data)}`
      ),
    [createSchema.fulfilled]: (state, { payload }) => {},
    [updateSchema.fulfilled]: (state, { payload }) => {
      state.schemas = state.schemas.map((p, i) => {
        if (p.id === payload.id) return payload;
        return p;
      });
    },
    [deleteSchema.fulfilled]: (state, { meta }) => {
      state.schemas = state.schemas.filter((p) => p.id !== meta.arg.id);
    },
  },
});

export const { setActiveSchema } = schemasSlice.actions;

export default schemasSlice.reducer;
