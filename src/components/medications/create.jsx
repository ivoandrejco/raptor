
import {Fragment, useEffect, useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {unwrapResult} from '@reduxjs/toolkit'
import {useFormik} from 'formik'
import * as Yup from 'yup'

import {createMedication, updateMedication} from '../../redux/slices/medications'
import {GenericForm, getCreateButtons, getUpdateButtons} from '../form'
import { MsgBox } from '../utils'

// FIELDS
const fields = {
  name:       { type: 'input',  label:  'Name' },
  dose:       { type: 'input',  label:  "Dose" },
  frequency:  { type: 'input',  label:  'Frequency' },
  comment:    { type: 'input',  label:  'Comment'},
}

const initialValues = {
  name:       "", 
  dose:       "",
  frequency:  "",
  comment:    "",
  ceased:     false,
}

const validationSchema = Yup.object({
  name:       Yup.string().required(),
  dose:       Yup.string(),
  frequency:  Yup.string(),
  comment:    Yup.string(),
})


export const MedicationCreate = () => {
  const [msg,setMsg]    = useState([])
  const {id}            = useParams()
  const dispatch        = useDispatch()
  const history         = useHistory()

  initialValues['pid']  = id
  const formik          = useFormik({
    initialValues:    initialValues,
    enableReinitialize: true,
    validationSchema: validationSchema
  })

  // EVENT HANDLERS
  const handleSubmit = () => dispatch(createMedication(formik.values)).then(unwrapResult) 
  const handleClose = (href=`/patients/patient/${id}/`) => {
    history.push(href)
  }
  
  // BUTTON onCLICK HANDLERS
  const buttons       = getCreateButtons()
  buttons.close.onClick = (e) => handleClose()  
  buttons.save.onClick = (e) => {
    handleSubmit()
    .then( data => handleClose())
    .catch( err => setMsg(["danger", `Failed to create new medication: ${JSON.stringify(err)}`]))
  }
  buttons.save_continue.onClick = (e) => {
    handleSubmit(formik.values)
    .then( data => {
      setMsg(["success", `New medications to ${data.name} created successfully`])
      formik.handleReset({})
    })
    .catch( err => setMsg(["danger", `Failed to create new medication: ${JSON.stringify(err)}`]))
  }
  
  return (
    <Fragment>
      <h5>New Medication</h5>
      <MsgBox msg={msg} />
      <GenericForm formik={formik} fields={fields} buttons={buttons} />
    </Fragment>  
  )
}


export const MedicationUpdate = () => {
  const [msg,setMsg]  = useState([])
  const dispatch      = useDispatch()
  const history       = useHistory()
  const selected      = useSelector( state => state.medications.activeMedication)

  const formik        = useFormik({
    initialValues:      selected,
    enableReinitialize: true,
    validationSchema:   validationSchema,
  })

  // EVENT HANDLERS
  const handleSubmit = () => dispatch(updateMedication(formik.values)).then(unwrapResult) 
  
  const handleClose = (href=`/patients/patient/${selected.pid}/`) => history.push(href)

  
  // BUTTON onCLICK HANDLERS
  const buttons       = getUpdateButtons()
  buttons.close.onClick = (e) => handleClose()  
  buttons.update.onClick = (e) => {
    handleSubmit()
    .then( data => handleClose() )
    .catch( err => setMsg(["danger", `Failed to update medication ${selected.name} - ${err}`]))
  }
  buttons.update_continue.onClick = (e) => {
    handleSubmit()
    .then( data => setMsg(["success", `The medication ${data.name} updated successfully`]) )
    .catch( err => setMsg(["danger", `Failed to update medication ${selected.name} - ${err}`]))
  }


  // add "Cease" field
  const update_fields = fields
  update_fields.ceased = {type: 'checkbox', label: 'Cease'}
  update_fields.ceased.onClick = (e) => {
    //formik['ceased'] = e.target.value
    console.log(`values: ${JSON.stringify(formik.values)}`)
  }
  return (
    <Fragment>
      <h4>Update Medication</h4>
      <MsgBox msg={msg} />
      <GenericForm formik={formik} fields={update_fields} buttons={buttons} />
    </Fragment>
  )
}

