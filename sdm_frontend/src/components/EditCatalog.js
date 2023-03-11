import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const EditCatalog = (props) => {
    const [submit, setSubmit]=useState(props.show);  // is this the right approach?
    const [concentration, setConcentration] = useState(props.concentration);
    const [code, setCode] = useState(props.code);
    const [name, setName] = useState(props.subject);

    const concChgHandler = (event) => {
        event.preventDefault();
        console.log(event);
        setConcentration(event.target.value);
    }

    const codeChgHandler = (event) => {
        event.preventDefault();
        setCode(event.value);
    }

    const nameChgHandler = (event) => {
        event.preventDefault();
        setName(event.value);
    }

    const submitHandler = () => {
        console.log('button clicked');
        setSubmit(true);
        console.log(submit);
        console.log(concentration);
        console.log(code);
        console.log(name);
    }

    //const concentrationList=JSON.parse("./concentrations.json");  TODO--make this work so the list can be available elsewhere
    const concentrationList={
        "concentrations": [
            "Data Science and Informatics",
            "Foundations and Theory",
            "Human Centered Computing (HCC)",
            "Networks, Systems, and Security",
            "Software Engineering",
            "Visual Computing"
        ]
    };

    return (
        <Form>
            <Form.Group className="mb-3" controlId={props.concentration}>
                <Form.Label>Concentration</Form.Label>
                <Form.Select onChange={concChgHandler}>
                    <option>{props.concentration}</option>
                    {concentrationList.concentrations.map( (item) => {
                        if (item !== props.concentration) {
                            return (<option value={item}>{item}</option>);
                        }
                        return null;
                    }
                )}
                </Form.Select>
                <Form.Text>Select course concentration</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId={props.code}>
                <Form.Label>Course code</Form.Label>
                <Form.Control placeholder={props.code} onChange={codeChgHandler} />
                <Form.Text>Enter course number as CODE-####</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId={props.subject}>
                <Form.Label>Course code</Form.Label>
                <Form.Control placeholder={props.subject} onChange={nameChgHandler} />
                <Form.Text>Enter course name</Form.Text>
            </Form.Group>

            <Button bsPrefix="btn-custom" onClick={submitHandler}>Submit</Button>
        </Form>
    )
}

export default EditCatalog;