import React, {useState} from 'react'
import {useHistory} from 'react-router';
import {useDispatch, useSelector} from 'react-redux'
import {unwrapResult} from '@reduxjs/toolkit'
import {Row, Col, Alert} from 'react-bootstrap'
import {useFormik} from 'formik';
import * as Yup from 'yup'

import {GenericForm, getCreateButtons, getUpdateButtons} from '../form'

import {createPatient, updatePatient} from '../../redux/slices/patients'

// FIELDS
const fields = {
  fname:  { type: 'input',  label: 'First Name' },
  lname:  { type: 'input',  label: "Last Name" },
  dob:    { type: "input",  label: "Birthday", placeholder: "Birthday YYYY-MM-DD"},
  gender: { type: 'select', label: 'Gender', options: [
    { value: null, name: "Select Gender" }, {value: "Male", name: "Male"}, { value: "Female", name: "Female"}]
  }  
}

const initialValues = {
  fname:  "", 
  lname:  "", 
  dob:    "", 
  gender: ""
}

const validationSchema = Yup.object({
  fname:  Yup.string().required(),
  lname:  Yup.string().required(),
  dob:    Yup.date().required()
})


export const PatientCreate = () => {
  const [msg,setMsg] = useState([])
  const history   = useHistory()
  const dispatch  = useDispatch()
  const formik    = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    enableReinitialize: true,
  });
  

  // EVENT HANDLERS
  const handleSubmit = (values) => dispatch(createPatient(formik.values)).then(unwrapResult)
  const handleClose = (href) => {
    history.push(href)
  }

  // BUTTON onCLICK HANDLERS
  const buttons = getCreateButtons()
  buttons.close.onClick = (e) => handleClose("/patients/")  
  buttons.save_close.onClick = (e) => {
    handleSubmit()
    .then( pt => handleClose(`/patients/patient/${pt.id}/`))
    .catch( err => setMsg(["danger", `Failed to create new patient: ${JSON.stringify(err)}`]))
  }
  buttons.save_continue.onClick = (e) => {
    handleSubmit()
    .then( pt => setMsg(["success", `New patient: ${pt.fname} ${pt.lname} created successfully`]))
    .catch( err => setMsg(["danger", `Failed to create new patient: ${JSON.stringify(err)}`]))
  }

  return (
    <React.Fragment>
      
      <Row>
      <Col>
        <h3>New Patient</h3>
        {msg && msg.length === 2 && <Alert variant={msg[0]}>{msg[1]}</Alert>}
        <GenericForm formik={formik} fields={fields} buttons={buttons} />
      </Col>
      <Col>
        
      </Col>
    </Row>
    </React.Fragment>
  );
};


export const PatientUpdate = ({patient}) => {
  const [msg,setMsg]  = useState([])
  const history       = useHistory()
  const dispatch      = useDispatch()
  
  console.log("UpdatePatient: " + JSON.stringify(patient))
  const formik = useFormik({
    initialValues: patient,
    enableReinitialize: true,
  });

  // EVENT HANDLERS
  const handleSubmit  = values  => dispatch(updatePatient(values)).then(unwrapResult)
  const handleClose   = href    => history.push(href)
  

  // BUTTON onCLICK HANDLERS
  const buttons = getUpdateButtons()
  buttons.close.onClick = (e) => handleClose("/patients/")  
  buttons.update.onClick = (e) => {
    handleSubmit(formik.values)
    .then( pt => handleClose(`/patients/`))
    .catch( err => setMsg(["danger", `Failed to update patient: ${JSON.stringify(err)}`]))
  }
 
  return (
    <React.Fragment>
      {msg && msg.length === 2 && <Alert variant={msg[0]}>{msg[1]}</Alert>}
      <GenericForm formik={formik} fields={fields} buttons={buttons} />
    </React.Fragment>
  )
}