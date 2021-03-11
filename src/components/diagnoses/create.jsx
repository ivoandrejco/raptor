
import {Fragment, useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {unwrapResult} from '@reduxjs/toolkit'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import qs from 'qs'

import {createDiagnosis, updateDiagnosis} from '../../redux/slices/diagnoses'
import {GenericForm, getCreateButtons, getUpdateButtons} from '../form'
import { MsgBox } from '../utils'

// FIELDS
const fields = {
  kind:         { type: 'select', label: 'Kind', options: [{value:"",name:"Select Diagnosis Kind"},{value: "Issue", name:"Issue"},{value:"Diagnosis",name:"Diagnosis"}] },
  title:        { type: 'input',  label: "Title" },
  description:  { type: 'editor', label: "Description" },
}

const initialValues = {
  type:         "Diagnosis", 
  title:        "",
  description:  "", 
}

const validationSchema = Yup.object({
  type:         Yup.string().required(),
  title:        Yup.string().required(),
})


export const DiagnosisCreate = () => {
  const [msg,setMsg]    = useState([])
  const [description, setDescription] = useState()
  const {id}            = useParams()
  const dispatch        = useDispatch()
  const history         = useHistory()
  
  initialValues['pid']  = id
  const formik          = useFormik({
    initialValues:      initialValues,
    validationSchema:   validationSchema,
    enableReinitialize: true,
  })

  // EVENT HANDLERS
  const handleSubmit = () => {
    const diagnosis = {...formik.values}
    diagnosis.description = description
    return dispatch(createDiagnosis(diagnosis)).then(unwrapResult)
  } 
  const handleClose = (href=`/patients/patient/${id}/`) => history.push(href)
  
    // BUTTON onCLICK HANDLERS
  const buttons = getCreateButtons()
  buttons.close.onClick = (e) => handleClose()  
  buttons.save_close.onClick = (e) => {
    handleSubmit()
    .then( data => handleClose())
    .catch( err => setMsg(["danger", `Failed to create new diagnosis: ${JSON.stringify(err)}`]))
  }
  buttons.save_continue.onClick = (e) => {
    handleSubmit()
    .then( data => {
      setMsg(["success", `New diagnosis to ${data.drug} created successfully`])
      formik.handleReset()
    })
    .catch( err => setMsg(["danger", `Failed to create new diagnosis: ${JSON.stringify(err)}`]))
  }
  
  fields.description.onChange = (e) => {
    setDescription(e.editor.getData())
  }
  return (
    <Fragment>
      <h5>New Diagnosis</h5>
      <MsgBox msg={msg} />
      <GenericForm formik={formik} fields={fields} buttons={buttons} />
    </Fragment>  
  )
}

export const DiagnosisUpdate = () => {
  const [msg,setMsg]  = useState([])
  const [description, setDescription] = useState()  
  const dispatch      = useDispatch()
  const history       = useHistory()
  const selected      = useSelector( state => state.diagnoses.activeDiagnosis)

  const formik        = useFormik({
    initialValues:    selected,
    enableReinitialize: true,
    validationSchema: validationSchema,
  })

  // EVENT HANDLERS
  const handleSubmit  = () => {
    const diagnosis = {...formik.values}
    diagnosis.description = description
    return dispatch(updateDiagnosis(diagnosis)).then(unwrapResult) 
  }
  const handleClose   = (href=`/patients/patient/${selected.pid}/`) => history.push(href)

  
  // BUTTON onCLICK HANDLERS
  const buttons           = getUpdateButtons()
  buttons.close.onClick   = (e) => handleClose()  
  buttons.update.onClick  = (e) => {
    handleSubmit()
    .then( data => handleClose() )
    .catch( err => setMsg(["danger", `Failed to update diagnosis to ${selected.drug} - ${err}`]))
  }
  buttons.update_continue.onClick = (e) => {
    handleSubmit()
    .then( data => setMsg(["success", `Diagnosis to ${data.drug} updated successfully`]) )
    .catch( err => setMsg(["danger", `Failed to update diagnosis to ${selected.drug} - ${err}`]))
  }
  
  fields.description.onChange = (e) => {
    setDescription(e.editor.getData())
  }
  return (
    <Fragment>
      <h4>Update Diagnosis</h4>
      <MsgBox msg={msg} />
      <GenericForm formik={formik} fields={fields} buttons={buttons} />
    </Fragment>
  )
}

