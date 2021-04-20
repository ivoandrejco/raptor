import { Route } from "react-router-dom";

import {
  SchemaList,
  SchemaView,
  SchemaCreate,
  SchemaUpdate,
} from "../components/schemas/create";

export const SchemasContainer = () => {
  return (
    <>
      <Route exact path="/schemas/schema/:id/">
        <SchemaView />
      </Route>
      <Route exact path="/schemas/schema/:id/update">
        <SchemaUpdate />
      </Route>
      <Route exact path="/schemas/create/">
        <SchemaCreate />
      </Route>
      <Route exact path="/schemas/">
        <SchemaList />
      </Route>
    </>
  );
};
