import { Fragment, useEffect, useState } from 'react'

import { Row, Col, Table, Alert } from 'react-bootstrap'

import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import {useFormik} from 'formik'
import {parse,isDate} from 'date-fns'
import qs from 'qs'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

import  {ClaimForm,initialValues, getFields, validationSchema} from './form'
import {
  createClaim, deleteClaim, fetchClaims, 
  createClaimPaid, fetchClaimsPaid,  
  fetchProviderNumbers
} from '../../redux/slices/billings'

import { unwrapResult } from '@reduxjs/toolkit'


const Claims = ({claims}) => {
  const dispatch      = useDispatch()
  const loading       = useSelector( (state) => state.billings.loading )
  const [msg,setMsg]  = useState([])
  

  if(loading)
    return (<Fragment><h3>Billing Claims</h3><p>Loading claims ...</p></Fragment>)

  if(!claims || !claims instanceof Array || !claims.length)
    return (<Fragment><h3>Billing Claims</h3><p>No claims found</p></Fragment>)
  
  return (
    <Fragment>
      <h3>Billing Claims</h3>
      {msg && msg.length === 2 && <Alert variant={msg[0]}>{msg[1]}</Alert> }
      <Table size="sm" striped bordered responsive>
      <thead>
        <tr>
          <th>Patient Name</th><th>Billed On</th><th>Code</th><th>Amount</th><th>Billed By</th>
        </tr>
      </thead>
      <tbody>
        { claims && claims.map( (claim, i) => {
          
          return (
            <tr key={i}> 
              <td>
                <FontAwesomeIcon onClick={ 
                  () => dispatch(deleteClaim(claim))
                  .then(unwrapResult)
                  .then(()=> setMsg(["success",`The claim for ${claim.fname} ${claim.lname} deleted successfully`]))
                  .catch((err)=> setMsg(["danger",`The claim for ${claim.fname} ${claim.lname} could not be deleted ${JSON.stringify(err)}`]))
                  } 
                  icon={faTrash} 
                  color="red"/>
                  &nbsp;{claim.fname}&nbsp;{claim.lname}
              </td>
              <td>{claim.billed_on}</td>
              <td>{claim.code}</td>
              <td>{claim.amount}</td>
              <td>{claim.billed_by}</td>
            </tr>
          )
        }
        )}
      </tbody>
    </Table>
    </Fragment>
  )
}

const amounts = {
  '110':134.3,
  '116':67.2
}

export const ClaimCreate = () => {
  const [msg,setMsg]  = useState([])
  const dispatch      = useDispatch()
  const history       = useHistory()
  const formik        = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    enableReinitialize: true,

  })

  useEffect( (state) => {
    dispatch(fetchProviderNumbers())
  },[dispatch,fetchProviderNumbers])

  
  
  const pns     = useSelector( state => state.billings.providerNumbers )
  const fields  = getFields()
  fields.billed_by.options.push(...pns.map( v => { return {value: v.id, name: `${v.doctor} / ${v.practice}`} } ))


  fields.code.onChange = (e) => { //alert(e.target.name + e.target.value)
    if(e.target.name === 'code' && amounts[e.target.value]) {
      formik.values.amount = amounts[e.target.value]
    }
    formik.handleChange(e)
  } 
  
  const handleCancel = () => {
    history.push("/billings/claims/")
  }

  const handleSubmit = (values) => {
    return dispatch(createClaim(qs.stringify(values))).then(unwrapResult)
  }

  const handleSaveAndClose = (e) => {
    if(!formik.isValid){
      setMsg(["danger",`The claim for ${formik.values['fname']} ${formik.values['lname']} could not be created: ${JSON.stringify(formik.errors)}`])
      return false
    }
     
    handleSubmit(formik.values)
    .then(() => handleCancel())
    .catch((err)=> setMsg(["danger",`The claim for ${formik.values['fname']} ${formik.values['lname']} could not be created: ${JSON.stringify(err)}`]))
  }


  const handleSaveAndContinue = (e) => {
    if(formik.errors instanceof Array && formik.errors.length > 0){
      setMsg(["danger",`The claim for ${formik.values['fname']} ${formik.values['lname']} could not be created: ${JSON.stringify(formik.errors)}`])
      return false
    }
     

    handleSubmit(formik.values)
    .then((obj)=> {setMsg(["success",`The claim for ${obj.fname} ${obj.lname} created successfully`]); formik.resetForm({values: {lname:'',fname:''}}) })
    .catch((err)=> setMsg(["danger",`The claim for ${formik.values['fname']} ${formik.values['lname']} could not be created: ${JSON.stringify(err)}`]))
  }

  const buttons = [
    {
      id: 'save_close',
      label: 'Save / Close',
      onClick: handleSaveAndClose
    },
    {
      id: 'save_continue',
      label: 'Save / Continue',
      onClick: handleSaveAndContinue
    },
    {
      id: 'close',
      label: 'Close',
      onClick: handleCancel
    }    
  ]
  return (
    <Fragment>
      <h3>New Claim</h3>
      {msg && msg.length == 2 && <Alert variant={msg[0]}>{msg[1]}</Alert>}
      <ClaimForm 
        formik={formik} 
        fields={fields}
        buttons={buttons}
      />
    </Fragment>
  )
}

export const ClaimsContainer = () => {
  const dispatch  = useDispatch()

  useEffect( (state) => {
    dispatch(fetchClaims())
  },[dispatch,fetchClaims])

  const claims = useSelector( state => state.billings.claims)

  return (
    <Claims claims={claims} />
  )
}
export const ClaimCreateContainer = () => {

  return (
    
    <Row>
        <Col lg={4}>
          <ClaimCreate />
        </Col>
        <Col>
          <ClaimsContainer />
        </Col>
    </Row>
    
  )
}


export const ClaimsPaid = ({claims}) => {

  if(!claims || !claims instanceof Array || !claims.length)
  return (<Fragment><h3>Claims Paid</h3><p>No claims paid found</p></Fragment>)

return (
  <Fragment>
    <h3>Claims Paid</h3>
    <Table size="sm" striped bordered responsive>
    <thead>
      <tr>
        <th>Patient Name</th><th>Paid On</th><th>Code</th><th>Amount</th><th>Billed By</th>
      </tr>
    </thead>
    <tbody>
      { claims && claims.map( (claim, i) => {
        
        return (
          <tr key={i}> 
            <td>
              <FontAwesomeIcon icon={faTrash} color="red"/>&nbsp;
               {claim.fname}&nbsp;{claim.lname}
            </td>
            <td>{claim.billed_on}</td>
            <td>{claim.code}</td>
            <td>{claim.amount}</td>
            <td>{claim.billed_by}</td>
          </tr>
        )
      }
      )}
    </tbody>
  </Table>
  </Fragment>
)
}

export const ClaimsPaidContainer = () => {
  const dispatch  = useDispatch()

  useEffect( (state) => {
    dispatch(fetchClaimsPaid())
  },[dispatch,fetchClaims])

  const claims = useSelector( state => state.billings.claimsPaid)

  return (
    <ClaimsPaid claims={claims} />
  )
}

export const ClaimPaidCreate = () => {
  const dispatch  = useDispatch()
  const formik    = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      //console.log(JSON.stringify(values))
      const ds = values["billed_on"].split("/")
      values["billed_on"] = ds && ds.length === 3 ? `${ds[2]}-${ds[1]}-${ds[0]}` : values["billed_on"]
      dispatch(createClaimPaid(qs.stringify(values)))
    }
  })

  useEffect( (state) => {
    dispatch(fetchProviderNumbers())
  },[dispatch,fetchProviderNumbers])

  const pns = useSelector( state => state.billings.providerNumbers )
  
  const opts = {
    billed_by: pns.map( v => {
      return {value: v.id, name: `${v.doctor} - ${v.number} - ${v.practice}`}
    })
  }

  return (
    <Fragment>
      <h3>New Claim</h3>
      <ClaimForm href="/billings/claimspaid" btnSubmit="Save" formik={formik} options={opts}/>
    </Fragment>
  )
}
export const ClaimPaidCreateContainer = () => {
  return (
    
    <Row>
        <Col lg={4}>
          <ClaimPaidCreate />
        </Col>
        <Col>
          <ClaimsPaidContainer />
        </Col>
    </Row>
    
  )
}