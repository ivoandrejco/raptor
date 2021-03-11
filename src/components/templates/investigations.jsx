import React, {Fragment, useEffect, useState} from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Row,Col } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons'

import { fetchTemplate, createTemplate, updateTemplate } from '../../redux/slices/templates'
import { GenericForm, GenericFormGroup, getCreateButtons, getUpdateButtons } from '../form'
import { MsgBox } from '../utils'
import { unwrapResult } from '@reduxjs/toolkit'

const tagFields = {
  tag:    { type:"input",label: "Tag", placeholder: "Create a tag for this investigation" },
  label:  { type:"input",label: "Label", placeholder: "Investigation name"},
  units:  { type:"input",label: "Units", placeholder: "Units" },
  order:  { type:"input",label: "Order", placeholder: "Order" },
}
const fields = {
  title:    { type:"input",label: "Title",   },
  slug:     { type:"input",label: "Slug",   placeholder: "Search items"},
}
const initialValues = {
  tag:      " ", 
  label:    " ", 
  units:    " ",
  date:     " ",
  value:    " ",
  comment:  " ",
}

const validationSchema = Yup.object({
  tag:    Yup.string().required(),
  label:  Yup.string().required(),
})

const TemplateInvestigationsJSONPreview = ({name,json,remove, update}) => {

  const keys  = json instanceof Object ? Reflect.ownKeys(json) : null

  if(!keys) {
    return <Fragment></Fragment>
  }

  keys.sort( (a,b) => {if(json[a].order && json[b].order){return parseInt(json[a].order) - parseInt(json[b].order)} else {return 0}})
  console.log(`templatepreview: ${JSON.stringify(keys)} `)
  return (
    <Fragment>
    <h3>Preview Template - {name}</h3><hr />
    {
      keys.map( (k,i) => {

        return (
          
          <div key={i}>
            {json[k].order}){' '}
            <FontAwesomeIcon icon={faPencilAlt} color="green"  onClick={() => update(k)} />{' '}
            <FontAwesomeIcon icon={faTrash} color="red"  onClick={() => remove(k)} />{' '}
            {json[k].label}: ... {json[k].units}
            <hr />
          </div>
          
        )
      })
    }
    </Fragment>
  )
}

export const TemplateInvestigationUpdate = () => {
  
  console.log('issueUpdate')
  const [template,setTemplate] = useState()
  const [json,setJSON]    = useState()
  const [aTag,setATag]    = useState()
  const [msg,setMsg]      = useState([])
  const {id}              = useParams()
  const dispatch          = useDispatch()
  const history           = useHistory()

  const formik            = useFormik({
    initialValues: {...initialValues},
    enableReinitialize: true,
   // validationSchema: validationSchema,
    onSubmit: () => {
 
      const values = {
        id: id,
        json: json,
      }
      console.log(`updateTemplate values: ${JSON.stringify(values)}`)
      dispatch(updateTemplate({kind:'investigation',data:values}))
      .then(  () => handleClose() )
      .catch( e => setMsg["danger",`cannot updateTemplate (${template.title}): ${e}`] )
    
    }
  })

  useEffect( () => dispatch(fetchTemplate({kind:'investigation',id:id})).then(unwrapResult)
                  .then( data => {setTemplate(data);setJSON(data.json)})
                  .catch( e => console.error(e) )
  ,[id])
  const buttons = getUpdateButtons()

  const handleClose = (href="/templates/") => history.push(href)

  // BUTTONS EVENTS
  buttons.close.onClick   = () => handleClose()
  buttons.update.type     = "submit"
  
   
  buttons.add_tag        = { 
    label:    'Add Tag',  
    onClick:  () => {
    
      const values        = {...formik.values}
      const tag           = formik.values['tag']
      const label         = formik.values['label']

      if(!tag || json.hasOwnProperty(tag)) {
        setMsg(['danger',`the tag '${tag}' is not acceptable or already exists`])
        return
      }
      delete values.tag
      setJSON({...json,[tag]:values})
    
      formik.handleReset()
      console.log(`updated template: ${JSON.stringify(json)}`)
    }
  }

  buttons.update_tag        = { 
    label:    'Update Tag',  
    onClick:  () => {
    
      const values        = {...formik.values}
      const tag           = formik.values['tag']
      const label         = formik.values['label']

      if(aTag || json.hasOwnProperty(aTag)) {
        delete values[aTag]
        let _json = {...json}
        delete _json[aTag]
        setJSON({..._json,[tag]:values})
        setMsg(['success',`the tag '${aTag}' was update`])
        return
      }
    }
  }

  const removeTag = (k) => {    
    const copy_json = {...json}
    delete copy_json[k]
    setJSON(copy_json)
  }
  const updateTag = (k) => {
    setATag(k)
    formik.setValues({...json[k],tag:k})
  }
 // console.log(`about to set template: ${JSON.stringify(_json)}`)
  return (
    template ? (<Row>
      <Col>
        <MsgBox msg={msg} />
        <h3>Update Template - {template.title}</h3>

        <GenericForm
        buttons={buttons}
        formik={formik}
        fields={tagFields}
        />
        
        </Col>
        <Col>
          <TemplateInvestigationsJSONPreview 
            name={template.title} 
            json={json}
            remove={removeTag}
            update={updateTag}
          />
        </Col>
    </Row>
    ) : (
      <h4>no template found - something went wrong</h4>
    )
  )
}

export const TemplateInvestigationCreate = ({name,kind}) => {
  const [json, setJSON]   = useState({})

  const [msg,setMsg]      = useState([])
  const dispatch          = useDispatch()
  const history           = useHistory()

  const formik            = useFormik({
    initialValues: {...initialValues},
    enableReinitialize: true,
 //   validationSchema: validationSchema,
    onSubmit: () => {
      console.log('TemplateINvestigationCreate')
    }

  })
  
  const buttons = getCreateButtons()

  //const handleSubmit= (values) => dispatch(createTemplate(values))
  const handleClose = (href="/templates/") => history.push(href)

  // BUTTONS EVENTS
  buttons.close.onClick = () => handleClose()
  buttons.save.onClick  = (e) => {
    const values = {
    
      title:  name,
      kind:   "Investigation",
      json:   json,
      tags:   "",
      hints:  "",
      comment: ""
    }
    

    dispatch(createTemplate({kind:'investigation',data:values})).then(unwrapResult)
    .then(  data => {console.log('created Template'); handleClose()} )
    .catch( e => setMsg["danger",`cannot save template: ${e}`] )
    //handleClose()
  }

  buttons['add_tag']        = { label: 'Add Tag', type: "submit"}
  buttons.add_tag.onClick   = () => {
    
    const values        = {...formik.values}
    const tag           = formik.values['tag'].toLowerCase().replace(/\s+/g,'_')
    if(!tag || json.hasOwnProperty(tag)) {
      setMsg(['danger',`the tag '${tag}' is not acceptable or already exists`])
      return
    }
    delete values.tag
    setJSON({...json,[tag]:values})
    formik.handleReset()
  }

  return (
    <Row>
      <Col>
    <h3>New Investigation Template - {name}</h3>
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
        <TemplateInvestigationsJSONPreview name={name} json={json}/>
      </Col>
    </Row>
  )
}
