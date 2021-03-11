import React, {Fragment, useState} from 'react'
import {Route, Link, useHistory} from 'react-router-dom'
import {Form,Row,Col, Button} from 'react-bootstrap'
import {useFormik} from 'formik'
import * as Yup from 'yup'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { GenericForm, getCreateButtons } from '../form'
import { MsgBox } from '../utils'

const fields = {
  tag:    { type:"input",label: "Tag", placeholder: "Create a tag for this question" },
  label:  { type:"input",label: "Label", placeholder: "Question to ask"},
  tip:    { type:"input",label: "Tip", placeholder: "Tips to ask more questions" },
  yes:    { type:"input",label: "Yes", placeholder: "Use this answer if Yes" },
  no:     { type:"input",label: "No", placeholder: "Use this answer if No" },
  button: { type:"submit",label: "Add Tag"  },
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

export const TemplateField = (props) => {

  const [template, setTemplate] = useState({})
  const [msg,setMsg]  = useState([])
  const history       = useHistory()

  const formik        = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: validationSchema
  })

  const buttons = getCreateButtons()
  buttons.close.onClick = () => history.push("/templates/")
  buttons.save.onClick  = () => {}
  
  fields.button.onClick    = () => {
    
    const values        = {...formik.values}
    const tag           = formik.values['tag']
    if(!tag || template.hasOwnProperty(tag)) {
      setMsg(['danger',`the tag '${tag}' is not acceptable or already exists`])
      return
    }
    delete values.tag
    const temp          = template
    temp[tag]           = values
    
    setTemplate(temp)
  }
  console.log(JSON.stringify(template))
  return (
    <Row>
      <Col>
    <h3>New Issue Template</h3>
    <MsgBox msg={msg} />
      <GenericForm
      buttons={buttons}
      formik={formik}
      fields={fields}
      />
      
      </Col>
    </Row>
  )
}