import { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation, useParams } from 'react-router'
import { useFormik } from 'formik'
import { fetchTemplate, fetchTemplateByName } from '../../redux/slices/templates'
import { GenericForm, getCreateButtons, getUpdateButtons } from '../form'
import { TemplateRenderJSONFields } from '../templates'
import { fetchInvestigation, createInvestigation, updateInvestigation } from '../../redux/slices/investigations'
import { unwrapResult } from '@reduxjs/toolkit'
import { MsgBox } from '../utils'
import { object } from 'yup'

const _props = {
  id:         '',
  iid:        '',
  tid:        '',
  title:      '',      
  json:       null,       
  value:      '',      
  comment:    '',    
  created_on: '', 
}

const fields = {
  comment: {type: "textarea", label: 'Comment', value: ""}
}

const initialValues = {
  comment: fields.value
}

const setInitialValues = (values=null) => {
  const ivals = {}
  if(!values===null){
    return _props
  }
  return ivals
}

const _FormToJSON = (values,json) => {
  const newJson  = {}

  if(!json)
    return newJson

  
  for(const key in json) {
    newJson[key]  = {
      ...json[key],
      value:    values[`${key}_value`]?values[`${key}_value`]:json[key].value, 
      comment:  values[`${key}_comment`]?values[`${key}_comment`]:json[key].comment, 
      date:     values[`${key}_date`]?values[`${key}_date`]:json[key].date,                  
    }
  }

  return newJson
}

const _JSONtoPreview = (json) => {
  let preview    = ""
  if(!json)
    return preview

  const keys  = json instanceof Object ? Reflect.ownKeys(json) : null
  keys.sort( (a,b) => {
    if(json[a].order && json[b].order) {
      return parseInt(json[a].order) - parseInt(json[b].order)
    } 
    return 0
  })

  for(let i = 0 ; i<keys.length ; i++) {
    let k        = keys[i]
    if(!json[k].value)
      continue
    let date     = json[k].date?`(${json[k].date})`:""
    let comment  = json[k].comment?` - (${json[k].comment})`:""
    let units    = json[k].units?` ${json[k].units}`:""
    preview     += `${json[k].label}${date}: ${json[k].value?json[k].value:"..."}${units}${comment}, `
  }
  return preview 
} 

const _FieldsToPreview = (values) => {
  let preview    = ""
  if(!values)
    return preview

  
  for(const k in fields) {
    preview     += values[k]?`${values[k]}, `:'' 
  }
  return preview 
} 


export const InvestigationCreateContainer = () => {
  const [json,setJSON]= useState()
  const [msg,setMsg]  = useState()
  const {id,cid,iid}  = useParams()
  const dispatch      = useDispatch()
  const location      = useLocation()
  const history       = useHistory()
  const params        = new URLSearchParams(location.search)
  const name          = params.get('name')
  const template      = useSelector( state => state.templates.activeTemplate )

  const formik        = useFormik({
    initialValues     : setInitialValues(),
    onSubmit: (values,{resetForm}) => {
    //  console.log(`createInvestigations: ${JSON.stringify(values)} - ${name} - ${JSON.stringify(template.json)}`)
    
      const json      = _FormToJSON(values,template?template.json:null)
      const investigation = {
        iid: iid,
        tid: template?template.id:null,
        title: name,
        json: json,
        value: `${_JSONtoPreview(json)} ${_FieldsToPreview(values)}`,
        comment: values['comment']
      }
      console.log(`createInvestigations: ${JSON.stringify(_JSONtoPreview(json))}`)
      
      dispatch(createInvestigation(investigation)).then(unwrapResult)
      .then(data => handleClose())
      .catch(e => setMsg(['danger',`Unable to create investigation for ${name}: ${JSON.stringify(e)} `]))
      console.log(`createInvestigations post processing: ${JSON.stringify(investigation)}`)
    }
  })
  useEffect( () => {
  //  console.log('useEffect INvetistigation')
    dispatch(fetchTemplateByName({title:name,kind:"investigation"})).then(unwrapResult)
    .then(data => setJSON(data instanceof Array && data.length?data[0].json:null))
  }, [iid] )
  //console.log(`template : ${JSON.stringify(template)}`)
  //console.log(`createInvestigations template: ${JSON.stringify(template)} - keys: ${Reflect.ownKeys(template)}`)
  const handleClose     = () => history.push(`/patients/patient/${id}`)
  
  const buttons         = getCreateButtons()
  buttons.close.onClick = () => handleClose()
  buttons.save.type     = "submit"
  return (
    <Fragment>
      <h5>Investigations for {name}</h5>
      <MsgBox msg={msg} />
      <GenericForm
        fields={fields}
        buttons={buttons}
        formik={formik}
      >
        <TemplateRenderJSONFields kind="Investigation" json={json} formik={formik} />
      </GenericForm>    
    </Fragment>
  )
}

export const InvestigationUpdateContainer = () => {
  const [investigation,setInvestigation]  = useState()
  const [json,setJSON]    = useState()
  const [msg,setMsg]      = useState()
  const {id,cid,iid,inid} = useParams()
  const dispatch          = useDispatch()
  const location          = useLocation()
  const history           = useHistory()
  const params            = new URLSearchParams(location.search)
  //const investigation     = useSelector( state => state.investigations.activeInvestigation )

  const values = {}
  for(const key in json) {
    values[`${key}_value`]    = json[key].value
    values[`${key}_comment`]  = json[key].comment
    values[`${key}_date`]     = json[key].date
  }
  for(const k in fields) {
    values[k]   = investigation && investigation[k]?investigation[k]:''
  }

  const formik        = useFormik({
    initialValues     : values,
    enableReinitialize: true,
    onSubmit: (values,{resetForm}) => {
    //  console.log(`createInvestigations: ${JSON.stringify(values)} - ${name} - ${JSON.stringify(template.json)}`)
    
      const _json          = _FormToJSON(values,json)
      const _investigation = {
        id:       inid,
        json:     _json,
        
        value:    `${_JSONtoPreview(_json)} ${_FieldsToPreview(values)}`,
        comment:  values['comment']
      }
      console.log(`updateInvestigations: ${JSON.stringify(_investigation)}`)
      
      dispatch(updateInvestigation(_investigation)).then(unwrapResult)
      .then(data => {handleClose(); console.log("update investigation")})
      .catch(e => setMsg(['danger',`Unable to update investigation for ${investigation.title}: ${e} `]))
      console.log(`updateInvestigation post processing: ${JSON.stringify(_investigation)}`)
    }
  })
  useEffect( () => {
    //console.log('useEffect INvetistigation: ' + inid)
    dispatch(fetchInvestigation(inid)).then(unwrapResult)
    .then( data => {
      setInvestigation(data)
      //console.log(`received json: ${JSON.stringify(data)}`)
      dispatch(fetchTemplate({kind:'investigation',id:data.tid})).then(unwrapResult)
        .then( tata => {
          setJSON({...tata.json,...data.json})
        }) 
      
    })
    .catch( e => setMsg(["danger",`unable to fetch the investigation: ${JSON.stringify(e)}`]))
  }, [inid] )
  //console.log(`investigation : ${JSON.stringify(investigation)}`)
  //console.log(`createInvestigations template: ${JSON.stringify(template)} - keys: ${Reflect.ownKeys(template)}`)
  const handleClose       = () => history.push(`/patients/patient/${id}`)
  //const tKeys           = Reflect.ownKeys(template)
  const buttons           = getUpdateButtons()
  buttons.close.onClick   = () => handleClose()
  buttons.update.type     = "submit"

  console.log(`update investigation template: ${JSON.stringify(json)}`)
  return (
    investigation ? (<Fragment>
      <h5>Update Investigations for {investigation.title}</h5>
      <MsgBox msg={msg} />
      <GenericForm
        fields={fields}
        buttons={buttons}
        formik={formik}
      >
        <TemplateRenderJSONFields kind={"Investigation"} json={json} formik={formik} />
      </GenericForm>    
    </Fragment> ) : (
      <h4>No investigation found</h4>
    )
  )
}