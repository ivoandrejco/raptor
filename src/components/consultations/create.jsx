
import {Fragment, useEffect, useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {unwrapResult} from '@reduxjs/toolkit'
import {useFormik} from 'formik'
import * as Yup from 'yup'

import { createConsultation, fetchConsultation, updateConsultation } from '../../redux/slices/consultations'
import { GenericForm, getCreateButtons, getUpdateButtons } from '../form'
import { MsgBox } from '../utils'
import { fetchProviderNumbers } from '../../redux/slices/billings'

// FIELDS
const fields = {
  code:     { type: 'input',  label: "Code", value: " "},
  provider: { type: 'select', label: 'Provider', options: [{value:" ",name: "Select Provider"}]},
  weight:     { type: 'input',  label: "Weight" },
  height:     { type: 'input',  label: "Height" },
  BP:           { type: 'input', label: "Blood pressure"},
  pulse:        { type: 'input', label: "Pulse"},
  examination:  { type: 'textarea',  label: "Examination", value: " " },
  presentation:  { type: 'textarea',  label: "Presentation", value: " " },
  plan:         { type: 'textarea',  label: "Plan", value: " " },
//  conclusion:  { type: 'textarea',  label: "Conclusion", value: " ", rows: "10" },
}

const initialValues = {
  code:     110, 
  provider: ' ',
  weight: ' ',
  height: ' ',
  bpressure: ' ',
  pulse: " bpm regular",
  presentation: ' ',
//  conclusion:  ' ',
  plan: '',
  examination: `heart sounds are dual with no audible murmurs; chest is clear; abdomen is distended, soft and non-tender with no palpable masses, liver or spleen; no palpable lymphadenopathy; no obvious mucocutaneous lesions, excessive bruising or bleeding; no bone tenderness or joint swellings`
}

const validationSchema = Yup.object({
  code:     Yup.number().required(),
  examination:  Yup.string().nullable(),
  conclusion:  Yup.string(),
})


export const ConsultationCreate = () => {
  const [_fields,setFields]      = useState([])
  const [msg,setMsg]            = useState([])
  const {id}                    = useParams()
  const dispatch                = useDispatch()
  const history                 = useHistory()
  
  useEffect( () => {
    dispatch(fetchProviderNumbers()).then(unwrapResult)
    .then( data => {
      const options  = [{value:" ",name:"Select Provider"}]
      const pns = data.map( p => ({ value: p.id,name: `${p.doctor} ${p.practice}`}) )
      fields.provider.options = options.concat(pns)
      setFields(fields)}
    )
    .catch( e => console.error(JSON.stringify(e)))
  }, [id])

  const formik        = useFormik({
    initialValues:    initialValues,
    validationSchema: validationSchema,
    enableReinitialize: true,
  })

  // EVENT HANDLERS
  const handleSubmit = (values) => { values['pid'] = id; return dispatch(createConsultation(values)).then(unwrapResult) }
  const handleClose = (href=`/patients/patient/${id}/`) => {
    history.push(href)
  }
  
  // BUTTON onCLICK HANDLERS
  const buttons       = getCreateButtons()
  buttons.close.onClick = (e) => handleClose()  
  buttons.save.onClick = (e) => {
    handleSubmit(formik.values)
    .then( data => handleClose())
    .catch( err => setMsg(["danger", `Failed to create new consultation: ${JSON.stringify(err)}`]))
  }

 
 // const _fields = {...fields}
 // _fields.provider.options.push(providers && providers.map( p => ({ value: p.id,name: `${p.doctor} ${p.practice}`}) ))
  console.log(JSON.stringify(_fields))
  
  return (
    <Fragment>
      <h5>New Consultation</h5>
      <MsgBox msg={msg} />
      <GenericForm formik={formik} fields={_fields} buttons={buttons} />
    </Fragment>  
  )
}

export const ConsultationUpdate = () => {
  const [consultation,
    setConsultation]      = useState(null)

  const [msg,setMsg]      = useState([])
  const {id,cid}          = useParams()
  const dispatch          = useDispatch()
  const history           = useHistory()
  //const selected      = useSelector( state => state.consultations.activeConsultation)

  const getInitialValues = () => {
    if(!consultation)
    return initialValues

    const values = {}
    for(const k in initialValues) {
      values[k] = consultation[k]
    }
    values['id'] = cid
    values['pid'] = id
    values['provider'] = consultation.provider.id
    return values
  }
  
  const formik        = useFormik({
    initialValues:    getInitialValues(),
    enableReinitialize: true,
    validationSchema: validationSchema,
  })

  useEffect( () => {
    dispatch(fetchProviderNumbers()).then(unwrapResult)
    .then( data => {
      const options  = [{value:" ",name:"Select Provider"}]
      const pns = data.map( p => ({ value: p.id,name: `${p.doctor} ${p.practice}`}) )
      fields.provider.options = options.concat(pns)
    })
    .catch( e => console.error(JSON.stringify(e)))

    dispatch(fetchConsultation(cid)).then(unwrapResult)
    .then( data => setConsultation(data) )
    .catch( e => console.error(JSON.stringify(e)))
  }, [])

  // EVENT HANDLERS
  const handleSubmit = () => dispatch(updateConsultation(formik.values)).then(unwrapResult) 
  const handleClose = (href=`/patients/patient/${consultation.pid.id}/`) => history.push(href)


  // BUTTON onCLICK HANDLERS
  const buttons       = getUpdateButtons()
  buttons.close.onClick = (e) => handleClose()  

  buttons.update_continue.onClick = (e) => {
    handleSubmit()
    .then( data => setMsg(["success", `The consultation ${data.created_on} updated successfully`]) )
    .catch( err => setMsg(["danger", `Failed to update consultation ${consultation.created_on} - ${err}`]))
  }

  buttons.update.onClick = (e) => {
    handleSubmit()
    .then( data => handleClose() )
    .catch( err => setMsg(["danger", `Failed to update consultation ${new Date(consultation.created_on).toLocaleDateString()} - ${err}`]))
  }
  console.log(JSON.stringify(formik.values))
  return (
    <Fragment>
      <h4>Update Consultation - {consultation && new Date(consultation.created_on).toLocaleDateString()}</h4>
      <MsgBox msg={msg} />
      <GenericForm formik={formik} fields={fields} buttons={buttons} />
    </Fragment>
  )
}

