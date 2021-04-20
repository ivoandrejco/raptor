import { Fragment } from "react";
import { Form, Alert, Col, Button } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

export const getInitialValues = (fields) => {
  const initVals = {};
  if (fields instanceof Array) {
    for (let i = 0; i < fields.length; i++)
      initVals[fields[i].name] = fields[i].value;
  } else if (fields instanceof Object) {
    for (var key in fields) initVals[key] = fields[key].value;
  }
  return initVals;
};

const getValue = (val) => {
  if (val) return val;
  else return " ";
};

const getLabel = (field) => (
  <Form.Label htmlFor={field.name}>{field.label}</Form.Label>
);

const getError = (field, formik) => {
  if (formik && formik.errors[field.name] && formik.touched[field.name])
    return <Alert variant="danger">{formik.errors[field.name]}</Alert>;
};

const getTextArea = (field, formik) => (
  <>
    {getLabel(field)}
    <Form.Control
      id={field.name}
      name={field.name}
      value={formik && formik.values[field.name]}
      as={field.type}
      rows={field.rows && field.rows}
      onChange={formik && formik.handleChange}
    />
    {getError(field, formik)}
  </>
);

const getFile = (field, formik) => (
  <>
    {getLabel(field)}
    <Form.File
      id={field.name}
      label={field.label}
      onChange={formik.handleChange}
      custom
    />
    {getError(field, formik)}
  </>
);

const getInput = (field, formik) => (
  <>
    {getLabel(field)}
    <Form.Control
      id={field.name}
      name={field.name}
      value={formik && formik.values[field.name]}
      as={field.type}
      onChange={formik && formik.handleChange}
      placeholder={field.placeholder}
    />
    {getError(field, formik)}
  </>
);

const getSelect = (field, formik) => (
  <>
    {getLabel(field)}
    <Form.Control
      id={field.name}
      name={field.name}
      value={formik && formik.values[field.name]}
      as={field.type}
      children={field.options.map((v, i) => (
        <option key={i} value={v.value}>
          {v.name}
        </option>
      ))}
      onChange={formik && formik.handleChange}
    />
    {getError(field, formik)}
  </>
);

const getField = (field, formik) => {
  switch (field.type) {
    case "input":
      return getInput(field, formik);
    case "textarea":
      return getTextArea(field, formik);
    case "select":
      return getSelect(field, formik);
    case "file":
      return getFile(field, formik);
    default:
      return null;
  }
};

const getButton = (btn, i) => (
  <Fragment key={i}>
    <Button
      key={i}
      type={btn.type ? btn.type : null}
      onClick={btn.onClick ? (e) => btn.onClick() : null}
      block={btn.block}
      variant={btn.variant}
    >
      {btn.label}
    </Button>
    &nbsp;
  </Fragment>
);

export const LayoutForm = ({ fields, buttons, formik }) => {
  if (!fields instanceof Array) {
    console.error(`Wrong argument - expected instance of Array - received ...`);
    return <div>Wrong argument</div>;
  }

  return (
    <Form onSubmit={formik.handleSubmit}>
      {fields.map((row, i) => (
        <Form.Row key={i}>
          {row.map((field, j) => {
            return (
              <Form.Group as={Col} key={j}>
                {getField(field, formik)}
              </Form.Group>
            );
          })}
        </Form.Row>
      ))}
      <Form.Row>
        {buttons && buttons.map((btn, i) => getButton(btn, i))}
      </Form.Row>
    </Form>
  );
};

export const GenericForm = ({ formik, fields, buttons }) => {
  const fKeys = typeof fields === "object" ? Reflect.ownKeys(fields) : null;

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Form.Row>
        {fKeys.map((key, i) => {
          return (
            <Form.Group key={i}>{getField(fields[key], formik)}</Form.Group>
          );
        })}
      </Form.Row>
      {buttons && buttons.map((btn, i) => getButton(btn, i))}
    </Form>
  );
};

export const SchemaForm = ({ formik, schema, buttons, collected }) => {
  return (
    <Form id={schema.id} onSubmit={formik.handleSubmit} key={schema.id}>
      <Form.Row>
        {schema &&
          schema.json.map((f, i) => {
            return (
              <Col key={i}>
                <Form.Group key={f.name}>
                  {getField(f, formik)}
                  {collected && (
                    <Form.Control
                      as="input"
                      placeholder="Collected"
                      name={`${f.name}_collected`}
                      defaultValue=""
                      value={
                        formik.values[`${f.name}_collected`]
                          ? formik.values[`${f.name}_collected`]
                          : ""
                      }
                      onChange={formik.handleChange}
                    />
                  )}
                </Form.Group>
              </Col>
            );
          })}
      </Form.Row>
      <Form.Row>
        {buttons && buttons.map((btn, i) => getButton(btn, i))}
      </Form.Row>
    </Form>
  );
};
export const PreviewForm = ({ fields, handleUpdate, handleDelete }) => {
  if (!fields instanceof Array && !fields[0].label) {
    console.error(`Wrong argument - expected instance of Array - received ...`);
    return <div>Wrong argument</div>;
  }

  return (
    <Fragment>
      {fields &&
        fields.map((f, i) => {
          return (
            <Form.Group key={i}>
              {handleUpdate && (
                <FontAwesomeIcon
                  icon={faPencilAlt}
                  color="green"
                  onClick={(e) => handleUpdate(f)}
                />
              )}{" "}
              {handleDelete && (
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  color="red"
                  onClick={(e) => handleDelete(f)}
                />
              )}{" "}
              {getField(f)}
            </Form.Group>
          );
        })}
    </Fragment>
  );
};
