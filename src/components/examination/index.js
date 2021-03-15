import { Fragment, useEffect } from 'react'
import { Row, Col, Table } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPlus, faPencilAlt } from '@fortawesome/free-solid-svg-icons'

import { ExaminationCreate, ExaminationUpdate } from './create'
//import { fetchExaminationsByPid, deleteExamination, setActiveExamination } from '../../redux/slices/examinations'

export const ExaminationSnippet = () => {
  const {id}          = useParams()
  const dispatch      = useDispatch() 
//  const examinations = useSelector(state => state.examinations.allByPid[id])
  useEffect( () => {
  //  dispatch(fetchExaminationsByPid(id))
  },[id])

  return (
    <Fragment>
    <h5><Link to={`/patients/patient/${id}/examinations/create/`}><FontAwesomeIcon icon={faPlus} size="sm" color="green" /></Link>&nbsp;Examinations</h5>
    <ExaminationList />
    </Fragment>
  )
}

export const ExaminationCreateContainer = () => {
  const {id}          = useParams()
 // const examinations = useSelector(state => state.examinations.allByPid[id])

  return (
    <Row>
      <Col>
        <ExaminationCreate />
      </Col>
      <Col>
        <ExaminationList />
      </Col>
    </Row>
  )
}

export const ExaminationUpdateContainer = () => {
  const {id}          = useParams()
//  const examinations = useSelector(state => state.examinations.allByPid[id])

  return (
    <Row>
      <Col>
        <ExaminationUpdate />
      </Col>
      <Col>
        <ExaminationList />
      </Col>
    </Row>
  )
}


export const ExaminationList = ({examinations}) => {
  const dispatch  = useDispatch()
  
  
  if(!examinations || !examinations.length) {
    return (
      <p>No examinations recorded</p>
    )
  }
  return (
   <>Examination List</> 
  )
}
