import {Fragment} from 'react'
import {Form, Alert, Button } from 'react-bootstrap'
import * as Yup from 'yup'


function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}

export const getFields = () => {
  return {
    fname: { 
      type: "input",
      label: "First Name",
    },
    lname: {
      type: "input",
      label: "Last Name",
    },
    code: {
      type: "input",
      label: "Code",
    },
    amount: {
      type: "input",
      label: "Amount",
    },
    billed_on : {
      type: "input",
      label: "Billed On", 
      placeholder: "YYYY-MM-DD"
    },
    billed_by : {
      type: "select",
      label: "Billed By",   
      options: [{value: null, name: "Select Doctor"}]  
    }      
  }

}

export const initialValues = {
  fname:"", 
  lname: "", 
  code: "",
  amount: 0.00,
  billed_on: formatDate(new Date()),
  billed_by: "",
}

export const validationSchema = Yup.object({
  fname: Yup.string().required(),
  lname: Yup.string().required(),
  code: Yup.number().required(),
  billed_on: Yup.date().max(new Date()).required(),
  billed_by: Yup.string().required(),
  amount: Yup.number().required(),
})


export const ClaimForm = ({formik,fields,buttons}) => {
  const keys        = Reflect.ownKeys(fields)
  return (
    <Form onSubmit={formik.handleSubmit}>
      { keys.map ( (key,i) => {
        return (    
          <Form.Group key={i}>
          <Form.Label key={i} htmlFor={key} >{fields[key].label}</Form.Label>
            <Form.Control 
              id={key} name={key}
              as={fields[key].type} 
              children={fields[key].options && fields[key].options.map( (v,i) => <option key={i} value={v.value}>{v.name}</option>) } 
              onChange={fields[key].onChange?fields[key].onChange:formik.handleChange}
              value={formik.values[key]}
              {...fields[key]}
            />    
            {formik.errors[key] && <Alert variant="danger">{formik.errors[key]}</Alert>}
          </Form.Group>               
        ) 
      })}
      { buttons.map( (btn,i) => 
        <Fragment key={i}><Button id={btn.id} onClick={btn.onClick?btn.onClick:null}>{btn.label}</Button>{' '}</Fragment>
      )}
      
    </Form>
  )
}