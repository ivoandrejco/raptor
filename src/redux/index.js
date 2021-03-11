import {combineReducers} from 'redux'
import {configureStore} from '@reduxjs/toolkit'
import thunk from 'redux-thunk'

import patientsReducer from './slices/patients'
import consultationsReducer from './slices/consultations'
import medicationsReducer from './slices/medications'
import allergiesReducer from './slices/allergies'
import comorbiditiesReducer from './slices/comorbidities'
import socialhxReducer from './slices/socialhx'
import billingsReducer from './slices/billings'
import tasksReducer from './slices/tasks'
import templatesReducer from './slices/templates'
import lettersReducer from './slices/letters'
import issuesReducer from './slices/issues'
import diagnosesReducer from './slices/diagnoses'
import investigationsReducer from './slices/investigations'
import searchReducer from './slices/search'


//export default combineReducers({patients, medications, comorbidities, allergies})
const rootReducer = combineReducers({
  patients: patientsReducer,
  consultations: consultationsReducer,
  allergies: allergiesReducer,
  comorbidities: comorbiditiesReducer,
  medications: medicationsReducer,
  socialhx: socialhxReducer,
  billings: billingsReducer,
  tasks: tasksReducer,
  templates: templatesReducer,
  letters: lettersReducer,
  issues: issuesReducer,
  diagnoses: diagnosesReducer,
  investigations: investigationsReducer,
  search: searchReducer
})

export default configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk)
})