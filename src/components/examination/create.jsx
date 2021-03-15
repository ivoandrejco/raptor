import {Fragment, useEffect, useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {unwrapResult} from '@reduxjs/toolkit'
import {useFormik} from 'formik'
import * as Yup from 'yup'

//import { createExamination, fetchExamination, updateExamination } from '../../redux/slices/examinations'
import { GenericForm, getCreateButtons, getUpdateButtons } from '../form'
import { MsgBox } from '../utils'

// FIELDS
const fields = {
  weight:       { type: 'input',    label: "Weight", value: 0 },
  height:       { type: 'input',    label: "Height", value: 0 },
  BP:           { type: 'input',    label: "Blood pressure"},
  pulse:        { type: 'input',    label: "Pulse"},
  pulse_desc:   { type: 'input',    label: "Pulse Description"},
  temp:         { type: 'input',    label: "Temperature"},
  sats:         { type: 'input',    label: "Saturations"},
  sats_desc:    { type: 'input',    label: "Saturations Description"},
  examination:  { type: 'textarea', label: "Examination", value: " " },
}

const layout = [
  [fields.weight,fields.height],
  [fields.BP,fields.pulse,fields.pulse_desc],
  [fields.temp,fields.sats,fields.sats_desc],
  [fields.examination]
]

const initialValues = {
  weight: 0,
  height: 0,
  BP: ' ',
  pulse: 72,
  pulse_desc: 'bpm ...',
  temp: 36.5,
  sats: 0,
  sats_desc: '',
  examination: `heart sounds are dual with no audible murmurs; chest is clear; abdomen is distended, soft and non-tender with no palpable masses, liver or spleen; no palpable lymphadenopathy; no obvious mucocutaneous lesions, excessive bruising or bleeding; no bone tenderness or joint swellings`
}

const validationSchema = Yup.object({
  height:       Yup.number().required(),
  weight:       Yup.number().required(),
  examination:  Yup.string().nullable(),
})


export const ExaminationCreate = () => {
  const [msg,setMsg]            = useState([])
  const {id}                    = useParams()
  const dispatch                = useDispatch()
  const history                 = useHistory()
  
  const formik        = useFormik({
    initialValues:   {...initialValues},
    validationSchema: validationSchema,
    enableReinitialize: true,
  })

  // EVENT HANDLERS
  const handleSubmit = (values) => { 
    values['pid'] = id; 
    //return dispatch(createExamination(values)).then(unwrapResult) 
  }

  const handleClose = (href=`/patients/patient/${id}/`) => {
    history.push(href)
  }
  
  // BUTTON onCLICK HANDLERS
  const buttons       = getCreateButtons()
  buttons.close.onClick = (e) => handleClose()  
  buttons.save.onClick = (e) => {
    handleSubmit(formik.values)
    .then( data => handleClose())
    .catch( err => setMsg(["danger", `Failed to create new examination: ${JSON.stringify(err)}`]))
  }

  return (
    <Fragment>
      <h5>New Examination</h5>
      <MsgBox msg={msg} />
      <GenericForm formik={formik} fields={fields} buttons={buttons} />
    </Fragment>  
  )
}

export const ExaminationUpdate = () => {
  const [examination,
    setExamination]       = useState(null)
  const [msg,setMsg]      = useState([])
  const {id,eid}          = useParams()
  const dispatch          = useDispatch()
  const history           = useHistory()

  useEffect( () => {
    //dispatch(fetchExamination(eid)).then(unwrapResult())
    //.then(data => setExamination(data)
    //.catch(err => setMsg(['danger','Failed to fetch examination'])
  },eid)

  const formik        = useFormik({
    initialValues:    {...initialValues},
    enableReinitialize: true,
    validationSchema: validationSchema,
  })

  formik.setValues(examination)


  // EVENT HANDLERS
  //const handleSubmit = () => dispatch(updateExamination(formik.values)).then(unwrapResult) 
  //const handleClose = (href=`/patients/patient/${examination.pid.id}/`) => history.push(href)


  // BUTTON onCLICK HANDLERS
  const buttons       = getUpdateButtons()
  //buttons.close.onClick = (e) => handleClose()  

  //buttons.update_continue.onClick = (e) => {
    //handleSubmit()
    //.then( data => setMsg(["success", `The examination ${data.created_on} updated successfully`]) )
    //.catch( err => setMsg(["danger", `Failed to update examination ${examination.created_on} - ${err}`]))
  //}

  //buttons.update.onClick = (e) => {
   // handleSubmit()
   // .then( data => handleClose() )
   // .catch( err => setMsg(["danger", `Failed to update examination ${new Date(examination.created_on).toLocaleDateString()} - ${err}`]))
  //}
  return (
    <Fragment>
      <h4>Update Examination - {examination && new Date(examination.collected_on).toLocaleDateString()}</h4>
      <MsgBox msg={msg} />
      <GenericForm formik={formik} fields={fields} buttons={buttons} />
    </Fragment>
  )
}

