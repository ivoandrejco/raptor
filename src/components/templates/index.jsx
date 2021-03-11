
import { Fragment, useEffect, useState } from 'react'
import { Form, Alert, FormGroup, ToggleButton } from 'react-bootstrap'

import { Row, Col, Container } from 'react-bootstrap'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'

import { GenericField, GenericForm, GenericFormGroup, getCreateButtons } from '../form'


//import { fetchTemplates as fetchInvestigationTemplates, deleteTemplate, fetchTemplate, setActiveTemplate } from '../../redux/slices/templates/templates'
import { fetchTemplates, fetchTemplate } from '../../redux/slices/templates'
import { TemplateInvestigationCreate, TemplateInvestigationUpdate } from './investigations'
import { TemplateIssueCreate, TemplateIssueUpdate } from './issues'
import { unwrapResult } from '@reduxjs/toolkit'

const RenderJSONFieldsIssue = ({formik,json}) => {

  const tKeys   = json instanceof Object ? Reflect.ownKeys(json) : null
  const colNum  = 4 

  if(!tKeys) {
    return (
      <p>Template not found</p>
    )
  }


  const handleChange = (e) => {  
    if(e.target.type ==='radio') {  
      formik.values[e.target.name.replace("_value","_comment")] = " "
    } 
    formik.handleChange(e) 
  }


  const fields = []
  
  for(let i=0; i< tKeys.length; i++) {
    const key = tKeys[i]
  
    fields.push(
      <Col lg={3} key={i}>
        <span>{json[key].label}&nbsp;&nbsp;</span>
        <Form.Group key={i}>
        
          <GenericField inline
          name={`${key}_value`}
          
          type="radio"
          value="false"
          label="No"
          onChange={handleChange}
          checked={formik.values[`${key}_value`] === "false"}
          />
          <GenericField inline
          name={`${key}_value`}
          
          type="radio"
          value="true"
          label="Yes"
          onChange={handleChange}
          checked={formik.values[`${key}_value`] === "true"}
          />
        
          <GenericField 
          name={`${key}_comment`}
          type="input"
          as="input"
          
          value={formik.values[`${key}_comment`]}
          onChange={handleChange}
          
          />
          <span style={{fontSize:"0.8em", fontStyle:"oblique"}}>{json[key].tip}</span>
        </Form.Group>  
      </Col>
    )
  

      
  
  }
  
  return (
    <>
      {fields}
    </>
  )
}


const RenderJSONFieldsInvestigation = ({formik,json}) => {
  let headers   = ''
  const history = useHistory()
  const keys    = json instanceof Object ? Reflect.ownKeys(json) : null
  
  keys.sort( (a,b) => {if(json[a].order && json[b].order){return parseInt(json[a].order) - parseInt(json[b].order)} else {return 0}})
 
  if(!json) {
    return (<Alert variant={"danger"}>{"Wrong format passed to json property"}</Alert>)
  }

  if(keys.length)
    headers =    <Row>
                  <Col lg={2} md={2} sm={2}><h6>Investigation</h6></Col>
                  <Col lg={2} md={2} sm={2}><h6>Value</h6></Col>
                  <Col lg={2} md={2} sm={2}><h6>Date</h6></Col>
                  <Col lg={3} md={2} sm={2}><h6>Comment</h6></Col>
                </Row> 
  return (
    <>
      { headers }
      <FormGroup>
      {
        keys.map( (k,i) => {
          const value_key = `${k}_value`
          const comment_key = `${k}_comment`
          const date_key = `${k}_date`
          return (
            <Fragment key={i}>
        
            <Row>
              <Col lg={2} md={2} sm={2}>
              <Form.Label key={i} htmlFor={value_key} >{json[k].label} ({json[k].units})</Form.Label>
              </Col>
              <Col lg={2} md={2} sm={2}>
            <Form.Control 
              
              id={value_key} name={value_key}
              as={"input"} 
              placeholder={json[k].label}
              onChange={formik.handleChange}
              value={formik.values && formik.values[value_key]?formik.values[value_key]:null}
              
            />  
             
              </Col>  
              <Col lg={2} md={2} sm={2}>
                <Form.Control 
                  id={date_key} name={date_key}
                  as={"input"} 
                  placeholder="Date dd/mm/yy"
                  onChange={formik.handleChange}
                  value={formik.values && formik.values[date_key]?formik.values[date_key]:null}
                  
                />   
              </Col>
              <Col lg={2} md={2} sm={2}>
                <Form.Control 
                  id={comment_key} name={comment_key}
                  as={"input"} 
                  placeholder="Comment"
                  onChange={formik.handleChange}
                  value={formik.values && formik.values[comment_key]?formik.values[comment_key]:null}
                  
                />   
              </Col>
            </Row>
            </Fragment>
            
          )
      })
    }
    </FormGroup>
    </>
  )
}

export const TemplateRenderJSONFields = ({kind,json,formik}) => {

 // console.log(`TemplateForm: ${JSON.stringify(template)}`)

  if( kind && kind.toLowerCase() === 'issue' && json)
    return (<RenderJSONFieldsIssue formik={formik} json={json} />)
  //  return (<IssueRenderJSONFields formik={formik} json={template.json} />)
  if( kind && kind.toLowerCase() === 'investigation' && json) 
    return (<RenderJSONFieldsInvestigation formik={formik} json={json} />)  
  
  return (<Alert variant={"warning"}>Template not found - <Link to={`/templates/create/?kind=${kind}`}>create template</Link> [insert link here]</Alert>)
}


export const TemplateList = () => {
  const [issues,setIssues] = useState()
  const [investigations,setInvestigations] = useState()
  
  const dispatch  = useDispatch()

  
  useEffect( () => {
    dispatch(fetchTemplates({kind:'issue'})).then(unwrapResult)
    .then(data => {console.log(JSON.stringify(data));setIssues(data)})
    dispatch(fetchTemplates({kind:'investigation'})).then(unwrapResult)
    .then(data => setInvestigations(data))
  },[])

  return (
    <Row>
      <Col lg={2}>
        <h5>Issue Templates</h5> 
        <ul class="list-unstyled">
          {
            issues && issues.map( (template, i) => {
              return <li><Link to={`/templates/issues/${template.id}/update/`} >{template.title}</Link></li>
            })
          } 
        </ul>  
      </Col> 
      <Col lg={2}>
        <h5>Investigation Templates</h5> 
        <ul class="list-unstyled">
          {
            investigations && investigations.map( (template, i) => {
              return <li><Link to={`/templates/investigations/${template.id}/update/`} >{template.title}</Link></li>
            })
          } 
        </ul>  
      </Col> 
    </Row>
  )
}
    

export const TemplateCreateContainer = () => {
  const history           = useHistory()
  const location          = useLocation()
  const params            = new URLSearchParams(location.search)
  const name              = params.get('name')
  const kind              = params.get('kind')
  
  const validationSchema  = Yup.object({
    name: Yup.string().required(),
    kind: Yup.string().required(),
  })
  const initialValues     = {
    name: " ",
    kind: " ",
  }
  const formik            = useFormik({
    initialValues         : initialValues,
    validationSchema      : validationSchema,
    onSubmit: () => {
      history.push(`/templates/create/?name=${formik.values['name']}&kind=${formik.values['kind']}`)
    }
  })

  if(!kind || !name) {


    const fields = {
      name: {type: 'input', label: 'Template name', placeholder: 'Enter template name'},
      kind: {type: 'select', label: 'Template kind', options: [{value:'',name: 'Select Template Type'},{value:'Issue',name:'Issue'},{value:'Investigation',name:'Investigation'}]},
    }
    const buttons = getCreateButtons()
    buttons.close.onClick = () => history.push('/templates/')
    buttons.save.type = "submit"

    return (
      <GenericForm
        formik={formik}
        fields={fields}
        buttons={buttons}
        />
    )
  }
  
  if(kind === 'Investigation')
    return <TemplateInvestigationCreate name={name} kind={kind}/>
  if(kind === 'Issue')
    return <TemplateIssueCreate name={name} kind={kind}/>
}


export const TemplateUpdateContainer = () => {
  const [template,setTemplate]  = useState()
  const {id}                    = useParams()
  const dispatch                = useDispatch()

  useEffect( () => {
    dispatch(fetchTemplate(id)).then(unwrapResult)
    .then( data => setTemplate(data) )
    .catch( e => console.error(e) )
  },[id])

  console.log(JSON.stringify(template))

  if(template && template.kind === 'Investigation')
    return <TemplateInvestigationUpdate template={template}/>
  if(template && template.kind === 'Issue')
    return <TemplateIssueUpdate  template={template}/>
  
  return <Alert variant="danger">Template not found - something went wrong</Alert>
}