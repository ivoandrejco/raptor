import { Fragment, useEffect } from 'react'
import { Row, Col, Table } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPlus, faPencilAlt } from '@fortawesome/free-solid-svg-icons'

import { ExaminationCreate, ExaminationUpdate } from './create'
import { fetchExaminationsByPid, deleteExamination, setActiveExamination } from '../../redux/slices/examinations'
import { setActiveIssue } from '../../redux/slices/issues'
import { IssueDeleteDialog, IssueDialog } from '../issues'
import { setActiveLetter, deleteLetter } from '../../redux/slices/letters'


export const ExaminationSnippet = () => {
  const {id}          = useParams()
  const dispatch      = useDispatch() 
  const examinations = useSelector(state => state.examinations.allByPid[id])
  useEffect( () => {
    dispatch(fetchExaminationsByPid(id))
  },[dispatch])

  return (
    <Fragment>
    <h5><Link to={`/patients/patient/${id}/examinations/create/`}><FontAwesomeIcon icon={faPlus} size="sm" color="green" /></Link>&nbsp;Examinations</h5>
    <ExaminationList examinations={examinations}/>
    </Fragment>
  )
}

export const ExaminationCreateContainer = () => {
  const {id}          = useParams()
  const examinations = useSelector(state => state.examinations.allByPid[id])

  return (
    <Row>
      <Col>
        <ExaminationCreate />
      </Col>
      <Col>
        <ExaminationList examinations={examinations}/>
      </Col>
    </Row>
  )
}

export const ExaminationUpdateContainer = () => {
  const {id}          = useParams()
  const examinations = useSelector(state => state.examinations.allByPid[id])

  return (
    <Row>
      <Col>
        <ExaminationUpdate />
      </Col>
      <Col>
        <ExaminationList examinations={examinations}/>
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
    
    <Table size="sm" striped bordered responsive>
      <tbody>
        {examinations.map( (examination, i) => {
          
          return (
          <Fragment key={i}>  
            <tr key={i+300} style={{background:"#efefef"}}> 
              <td colSpan={2}>
                <FontAwesomeIcon onClick={() => dispatch(deleteExamination(examination))} style={{cursor:"hand"}} icon={faTrash} color="red"/>{' '}
                <Link to={`/patients/patient/${examination.pid.id}/examinations/${examination.id}/update`} >
                {new Date(examination.created_on).toLocaleString()}
                </Link>
              </td>
              <td colSpan={1}>
                <strong>Code: </strong>{examination.code}
              </td>
            </tr>
            <tr key={i+100}>
              <td width={"35%"}>
                <strong>
                  <IssueDialog redirect={`/patients/patient/${examination.pid.id}/examination/${examination.id}/issue/create/`} />{' '}Issue(s)
                </strong>
                <ul className="list-unstyled">
                
                  { 
                    examination.issues.map( (issue,i) => {
                      return (
                        <li key={i}>
                          <Link to={`/patients/patient/${examination.pid.id}/examination/${examination.id}/issue/${issue.id}/update/`} >
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
                    examination.issues.map( (issue,j) => {
                   
                      return (
                        <Row key={j} >
                          { !issue.investigations.length &&
                          <Col lg={1}>
                          <Link to={`/patients/patient/${examination.pid.id}/${examination.id}/${issue.id}/investigation/create/?name=${issue.title}`} >
                          <FontAwesomeIcon icon={faPlus} color="green"/>
                          </Link>
                          </Col>
                          }
                          <Col>
                            {  
                              issue.investigations.map( (invx,i) => {
                                return (
                                <div key={i}>
                                  <Link to={`/patients/patient/${examination.pid.id}/${examination.id}/${issue.id}/investigation/${invx.id}/update/`} >
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
                <Link to={`/patients/patient/${examination.pid.id}/examination/${examination.id}/letter/create/preview/`} >
                  <FontAwesomeIcon icon={faPlus} color="green"/>
                </Link>
                &nbsp;Letter(s)
              </strong>
                  { examination.letters.map( (letter,i) => {
                    return (
                      <div key={i}> 
                      
                        <Link to={`/patients/patient/${examination.pid.id}/examination/${examination.id}/letter/${letter.id}/update/`}>
                          <FontAwesomeIcon icon={faPencilAlt} color="green"/>
                        </Link>{' '}
                        
                          <FontAwesomeIcon onClick={(e) => dispatch(deleteLetter(letter))} icon={faTrash} color="red"/>
                        {' '}
                        <Link onClick={() => dispatch(setActiveLetter(letter))} to={`/patients/patient/${examination.pid.id}/examination/${examination.id}/letter/${letter.id}`}>    
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
