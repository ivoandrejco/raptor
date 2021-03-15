import { Fragment, useEffect } from 'react'
import { Row, Col, Table } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPlus, faPencilAlt } from '@fortawesome/free-solid-svg-icons'

import { ConsultationCreate, ConsultationUpdate } from './create'
import { ExaminationCreate } from '../examination/create'
import { fetchConsultationsByPid, deleteConsultation, setActiveConsultation } from '../../redux/slices/consultations'
import { setActiveIssue } from '../../redux/slices/issues'
import { IssueDeleteDialog, IssueDialog } from '../issues'
import { setActiveLetter, deleteLetter } from '../../redux/slices/letters'


export const ConsultationSnippet = () => {
  const {id}          = useParams()
  const dispatch      = useDispatch() 
  const consultations = useSelector(state => state.consultations.allByPid[id])
  useEffect( () => {
    dispatch(fetchConsultationsByPid(id))
  },[dispatch])

  return (
    <Fragment>
    <h5><Link to={`/patients/patient/${id}/consultations/create/`}><FontAwesomeIcon icon={faPlus} size="sm" color="green" /></Link>&nbsp;Consultations</h5>
    <ConsultationList consultations={consultations}/>
    </Fragment>
  )
}

export const ConsultationCreateContainer = () => {
  const {id}          = useParams()
  const consultations = useSelector(state => state.consultations.allByPid[id])

  return (
    <Row>
      <Col>
        <ConsultationCreate />
      </Col>
      <Col>
        <ExaminationCreate />
      </Col>
    </Row>
  )
}

export const ConsultationUpdateContainer = () => {
  const {id}          = useParams()
  const consultations = useSelector(state => state.consultations.allByPid[id])

  return (
    <Row>
      <Col>
        <ConsultationUpdate />
      </Col>
      <Col>
        <ConsultationList consultations={consultations}/>
      </Col>
    </Row>
  )
}


export const ConsultationList = ({consultations}) => {
  const dispatch  = useDispatch()
  
  
  if(!consultations || !consultations.length) {
    return (
      <p>No consultations recorded</p>
    )
  }
  return (
    
    <Table size="sm" striped bordered responsive>
      <tbody>
        {consultations.map( (consultation, i) => {
          
          return (
          <Fragment key={i}>  
            <tr key={i+300} style={{background:"#efefef"}}> 
              <td colSpan={2}>
                <FontAwesomeIcon onClick={() => dispatch(deleteConsultation(consultation))} style={{cursor:"hand"}} icon={faTrash} color="red"/>{' '}
                <Link to={`/patients/patient/${consultation.pid.id}/consultations/${consultation.id}/update`} >
                {new Date(consultation.created_on).toLocaleString()}
                </Link>
              </td>
              <td colSpan={1}>
                <strong>Code: </strong>{consultation.code}
              </td>
            </tr>
            <tr key={i+100}>
              <td width={"35%"}>
                <strong>
                  <IssueDialog redirect={`/patients/patient/${consultation.pid.id}/consultation/${consultation.id}/issue/create/`} />{' '}Issue(s)
                </strong>
                <ul className="list-unstyled">
                
                  { 
                    consultation.issues.map( (issue,i) => {
                      return (
                        <li key={i}>
                          <Link to={`/patients/patient/${consultation.pid.id}/consultation/${consultation.id}/issue/${issue.id}/update/`} >
                          <FontAwesomeIcon onClick={()=>dispatch(setActiveIssue(issue))} icon={faPencilAlt} color="green"/>&nbsp;
                          </Link>
                          <IssueDeleteDialog issue={issue} />&nbsp;
                          
                          {issue.title}
                        </li>
                      )
                    })
                  }
                </ul>
               
              </td>
              <td width={"34%"}>
                <strong>
                Investigations(s)
                </strong>
                <ul className="list-unstyled">
                  { 
                    consultation.issues.map( (issue,j) => {
                   
                      return (
                        <Row key={j} >
                          { !issue.investigations.length &&
                          <Col lg={1}>
                          <Link to={`/patients/patient/${consultation.pid.id}/${consultation.id}/${issue.id}/investigation/create/?name=${issue.title}`} >
                          <FontAwesomeIcon icon={faPlus} color="green"/>
                          </Link>
                          </Col>
                          }
                          <Col>
                            {  
                              issue.investigations.map( (invx,i) => {
                                return (
                                <div key={i}>
                                  <Link to={`/patients/patient/${consultation.pid.id}/${consultation.id}/${issue.id}/investigation/${invx.id}/update/`} >
                                  <FontAwesomeIcon icon={faPencilAlt} color="green"/>{''}
                                  
                                  {' '}{invx.title}
                                  </Link>
                                </div>
                                )
                              })
                            }
                          </Col>
                        </Row>  
                      )
                    })
                  }
                </ul>
              </td>
              <td>
              <strong>
                <Link to={`/patients/patient/${consultation.pid.id}/consultation/${consultation.id}/letter/create/preview/`} >
                  <FontAwesomeIcon icon={faPlus} color="green"/>
                </Link>
                &nbsp;Letter(s)
              </strong>
                  { consultation.letters.map( (letter,i) => {
                    return (
                      <div key={i}> 
                      
                        <Link to={`/patients/patient/${consultation.pid.id}/consultation/${consultation.id}/letter/${letter.id}/update/`}>
                          <FontAwesomeIcon icon={faPencilAlt} color="green"/>
                        </Link>{' '}
                        
                          <FontAwesomeIcon onClick={(e) => dispatch(deleteLetter(letter))} icon={faTrash} color="red"/>
                        {' '}
                        <Link onClick={() => dispatch(setActiveLetter(letter))} to={`/patients/patient/${consultation.pid.id}/consultation/${consultation.id}/letter/${letter.id}`}>    
                          {letter.title}
                        </Link>
                      
                      </div>
                    )
                  })}
              </td>
            </tr>
          </Fragment>
          )
        })}
      </tbody>  
    </Table>
    
  )
}
