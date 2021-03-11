import { Fragment, useState, useEffect } from 'react' 
import { Link, useParams, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import { useFormik} from 'formik'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus,faPencilAlt } from '@fortawesome/free-solid-svg-icons'

import { fetchSocialHxByPid, createSocialHx, updateSocialHx } from '../../redux/slices/socialhx'

import SocialHxForm from './form'

import { getCreateButtons, getUpdateButtons } from '../form'
import { MsgBox } from '../utils'




export const SocialHxSnippet = () => {
  const {id}      = useParams()
  const dispatch  = useDispatch()
  const socialhx  = useSelector( state => state.socialhx.activeSocialHx )
  const baseUrl   = `/patients/patient/${id}/socialhx/`
  const href      = socialhx ? `${baseUrl}${id}/update/` : baseUrl
  
  useEffect( () => dispatch(fetchSocialHxByPid(id)), [dispatch])
  return (
    <Fragment>
    <h5>
      <Link to={href}>
        <FontAwesomeIcon icon={faPlus} size="sm" color="green" />
      </Link>&nbsp;Social/Family History
    </h5>
    {socialhx && socialhx.template_value}
    {!socialhx && <p>No social/family history recorded</p>}
    </Fragment>
  )
}

const fields = {
  living: {
    type: "input",
    label: "Living arrangements",
    placeholder: "alone/with partner/with kids"
  },
  working: {
    type: "input",
    label: "Work arrangements"
  },
  smoking: {
    type: "input",
    label: "Smoking"
  },
  drinking: {
    type: "input",
    label: "Alcohol"
  },
  children: {
    type: "input",
    label: "Children"
  },
  family: {
    type: "input",
    label: "Family History"
  },
}

export const initialValues = {
  living: "",
  working: "",
  smoking: "",
  drinking: "",
  children: "",
  family: "",
  template: "lives {{living}}, {{working}}, smoking: {{smoking}}, alcohol: {{drinking}}, children: {{children}}, family hx: {{family}}",
  template_value: ""
}

export const SocialHxCreate = () => {
  const [msg,setMsg]    = useState([])
  const {id}            = useParams()
  const dispatch        = useDispatch()
  const history         = useHistory()

  initialValues['pid']  = id
  const formik          = useFormik({
    initialValues:        initialValues,
  })

  // EVENT HANDLERS
  const handleSubmit    = () => dispatch(createSocialHx(formik.values)).then(unwrapResult) 
  const handleClose     = (href=`/patients/patient/${id}/`) => history.push(href)
  
    // BUTTON onCLICK HANDLERS
  const buttons         = getCreateButtons()
  buttons.close.onClick = (e) => handleClose()  
  buttons.save.onClick = (e) => {
    handleSubmit()
    .then( data => handleClose())
    .catch( err => setMsg(["danger", `Failed to create social history: ${JSON.stringify(err)}`]))
  }

  return (
    <Fragment>
      <h5>Social History</h5>
      <MsgBox msg={msg} />
      <SocialHxForm formik={formik} fields={fields} buttons={buttons} />
    </Fragment>  
  )
}


export const SocialHxUpdate = () => {
  const [msg,setMsg]    = useState([])
  const {id,sid}        = useParams()
  
  const dispatch        = useDispatch()
  const history         = useHistory()
  let   selected        = useSelector( state => state.socialhx.activeSocialHx )

  useEffect( () => dispatch(fetchSocialHxByPid(id)), [selected] )

  const formik          = useFormik({
    initialValues:      selected,
  })
  

  // EVENT HANDLERS
  const handleSubmit  = () => dispatch(updateSocialHx(formik.values)).then(unwrapResult) 

  const handleClose   = (href=`/patients/patient/${selected.pid}/`) => history.push(href)

  
  // BUTTON onCLICK HANDLERS
  const buttons           = getUpdateButtons()
  buttons.close.onClick   = (e) => handleClose()  
  buttons.update.onClick  = (e) => {
    handleSubmit()
    .then( data => handleClose() )
    .catch( err => setMsg(["danger", `Failed to update social history - ${err}`]))
  }


  return (
    <Fragment>
      <h5>Update Social History</h5>
      <MsgBox msg={msg} />
      <SocialHxForm formik={formik} fields={fields} buttons={buttons} />
    </Fragment>  
  )
}
