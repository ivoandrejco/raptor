import { useEffect } from 'react'
import { Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchConsultations, deleteConsultation, setActiveConsultation } from '../redux/slices/consultations'


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

export const ConsultationsContainer = () => {
  const dispatch      = useDispatch()
  const consultations = useSelector( state => state.consultations.all )

  useEffect( () => dispatch(fetchConsultations()),[] ) 

  return (
    
      <Table size="sm" striped bordered responsive>
  
  { consultations && consultations.map( (consultation, i) => {
    
    return (
      <tbody>
      <tr key={i} style={{background:"#efefef"}}> 
        <td>
          <FontAwesomeIcon onClick={() => dispatch(deleteConsultation(consultation))} style={{cursor:"hand"}} icon={faTrash} color="red"/>{' '}
          <Link to={`/patients/patient/${consultation.pid.id}/`} >
          {consultation.pid.name}
          </Link>
        </td>
        <td>
        {new Date(consultation.created_on).toLocaleString()}
        </td>
        <td colSpan={2}>
          <strong>Code: </strong>{consultation.code}
        </td>
        <td colSpan={2}>
          <strong>Letter(s): </strong>{consultation.letters.map( l => l.status)}
        </td>
      </tr>
      </tbody>
    )
  })}

    </Table>
    
  )
}

