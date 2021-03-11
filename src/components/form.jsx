
import {Fragment} from 'react'
import {Form, Alert, Button, Collapse } from 'react-bootstrap'
import CKEditor from 'ckeditor4-react'

export const getCreateButtons = () => ({
  save: {
    label: 'Save',
    onClick: null,
  },
  save_close: {
    label: 'Save / Close',
    onClick: null,
  },
  save_continue:{
    label: 'Save / Continue',
    onClick: null,
  },
  close: {
    label: 'Close',
    onClick: null,
  }
  })  

export const getUpdateButtons = () => ({
  update: {
    label: 'Update',
    onClick: null,
  },
  update_close: {
    label: 'Update / Close',
    onClick: null,
  },
  update_continue: {
    label: 'Update / Continue',
    onClick: null,
  },
  close: {
    label: 'Close',
    onClick: null,
  }
})    

export const GenericField = (props) => {

  if( ["radio","checkbox"].includes(props.type))
    return (<Form.Check {...props}/>)
  if( ["textarea","input","select"].includes(props.type) )
    return (<Form.Control {...props}/>)
}

export const GenericForm = ({formik,fields,buttons,children,iVals}) => {
  const fKeys        = typeof fields  === 'object' ? Reflect.ownKeys(fields) : null
  const bKeys        = typeof buttons === 'object' ? Reflect.ownKeys(buttons) : null
  
  return (
    <Form onSubmit={formik.handleSubmit}>
      {children}
      { fKeys && fKeys.map ( (key,i) => {
        
        return (    
          <Form.Group key={i}>
         
            { (fields[key].type === 'checkbox' || fields[key].type === 'radio') && 
            <Form.Check
              id={key} name={key}
              type={fields[key].type} 
              onChange={fields[key].onChange?fields[key].onChange:formik.handleChange}
              value={formik.values[key]}
              {...fields[key]}
              checked={formik.values[key]}
            />    
            }
            { (fields[key].type === 'input' || fields[key].type === 'textarea' ||  fields[key].type === 'select') &&
              <Fragment>
                <Form.Label key={i} htmlFor={key} >{fields[key].label}</Form.Label>
                <Form.Control 
                  {...fields[key]}
                  id={key} name={key}
                  as={fields[key].type} 
                  rows={fields[key].rows?fields[key].rows:"5"}
                  children={fields[key].options && fields[key].options.map( (v,i) => <option key={i} value={v.value}>{v.name}</option>) } 
                  onChange={fields[key].onChange?(e) => {fields[key].onChange(e);formik.handleChange(e)} : formik.handleChange}
                  value={formik.values && formik.values[key]?formik.values[key]:' '}
                  
                />    
              </Fragment>
            }
            
            { fields[key].type === 'editor' &&
              <Fragment>
                <Form.Label key={i} htmlFor={key} >{fields[key].label}</Form.Label>
                <CKEditor
                  id={key} name={key}
                  type="classic"
                  data={formik.values[key]}
                  onChange={fields[key].onChange}
                  config={{
                    

                  }}
                />    
              </Fragment>
            }
            
            {formik.errors[key] && <Alert variant="danger">{formik.errors[key]}</Alert>}
          </Form.Group>      
                   
        ) 
      })}
      { bKeys && bKeys.map( (bkey,i) => {
          if(buttons[bkey].onClick !== null || buttons[bkey].type==="submit") {
            return (<Fragment key={i}><Button type={buttons[bkey].type?buttons[bkey].type:null} id={bkey} onClick={buttons[bkey].onClick}>{buttons[bkey].label}</Button>{' '}</Fragment>)
          }
            
        }
      )}
      
    </Form>
  )
}

export const GenericFormGroup = ({formik,fields,buttons,children}) => {
  const fKeys        = typeof fields  === 'object' ? Reflect.ownKeys(fields) : null
  const bKeys        = typeof buttons === 'object' ? Reflect.ownKeys(buttons) : null
  
  return (
    <>
      { fKeys && fKeys.map ( (key,i) => {
        
        return (    
          <Form.Group key={i}>
         
            { (fields[key].type === 'checkbox' || fields[key].type === 'radio') && 
            <Form.Check
              id={key} name={key}
              type={fields[key].type} 
              onChange={fields[key].onChange?fields[key].onChange:formik.handleChange}
              value={formik.values[key]}
              {...fields[key]}
              checked={formik.values[key]}
            />    
            }
            { (fields[key].type === 'input' || fields[key].type === 'textarea' ||  fields[key].type === 'select') &&
              <Fragment>
                <Form.Label key={i} htmlFor={key} >{fields[key].label}</Form.Label>
                <Form.Control 
                  {...fields[key]}
                  id={key} name={key}
                  as={fields[key].type} 
                  rows={fields[key].rows?fields[key].rows:5}
                  children={fields[key].options && fields[key].options.map( (v,i) => <option key={i} value={v.value}>{v.name}</option>) } 
                  onChange={fields[key].onChange?(e) => {fields[key].onChange(e);formik.handleChange(e)} : formik.handleChange}
                  value={formik.values[key]}
                  
                />    
              </Fragment>
            }
            
            { fields[key].type === 'editor' &&
              <Fragment>
                <Form.Label key={i} htmlFor={key} >{fields[key].label}</Form.Label>
                <CKEditor
                  id={key} name={key}
                  type="classic"
                  data={formik.values[key]}
                  onChange={fields[key].onChange}
                  config={{
                    

                  }}
                />    
              </Fragment>
            }
            
            {formik.errors[key] && <Alert variant="danger">{formik.errors[key]}</Alert>}
          </Form.Group>      
                   
        ) 
      })}
      { bKeys && bKeys.map( (bkey,i) => {
          if(buttons[bkey].onClick !== null || buttons[bkey].type==="submit") {
            return (<Fragment key={i}><Button type={buttons[bkey].type?buttons[bkey].type:null} id={bkey} onClick={buttons[bkey].onClick}>{buttons[bkey].label}</Button>{' '}</Fragment>)
          }
            
        }
      )}
  </>
  )
}