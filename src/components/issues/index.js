import { Fragment, useEffect, useState } from 'react'
import { Row, Col, Table, Modal, Button, Form } from 'react-bootstrap'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {unwrapResult} from '@reduxjs/toolkit'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'

import { IssueCreate, IssueUpdate } from './create'
import { fetchIssuesByCid, fetchIssue, deleteIssue, setActiveIssue } from '../../redux/slices/issues'
import { fetchTemplate, fetchTemplateByName } from '../../redux/slices/templates'
import { MsgBox } from '../utils'
import { fetchConsultation, fetchConsultationsByPid } from '../../redux/slices/consultations'


export const IssueSnippet = () => {
  const {id}      = useParams()
  const dispatch  = useDispatch() 
  const issues = useSelector(state => state.issues.allByPid[id])
  useEffect( () => {
    dispatch(fetchIssuesByCid(id))
  })

  return (
    <Fragment>
    <h5><Link to={`/patients/patient/${id}/issues/create/`}><FontAwesomeIcon icon={faPlus} size="sm" color="green" /></Link>&nbsp;Issues</h5>
    <IssueList issues={issues}/>
    </Fragment>
  )
}

export const IssueCreateContainer = () => {
  const location          = useLocation()
  const params            = new URLSearchParams(location.search)
  const issue             = params.get('issue')
  const dispatch          = useDispatch()
  
  
 
  return (
        <IssueCreate title={issue} />
  )
}

export const IssueUpdateContainer = () => {


  return (
        <IssueUpdate />
  )
}


export const IssueList = ({issues}) => {
  const dispatch  = useDispatch()
  
  if(!issues || !issues.length) {
    return (
      <p>No issues recorded</p>
    )
  }
  return (
    
    <Table size="sm" striped bordered responsive>
      <thead>
        <tr>
          <th>Title</th><th>Value</th>
        </tr>
      </thead>
      <tbody>
        {issues.map( (issue, i) => {
          
          return (
            <tr key={i}> 
              <td>
                <FontAwesomeIcon onClick={() => dispatch(deleteIssue(issue))} style={{cursor:"hand"}} icon={faTrash} color="red"/>{' '}
                <Link to={`/patients/patient/${issue.pid}/issues/update`} onClick={(e) => dispatch(setActiveIssue(issue))}>{issue.title}</Link>
              </td>
              <td>{issue.value}</td>
            </tr>
          )
        })}
      </tbody>
    </Table>
    
  )
}

export const IssueDialog = ({redirect}) => {
  const [show, setShow]   = useState(false);
  const [issue, setIssue] = useState("")
  const history           = useHistory()

  const handleClose   = () => setShow(false);
  
  const handleAdd     = () => {
    console.log(`added issue: ${issue}`)
    handleClose()
    history.push(`${redirect}?issue=${issue}`)
  }

  return (
    <>
      
      <FontAwesomeIcon icon={faPlus} onClick={() => setShow(true)} color="green"/>
      

      <Modal
        show={show}
        onHide={handleClose}
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Issue</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control as="input" id="issue" onChange={(e) => setIssue(e.target.value)}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAdd}>Add</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export const IssueDeleteDialog = ({issue,redirect}) => {
  const [ show, setShow ]   = useState(false)
  const dispatch            = useDispatch()
  const history             = useHistory()
  
  const handleDelete     = () => {
    dispatch(deleteIssue(issue)).then(unwrapResult)
    .then(data => {
      dispatch(fetchConsultation(issue.cid))
      setShow(false)
    })
    
  }

  return (
    <>
      
      <FontAwesomeIcon icon={faTrash} onClick={() => setShow(true)} color="red"/>
      

      <Modal
        show={show}
        onHide={ () => setShow(false) }
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Issue</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <strong>{issue.title}</strong>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={ () => setShow(false) }>
            Close
          </Button>
          <Button variant="primary" onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
