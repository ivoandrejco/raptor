import { Fragment } from 'react'
import { Row, Col, Table } from 'react-bootstrap'
import {Link, useParams} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import {useFormik} from 'formik'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'

import { GenericForm } from '../form'

import {createComorbidity, updateComorbidity, deleteComorbidity, setActiveComorbidity} from '../../redux/slices/comorbidities'
import { ComorbidityCreate, ComorbidityUpdate }  from './create'


export const ComorbiditySnippet = () => {
  const {id}  = useParams()
  const comorbidities = useSelector(state => state.comorbidities.allByPid[id])
  if(id)
    return (
      <Fragment>
        <h5><Link to={`/patients/patient/${id}/comorbidities/create/`}><FontAwesomeIcon icon={faPlus} size="sm" color="green" /></Link>&nbsp;Comorbidities</h5>
        <ComorbidityList comorbidities={comorbidities} />  
        <ComorbiditiesAdd />
      </Fragment>
    )
  else
    return (
      <div>Cannot show comorbidities for unknown patient</div>
    )
}

const ComorbiditiesAdd = () => {
  const dispatch  = useDispatch()
  const {id}      = useParams()

  const fields    = {
    comorbidities: {
      type: "input",
      
      label: "Enter comma separated list of comorbidities:",
      tip: "Diabetes mellitus type 2 - HbA1c 6.5%, Hypertension",
    }
  }

  const formik = useFormik({
    initialValues: {comorbidities:' '},
    enableReinitialize: true,
    onSubmit: (values,{resetForm}) => {
      const lines = values['comorbidities'] ? values['comorbidities'].replace(/,\s*$/,'').split(','): null
      
      const items = lines && lines.map( m => {
        const itemArray  = m.trim().split(/\s+-\s+/)
        const name       = itemArray[0].charAt(0).toUpperCase() + itemArray[0].slice(1)
        const item       = { pid: id, name: name }
        if(itemArray.length === 2)
          item['comment'] = itemArray[1]
          
        return item
      })
      for( let i = 0; i < items.length ; i++ ) {
        dispatch(createComorbidity(items[i]))
      }
      console.log(JSON.stringify(items))
    }
  })
  return (
    <GenericForm 
    fields={fields}
    formik={formik}
    />
  )
}

export const ComorbidityList = ({comorbidities}) => {
  const {id}            = useParams()
  const dispatch        = useDispatch()
  
  if(!comorbidities || !comorbidities.length) {
    return (
      <p>No comorbidities recorded</p>
    )
  }
  return (
    <Table size="sm" striped bordered responsive>
      <thead>
        <tr>
          <th>Comorbidity</th><th>Comment</th>
        </tr>
      </thead>
      <tbody>
        {comorbidities.map( (comorbidity, i) => {
          return (
            <tr key={i}> 
              <td>
                <FontAwesomeIcon onClick={() => dispatch(deleteComorbidity(comorbidity))} icon={faTrash} color="red"/>&nbsp;
                <Link to={`/patients/patient/${comorbidity.pid}/comorbidities/update/`} onClick={(e) => dispatch(setActiveComorbidity(comorbidity))}>{comorbidity.name}</Link>      
              </td>
              <td>{comorbidity.comment}</td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export const ComorbidityCreateContainer = () => {
  const {id}          = useParams()
  const comorbidities = useSelector(state => state.comorbidities.allByPid[id])

  return (
    <Row>
      <Col>
        <ComorbidityCreate />
      </Col>
      <Col>
        <ComorbidityList comorbidities={comorbidities}/>
      </Col>
    </Row>
  )
}

export const ComorbidityUpdateContainer = () => {
  const {id}          = useParams()
  const comorbidities = useSelector(state => state.comorbidities.allByPid[id])

  return (
    <Row>
      <Col>
        <ComorbidityUpdate />
      </Col>
      <Col>
        <ComorbidityList comorbidities={comorbidities}/>
      </Col>
    </Row>
  )
}

