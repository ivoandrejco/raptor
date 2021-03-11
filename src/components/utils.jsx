import { useState } from 'react'

import { Alert, Modal, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'


export const MsgBox = ({msg}) => {
  if(!msg || !msg instanceof Array || msg.length !== 2)
    return null

  return (
    <Alert variant={msg[0]}>{msg[1]}</Alert>
  )
}


export const ConfirmDialog = ({title,body,handleConfirm}) => {
  const [ show, setShow ]   = useState(false)

  return (
    <>
      
      <FontAwesomeIcon icon={faTrash} onClick={() => setShow(true)} color="red"/>

      <Modal
        show={show}
        onHide={ () => setShow(false) }
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {body}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={ () => setShow(false) }>
            Close
          </Button>
          <Button variant="primary" onClick={( ) => {handleConfirm(); setShow(false)} }>Delete</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export const getAge   = (dateString) => {
  var today     = new Date();
  var birthDate = new Date(dateString);
  var age       = today.getFullYear() - birthDate.getFullYear();
  var m         = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
  }
  return age;
}
