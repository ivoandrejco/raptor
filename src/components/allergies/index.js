import { Fragment, useEffect } from 'react'
import { Row, Col, Table } from 'react-bootstrap'
import {Link, useParams} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'

import { AllergyCreate, AllergyUpdate } from './create'
import { fetchAllergiesByPid, deleteAllergy, setActiveAllergy } from '../../redux/slices/allergies'



export const AllergySnippet = () => {
  const {id}      = useParams()
  const dispatch  = useDispatch() 
  const allergies = useSelector(state => state.allergies.allByPid[id])
  useEffect( () => {
    dispatch(fetchAllergiesByPid(id))
  })

  return (
    <Fragment>
    <h5><Link to={`/patients/patient/${id}/allergies/create/`}><FontAwesomeIcon icon={faPlus} size="sm" color="green" /></Link>&nbsp;Allergies</h5>
    <AllergyList allergies={allergies}/>
    </Fragment>
  )
}

export const AllergyCreateContainer = () => {
  const {id}      = useParams()
  const allergies = useSelector(state => state.allergies.allByPid[id])

  return (
    <Row>
      <Col>
        <AllergyCreate />
      </Col>
      <Col>
        <AllergyList allergies={allergies}/>
      </Col>
    </Row>
  )
}

export const AllergyUpdateContainer = () => {
  const {id}      = useParams()
  const allergies = useSelector(state => state.allergies.allByPid[id])

  return (
    <Row>
      <Col>
        <AllergyUpdate />
      </Col>
      <Col>
        <AllergyList allergies={allergies}/>
      </Col>
    </Row>
  )
}


export const AllergyList = ({allergies}) => {
  const dispatch  = useDispatch()
  
  if(!allergies || !allergies.length) {
    return (
      <p>No allergies recorded</p>
    )
  }
  return (
    
    <Table size="sm" striped bordered responsive>
      <thead>
        <tr>
          <th>Drug</th><th>Reaction</th>
        </tr>
      </thead>
      <tbody>
        {allergies.map( (allergy, i) => {
          
          return (
            <tr key={i}> 
              <td>
                <FontAwesomeIcon onClick={() => dispatch(deleteAllergy(allergy))} style={{cursor:"hand"}} icon={faTrash} color="red"/>{' '}
                <Link to={`/patients/patient/${allergy.pid}/allergies/update`} onClick={(e) => dispatch(setActiveAllergy(allergy))}>{allergy.drug}</Link>
              </td>
              <td>{allergy.reaction}</td>
            </tr>
          )
        })}
      </tbody>
    </Table>
    
  )
}