
import {Fragment, useEffect, useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {unwrapResult} from '@reduxjs/toolkit'
import {useFormik} from 'formik'
import * as Yup from 'yup'

import {createComorbidity, updateComorbidity} from '../../redux/slices/comorbidities'
import {GenericForm, getCreateButtons, getUpdateButtons} from '../form'
import { MsgBox } from '../utils'

// FIELDS
const fields = {
  name:     { type: 'input',  label: 'Name' },
  comment:  { type: 'input',  label: "Comment" },
}

const initialValues = {
  name:     "", 
  comment:  "", 
}

const validationSchema = Yup.object({
  name:  Yup.string().required(),
  comment:  Yup.string(),
})


export const ComorbidityCreate = () => {
  const [msg,setMsg]  = useState([])
  const {id}          = useParams()
  const dispatch      = useDispatch()
  const history       = useHistory()
  const patient       = useSelector(state => state.patients.activePatient)
  
  const formik        = useFormik({
    initialValues:    initialValues,
    validationSchema: validationSchema
  })

    // EVENT HANDLERS
    const handleSubmit = (values) => { values['pid'] = id;console.log(JSON.stringify(values)); return dispatch(createComorbidity(values)).then(unwrapResult) }
    const handleClose = (href=`/patients/patient/${id}/`) => {
      history.push(href)
    }
  
    // BUTTON onCLICK HANDLERS
  const buttons       = getCreateButtons()
  buttons.close.onClick = (e) => handleClose()  
  buttons.save_close.onClick = (e) => {
    handleSubmit(formik.values)
    .then( data => handleClose())
    .catch( err => setMsg(["danger", `Failed to create new comorbidity: ${JSON.stringify(err)}`]))
  }
  buttons.save_continue.onClick = (e) => {
    handleSubmit(formik.values)
    .then( data => {
      setMsg(["success", `New comorbitidy to ${data.name} created successfully`])
      formik.handleReset()
    })
    .catch( err => setMsg(["danger", `Failed to create new comorbidity: ${err}`]))
  }
  
  return (
    <Fragment>
      <h5>New Comorbidity</h5>
      <MsgBox msg={msg} />
      <GenericForm formik={formik} fields={fields} buttons={buttons} />
    </Fragment>  
  )
}

export const ComorbidityUpdate = () => {
  const [msg,setMsg]  = useState([])
  const dispatch      = useDispatch()
  const history       = useHistory()
  const selected      = useSelector( state => state.comorbidities.activeComorbidity)

  const formik        = useFormik({
    initialValues:    selected,
    enableReinitialize: true,
    validationSchema: validationSchema,
  })

  // EVENT HANDLERS
  const handleSubmit = () => dispatch(updateComorbidity(formik.values)).then(unwrapResult) 
  const handleClose = (href=`/patients/patient/${selected.pid}/`) => history.push(href)


  // BUTTON onCLICK HANDLERS
  const buttons     = getUpdateButtons()
  buttons.close.onClick = (e) => handleClose()  
  buttons.update.onClick = (e) => {
    handleSubmit()
    .then( data => handleClose() )
    .catch( err => setMsg(["danger", `Failed to update comorbidity ${selected.name} - ${err}`]))
  }
  buttons.update_continue.onClick = (e) => {
    handleSubmit()
    .then( data => setMsg(["success", `The comorbidity ${data.name} updated successfully`]) )
    .catch( err => setMsg(["danger", `Failed to update comorbidity ${selected.name} - ${err}`]))
  }


  return (
    <Fragment>
      <h4>Update Comorbidity</h4>
      <MsgBox msg={msg} />
      <GenericForm formik={formik} fields={fields} buttons={buttons} />
    </Fragment>
  )
}

