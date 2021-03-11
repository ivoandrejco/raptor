import React, {Fragment, useEffect, useState} from 'react'
import {Route, Link, useLocation, useHistory, useParams} from 'react-router-dom'
import {Form,Row,Col, Button} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import {useFormik} from 'formik'
import * as Yup from 'yup'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons'

import { 
  createTemplate, 
  updateTemplate,
  deleteTemplate,
  fetchTemplate, 
  fetchTemplates, 

} from '../../redux/slices/templates'
import { GenericForm, GenericFormGroup, getCreateButtons, getUpdateButtons } from '../form'
import { MsgBox } from '../utils'
import { unwrapResult } from '@reduxjs/toolkit'

const tagFields = {
  tag:    { type:"input",label: "Tag", placeholder: "Create a tag for this question" },
  label:  { type:"input",label: "Label", placeholder: "Question to ask"},
  tip:    { type:"input",label: "Tip", placeholder: "Tips to ask more questions" },
  yes:    { type:"input",label: "Yes", placeholder: "Use this answer if Yes" },
  no:     { type:"input",label: "No", placeholder: "Use this answer if No" },
  comment:   { type:"hidden" },
  value:    {type: "hidden"},
}

const fields = {
  title:          { type:"input",label: "Title", placeholder: "Template name" },
  slug:           { type:"textarea",label: "Slug", placeholder: "Slug - search items", rows: 1 },
  presentation:   { type:"textarea",label: "Presentation" },
  conclusion:     { type:"textarea",label: "Conclusion" },
  differential:   { type:"editor",label: "Differential" }
}


const initialValues = {
  tag:      "", 
  label:    "", 
  tip:      "",
  yes:      "",
  no:       "",
  value:    0,
  comment:  "",
}

const validationSchema = Yup.object({
  tag:    Yup.string().required(),
  label:  Yup.string().required(),
  yes:    Yup.string().required(),
  no:     Yup.string().required(),
})

const TemplateIssuePreview = ({name,json,deleteTag,updateTag}) => {
  const dispatch = useDispatch()

  const keys  = json instanceof Object ? Reflect.ownKeys(json) : null

  if(!keys) {
    return <Fragment></Fragment>
  }
  //console.log(`templatepreview: ${JSON.stringify(_template)}`)
  return (
    <Fragment>
    <h3>Template Preview - {name}</h3><hr />
    {
      keys.map( (k,i) => {

        return (
          <Fragment key={i}>
          <div>
            <FontAwesomeIcon icon={faTrash} color="darkred"  onClick={() => deleteTag(k) } />{' '}
            <FontAwesomeIcon icon={faPencilAlt} color="darkgreen"  onClick={() => updateTag(k) } />{' '}
            { json[k].label }
          </div>
          <div><strong>YES: </strong>{ json[k].yes }</div>
          <div><strong>No: </strong>{ json[k].no }</div>
          <div><strong>TIP: </strong>{ json[k].tip }</div>
          <hr />
          </Fragment>
        )
      })
    }
    </Fragment>
  )
}

const createTemplateTags = (t) => {
  
  const keys = t instanceof Object ? Reflect.ownKeys(t) : null
  if(!keys){
    console.error(`${t} is not an Object - cannot create template tags`)
    return null
  }
  const _tags = keys.map( v => `{{#if ${v}.value}} ${t[v].yes} {{else}} ${t[v].no} {{/if}}{{${v}.comment}}`)
  _tags.push(' {{comment}}')
  return _tags.join(' ')
}


const _FormToJSON = (values,json) => {
  
  const _tag          = values['tag']
  if(!_tag) return json

  const tag           = _tag?_tag.toLowerCase().replace(/\s/g,'_'):null

  const tagValues     = {}
  for(const f in tagFields){
    if(f!=='tag')
      tagValues[f]   = values[f]
  }
  
  return {...json,[tag]:tagValues}
}

export const TemplateIssueUpdate = () => {
  const [msg,setMsg]      = useState([])
  const [json,setJSON]    = useState()
  const [selected,setSelected] = useState()

  const {id}              = useParams()
  const dispatch          = useDispatch()
  const history           = useHistory()

  useEffect( () => {
    dispatch(fetchTemplate(id)).then(unwrapResult)
    .then( data => { setJSON(data.json);setSelected(data) } )
    .catch( e => console.error(e) )

  },[id])

  const formik          = useFormik({
    initialValues: {...initialValues,...selected},
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: () => {

    }
  })

  const buttons = getUpdateButtons()

  //const handleSubmit= (values) => dispatch(createTemplate(values))
  const handleClose = (href="/templates/issues/") => history.push(href)

  // BUTTONS EVENTS
  buttons.close.onClick = () => handleClose()
  buttons.update.onClick  = () => {
    
    const values = {
      ...selected,
      ...formik.values,
      json: json,
      tags: createTemplateTags(json),
      
    }
    //console.log(JSON.stringify(values) + " xxxxxxx")
    
    dispatch(updateTemplate(values))
    .then(  data => handleClose() )
    .catch( e => setMsg["danger",`cannot updatetemplate: ${e}`] )
}
  
buttons['add_tag']        = { 
  label: 'Add Tag', 
  onClick:  (e) => {
  
    setJSON(_FormToJSON(formik.values,json))
    formik.setValues(initialValues)
  }
}
buttons['update_tag']        = { 
  label: 'Update Tag', 
  onClick:  (e) => {
  
    setJSON(_FormToJSON(formik.values,json))
    formik.setValues(initialValues)
  }
}

const deleteTag = (tag) => {
  const _json = {...json}
  delete _json[tag]
  setJSON(_json)
}

const updateTag = (tag) => {
  formik.setValues({...json[tag],tag})
}
 // console.log(`about to set template: ${JSON.stringify(_json)}`)
  return (
    <Row>
      <Col>
    <h3>Update Template - {selected && selected.title}</h3>
    <MsgBox msg={msg} />
  
      <GenericForm
      buttons={buttons}
      formik={formik}
      fields={tagFields}
      
      >
        <GenericFormGroup fields={fields} formik={formik} />
      </GenericForm>  
      
      </Col>
      <Col>
        <TemplateIssuePreview 
          name={selected && selected.title} 
          json={json}
          deleteTag={deleteTag}
          updateTag={updateTag} />
      </Col>
    </Row>
  )
}

export const TemplateIssueCreate = ({name,kind}) => {
  const [template, setTemplate] = useState({})

  const [msg,setMsg]      = useState([])
  const dispatch          = useDispatch()
  const history           = useHistory()
 

  const formik          = useFormik({
    initialValues: {...initialValues,title:name},
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: () => {

    }
  })

  const buttons = getCreateButtons()

  //const handleSubmit= (values) => dispatch(createTemplate(values))
  const handleClose = (href="/templates/") => history.push(href)

  // BUTTONS EVENTS
  buttons.close.onClick = () => handleClose()
  buttons.save.onClick  = () => {
    
    const tags = createTemplateTags(template)
    const values = {
      title:  name,
      json:   template,
      tags:   tags ,
    }
    for(const k in fields) {
      values[k] = formik.values[k]
    }
    //console.log(JSON.stringify(values) + " xxxxxxx")
    dispatch(createTemplate(values))
    .then(  data => handleClose() )
    .catch( e => setMsg["danger",`cannot save template: ${e}`] )
  }
  buttons['add_tag']        = { 
    label: 'Add Tag', 
    type: "submit",
    
    onClick: () => {
      const _tag          = formik.values['tag']
      const tag           = _tag?_tag.toLowerCase().replace(/\s/g,'_'):null
      if(!tag || template.hasOwnProperty(tag)) {
        setMsg(['danger',`the tag '${tag}' is not acceptable or already exists`])
        return
      }
      const tagValues        = {}
      for(const f in tagFields){
        if(f!=='tag')
          tagValues[f]   = formik.values[f]
      }
      
      const temp          = template
      temp[tag]           = {...tagValues}
      setTemplate(temp)
      console.log(JSON.stringify(temp))
      // clear fields
      for(const f in tagFields){
        tagValues[f]   = ' '
      }
      console.log(JSON.stringify(temp))
      
      console.log('about to set template')
      
      formik.setValues(initialValues)
    }
  }

  return (
    <Row>
      <Col>
    <h3>New Issue Template - {name}</h3>
    <MsgBox msg={msg} />
  
      <GenericForm
      buttons={buttons}
      formik={formik}
      fields={tagFields}
      children={<GenericFormGroup formik={formik} fields={fields} />}
      />
      
      </Col>
      <Col>
        <TemplateIssuePreview name={name} template={template}/>
      </Col>
    </Row>
  )
}


export const TemplateIssueList = () => {
  const [templates,setTemplates] = useState()
  const loading   = useSelector( state => state.templates.loading )

  const dispatch  = useDispatch()
  

  useEffect( () => dispatch(fetchTemplates()).then(unwrapResult)
                  .then(data => setTemplates(data))
                  .catch(e => console.error(e))
  ,[] )
  console.log("templateList")
  if(loading) {
    return (
      <p>loading ...</p>
    )
  }
  return (
    
    <Fragment>
      <Row style={{background:'lightgrey',padding: "5px 0", fontWeight: "bold"}}>
        <Col lg={2}>
          Title
        </Col>
        
        <Col>
          
        </Col>
      </Row>
      
      
        {
        templates && templates.map( (template, i) => {
          return (
            
            <Row style={{margin: "5px 0"}} key={i}> 
              <Col lg={2}>
                <FontAwesomeIcon onClick={() => dispatch(deleteTemplate(template))} style={{cursor:"hand"}} icon={faTrash} color="red"/>{' '}
                <Link to={`/templates/issues/${template.id}/update/`} >{template.title}</Link>
              </Col>
              
              
            </Row>   
          )
        })
        }
      
    </Fragment>
    
  )
}

export const TemplateCreate = (props) => {
  const [name,setName] = useState("")
  const [categoryName,setCategoryName] = useState("") 
  const [categories, setCategories] = useState([])
  const [symptomTag, setSymptomTag] = useState("")
  const [symptomLabel, setSymptomLabel] = useState("")
  const [symptomTip, setSymptomTip] = useState("")
  const [symptomYes, setSymptomYes] = useState("")
  const [symptomNo, setSymptomNo] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(0)
  
  const deleteSx = (cat,sx) => {
    
    const new_categories = categories.filter( c => {
      
      if(c.name === cat) 
        c.symptoms = c.symptoms.filter( s => s.name !== sx )
      return c 
    })
    setCategories(new_categories)
  }

  const deleteCat = (catName) => {
    const new_categories = categories.filter( c => c.name !== catName )
    setCategories(new_categories)
  }
  return (
    <React.Fragment>
      <Row>
        <Col><h2>New Template</h2></Col>
        <Col><h2>Template Preview</h2></Col>
      </Row>
      <Row>
        <Col>

          <Form key={5} onSubmit={e => e.preventDefault()}>
            <Form.Group>
            <Form.Control
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={ e=> setName(e.target.value) }
            placeholder="Name"
            />
            </Form.Group>
          </Form>
          <h4>Symptoms Categories</h4>
          <Form key={10} >
            <Form.Group>
              <Form.Control as="select" onChange={ e => {setSelectedCategory(e.target.value); }}>
                <option>Select Category ({categories.length})</option>
                
                {categories.map( (v, k) => {
                  return (<option key={k}>{v.name}</option>)
                })}
              </Form.Control>
            </Form.Group>
          </Form>
          <Form key={20} onSubmit={ 
              e => {
                e.preventDefault(); 
          
                let found = null
                const category = {
                  id: categoryName.trim().toLowerCase().replaceAll(" ","_"),
                  name: categoryName, 
                  symptoms: {}
                }
                found = categories.find( (v,i) => {
                  if(v.id === category.id)
                    return true

                })
                if(!found) {
                  categories.push(category)
                  setCategories(categories); 
                }
                setCategoryName("") 
              }} >
            <Form.Group>
              <Form.Control
                type="text"
                name="category_name"
                placeholder="Type a category name and press [Enter]"
                onChange={e => setCategoryName(e.target.value)}
                value={categoryName}
                />
            </Form.Group>
          </Form>
          <h4>Symptoms</h4>
          <Form onSubmit={ e => {e.preventDefault();
            
            categories.filter( cat => {
              
              if(cat.name === selectedCategory) {
                cat.symptoms[symptomTag] ={label:symptomLabel, tip:symptomTip, value:0,comment:"",yes: symptomYes,no:symptomNo}
                setSymptomLabel("")
                setSymptomYes("")
                setSymptomNo("")
                return cat
              }
            })
            setCategories(categories)
          }}>
            <Form.Group key={0}>
              <Form.Control
                type="text"
                name="symptom_tag"
                placeholder="Create a tag for this question"
                onChange={e => setSymptomTag(e.target.value) }
                value={symptomTag}
                />
            </Form.Group>
            <Form.Group key={1}>
              <Form.Control
                type="text"
                name="symptom_label"
                placeholder="Question to be asked"
                onChange={e => setSymptomLabel(e.target.value) }
                value={symptomLabel}
                />
            </Form.Group>
            <Form.Group key={2}>
              <Form.Control
                type="text"
                name="symptom_tip"
                placeholder="Tips to ask more questions"
                onChange={e => setSymptomTip(e.target.value)}
                value={symptomTip}
                />
            </Form.Group>
            <Form.Group key={3}>
              <Form.Control
                type="text"
                name="symptom_yes"
                placeholder="'Yes' answer for the question to be used in correspondence"
                onChange={e => setSymptomYes(e.target.value)}
                value={symptomYes}
                />
            </Form.Group>
            <Form.Group key={4}>
              <Form.Control
                type="text"
                name="symptom_no"
                placeholder="'No' answer for the question to be used in correspondence"
                onChange={e => setSymptomNo(e.target.value)}
                value={symptomNo}
                />
            </Form.Group>
            <Button type="submit">Add</Button>
          </Form>

        </Col>
        <Col>
          <h4>Name</h4>
          <p>{name}</p>
          <h4>Symptoms by Category</h4>
          <ul className="list-unstyled">
          {categories.map( (v, k) => {
            console.log(JSON.stringify(v))
            const keys = v.symptoms instanceof Object ? Reflect.ownKeys(v.symptoms) : null
            return (
            
              <li key={k} >
                  <FontAwesomeIcon onClick={ () => deleteCat(v.name) } icon={faTrash} color="red"/>
                  &nbsp;<strong>{v.name}</strong>
                  <ul className="">
                  {
                        
                        keys.map ( (k,j) => {
                          
                          return (
                            <li key={j}>
                              <FontAwesomeIcon onClick={() => deleteSx(v.name,v.symptoms[k].label)} icon={faTrash} color="red"/>
                              &nbsp;{v.symptoms[k].label}?{v.symptoms[k].tip?` - ${v.symptoms[k].tip}`:null}
                              <div><strong>Yes: </strong>{v.symptoms[k].yes}</div>
                              <div><strong>&nbsp;No: </strong>{v.symptoms[k].no}</div>
                            </li>
                          )
                        })

                    
                  }
                  </ul>
              </li>
            )
            
          })}
          </ul>     
        </Col>
        
      </Row>
    </React.Fragment>
  )
}