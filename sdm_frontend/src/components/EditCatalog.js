import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const EditCatalog = (props) => {
  const [concentration, setConcentration] = useState(props.concentration);
  const [code, setCode] = useState(props.code);
  const [name, setName] = useState(props.subject);
  const [courseDescription, setCourseDescription] = useState(
    props.courseDescription
  );
  const [creditHours, setCreditHours] = useState(props.creditHours);

  const concChgHandler = (event) => {
    //event.preventDefault();
    console.log("event.target.value change ", event.target.value);
    setConcentration(event.target.value);
  };

  const codeChgHandler = (event) => {
    setCode(event.target.value);
  };

  const nameChgHandler = (event) => {
    setName(event.target.value);
  };

  const descChgHandler = (event) => {
    setCourseDescription(event.target.value);
  };

  const credHrsChgHandler = (event) => {
    setCreditHours(event.target.value);
  };
  const submitHandler = (event) => {
    event.preventDefault();
    //TODO: courseDescription implementation
    //calling submitHandler in CatalogItem.js
    props.submit({
      name,
      concentration,
      courseDescription,
      code,
      creditHours,
    });
  };

  //const concentrationList=JSON.parse("./concentrations.json");  TODO--make this work so the list can be available elsewhere
  const concentrationList = {
    concentrations: [
      "Data Science and Informatics",
      "Foundations and Theory",
      "Human Centered Computing",
      "Networking, Systems and Security",
      "Software Engineering",
      "Visual Computing",
    ],
  };

  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Concentration</Form.Label>
        <Form.Select onChange={concChgHandler}>
          <option>{concentration || props.concentration}</option>
          {concentrationList.concentrations.map((item) => {
            if (item !== props.concentration) {
              return (
                <option value={item} key={Math.random()}>
                  {item}
                </option>
              );
            }
            return null;
          })}
        </Form.Select>
        <Form.Text>Select course concentration</Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId={props.code}>
        <Form.Label>Course code</Form.Label>
        <Form.Control
          placeholder={props.code}
          readOnly={!props.isNew}
          onChange={codeChgHandler}
        />
        <Form.Text>Enter course number as CODE-####</Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId={props.creditHours}>
        <Form.Label>Course Credit Hours</Form.Label>
        <Form.Control
          placeholder={props.creditHours}
          onChange={credHrsChgHandler}
        />
        <Form.Text>Enter Credit Hours</Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId={props.subject}>
        <Form.Label>Course name</Form.Label>
        <Form.Control placeholder={props.subject} onChange={nameChgHandler} />
        <Form.Text>Enter course name</Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId={props.courseDescription}>
        <Form.Label>Course description</Form.Label>
        <Form.Control
          placeholder={props.courseDescription}
          onChange={descChgHandler}
        />
        <Form.Text>Enter course description</Form.Text>
      </Form.Group>

      <Button bsPrefix="btn-custom" onClick={submitHandler}>
        Submit
      </Button>
    </Form>
  );
};

export default EditCatalog;
