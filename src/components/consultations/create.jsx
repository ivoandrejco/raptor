
import { Fragment, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { 
  fetchConsultation, 
  createConsultation, 
  updateConsultation,
  deleteConsultation
} from '../../redux/slices/consultations'
import { 
  fetchProviders 
} from '../../redux/slices/billings'

import { LayoutForm, getInitialValues } from '../forms'
import { MsgBox } from '../utils'

// FIELDS
const fields = {
  code:       { type: 'input',   name: 'code', label: "Code", value: 110 },
  provider:   { type: 'select',  name: 'provider', label: 'Provider', value: ' ', options: []},
  history:    { type: 'textarea', name: 'history', rows: 6,label: "History", value: null },
  impression: { type: 'textarea', name: 'impression', rows: 6, label: "Impression", value: null },
  plan:       { type: 'textarea', name: 'plan', rows: 6, label: "Plan", value: null },
}

const _layout = [
  [fields.code,fields.provider],
  [fields.history,fields.impression],
  [fields.plan]
]

const validationSchema = Yup.object({
  code:       Yup.number().required(),
  history:    Yup.string().required(),
  impression: Yup.string(),
  plan:       Yup.string().required(),
})

const formatProvider = p => ( {value:p.id, name: `${p.doctor} ${p.practice}`} )
const  setProviders = (data) => {
  fields.provider.options = [{value:' ',name:'Select Provider'}]
    .concat(data.map( p => formatProvider(p) )) 
}

export const ConsultationCreate = () => {
  const [layout,setLayout]      = useState(null)
  const [msg,setMsg]            = useState([])
  const {id}                    = useParams()
  const dispatch                = useDispatch()
  const history                 = useHistory()
  
  useEffect( () => 

    dispatch(fetchProviders()).then(unwrapResult)
    .then( data => { setProviders(data); setLayout(_layout) } )
    .catch( e => console.error( JSON.stringify(e) ))
      
  , [dispatch,id] )

  const formik        = useFormik({
    enableReinitialize: true,
    validationSchema:   validationSchema,
    initialValues:      {patient: id,  ...getInitialValues(fields)},
    onSubmit:           values => dispatch(createConsultation(values)).then(unwrapResult) 
                        .then( data => handleClose() )
                        .catch( err => setMsg(["danger", `Failed to create new consultation: ${JSON.stringify(err)}`]))
  })

  // EVENT HANDLERS
  const handleClose = (href=`/patients/patient/${id}/`) => history.push(href)

  
  // BUTTONs
  const buttons = [
    {
      label: 'Save',
      type: 'submit',
    },
    {
      label: 'Close',
      onClick: handleClose
    },
  ]
 
  return (layout && 
    <Fragment>
      <h5>New Consultation</h5>
      <MsgBox msg={msg} />
      <LayoutForm buttons={buttons} formik={formik} fields={layout} />
    </Fragment>  
  )
}

export const ConsultationUpdate = () => {
  const [layout,setLayout]      = useState(null)
  const [consultation,
    setConsultation]            = useState(null)
  const [msg,setMsg]            = useState([])
  const {id,cid}                = useParams()
  const dispatch                = useDispatch()
  const history                 = useHistory()

  
  useEffect( () => {

    dispatch(fetchProviders()).then(unwrapResult)
    .then( data => { setProviders(data); setLayout(_layout)} )
    .catch( e => console.error(JSON.stringify(e)) )

    dispatch(fetchConsultation(cid)).then(unwrapResult)
    .then( data => setConsultation(data) )
    .catch( e => console.error(JSON.stringify(e)))

  }, [dispatch,id,cid])

  const formik        = useFormik({
    initialValues: { ...consultation,provider: consultation && consultation.provider.id }, 
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: values => dispatch(updateConsultation(values)).then(unwrapResult)
              .then( data => handleClose() )
              .catch( err => setMsg(["danger", `Failed to update consultation ${new Date(consultation.created_on).toLocaleDateString()} - ${err}`]))
  })

  // EVENT HANDLERS
  const handleClose = (href=`/patients/patient/${id}/`) => history.push(href)

  const buttons = [
    {
      label: 'Update',
      type: 'submit'
    },
    {
      label: 'Delete',
      onClick: e => dispatch(deleteConsultation(consultation)).then(unwrapResult)
        .then( d => handleClose() )
        .catch( e => console.error(e) )
    },
    {
      label: 'Close',
      onClick: handleClose
    }
  ]

  return ( layout && 
    <Fragment>
      <h4>Update Consultation - {consultation && new Date(consultation.created_on).toLocaleDateString()}</h4>
      <MsgBox msg={msg} />
      <LayoutForm formik={formik} fields={layout} buttons={buttons} />
    </Fragment>
  )
}

