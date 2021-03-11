import { useState } from 'react'
import './App.css';

import {BrowserRouter as Router, Route,Switch, useHistory, useLocation} from 'react-router-dom'
import { Provider } from "react-redux";
import store from "./redux";


import Navigator from './Navigator'
import PatientsContainer from './containers/patients'
import { TemplatesContainer } from './containers/templates'
import { ConsultationsContainer } from './containers/consultations'
import BillingsContainer from './containers/billings'
import { TasksContainer } from './containers/tasks'

const App = () => {

  return (
    <Provider store={store}>
    <Router>
      <Navigator />
       
      <div style={{"margin":"15px"}}>
      <Switch>
          <Route path={`/patients/`}>
            <PatientsContainer />
          </Route>
          <Route path="/consultations/">
            <ConsultationsContainer />
          </Route>
          <Route path="/templates">
            <TemplatesContainer />
          </Route>
          <Route path="/billings">
            <BillingsContainer />
          </Route>
          <Route path="/tasks">
            <TasksContainer />
          </Route>
      </Switch>
      </div>
      
    </Router>
    </Provider>
  );
}

export default App;
