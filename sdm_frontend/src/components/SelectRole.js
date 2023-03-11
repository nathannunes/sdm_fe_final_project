import React from 'react';
import Form from 'react-bootstrap/Form';

const SelectRole = (props) => {
    const roleChangeHandler = (event) => {
        event.preventDefault();
        props.roleChange(event.target.value);
    }

    return(
        <Form>
            <Form.Group className="mb-3" controlId="select">
                <Form.Label>Select role</Form.Label>
                <Form.Select onChange={roleChangeHandler}>
                    <option>Academic Administrator</option>
                    <option>Academic Advisor</option>
                    <option>Student</option>
                </Form.Select>
            </Form.Group>
        </Form>
    )

}

export default SelectRole;