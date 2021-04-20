import { Fragment, useState, useEffect } from 'react'
import { Row, Col, Table } from 'react-bootstrap'
import { Link, useParams} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPlus, faPencilAlt } from '@fortawesome/free-solid-svg-icons'

import { DiagnosisCreate, DiagnosisUpdate } from './create'
import { fetchDiagnosesByPid, deleteDiagnosis, updateDiagnosis, setActiveDiagnosis } from '../../redux/slices/diagnoses'



export const DiagnosisSnippet = () => {
  const {id}      = useParams()
  const dispatch  = useDispatch() 
  const [diagnoses,setDiagnoses] = useState()

  useEffect( () => {
    dispatch(fetchDiagnosesByPid(id)).then(unwrapResult)
    .then(data => setDiagnoses(data))
    .catch(e => console.error(JSON.stringify(e)))
  },[id])
   
  return (
    <>
    <h5>
      <Link to={`/patients/patient/${id}/diagnoses/create/`}>
       <FontAwesomeIcon icon={faPlus} />&nbsp;Diagnoses
      </Link>
    </h5>
    <DiagnosisList diagnoses={diagnoses}/>
    <br />
    </>
  )
}

export const DiagnosisCreateContainer = () => {
  const {id}      = useParams()
  const dispatch  = useDispatch() 
  const [diagnoses,setDiagnoses] = useState()

  useEffect( () => {
    dispatch(fetchDiagnosesByPid(id)).then(unwrapResult)
    .then(data => setDiagnoses(data))
    .catch(e => console.error(JSON.stringify(e)))
  },[id])

  return (
    <Row>
      <Col>
        <DiagnosisCreate />
      </Col>
      <Col>
        <DiagnosisList diagnoses={diagnoses}/>
      </Col>
    </Row>
  )
}

export const DiagnosisUpdateContainer = () => {
  const {id}      = useParams()
  const diagnoses = useSelector(state => state.diagnoses.allByPid[id])

  return (
    <Row>
      <Col>
        <DiagnosisUpdate />
      </Col>
      <Col>
        <DiagnosisList diagnoses={diagnoses}/>
      </Col>
    </Row>
  )
}


export const DiagnosisList = ({diagnoses}) => {
  const dispatch  = useDispatch()
  
  if(!diagnoses || !diagnoses.length) {
    return (
      <p>No diagnoses recorded</p>
    )
  }
  return (
    
        diagnoses.map( (diagnosis, i) => {
          
          return (
            <Fragment key={i}>
            <h6> 
                <FontAwesomeIcon onClick={() => dispatch(deleteDiagnosis(diagnosis))} style={{cursor:"hand"}} icon={faTrash} color="red"/>{' '}
                <Link to={`/patients/patient/${diagnosis.pid}/diagnoses/${diagnosis.id}/update/`} onClick={(e) => dispatch(setActiveDiagnosis(diagnosis))}>
                {diagnosis.title} 
                </Link>
            </h6>
            <div dangerouslySetInnerHTML={{__html:diagnosis.description}} />
            </Fragment>
          )
        })
  )
}
