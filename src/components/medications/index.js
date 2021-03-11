import { Fragment } from 'react'
import { Table, Col, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { GenericForm } from '../form'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash, faTimesCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons'

import { MedicationCreate, MedicationUpdate } from './create'
import { createMedication, deleteMedication,setActiveMedication } from '../../redux/slices/medications'
import { useFormik } from 'formik'
import { unwrapResult } from '@reduxjs/toolkit'

export const MedicationSnippet = ({medications}) => {
  const {id}      = useParams()

  return (
    <Fragment>
      <h5><Link to={`/patients/patient/${id}/medications/create/`}><FontAwesomeIcon icon={faPlus} size="sm" color="green" /></Link>&nbsp;Medications</h5>
      <MedicationList medications={medications}/>
      <MedicationAdd />
    </Fragment>
    
  )
}

const MedicationAdd = () => {
  const dispatch  = useDispatch()
  const {id}      = useParams()

  const fields    = {
    medications: {
      type: "input",
      label: "Enter comma separated list of medications: ",
      placeholder: "Metformin 1 g bd, Aspirin"
    }
  }

  const formik = useFormik({
    initialValues: {medications:' '},
    enableReinitialize: true,
    onSubmit: (values,{resetForm}) => {
      const mds = values['medications'] ? values['medications'].replace(/,\s*$/,'').split(','): null
      
      const meds = mds && mds.map( m => {
        const medArray  = m.trim().split(/\s+/)
        const name      = medArray[0].charAt(0).toUpperCase() + medArray[0].slice(1)
        const drug      = {pid: id, name: name}
        if(medArray.length >= 4){
          drug['dose'] = `${medArray[1]} ${medArray[2]}`
          drug['frequency'] = medArray[3]
        } else if(medArray.length === 3) {
          if(['mg','mcg','g','ml','tab','cap'].includes(medArray[2]))
            drug['dose']      = `${medArray[1]} ${medArray[2]}`
          else {
            drug['dose']      = medArray[1]
            drug['frequency'] = medArray[2]
          }
        } 
        return drug
      })
      for( let i = 0; i < meds.length ; i++ ) {
        dispatch(createMedication(meds[i]))
      }
      console.log(JSON.stringify(meds))
    }
  })
  return (
    <GenericForm 
    fields={fields}
    formik={formik}
    />
  )
}

const MedicationList = ({medications}) => {
  const dispatch    = useDispatch()
    
  if(!medications || !medications.length)
    return (<p>Nil medications recorded</p>)

  return (
    
    <Table size="sm" striped bordered responsive>
      <thead>
        <tr>
          <th>Medication</th><th>Dose</th><th>Status</th>
        </tr>
      </thead>
      <tbody>
        {medications && medications.map( (medication, i) => {
          
          return (
            <Fragment  key={i}>
            <tr> 
              <td>
                <FontAwesomeIcon onClick={e => dispatch(deleteMedication(medication))} icon={faTrash} color="red"/>&nbsp;
                <Link to={`/patients/patient/${medication.pid}/medications/update`} onClick={(e) => dispatch(setActiveMedication(medication))}>{medication.name}</Link>
                {medication.comment && medication.comment }
              </td>
              <td>{medication.dose} {medication.frequency}</td>
              <td>
                { medication.ceased ? <FontAwesomeIcon icon={faTimesCircle} color="red" /> : <FontAwesomeIcon icon={faCheckCircle} color="green" /> }
              </td>
            </tr>
           
            </Fragment>
          )
        }
        )}
      </tbody>
    </Table>
  )
}


export const MedicationCreateContainer = () => {
  const {id}          = useParams()
  const medications   = useSelector(state => state.medications.allByPid[id])

  return (
    <Row>
      <Col>
        <MedicationCreate />
      </Col>
      <Col>
        <MedicationList medications={medications}/>
      </Col>
    </Row>
  )
}

export const MedicationUpdateContainer = () => {
  const {id}          = useParams()
  const medications   = useSelector(state => state.medications.allByPid[id])

  return (
    <Row>
      <Col>
        <MedicationUpdate />
      </Col>
      <Col>
        <MedicationList medications={medications}/>
      </Col>
    </Row>
  )
}

