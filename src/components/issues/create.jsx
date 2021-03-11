
import {Fragment, useEffect, useState} from 'react'
import {Row,Col} from 'react-bootstrap'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {unwrapResult} from '@reduxjs/toolkit'
import {useFormik} from 'formik'
import Handlebars from 'handlebars'

import { fetchConsultation } from '../../redux/slices/consultations'
import { fetchIssue, createIssue, updateIssue, setActiveIssue} from '../../redux/slices/issues'
import { fetchTemplate, fetchTemplateByName, setActiveTemplate } from '../../redux/slices/templates'
import { GenericForm, GenericFormGroup, getCreateButtons, getUpdateButtons} from '../form'

import { TemplateRenderJSONFields } from '../templates'

import { MsgBox } from '../utils'

const _props = {
  id            : "",
  cid           : "",
  tid           : "",
  json          : "",
  title         : "",
  presentation  : ' ',
  conclusion    : ' ',
}
// FIELDS
const fields = {
  presentation:   { type: 'textarea',   label: "Presentation", rows: 5 },
  conclusion:     { type: 'textarea',   label: "Conclusion", rows: 5 },
}



  // process template json
  const _process_json_data = (json,data,setMsg) => {

    const newJson = {}
    const errors  = []
    
    if(!(json instanceof Object)) {
      setMsg(["danger",`'${json}' is not an object`])
      return null
    }
    const keys    = Reflect.ownKeys(json)
    let   length  = keys.length
    let   counter = 0
  
    Reflect.ownKeys(json).map( key => {
      if( data[`${key}_value`] && ["0","1"].includes(data[`${key}_value`]) ) {
        counter++
        const _json = {...json[key]}
        _json.value = data[`${key}_value`]==="1"?true:false
        _json.comment = data[`${key}_comment`]?data[`${key}_comment`]:""
        newJson[key] = _json
      } else {
        errors.push(`${json[key].label}\n`)
      }
    })
    if(counter === length)
      return newJson
    else {
      setMsg(['danger',`These fields: "${errors.join(' ')}" require values`])
      return null
    }
      
  }

export const IssuePreview = ({presentation,conclusion}) => {
  
  const value   = useSelector(state => state.issues.template_value)
  const fields  = {
    tags:  { type: 'textarea',  rows: 10},
  }

  //console.log(`ISSUE PREVIEW FORMIK VALUES: ${JSON.stringify(formik.values)}`)
  return (
    <Fragment>
      <h5>Presentation</h5>
      <p dangerouslySetInnerHTML={{__html:presentation}} />
      <h5>Conclusion</h5>
      <div dangerouslySetInnerHTML={{__html:conclusion}} />
  
      
    </Fragment>
  )
}


const _JSONtoForm = (json) => {
  if(!json)
    return null

  let vals  = {}
  for(const k in json) {
    vals[`${k}_value`]   = json[k].value && json[k].value?"true":"false"
    vals[`${k}_comment`] = json[k].comment?json[k].comment:' '
  }
  return vals
}

const _FormToJSON = (values,json) => {
  if(!json)
    return null

  const _json = {}
  for(const k in json) {
    _json[k] = {
      ...json[k],
      value:    values[`${k}_value`]?values[`${k}_value`]==="true":json[k].value, 
      comment:  values[`${k}_comment`]?values[`${k}_comment`]:json[k].comment,
    } 
  }
  return _json
}

const _updateIssue      = (patient,values,template,json) => {
  let issue = {}
  for(const k in _props) {
    issue[k] = values[k]?values[k]:null
  }
  issue.json          = _FormToJSON(values,json)
//  issue.presentation  = values['presentation'] //compileTemplate(patient, values['presentation'],issue.json)
//  issue.conclusion    = values['conclusion'] //compileTemplate(patient, values['conclusion'],issue.json)

  
  return issue
}


const _createIssue      = (patient,values,template,json=null) => {
  let issue = {}
  for(const k in _props) {
    issue[k] = values[k]
  }

  issue.json          = _FormToJSON(values,json)
//  issue.presentation  = compileTemplate(patient,`${template && template.presentation} ${values['presentation']}`,issue.json)
//  issue.conclusion    = compileTemplate(patient,`${template && template.conclusion} ${values['conclusion']}`,issue.json)

  return issue
}

const compileTemplate = (patient,template,json) => {
  try {
    const nouns = {}
    
    if(patient.gender === 'Male'){
      nouns.himher  = 'him'
      nouns.Heshe   = 'He'
      nouns.heshe   = 'he'
      nouns.hisher  = 'his'
      nouns.Hisher  = 'His'
    } else {
      nouns.himher  = 'her'
      nouns.hisher  = 'her'
      nouns.Himher = nouns.Hisher = 'Her'
      nouns.Heshe = 'She'
      nouns.heshe = 'she'
    }
    const tmplData = {...json,patient: patient.fname,...nouns}
    //console.log(JSON.stringify(tmplData))
    return Handlebars.compile(template)(tmplData).replace(/\s+\./g,'.')
   
  } catch(e) {
    console.error(e)
  }
  return template
}

export const IssueCreate = ({title}) => {
  const [template,setTemplate]  = useState()
  const [_presentation, setPresentation]  = useState()
  const [_conclusion, setConclusion]      = useState()
  const [json,setJSON]          = useState()
  const [msg,setMsg]            = useState([])
  const patient                 = useSelector(state => state.patients.activePatient)
  
  const {id, cid}             = useParams()
  const location          = useLocation()
  const params            = new URLSearchParams(location.search)
  const issue             = params.get('issue')
  const history           = useHistory()
  const dispatch          = useDispatch()  
  
  useEffect( 
    () => dispatch(fetchTemplateByName({kind:'issue',title:issue})).then(unwrapResult)
    .then( data => {
      
      if(data instanceof Array && data.length) {
        const d = data[0]
        setJSON(d.json)
        setTemplate(d)
        setPresentation(compileTemplate(patient,d.presentation))
        setConclusion(compileTemplate(patient,d.conclusion))     
      }
    })
    .catch( e => console.error(e))
    , []  
  )
 
 // console.log(`issue created: ${params.get('issue').charAt(0).toUpperCase() + params.get('issue').slice(1)}`)
 // console.log('get template - dispatch(fetchIssueTemplateByName(issue)')
 // console.log("if template received - display template")
  //console.log(patient)


  const formik            = useFormik({
    enableReinitialize:   true,
    initialValues:        { 
      cid:          cid,
      title:        title,
      tid:          template?template.id:null,
      json:         template?template.json:{},
      presentation: template?template.presentation:'',
      conclusion:   template?template.conclusion:'',
      ..._JSONtoForm(json)
    }
  })

  //console.log(`TEMPLATE: ${JSON.stringify(json)}`)
  // EVENT HANDLERS
  const handleSubmit      = (values=formik.values) => dispatch(createIssue(values)).then(unwrapResult) 
  const handleClose       = (href=`/patients/patient/${id}/`) => {
    history.push(href)
  }
  
  // BUTTON onCLICK HANDLERS
  const buttons           = getCreateButtons()
  buttons.close.onClick   = (e) => handleClose()  
  buttons.save.onClick    = (e) => {
      
    const issue = _createIssue(patient,formik.values,template,json)
    //console.log(JSON.stringify(issue))
    
    handleSubmit(issue)
    .then( data => {
      dispatch(fetchConsultation(cid))
      //dispatch(setActiveTemplate(null))
      history.push(`/patients/patient/${id}/${cid}/${data.id}/investigation/create/?name=${data.title}`)
      //handleClose()
    })
    .catch( err => {setMsg(["danger", `Failed to create new issue: ${JSON.stringify(err)}`]); console.error(err)})
  }
  //console.log(`TEMPLATE: ${JSON.stringify(template)}`)
  buttons['preview'] = {
    label: 'Preview',
    onClick: (e) => {
    
      setMsg()
      const __json = _FormToJSON(formik.values,json)
      setJSON(__json)
      setPresentation(compileTemplate(patient,`${template.presentation} ${formik.values['presentation']}`,__json))
      setConclusion(compileTemplate(patient,`${template.conclusion} ${formik.values['conclusion']}`,__json))
    }
  }
  
  //console.log(`ISSUE PREVIEW: ${JSON.stringify(template)}`)
  return (
    <>
      <MsgBox msg={msg} />
      <h4>New Issue - {issue}</h4>
      <GenericForm 
        formik={formik} 
        buttons={buttons}  
      >
        
        <Row>
          <TemplateRenderJSONFields
            formik={formik} 
            kind="Issue"
            json={json}
          />
        </Row>
        <hr />
        <Row>
          <Col lg={6}>
            <GenericFormGroup
              formik={formik}   
              fields={fields}
            />
          </Col>
          <Col lg={5}>
            <IssuePreview presentation={_presentation} conclusion={_conclusion} />
          </Col> 
        </Row>
      </GenericForm> 
    </>  
  )
}

export const IssueUpdate = () => {
  
  const [json,setJSON]                    = useState()
  const [msg,setMsg]                      = useState([])
  const [_conclusion, setConclusion]      = useState()
  const [_presentation, setPresentation]  = useState()
  const [template, setTemplate]           = useState(null)
 

  const {id,cid,iid}  = useParams()
  const dispatch      = useDispatch()
  const history       = useHistory()
  const patient       = useSelector( state => state.patients.activePatient)
  const issue         = useSelector( state => state.issues.activeIssue )
 

  useEffect( () => {
    
    dispatch(fetchIssue(iid)).then(unwrapResult)
    .then(data => {
      
      
      setJSON(data.json) 
      setPresentation(data.presentation)
      setConclusion(data.conclusion)
      console.log(`FUCK FUCK: ${JSON.stringify(_JSONtoForm(data.json))}`)
      if(data.tid) {
        console.log('fetchi template')
        dispatch(fetchTemplate({kind:'issue',id:data.tid})).then(unwrapResult)
        .then( data => setTemplate(data))
        .catch( e => console.error(e) )
      }
    })
    .catch( e => console.error(e) )



  }, [cid,iid] )
  

  const formik        = useFormik({
    initialValues:    {...issue,..._JSONtoForm(issue.json)},
    enableReinitialize: true,
    onSubmit: (values) => {
      
      handleSubmit( _updateIssue(patient,values, template, json) )
      .then( data => handleClose() )
      .catch( err => setMsg(["danger", `Failed to update issue to ${issue.title} - ${JSON.stringify(err)}`]))

    }
  })

  // EVENT HANDLERS
  const handleSubmit  = ( values ) => {console.log("DDDDDDDDD: " + values); return dispatch(updateIssue(values)).then(unwrapResult) }
  const handleClose   = ( href=`/patients/patient/${id}/` ) => history.push(href)

  
  // BUTTON onCLICK HANDLERS
  const buttons       = getUpdateButtons()
  buttons.close.onClick = (e) => handleClose()  
  buttons.update.type = 'submit'

  buttons.preview = { 
    label: "Preview",
    onClick: (e) => {
      
      //const issue = _updateIssue(formik.values,selected)
      //console.log(`ISSUE PREVIEW: ${issue.value}`)
      setMsg()
      const __json = _FormToJSON(formik.values,json)
      setJSON(__json)
      setPresentation(compileTemplate(patient,`${template ? template.presentation : _presentation}`,__json))
      setConclusion(compileTemplate(patient,`${template ? template.conclusion : _conclusion}`,__json))
    }
  }
  //console.log(`${JSON.stringify(formik)}`)
  
  
  return (
    issue && <>
      <MsgBox msg={msg} />
      <h4>Update Issue - {issue.title}</h4>
      
      <GenericForm 
        formik={formik} 
        buttons={buttons}  
      >
        <Row>
          <TemplateRenderJSONFields
            formik={formik} 
            kind="Issue"
            json={json}
          />
        </Row>
        <hr />
        <Row>
          <Col lg={6}>
            <GenericFormGroup
              formik={formik}   
              fields={fields}
              
            />
          </Col>
          <Col lg={5}>
            <IssuePreview presentation={_presentation} conclusion={_conclusion} />
          </Col> 
        </Row>
      </GenericForm>  
    </>
  )
}
