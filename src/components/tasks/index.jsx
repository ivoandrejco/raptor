import { Fragment, useEffect, useState } from 'react'
import { Row, Col, Table } from 'react-bootstrap'
import {Link, useParams} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPlus, faTimesCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons'

import { TaskCreate, TaskUpdate } from './create'
import { fetchTasksByPid, updateTask, deleteTask, setActiveTask } from '../../redux/slices/tasks'
import { unwrapResult } from '@reduxjs/toolkit'



export const TaskSnippet = ({tasks}) => {
  const {id}      = useParams()
  const dispatch  = useDispatch() 

  useEffect( () => {
    dispatch(fetchTasksByPid(id))
  })

  return (
    <Fragment>
    <h5><Link to={`/patients/patient/${id}/tasks/create/`}><FontAwesomeIcon icon={faPlus} size="sm" color="green" /></Link>&nbsp;Tasks</h5>
    <TaskList tasks={tasks}/>
    </Fragment>
  )
}

export const TaskCreateContainer = () => {
  const {id}      = useParams()
  const tasks     = useSelector(state => state.tasks.allByPid[id])

  return (
    <Row>
      <Col>
        <TaskCreate />
      </Col>
      <Col>
        <TaskList tasks={tasks}/>
      </Col>
    </Row>
  )
}

export const TaskUpdateContainer = () => {
  const {id}      = useParams()
  const tasks     = useSelector(state => state.tasks.allByPid[id])

  return (
    <Row>
      <Col>
        <TaskUpdate />
      </Col>
      <Col>
        <TaskList tasks={tasks}/>
      </Col>
    </Row>
  )
}


export const TaskList = ({tasks,showPatient}) => {
  const dispatch  = useDispatch()

  if(!tasks || !tasks.length) {
    return (
      <p>No tasks recorded</p>
    )
  }
  return (
    
    <Table size="sm" striped bordered responsive>
      <thead>
        <tr>
          { showPatient ? <th>Patient</th> : null}
          <th>Task name</th><th>Status</th><th>Update on</th><th>Created on</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map( (task, i) => {
          
          return (
            <tr key={i}> 
              { showPatient ? <td><Link to={`/patients/patient/${task.pid.id}`}>{task.pid.name}</Link></td> : null}
              <td>
                <FontAwesomeIcon onClick={() => dispatch(deleteTask(task))} style={{cursor:"hand"}} icon={faTrash} color="red"/>{' '}
                <Link to={`/patients/patient/${task.pid}/tasks/${task.id}/update`} onClick={(e) => dispatch(setActiveTask(task))}>{task.name}</Link>
              </td>
              <td>
                <FontAwesomeIcon 
                  onClick={() => dispatch(updateTask({...task,status:task.status==='Pending'?'Completed':'Pending'}))} 
                  style={{cursor:"hand"}} icon={task.status==='Pending'?faTimesCircle:faCheckCircle} 
                  color={task.status==='Pending'?'red':'green'}/>
                  
              </td>
              <td>{task.updated_on  }</td>
              <td>{task.created_on  }</td>
            </tr>
          )
        })}
      </tbody>
    </Table>
    
  )
}