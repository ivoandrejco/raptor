
import {Fragment, useEffect, useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {unwrapResult} from '@reduxjs/toolkit'
import {useFormik} from 'formik'
import * as Yup from 'yup'

import {createTask, updateTask} from '../../redux/slices/tasks'
import {GenericForm, getCreateButtons, getUpdateButtons} from '../form'
import { MsgBox } from '../utils'

// FIELDS
const fields = {
  name:     { type: 'input',  label: 'Task Name' },
  status:   { type: 'select',  label: "Task Status", options: [
    {value: null, name: 'Select Status'},
    {value: "Pending", name: "Pending"},
    {value: "Completed", name: "Completed"}
  ]},
}

const initialValues = {
  name:  "", 
  status:  "Pending", 
}

const validationSchema = Yup.object({
  name:  Yup.string().required(),
  status:  Yup.string().required(),
})


export const TaskCreate = () => {
  const [msg,setMsg]  = useState([])
  const {id}          = useParams()
  const dispatch      = useDispatch()
  const history       = useHistory()
  
  const formik        = useFormik({
    initialValues:    initialValues,
    validationSchema: validationSchema,
    enableReinitialize: true,
  })

    // EVENT HANDLERS
    const handleSubmit = (values) => { values['pid'] = id; return dispatch(createTask(values)).then(unwrapResult) }
    const handleClose = (href=`/patients/patient/${id}/`) => {
      history.push(href)
    }
  
  // BUTTON onCLICK HANDLERS
  const buttons       = getCreateButtons()
  buttons.close.onClick = (e) => handleClose()  
  buttons.save_close.onClick = (e) => {
    handleSubmit(formik.values)
    .then( data => handleClose())
    .catch( err => setMsg(["danger", `Failed to create new task: ${JSON.stringify(err)}`]))
  }
  buttons.save_continue.onClick = (e) => {
    handleSubmit(formik.values)
    .then( data => {
      setMsg(["success", `New task ${data.name} created successfully`])
      formik.handleReset()
    })
    .catch( err => setMsg(["danger", `Failed to create new task: ${JSON.stringify(err)}`]))
  }
  
  return (
    <Fragment>
      <h5>New Task</h5>
      <MsgBox msg={msg} />
      <GenericForm formik={formik} fields={fields} buttons={buttons} />
    </Fragment>  
  )
}

export const TaskUpdate = () => {
  const [msg,setMsg]  = useState([])
  const dispatch      = useDispatch()
  const history       = useHistory()
  const selected      = useSelector( state => state.tasks.activeTask)

  const formik        = useFormik({
    initialValues:    selected,
    enableReinitialize: true,
    validationSchema: validationSchema,
  })

  // EVENT HANDLERS
  const handleSubmit = () => dispatch(updateTask(formik.values)).then(unwrapResult) 
  const handleClose = (href=`/patients/patient/${selected.pid}/`) => history.push(href)


  // BUTTON onCLICK HANDLERS
  const buttons       = getUpdateButtons()
  buttons.close.onClick = (e) => handleClose()  
  buttons.update_close.onClick = (e) => {
    handleSubmit()
    .then( data => handleClose() )
    .catch( err => setMsg(["danger", `Failed to update task ${selected.name} - ${err}`]))
  }
  buttons.update_continue.onClick = (e) => {
    handleSubmit()
    .then( data => setMsg(["success", `Task to ${data.drug} updated successfully`]) )
    .catch( err => setMsg(["danger", `Failed to update task ${selected.name} - ${err}`]))
  }


  return (
    <Fragment>
      <h4>Update Task</h4>
      <MsgBox msg={msg} />
      <GenericForm formik={formik} fields={fields} buttons={buttons} />
    </Fragment>
  )
}

