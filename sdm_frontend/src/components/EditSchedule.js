import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

// ID, Year: joint key to identify the offering
// Spring, Summer, Fall: semester in the calendar year, 
// use "Y" to indicate if offered, "N" if not

const EditSchedule = (props) => {
    const [concentration, setConcentration] = useState(props.concentration);
    const [code, setCode] = useState(props.code);
    const [name, setName] = useState(props.subject);
    const [inSpring, setInSpring] = useState(props.inSpring);
    const [inSummer, setInSummer] = useState(props.inSummer);
    const [inFall, setInFall] = useState(props.inFall);
    const [years, setYears] = useState(props.Years);

    const concChgHandler = (event) => {
        event.preventDefault();
        setConcentration(event.target.value);
    }

    const codeChgHandler = (event) => {
        event.preventDefault();
        setCode(event.target.value);
    }

    const nameChgHandler = (event) => {
        event.preventDefault();
        setName(event.target.value);
    }

    const springHandler = (event) => {
        event.preventDefault();
        setInSpring(event.target.value);
    }

    const summerHandler = (event) => {
        event.preventDefault();
        setInSummer(event.target.value);
    }

    const fallHandler = (event) => {
        event.preventDefault();
        setInFall(event.target.value);
    }

    const yearHandler = (event) => {
        event.preventDefault();
        setYears(event.target.value);
    }

    const submitHandler = (event) => {
        event.preventDefault();
        props.submit({"concentration": concentration, 
                      "code": code, 
                      "subject": name,
                      "spring": inSpring,
                      "summer": inSummer,
                      "fall": inFall,
                      "years": years.split(/[ ,]+/)
                    });
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
            <Form.Group className="mb-3" controlId={props.code}>
                <Form.Label>Course code</Form.Label>
                <Form.Control placeholder={props.code} onChange={codeChgHandler} />
                <Form.Text>Enter course number as CODE-####</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="concentration">
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

            <Form.Group className="mb-3" controlId="subject">
                <Form.Label>Course name</Form.Label>
                <Form.Control placeholder={props.subject} onChange={nameChgHandler} />
                <Form.Text>Enter course name</Form.Text>
            </Form.Group>

            <Table size="sm">
                <thead>
                    <tr>
                        <td colspan="3">Select which semesters the course is offered</td>
                    </tr>
                </thead>
                
                <tbody>
                    <tr>
                        <td width="30%">
                            <Form.Group className="mb-3" controlId="springCheckbox">
                                <Form.Check type="checkbox" label="Spring" onChange={springHandler} />
                            </Form.Group>
                        </td>
                        <td width="30%">
                        <Form.Group className="mb-3" controlId="summerCheckbox">
                            <Form.Check type="checkbox" label="Summer" onChange={summerHandler} />
                        </Form.Group>
                        </td>
                        <td width="30%">
                        <Form.Group className="mb-3" controlId="fallCheckbox">
                            <Form.Check type="checkbox" label="Fall" onChange={fallHandler} />
                        </Form.Group>
                        </td>
                    </tr>
                </tbody>
            </Table>

            <Form.Group className="mb-3" controlId="year">
                <Form.Label>Year(s) offered</Form.Label>
                <Form.Control placeholder={props.subject} onChange={yearHandler} />
                <Form.Text>Enter comma-separated list of years the course is offered</Form.Text>
            </Form.Group>

            <Button bsPrefix="btn-custom" onClick={submitHandler}>Submit</Button>
        </Form>
    )
}

export default EditSchedule;