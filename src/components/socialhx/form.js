import {Fragment, useState} from 'react'
import {Form, Button, Col, Row} from 'react-bootstrap'
import  Handlebars from 'handlebars'


const SocialHxForm = ({formik,fields,buttons}) => {
  const [mTpl, setTemplate] = useState({__html:""})

  const fKeys     = typeof fields  === 'object' ? Reflect.ownKeys(fields) : null
  const bKeys     = typeof buttons === 'object' ? Reflect.ownKeys(buttons) : null

  let template    = null
  try {
    template    = Handlebars.compile(formik.values["template"])
  } catch(e) {
    console.error(e)
  }
  

  const processTemplate  = () => {
    try {
      const html = template(formik.values)
      setTemplate({__html:html})
      formik.values['template_value'] = html
    } catch(e) {
      console.error(e)
    }
  }

  const onBlur = (e) => {
    if(e.target.name === 'template') {
      template = Handlebars.compile(e.target.value)
    }
    processTemplate()
  }
  

  return (
    <Form onSubmit={(e) => {processTemplate();}}>
        <Form.Row>
      <Col>
        
          { fKeys.map ( (key,i) => {  
       
            return (
              <Form.Group key={i}>
                <Form.Label htmlFor={fields[key].name}>{fields[key].label} - Tag: {`{{${key}}}`}</Form.Label>
              <Form.Control
                id={key}
                {...fields[key]}
                as={fields[key].type}
                onChange={formik.handleChange}
                onBlur={onBlur}
                value={formik.values[key]}
              />    
              </Form.Group>    
            )
      
          })}
        
      </Col>

      <Col>
    
              <Form.Label htmlFor="template">Template</Form.Label>
              <Form.Control
                id="template"
                name="template"
                as="textarea"
                value={formik.values["template"]}
                rows={5}
                onChange={formik.handleChange}
                onBlur={onBlur}
              />    
              
        <div style={{fontStyle: "italic"}} dangerouslySetInnerHTML={mTpl} />  
        <br />
        { bKeys && bKeys.map( (bkey,i) => {
          if(buttons[bkey].onClick)
            return (<Fragment key={i}><Button id={bkey} onClick={buttons[bkey].onClick}>{buttons[bkey].label}</Button>{' '}</Fragment>)
        }
        )}
      </Col>
      </Form.Row>
    </Form>
  )
}

export default SocialHxForm