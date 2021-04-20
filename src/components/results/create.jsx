import { useState, Fragment, useEffect, useRef } from "react";
import { Button, Col, Collapse, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { unwrapResult } from "@reduxjs/toolkit";
import { useFormik } from "formik";
import { getByKind } from "../../redux/slices/schemas";
import { SchemaForm, getInitialValues } from "../forms";

const ResultSchema = ({ schema, addSchema }) => {
  const [open, setOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const colRef = useRef(null);

  const formik = useFormik({
    initialValues: getInitialValues(
      schema.json.map((f) => {
        let c = {};
        if (f["collected"]) c[`${f.name}_collected`] = f["collected"];
        else c[`${f.name}_collected`] = new Date().toLocaleDateString();

        return { ...f, ...c };
      })
    ),
    enableReinitialize: true,
    onSubmit: (values) => {
      const json = schema.json.map((f) => ({
        ...f,
        value: values[f.name],
        collected: values[`${f.name}_collected`],
      }));
      // console.log(JSON.stringify({ ...schema, json: json }));
      addSchema({ ...schema, json: json });
      setAdded(true);
    },
  });

  console.log(formik.values);
  const buttons = [
    {
      label: "Add",
      type: "submit",
      block: true,
      variant: "success",
    },
  ];
  return (
    <>
      <Row>
        <Col lg={2}>
          <Button
            onClick={() => setOpen(!open)}
            aria-controls={schema.id}
            aria-expanded={open}
            block
            variant={added ? "success" : "primary"}
          >
            {schema.title}
          </Button>
        </Col>
        <Col>
          <Collapse ref={colRef} in={open}>
            <div ref={colRef} id={schema.id}>
              <SchemaForm
                key={schema.id}
                formik={formik}
                buttons={buttons}
                schema={schema}
                collected={true}
              />
            </div>
          </Collapse>
        </Col>
      </Row>
      <hr />
    </>
  );
};
export const ResultCreate = () => {
  const [schemas, setSchemas] = useState([]);
  const [results, setResults] = useState([]);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(
    () =>
      dispatch(getByKind("investigation"))
        .then(unwrapResult)
        .then((data) => setSchemas(data))
        .catch((e) => console.error(e.response.data)),
    [dispatch]
  );

  const addSchema = (schema) => {
    console.log(JSON.stringify(schema));
    setResults(results.filter((f) => f.id === schema.id).concat([schema]));
  };

  return (
    <>
      <h3>Results</h3>
      <br />
      {schemas.map((t) => (
        <ResultSchema key={t.id} schema={t} addSchema={addSchema} />
      ))}
      <Button onClick={(e) => history.goBack()}>Cancel</Button>
    </>
  );
};
