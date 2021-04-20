import { Fragment, useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { Link, NavLink, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPencilAlt,
  faEnvelope,
  faStethoscope,
  faFlask,
} from "@fortawesome/free-solid-svg-icons";

import { ConsultationCreate, ConsultationUpdate } from "./create";
import { fetchConsultationsByPid } from "../../redux/slices/consultations";

export const ConsultationSnippet = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [cons, setConsultations] = useState(null);

  useEffect(() => {
    dispatch(fetchConsultationsByPid(id))
      .then(unwrapResult)
      .then((data) => setConsultations(data))
      .catch((e) => console.error(e));
  }, [dispatch, id]);

  return (
    <Fragment>
      <Link to={`/patients/patient/${id}/consultations/create/`}>
        <h5>
          <FontAwesomeIcon icon={faPlus} />
          &nbsp;Consultations
        </h5>
      </Link>
      <ConsultationList consultations={cons} />
      <br />
    </Fragment>
  );
};

export const ConsultationCreateContainer = () => {
  const { id } = useParams();
  const consultations = useSelector(
    (state) => state.consultations.allByPid[id]
  );

  return (
    <Row>
      <Col lg={9}>
        <ConsultationCreate />
      </Col>
      <Col lg={3}>
        <h5>Past Consultations</h5>
        <ConsultationList consultations={consultations} />
      </Col>
    </Row>
  );
};

export const ConsultationUpdateContainer = () => {
  const { id } = useParams();
  const consultations = useSelector(
    (state) => state.consultations.allByPid[id]
  );

  return (
    <Row>
      <Col lg={8}>
        <ConsultationUpdate />
      </Col>
      <Col lg={4}>
        <h5>Consultations</h5>
        <ConsultationList consultations={consultations} />
      </Col>
    </Row>
  );
};

export const ConsultationList = ({ consultations }) => {
  if (!consultations || !consultations.length) {
    return <p>No consultations recorded</p>;
  }
  return (
    consultations &&
    consultations.map((consultation, i) => {
      let letter =
        consultation.letters && consultation.letters.length
          ? consultation.letters[0]
          : null;
      let exam =
        consultation.examinations && consultation.examinations.length
          ? consultation.examinations[0]
          : null;
      let results =
        consultation.results && consultation.results.length
          ? consultation.results[0]
          : null;

      let pid = consultation.patient.id;
      let cid = consultation.id;

      return (
        <Row key={i}>
          <Col>
            <NavLink
              to={`/patients/patient/${pid}/consultations/${cid}/update`}
              activeStyle={{ fontWeight: "bold" }}
            >
              {consultation.code}&nbsp;-&nbsp;
              {new Date(consultation.created_on).toLocaleDateString()}
            </NavLink>
            &nbsp;|&nbsp;
            {
              <Link
                to={`/patients/patient/${pid}/consultations/${cid}/update/`}
              >
                <FontAwesomeIcon color="green" icon={faPencilAlt} />
              </Link>
            }
            &nbsp;|&nbsp;
            {exam && (
              <Link
                to={`/patients/patient/${pid}/consultation/${cid}/examination/${exam.id}/update/`}
              >
                <FontAwesomeIcon color="green" icon={faStethoscope} />
              </Link>
            )}
            {!exam && (
              <Link
                to={`/patients/patient/${pid}/consultation/${cid}/examination/create/`}
              >
                <FontAwesomeIcon color="red" icon={faStethoscope} />
              </Link>
            )}
            &nbsp;|&nbsp;
            {results && (
              <Link
                to={`/patients/patient/${pid}/consultation/${cid}/results/${results.id}/update/`}
              >
                <FontAwesomeIcon color="green" icon={faFlask} />
              </Link>
            )}
            {!results && (
              <Link
                to={`/patients/patient/${pid}/consultation/${cid}/results/create/`}
              >
                <FontAwesomeIcon color="salmon" icon={faFlask} />
              </Link>
            )}
            &nbsp;|&nbsp;
            {!letter && (
              <Link
                to={`/patients/patient/${pid}/consultation/${cid}/letter/create/preview/`}
              >
                <FontAwesomeIcon icon={faEnvelope} color="darkred" />
              </Link>
            )}
            {letter && (
              <>
                <Link
                  to={`/patients/patient/${pid}/consultation/${cid}/letter/${letter.id}/update/`}
                >
                  <FontAwesomeIcon icon={faPencilAlt} color="green" />
                </Link>{" "}
                <Link
                  to={`/patients/patient/${pid}/consultation/${cid}/letter/${letter.id}`}
                >
                  {letter.title}
                </Link>
              </>
            )}
          </Col>
        </Row>
      );
    })
  );
};
