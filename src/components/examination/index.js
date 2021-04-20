import { useEffect, useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPlus, faPencilAlt } from '@fortawesome/free-solid-svg-icons'

import { ExaminationCreate, ExaminationUpdate } from './create'


export const ExaminationCreateContainer = () => {
  const [exams,setExams]  = useState()
  const {id}    = useParams()
  const consultations = useSelector( state => state.consultations.allByPid[id] )

  useEffect( () => {
    const _exams = []
    for(let i=0;i<consultations.length;i++){
      let c = consultations[i]
      let e = (c.examinations && c.examinations.length)?c.examinations[0]:undefined
      if( e )
        _exams.push(e)
    }
    setExams(_exams)
  },[id])

  return (
    <Row>
      <Col>
        <ExaminationCreate />
      </Col>
      <Col>
        <ExaminationList examinations={exams}/>
      </Col>
    </Row>
  )
}

export const ExaminationUpdateContainer = () => {
  const [exams,setExams]  = useState()
  const {id,eid}    = useParams()
  const consultations = useSelector( state => state.consultations.allByPid[id] )

  useEffect( () => {
    const _exams = []
    for(let i=0;i<consultations.length;i++){
      let c = consultations[i]
      let e = (c.examinations && c.examinations.length)?c.examinations[0]:undefined
      if( e && e.id != eid)
        _exams.push(e)
    }
    setExams(_exams)
  },[id,eid])

  return (
    <Row>
      <Col>
        <ExaminationUpdate />
      </Col>
      <Col>
        <ExaminationList examinations={exams}/>
      </Col>
    </Row>
  )
}


export const ExaminationList = ({examinations}) => {
  const {id}  = useParams()
  if(!examinations || !examinations.length) {
    return (
      <p>No examinations recorded</p>
    )
  }
  return (
    <>
    <h4>Examinations</h4>
    <Row style={{fontWeight:"bold"}}>
      <Col lg={3}>Collected</Col>
      <Col lg={2}>Height</Col>
      <Col lg={2}>Weight</Col>
      <Col>Pulse</Col>
      <Col>BP</Col>
    </Row>
     { 
       examinations.map( (e,i) => 
         <Link key={i} to={`/patients/patient/${id}/consultation/${e.consultation}/examination/${e.id}/update/`}>
         <Row>
         <Col lg={3}>{e.collected_on}</Col>
         <Col lg={2}>{e.height}</Col>
         <Col lg={2}>{e.weight}</Col>
         <Col>{e.pulse}</Col>
         <Col>{e.BP}</Col>
         </Row>
         </Link>
       )
     }
    </>
  )
}
