
import {Fragment, useEffect, useState} from 'react'
import { Button } from 'react-bootstrap'
import {useHistory, useParams, Link, useLocation } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {unwrapResult} from '@reduxjs/toolkit'
import {useFormik} from 'formik'

import { fetchConsultation } from '../../redux/slices/consultations'
import {createLetter, fetchLetter, updateLetter} from '../../redux/slices/letters'
import {GenericForm, getCreateButtons, getUpdateButtons} from '../form'

import { getAge, MsgBox } from '../utils'
import socialhx from '../../redux/slices/socialhx'

// FIELDS
const fields = {
  title:     { type: 'input',   label: 'Title' },
  content:   { type: 'editor',   label: "Content" },
  status:    { type: 'select',   label: "Status", options: [
    {value: null, name: 'Select Status'},
    {value: "Pending", name: "Pending"},
    {value: "Completed", name: "Completed"}
  ] },
}

const initialValues = {
  title:    "",
  content:  "", 
  status:   "Pending"
  
}



const getIntroduction = (consultation,patient,diagnoses) => {
  const fname   = patient.fname
  const age     = getAge(patient.dob)
  const gender  = patient.gender === 'Male' ? (age > 60 ? 'gentleman':'man') : (age > 60 ? 'lady' : 'woman')
  
  const issuesNames  = consultation.issues.map( v => v.title ).join(', ')
  const consultationDate = new Date(consultation.created_on).toLocaleDateString()

  switch(consultation.code){
    case 110:
      return (
        `<p>Thank you very much for involving me in ${fname}‘s care with ${issuesNames.toLowerCase()} for further assessment, whom I saw on ${consultationDate}.</p>
      
        <p>${fname} is ${age} years old ${gender} with: </p>`
        )
    case 116:
      if(diagnoses) {
        return (
          diagnoses.map( (d,i) => `<strong>${d.dtype}</strong><p>${d.title}</p>${d.description}`)
        )
      }
      return ''  
  }
}

const getConclusion = (consultation,patient) => {
  const fname   = patient.fname
  const gender  = patient.gender === 'Male' ? 'his' : 'her'
  const consultationDate = new Date(consultation.created_on).toLocaleDateString()

  switch(consultation.code){
    case 110:
      return (
        `<div><strong>Summary</strong><br />
        <div>${ consultation.issues.map( (issue,i) => `<strong>${i+1}) ${issue.title}</strong><p>${issue.conclusion}</p>` ) }</div>
       
        </div>
        <br />
        Once again, thank you very much for involving me in ${gender} care.
        `
      )
    case 116:
      return (
        `<div><strong>Progress / Plan</strong><br />
        I reviewed ${fname} on ${consultationDate}. ${fname} is well with no new symptoms or medications. ${ consultation.conclusion }
        </div>
        <br />
        `
      )
    default: 
        return null
  }
  
}

const _createLetter = (consultation,patient,medications,allergies,comorbidities,socialhx,diagnoses) => {
  const values = {
    fname: "",
    gender: "",
    age: "",
    consultationDate: "",
    issues: "",
  }
  
  if(consultation) {
    const con         = consultation
    values['date']    = new Date(consultation.created_on).toLocaleDateString()
    
    values['investigations'] = ''
    values['issues'] =  consultation.issues.map( v => {
        
        values['investigations'] += v.investigations instanceof Array && v.investigations.map( inx => `${inx.value}` ) 
        return `
        <strong class="font-weight:bold">${v.title}</strong><br />${v.presentation} ${v.value?v.value:''}
        `
      }).join(' ')
    
    values['consultation_examination'] = `${con.weight?`weight ${con.weight} kg`:''}${con.BP?`, BP ${con.BP} mmHg`:''}${con.pulse?`, pulse ${con.pulse},`:''}
    ${consultation.examination}`
  }

  if(socialhx) {
    values['socialhx'] = socialhx.template_value
  }

  if(allergies){
    values['allergies'] = allergies.map( v => ` ${v.drug} ${v.reaction ? ` - ${v.reaction}`:""  }`).join(', ')
  } else {

  }

  if(comorbidities){
    values['comorbidities'] = comorbidities.map( v => `<p style="margin:0; font-style:italic"> ${v.name} ${v.comment?` - ${v.comment}`:''} </p>`).join(' ')
  } else {
    values['comorbidities'] = '<i>nil</i>'
  }

  if(medications){
    values['medications'] = medications.map( v => `<p style="margin:0; font-style:italic">${v.name} ${v.dose} ${v.frequency} ${v.comment? `- ${v.comment}` : ''}</p>`).join(' ')
  }
  return `
  <div id="letter" style="width:595px; ">
    ${patient.fname} ${patient.lname}<br />
    ${ consultation && getIntroduction(consultation,patient,diagnoses) }

    <p>
    ${values['issues'] ? values['issues']: '....' }The systems review is unremarkable.
    </p>
    <table style="width:100%;border-collapse:collapse; border: 1px solid black;">
    <tr>
      <td width="56%" style="vertical-align:top">
        <p style="font-weight:bold; margin:0">Background</p>
        
        ${values['comorbidities']}
        
      </td>
      <td style="vertical-align:top">
        <p style="font-weight:bold; margin: 0">Medications</p>
        
        ${values['medications']}
        
        <span style="font-weight:bold">Allergies: </span><span style="font-style:italic">${values['allergies']?values['allergies']:"nil"}</span></p>
      </td>
    </tr>
    </table>

    
    <p style="margin:0">
    <span style="font-weight:bold">
    Social hx: 
    </span>
    <span style="font-style:italic">${ values['socialhx'] }</span>
    </p>
    <div>
    <br />
    <div><strong>Examination: </strong>
    <span style="font-style:italic">${ values['consultation_examination'] }</span>
    </div>
    <br />
    <div><strong>Investigations:</strong> 
    <span style="font-style:italic">${ values['investigations'] }</span>
    </div>
    <div>
    <br />
    ${ consultation && getConclusion(consultation,patient)}
    <br />
    <br />
    Yours sincerely
    <br />
    <br />
    Dr. ${consultation && consultation.provider.doctor}<br />
    ${consultation && consultation.provider.specialty}<br />
    ${consultation && consultation.provider.number}<br />
    
  </div>
  `
}

export const LetterCreate = () => {
  const [msg,setMsg]      = useState([])
  const {id,cid}          = useParams()
  const dispatch          = useDispatch()
  const history           = useHistory()
  const patient           = useSelector(state => state.patients.activePatient)
  const medications       = useSelector(state => state.medications.allByPid[id])
  const allergies         = useSelector(state => state.allergies.allByPid[id])
  const comorbidities     = useSelector(state => state.comorbidities.allByPid[id])
  const consultation      = useSelector(state => state.consultations.activeConsultation)
  const socialhx          = useSelector(state => state.socialhx.activeSocialHx)
  const diagnoses         = useSelector(state => state.diagnoses.allByPid[id])

  const content             = _createLetter(consultation,patient,medications,allergies,comorbidities,socialhx,diagnoses)
  initialValues['cid']      = cid
  initialValues['content']  = content 
  const formik              = useFormik({
    initialValues:        initialValues,
  })

  // EVENT HANDLERS
  const handleSubmit      = (values=formik.values) => dispatch(createLetter(values)).then(unwrapResult) 
  const handleClose       = (href=`/patients/patient/${id}/`) => history.push(href)
  
  // BUTTON onCLICK HANDLERS
  const buttons           = getCreateButtons()
  buttons.close.onClick   = (e) => handleClose()  
  buttons.save.onClick    = (e) => {
    console.log(JSON.stringify(formik.values))
    handleSubmit()
    .then( data => {
      fetchConsultation(cid)
      handleClose()
    })
    .catch( err => setMsg(["danger", `Failed to create new letter: ${JSON.stringify(err)}`]))
  }

  return (
    <Fragment>
      <h5>New Letter</h5>
      <MsgBox msg={msg} />
      
      <GenericForm 
        formik={formik} 
        buttons={buttons} 
        fields={fields}
      />
    </Fragment>  
  )
}
export const LetterCreatePreview = () => {
  const [msg,setMsg]      = useState([])
  const {id,cid}          = useParams()
  const dispatch          = useDispatch()
  const history           = useHistory()
  const patient           = useSelector(state => state.patients.activePatient)
  const medications       = useSelector(state => state.medications.allByPid[id])
  const allergies         = useSelector(state => state.allergies.allByPid[id])
  const comorbidities     = useSelector(state => state.comorbidities.allByPid[id])
  const consultation      = useSelector(state => state.consultations.activeConsultation)
  const socialhx          = useSelector(state => state.socialhx.activeSocialHx)
  const diagnoses         = useSelector(state => state.diagnoses.allByPid[id])

  useEffect( () => {
    dispatch(fetchConsultation(cid))
  },[cid])
  const content           = _createLetter(consultation,patient,medications,allergies,comorbidities,socialhx,diagnoses)
  
  const saveLetter        = () => {
    const letter  = { cid: cid, title: new Date().toLocaleDateString(), status: "Pending", content: content}
    dispatch(createLetter(letter)).then(unwrapResult) 
    .then( data => history.push(`/patients/patient/${id}/consultation/${cid}/letter/${data.id}/update/`))
    .catch( e => setMsg(["danger",`Failed to save the letter ${JSON.stringify(e)}`]))
  }
  return (
    <Fragment>
      <h5>New Letter</h5>
      <MsgBox msg={msg} />
      <div style={{width: "595px"}} dangerouslySetInnerHTML={{__html:content}} />
      <hr />
      <Button variant="primary" onClick={() => saveLetter() }>Save</Button>{' '}
      <Link to={`/patients/patient/${id}/`}><Button variant="primary">Close</Button></Link>
      
    </Fragment>  
  )
}

export const LetterUpdate = () => {
  const [msg,setMsg]  = useState([])
//  const [content, setContent] = useState()
  const [letter,  setLetter]  = useState({})
  const {id,cid,lid}      = useParams()
  const dispatch          = useDispatch()
  const history           = useHistory()
  const location          = useLocation()
  const params            = new URLSearchParams(location.search)
  const next              = params.get('next')
  
  console.log("NEXT: " +next)
//  const selected          = useSelector( state => state.letters.activeLetter)
  useEffect( () => 
    dispatch(fetchLetter(lid)).then(unwrapResult)
    .then(data => setLetter(data) )
    .catch(e => console.error(e))
    //{console.log("useEffect updateLetter")}
  ,[])
  console.log(letter)
  console.log('LetterUpdate')

  const formik        = useFormik({
    initialValues:    letter,
    enableReinitialize: true,
  })


  // EVENT HANDLERS
  const handleSubmit  = (values=formik.values) => dispatch(updateLetter(values)).then(unwrapResult) 
  const handleClose   = (href) => history.push(href?href:`/patients/patient/${id}/`)

  fields.content.onChange = (e) => {
    setLetter({...letter,content:e.editor.getData()})
      //console.log(content)
  }
  // BUTTON onCLICK HANDLERS
  const buttons       = getUpdateButtons()
  buttons.close.onClick = (e) => handleClose()  
  buttons.update.onClick = (e) => {
    const _letter = {...letter,...formik.values}
    console.log(_letter)
    handleSubmit(_letter)
    .then( data => handleClose(next) )
    .catch( err => setMsg(["danger", `Failed to update letter to ${_letter.title} - ${err}`]) )
  } 
  
  return (
    <Fragment>
      <h4>Update Letter {letter?letter.title:''}</h4>
      <MsgBox msg={msg} />
      <GenericForm formik={formik} fields={fields}  buttons={buttons}/>
    </Fragment>
  )
}

