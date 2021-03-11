import React, { Fragment, useEffect } from 'react'
import {Container, Col,Row} from 'react-bootstrap'
import {Route,Link,useParams} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'


import {PatientUpdate} from './create';

import { 
  AllergySnippet, 
  AllergyCreateContainer, 
  AllergyUpdateContainer } 
  from '../allergies'

import { 
  ComorbiditySnippet, 
  ComorbidityCreateContainer, 
  ComorbidityUpdateContainer 
} from '../comorbidities'

import {
  MedicationSnippet,
  MedicationCreateContainer,
  MedicationUpdateContainer
} from '../medications'

import {
  TaskSnippet,
  TaskCreateContainer,
  TaskUpdateContainer
} from '../tasks'

import {
  ConsultationSnippet,
  ConsultationCreateContainer,
  ConsultationUpdateContainer
} from '../consultations'

import {
  SocialHxSnippet,
  SocialHxCreate,
  SocialHxUpdate,
} from '../socialhx'

import {
  IssueCreateContainer,
  IssueUpdateContainer
} from '../issues'

import {
  LetterView, 
  LetterCreateContainer,
  LetterUpdateContainer
} from '../letters'
import {LetterCreatePreview } from '../letters/create'

import {
  DiagnosisSnippet,
  DiagnosisCreateContainer,
  DiagnosisUpdateContainer
} from '../diagnoses'

import { 
  InvestigationCreateContainer,
  InvestigationUpdateContainer,
} from '../investigations';

import { fetchPatient } from '../../redux/slices/patients'
import { fetchConsultationsByPid } from '../../redux/slices/consultations'
import { fetchMedicationsByPid } from '../../redux/slices/medications'
import { fetchComorbiditiesByPid } from '../../redux/slices/comorbidities'
import { fetchAllergiesByPid } from '../../redux/slices/allergies'
import { fetchSocialHxByPid } from '../../redux/slices/socialhx'
import { fetchDiagnosesByPid } from '../../redux/slices/diagnoses'

import { getAge } from '../utils'
import { fetchLetter } from '../../redux/slices/letters';
import { unwrapResult } from '@reduxjs/toolkit';


export const PatientView = () => {
  const {id}        = useParams()
  const allergies   = useSelector(state => state.allergies.allByPid[id])
  const tasks       = useSelector(state => state.tasks.allByPid[id])
  const medications = useSelector(state => state.medications.allByPid[id])
  const diagnoses   = useSelector(state => state.diagnoses.allByPid[id])
  return (
    <Row>
      <Col>
        <DiagnosisSnippet diagnoses={diagnoses}/>
        <ConsultationSnippet />
        <TaskSnippet tasks={tasks} />
      </Col>
      <Col>
      <ComorbiditySnippet />  
        <MedicationSnippet medications={medications} />  
        <AllergySnippet allergies={allergies} />    
        <SocialHxSnippet />   
      </Col>
    </Row>
  )
}

export const PatientPage = () => {
  const {id,lid}      = useParams()  
  const dispatch      = useDispatch()
  const patient       = useSelector( state => state.patients.activePatient)
  
  useEffect( () => {
    dispatch(fetchPatient(id)).then(unwrapResult)
    .then( p => {
      dispatch(fetchConsultationsByPid(p.id))
      dispatch(fetchMedicationsByPid(p.id))
      dispatch(fetchAllergiesByPid(p.id))
      dispatch(fetchComorbiditiesByPid(p.id))
      dispatch(fetchSocialHxByPid(p.id))
      dispatch(fetchDiagnosesByPid(p.id))
      //if(lid)
        //dispatch(fetchLetter(lid))
    })
    .catch( e => console.error(e) )

  }, [id] )

    
  return (
    patient ? (<Container>
      <h3>
      <Link to={`/patients/patient/${patient.id}/update/`}><FontAwesomeIcon icon={faPencilAlt} color="green" /></Link>
      &nbsp;{patient.fname} {patient.lname} :: {patient.gender} :: {getAge(patient.dob)} years :: {new Date(patient.dob).toLocaleDateString()}
      </h3>
      <hr />
      <Route exact path="/patients/patient/:id/diagnoses/create/">
        <DiagnosisCreateContainer />
      </Route>
      <Route exact path="/patients/patient/:id/diagnoses/:did/update/">
        <DiagnosisUpdateContainer />
      </Route>
      <Route exact path="/patients/patient/:id/diagnoses/:did/investigations/create">
      </Route>
      <Route exact path="/patients/patient/:id/diagnoses/:did/investigations/create">
      </Route>
      <Route exact path="/patients/patient/:id/socialhx">
        <SocialHxCreate />
      </Route>
      <Route exact path="/patients/patient/:id/socialhx/:sid/update">
        <SocialHxUpdate />
      </Route>
      <Route exact path="/patients/patient/:id/consultations/create/">
        <ConsultationCreateContainer />
      </Route>
      <Route exact path="/patients/patient/:id/consultations/:cid/update/">
        <ConsultationUpdateContainer />
      </Route>
      <Route exact path="/patients/patient/:id/:cid/:iid/investigation/create/">
        <InvestigationCreateContainer />
      </Route>
      <Route exact path="/patients/patient/:id/:cid/:iid/investigation/:inid/update/">
        <InvestigationUpdateContainer />
      </Route>
      <Route exact path="/patients/patient/:id/consultation/:cid/issue/create/">
        <IssueCreateContainer />
      </Route>
      <Route exact path="/patients/patient/:id/consultation/:cid/issue/:iid/update/">
        <IssueUpdateContainer />
      </Route>
      <Route exact path="/patients/patient/:id/consultation/:cid/letter/create/preview/">
        <LetterCreatePreview />
      </Route>
      <Route exact path="/patients/patient/:id/consultation/:cid/letter/:lid/create/">
        <LetterCreateContainer />
      </Route>
      <Route exact path="/patients/patient/:id/consultation/:cid/letter/:lid/update/">
        <LetterUpdateContainer />
      </Route>
      <Route exact path="/patients/patient/:id/consultation/:cid/letter/:lid/">
        <LetterView />
      </Route>
      <Route exact path="/patients/patient/:id/medications/create/">
        <MedicationCreateContainer />
      </Route>
      <Route exact path="/patients/patient/:id/medications/update/">
        <MedicationUpdateContainer />
      </Route>
      <Route exact path="/patients/patient/:id/comorbidities/create/">
        <ComorbidityCreateContainer />
      </Route>
      <Route exact path="/patients/patient/:id/comorbidities/update/">
        <ComorbidityUpdateContainer />
      </Route>

      <Route exact path="/patients/patient/:id/allergies/update/">
        <AllergyUpdateContainer />
      </Route>
      <Route exact path="/patients/patient/:id/allergies/create/">
        <AllergyCreateContainer />
      </Route>
      
      <Route exact path="/patients/patient/:id/tasks/:taskid/update/">
        <TaskUpdateContainer />
      </Route>
      <Route exact path="/patients/patient/:id/tasks/create/">
        <TaskCreateContainer />
      </Route>

      <Route exact path="/patients/patient/:id/update/">
        <PatientUpdate patient={patient}/>
      </Route>
      <Route exact path="/patients/patient/:id/">
        <PatientView patient={patient}/>
      </Route>
    </Container>) : (
      <Container>Patient does not exist</Container>
    )
  )
}

