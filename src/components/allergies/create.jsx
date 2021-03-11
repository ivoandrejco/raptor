
import {Fragment, useEffect, useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {unwrapResult} from '@reduxjs/toolkit'
import {useFormik} from 'formik'
import * as Yup from 'yup'

import {createAllergy, updateAllergy} from '../../redux/slices/allergies'
import {GenericForm, getCreateButtons, getUpdateButtons} from '../form'
import { MsgBox } from '../utils'

// FIELDS
const fields = {
  drug:     { type: 'input',  label: 'Drug Name' },
  reaction: { type: 'input',  label: "Reaction" },
}

const initialValues = {
  drug:  "", 
  reaction:  "", 
}

const validationSchema = Yup.object({
  drug:  Yup.string().required(),
  reaction:  Yup.string(),
})


export const AllergyCreate = () => {
  const [msg,setMsg]    = useState([])
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
  const handleSubmit = () => dispatch(createAllergy(formik.values)).then(unwrapResult) 
  const handleClose = (href=`/patients/patient/${id}/`) => history.push(href)
  
    // BUTTON onCLICK HANDLERS
  const buttons = getCreateButtons()
  buttons.close.onClick = (e) => handleClose()  
  buttons.save_close.onClick = (e) => {
    handleSubmit()
    .then( data => handleClose())
    .catch( err => setMsg(["danger", `Failed to create new allergy: ${JSON.stringify(err)}`]))
  }
  buttons.save_continue.onClick = (e) => {
    handleSubmit()
    .then( data => {
      setMsg(["success", `New allergy to ${data.drug} created successfully`])
      formik.handleReset()
    })
    .catch( err => setMsg(["danger", `Failed to create new allergy: ${JSON.stringify(err)}`]))
  }
  
  return (
    <Fragment>
      <h5>New Allergy</h5>
      <MsgBox msg={msg} />
      <GenericForm formik={formik} fields={fields} buttons={buttons} />
    </Fragment>  
  )
}

export const AllergyUpdate = () => {
  const [msg,setMsg]  = useState([])
  const dispatch      = useDispatch()
  const history       = useHistory()
  const selected      = useSelector( state => state.allergies.activeAllergy)

  const formik        = useFormik({
    initialValues:    selected,
    enableReinitialize: true,
    validationSchema: validationSchema,
  })

  // EVENT HANDLERS
  const handleSubmit  = () => dispatch(updateAllergy(formik.values)).then(unwrapResult) 
  const handleClose   = (href=`/patients/patient/${selected.pid}/`) => history.push(href)

  
  // BUTTON onCLICK HANDLERS
  const buttons           = getUpdateButtons()
  buttons.close.onClick   = (e) => handleClose()  
  buttons.update.onClick  = (e) => {
    handleSubmit()
    .then( data => handleClose() )
    .catch( err => setMsg(["danger", `Failed to update allergy to ${selected.drug} - ${err}`]))
  }
  buttons.update_continue.onClick = (e) => {
    handleSubmit()
    .then( data => setMsg(["success", `Allergy to ${data.drug} updated successfully`]) )
    .catch( err => setMsg(["danger", `Failed to update allergy to ${selected.drug} - ${err}`]))
  }
  

  return (
    <Fragment>
      <h4>Update Allergy</h4>
      <MsgBox msg={msg} />
      <GenericForm formik={formik} fields={fields} buttons={buttons} />
    </Fragment>
  )
}

