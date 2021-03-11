import React, { Fragment, useState, useEffect } from 'react'
import { Table} from 'react-bootstrap'

import { Route, Link, useHistory, useParams } from 'react-router-dom'
import { connect, useDispatch, useSelector} from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'

import { ConfirmDialog } from '../components/utils'

import { fetchPatients,deletePatient} from '../redux/slices/patients'

import { PatientCreate} from '../components/patients/create'
import { PatientPage} from '../components/patients'

const PatientsList = ({patients}) => {
  const dispatch  = useDispatch()
  const loading   = useSelector(state => state.patients.loading)

  if(loading)
    return (<span>Loading patients ...</span>)

  return (
   patients ? ( <React.Fragment>
      <h1>Patients ({patients.length})</h1>
      <Table size="sm" striped bordered responsive>
      <thead>
        <tr>
          <th>Name</th><th>Birthday</th><th>Gender</th><th>Last Visit</th><th>Tasks</th>
        </tr>
      </thead>
      <tbody>
        {patients && patients.map( (patient, i) => {
          const link = `/patients/patient/${patient.id}/`
          return (
            <tr key={i}> 
              <td>
                <Link to={`/patients/patient/${patient.id}/update/`}><FontAwesomeIcon icon={faPencilAlt} color="green" /></Link>
                &nbsp;
                <ConfirmDialog title="Delete Patient" body={`${patient.fname} ${patient.lname}`} handleConfirm={ () => dispatch(deletePatient(patient.id)) } />
                &nbsp;
                <Link to={link}>{patient.fname} {patient.lname}</Link>
              </td>
              <td>{patient.dob}</td>
              <td>{patient.gender}</td>
              <td>{new Date(patient.last_visit).toLocaleDateString()}</td>
              <td>nil</td>
              
            </tr>
          )
        }

        )}
      </tbody>
      </Table>
    </React.Fragment>) : (
      <h4>No patients found</h4>
    )
  )
}



const PatientsContainer = () => {
  const [patients,setPatients]  = useState()
  const dispatch  = useDispatch()
  const history   = useHistory()
  const search    = useSelector(state => state.search.filter)
  
  const _search   = search ? `?search=${search}` : "" 
  
  //setPatients()
  
  useEffect( () => dispatch(fetchPatients(_search)).then(unwrapResult)
                    .then( data => {  
                      console.log(`fetched patients: ${JSON.stringify(data)}`)
                      if(data.length === 1)
                        history.push(`/patients/patient/${data[0].id}/`)
                      else if(data.length === 0)
                        history.push(`/patients/create/`)  
                      setPatients(data)
                    })
                    .catch( e => console.error(e) ),
            [search])

  return (
    <Fragment>
      <Route path="/patients/patient/:id">
        <PatientPage />
      </Route>
      <Route exact path="/patients/create/">
        <PatientCreate />
      </Route>
      <Route exact path="/patients/" >
        <PatientsList patients={patients} />
      </Route>
    </Fragment>
  )
}

export default PatientsContainer