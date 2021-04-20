import { useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { useFormik } from "formik";
import { useHistory, Link, useParams } from "react-router-dom";
import * as Yup from "yup";

import { MsgBox } from "../utils";

import { GenericForm, PreviewForm, getInitialValues } from "../forms";
import { createSchema, fetchSchemas } from "../../redux/slices/schemas.js";

const tagFields = {
  label: {
    name: "label",
    type: "input",
    label: "Label",
    value: "",
    placeholder: "Result",
  },
  units: {
    name: "units",
    type: "input",
    label: "Units",
    value: "",
    placeholder: "Units",
  },
  order: {
    name: "order",
    type: "input",
    label: "Order",
    value: "",
    placeholder: "Order",
  },
  type: {
    name: "type",
    type: "select",
    label: "Type",
    value: "",
    options: [
      { value: "", name: "Select Type" },
      { value: "input", name: "Short Text" },
      { value: "textarea", name: "Long Text" },
      { value: "file", name: "File" },
    ],
    placeholder: "Type",
  },
};

const tagValidationSchema = Yup.object({
  label: Yup.string().required(),
  order: Yup.number().required(),
  type: Yup.string().required(),
});

const schemaFields = {
  title: {
    name: "title",
    type: "input",
    label: "Name",
    value: "",
    placeholder: "Name",
  },
  ordering: {
    name: "ordering",
    type: "input",
    label: "Ordering",
    value: 0,
    placeholder: "Ordering",
  },
  kind: {
    name: "kind",
    type: "select",
    options: [
      { value: "", name: "Select Type" },
      { name: "Investigation", value: "investigation" },
      { name: "Issue", value: "issue" },
    ],
    label: "Schema Type",
    value: "",
  },
};

const schemaValidationSchema = Yup.object({
  title: Yup.string().required(),
  kind: Yup.string().required(),
});

const SchemaPreview = ({ fields, setFields, setInitialField }) => {
  const handleUpdate = (f) => {
    console.log("update" + f);
    setInitialField(f);
  };

  const handleDelete = (f) => {
    setFields(fields.filter((field) => field.name !== f.name));
    console.log("delete" + f.name);
  };
  return (
    <>
      <h4>Schema Preview</h4>
      <PreviewForm
        fields={fields}
        handleUpdate={handleUpdate}
        handleDelete={handleDelete}
      />
    </>
  );
};

const SchemaFields = ({ fields, setFields, initialField, setInitialField }) => {
  const history = useHistory();

  const formik = useFormik({
    initialValues: initialField ? initialField : getInitialValues(tagFields),
    validationSchema: tagValidationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      let name = values["label"].toLowerCase().replace(/\s+/g, "_");
      setFields(
        fields
          .filter((t) => {
            if (t && t.name !== name) {
              return t;
            }
            return null;
          })
          .concat([
            {
              ...values,
              value: "",
              name: name,
              placeholder: values["units"],
            },
          ])
          .sort((a, b) => parseInt(a.order) - parseInt(b.order))
      );
      setInitialField(getInitialValues(tagFields));
      resetForm();
      console.log(fields);
    },
  });

  const buttons = [
    {
      label: "Add",
      type: "submit",
    },
    {
      label: "Close",
      onClick: () => history.goBack(),
    },
  ];

  return (
    <>
      <h4>Schema Field</h4>
      <GenericForm fields={tagFields} buttons={buttons} formik={formik} />
    </>
  );
};

export const SchemaCreate = () => {
  const [msg, setMsg] = useState();
  const [fields, setFields] = useState([]);
  const [initialField, setInitialField] = useState();
  const history = useHistory();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: { title: "" },
    validationSchema: schemaValidationSchema,
    onSubmit: (values) => {
      const schema = { ...values, json: fields };
      console.log(JSON.stringify(schema));
      dispatch(createSchema(schema))
        .then(unwrapResult)
        .then((data) =>
          setMsg(["success", `Schema ${data.title} saved successfully`])
        )
        .catch((e) => setMsg(["danger", JSON.stringify(e.response.data)]));
    },
  });
  const buttons = [
    {
      label: "Save Schema",
      type: "submit",
    },
    {
      label: "Close",
      onClick: () => history.goBack(),
    },
  ];
  console.log(fields);
  return (
    <>
      <Row>
        <Col>
          <h2>Create New Schema</h2>
          <MsgBox msg={msg} />
        </Col>
      </Row>
      <Row>
        <Col>
          <SchemaFields
            fields={fields}
            setFields={setFields}
            initialField={initialField}
            setInitialField={setInitialField}
          />
        </Col>
        <Col>
          <SchemaPreview
            fields={fields}
            setFields={setFields}
            setInitialField={setInitialField}
          />
        </Col>
        {fields.length > 0 && (
          <Col>
            <h4>New Schema</h4>
            <GenericForm
              buttons={buttons}
              formik={formik}
              fields={schemaFields}
            />
          </Col>
        )}
      </Row>
    </>
  );
};

export const SchemaUpdate = () => {
  const [schema, setSchema] = useState();
  const [msg, setMsg] = useState();
  const [fields, setFields] = useState([]);
  const [initialField, setInitialField] = useState();
  const dispatch = useDispatch();
  const { id } = useParams();
  const history = useHistory();

  useEffect(
    () =>
      dispatch(fetchSchemas(id))
        .then(unwrapResult)
        .then((data) => setSchema(data[0])),
    [dispatch, id]
  );

  return (
    <>
      <Row>
        <Col>
          <h2>Schema Update - {schema && schema.title}</h2>
          <MsgBox msg={msg} />
        </Col>
      </Row>
    </>
  );
};

export const SchemaView = () => {
  const [schema, setSchema] = useState();
  const dispatch = useDispatch();
  const { id } = useParams();
  const history = useHistory();

  useEffect(
    () =>
      dispatch(fetchSchemas(id))
        .then(unwrapResult)
        .then((data) => setSchema(data[0])),
    [dispatch, id]
  );

  if (schema)
    return (
      <>
        <h2>
          {schema.title} - {schema.kind} schema
        </h2>
        <PreviewForm fields={schema.json} />
        <Button onClick={(e) => history.goBack()}>Close</Button>
      </>
    );
  else return <>Schema not found</>;
};
export const SchemaList = () => {
  const [schemas, setSchemas] = useState([]);
  const dispatch = useDispatch();

  useEffect(
    () =>
      dispatch(fetchSchemas())
        .then(unwrapResult)
        .then((data) => setSchemas(data.reverse())),
    [dispatch]
  );
  return (
    <>
      <h2>Schemas</h2>
      <ul className="list-unstyled">
        {schemas &&
          schemas.map((s, i) => (
            <li key={i}>
              <Link to={`/schemas/schema/${s.id}/`}>{s.title}</Link>
            </li>
          ))}
      </ul>
    </>
  );
};
