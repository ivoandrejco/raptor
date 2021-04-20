import {Fragment, useEffect, useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {unwrapResult} from '@reduxjs/toolkit'
import {useFormik} from 'formik'
import * as Yup from 'yup'

import { 
  createExamination, 
  fetchExamination, 
  updateExamination, 
  deleteExamination 
} from '../../redux/slices/examinations'

import { LayoutForm, getInitialValues } from '../forms'
import { MsgBox } from '../utils'

// FIELDS
const fields = {
  weight:       { type: 'input',  name: 'weight',  label: "Weight", value: null },
  height:       { type: 'input',  name: 'height',  label: "Height", value: null },
  BP:           { type: 'input',  name: 'BP',      label: "Blood pressure", value: null},
  pulse:        { type: 'input',  name: 'pulse',   label: "Pulse", value: 72},
  pulse_desc:   { type: 'input',  name: 'pulse_desc',  label: "Pulse Description", value: 'bpm'},
  temp:         { type: 'input',  name: 'temp',  label: "Temperature", value: 36.5},
  sats:         { type: 'input',  name: 'sats',    label: "Saturations", value: 98},
  sats_desc:    { type: 'input',  name: 'sats_desc',    label: "Saturations Description", value: 'room air'},
  findings:     { type: 'textarea', name: 'findings',  label: "Examination", rows:7, value: `heart sounds are dual with no audible murmurs; chest is clear;\n abdomen is distended, soft and non-tender with no palpable masses, liver or spleen; no palpable lymphadenopathy;\n no obvious mucocutaneous lesions, excessive bruising or bleeding; no bone tenderness or joint swellings` },
}

const layout = [
  [fields.weight,fields.height],
  [fields.BP,fields.pulse,fields.pulse_desc],
  [fields.temp,fields.sats,fields.sats_desc],
  [fields.findings]
]

const validationSchema = Yup.object({
  height:    Yup.number().required(),
  weight:    Yup.number().required(),
  findings:  Yup.string().nullable(),
})


export const ExaminationCreate = () => {
  const [msg,setMsg]  = useState([])
  const {id,cid}      = useParams()
  const dispatch      = useDispatch()
  const history       = useHistory()

  const formik        = useFormik({
    initialValues:      getInitialValues(fields),
    validationSchema:   validationSchema,
    enableReinitialize: true,
    onSubmit: ( values ) => {
      handleSubmit(values)
      .then( data => handleClose())
      .catch( err => setMsg(["danger", `Failed to create new examination: ${JSON.stringify(err.response)}`]))
    }
  })

  // EVENT HANDLERS
  const handleSubmit = values => dispatch(createExamination({consultation:cid,...values})).then(unwrapResult) 

  const handleClose = (href=`/patients/patient/${id}/`) => history.push(href)
  
  // BUTTONS
  const buttons       = [
    {
      label: 'Close',
      onClick: handleClose,
    },
    {
      label: 'Save',
      type: 'submit'
    }
  ]


  return (
    <Fragment>
      <h5>New Examination</h5>
      <MsgBox msg={msg} />
      <LayoutForm formik={formik} fields={layout} buttons={buttons} />
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
    dispatch(fetchExamination(eid)).then(unwrapResult)
    .then( data => setExamination(data) )
    .catch(err => setMsg(['danger',`Failed to fetch examination: ${JSON.stringify(err.data)}`]))
  },[eid])

  const formik        = useFormik({
    initialValues:      {...examination},
    enableReinitialize: true,
    validationSchema:   validationSchema,
    onSubmit: values => {
      handleSubmit(values)
      .then( data => handleClose() )
      .catch( err => setMsg(["danger", `Failed to update examination ${new Date(examination.collected_on).toLocaleDateString()} - ${err}`]))
    }
  })

  // EVENT HANDLERS
  const handleSubmit = values => dispatch(updateExamination(values)).then(unwrapResult) 
  const handleClose  = (href=`/patients/patient/${id}/`) => history.push(href)
  

  // BUTTONS
  const buttons       = [
    {
      label: 'Close',
      onClick: handleClose,
    },
    {
      label: 'Delete',
      onClick: e => dispatch(deleteExamination(examination)).then(unwrapResult)
                .then(data => handleClose())
                .catch(e => console.error(e))
      
    },
    {
      label: 'Update',
      type: 'submit',
    }
  ]

  return (
    <Fragment>
      <h4>Update Examination - {examination && new Date(examination.collected_on).toLocaleDateString()}</h4>
      <MsgBox msg={msg} />
      <LayoutForm formik={formik} fields={layout} buttons={buttons} />
    </Fragment>
  )
}

