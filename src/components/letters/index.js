import { Fragment, useEffect, useState } from 'react'
import { Row, Col, Table, Modal, Button, Form } from 'react-bootstrap'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'

import { LetterCreate, LetterUpdate } from './create'
import { fetchLettersByCid, fetchLetter, deleteLetter, setActiveLetter } from '../../redux/slices/letters'
import { fetchSocialHxByPid } from '../../redux/slices/socialhx'
import { fetchConsultation } from '../../redux/slices/consultations'
import { unwrapResult } from '@reduxjs/toolkit'


export const LetterSnippet = () => {
  const {id}      = useParams()
  const dispatch  = useDispatch() 
  const letters   = useSelector(state => state.letters.allByCid[id])
  useEffect( () => {
    dispatch(fetchLettersByCid(id))
  })

  return (
    <Fragment>
    <h5><Link to={`/patients/patient/${id}/letters/create/`}><FontAwesomeIcon icon={faPlus} size="sm" color="green" /></Link>&nbsp;Letters</h5>
    <LetterList letters={letters}/>
    </Fragment>
  )
}

export const LetterView = () => {

  const {id,cid,lid}    = useParams()
  const dispatch        = useDispatch() 
  const location        = useLocation()
  const next            = location.pathname
  const letter          = useSelector(state => state.letters.activeLetter)
  
  useEffect( () => {
    dispatch(fetchLetter(lid))
  },[lid] )
  

  return (
    <Fragment>
    
    <div style={{width: "595px"}} dangerouslySetInnerHTML={{__html:letter.content}} />
    <hr/ >
    <Link to={`/patients/patient/${id}/consultation/${cid}/letter/${lid}/update?next=${next}`}><Button variant="primary">Update</Button></Link>&nbsp;
    <Link to={`/patients/patient/${id}/`}><Button variant="primary">Close</Button></Link>
    </Fragment>
  )
}


export const LetterCreateContainer = () => {
 // const letters     = useSelector(state => state.letters.allByCid[id])
  const {id,cid}      = useParams()
  const dispatch      = useDispatch()

  useEffect( () => {
    dispatch(fetchConsultation(cid))
    dispatch(fetchSocialHxByPid(id))
  },[id,cid])

  return (
    <Row>
      <Col>
        <LetterCreate />
      </Col>
 
    </Row>
  )
}

export const LetterUpdateContainer = () => {
  const {id}        = useParams()
  const letters     = useSelector(state => state.letters.allByCid[id])
  
  return (
    <Row>
      <Col>
        <LetterUpdate />
      </Col>
      <Col>
        <LetterList letters={letters}/>
      </Col>
    </Row>
  )
}


export const LetterList = ({letters}) => {
  const dispatch  = useDispatch()
  
  if(!letters || !letters.length) {
    return (
      <p>No letters recorded</p>
    )
  }
  return (
    
    <Table size="sm" striped bordered responsive>
      <thead>
        <tr>
          <th>Created on</th><th>Title</th>
        </tr>
      </thead>
      <tbody>
        {letters.map( (letter, i) => {
          
          return (
            <tr key={i}> 
              <td>
                <FontAwesomeIcon onClick={() => dispatch(deleteLetter(letter))} style={{cursor:"hand"}} icon={faTrash} color="red"/>{' '}
                <Link to={`/patients/patient/${letter.pid}/letters/update`} onClick={(e) => dispatch(setActiveLetter(letter))}>{letter.created_on}</Link>
              </td>
              <td>{letter.title}</td>
            </tr>
          )
        })}
      </tbody>
    </Table>
    
  )
}

export const LetterDialog = ({redirect}) => {
  const [show, setShow]     = useState(false);
  const [letter, setLetter] = useState({})
  const history             = useHistory()

  const handleClose   = () => setShow(false);
  
  const handleAdd     = () => {
    console.log(`added letter: ${letter}`)
    handleClose()
    history.push(`${redirect}?letter=${letter}`)
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
          <Modal.Title>Add Letter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control as="input" id="letter" onChange={(e) => setLetter(e.target.value)}/>
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
