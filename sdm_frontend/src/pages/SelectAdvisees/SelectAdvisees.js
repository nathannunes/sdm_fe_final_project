import React from 'react';
import StudentNAdvisees from "./StudentNAdvisees";
import Dashboard from "../../components/Dashboard";
import Table from 'react-bootstrap/Table';

const dummyData = [
        {
            "studentCUId": "STU_1",
            "name": "Rajat",
            "degree": null,
            "studentType": "F",
            "studyPlan": {
                "id": 1,
                "advisor": {
                    "advisorCUId": "ADV_1",
                    "advisorName": "testuser7",
                    "advisorEmail": "michael@clemson.edu",
                    "advisorSchool": "Clemson University",
                    "department": "CS"
                },
                "courses": []
            }
        },
        {
            "studentCUId": "STU_2",
            "name": "Nathan",
            "degree": null,
            "studentType": "F",
            "studyPlan": {
                "id": 1,
                "advisor": {
                    "advisorCUId": "ADV_1",
                    "advisorName": "testuser7",
                    "advisorEmail": "michael@clemson.edu",
                    "advisorSchool": "Clemson University",
                    "department": "CS"
                },
                "courses": []
            }
        },
    {
        "studentCUId": "STU_3",
        "name": "Jayesh",
        "degree": null,
        "studentType": "F",
        "studyPlan": {
            "id": 1,
            "advisor": {
                "advisorCUId": "ADV_1",
                "advisorName": "testuser7",
                "advisorEmail": "michael@clemson.edu",
                "advisorSchool": "Clemson University",
                "department": "CS"
            },
            "courses": []
        }
    }
];


function SelectAdvisees(){
    return(
        <div align="center">
            <h1 align="center" style={{color: "#e27f0b"}}>Student Advisees: School of Computing </h1>
            <Dashboard />
            <div align="center">
                <Table striped borderless>
                    <thead align="center">
                    <tr>
                        <th>Name</th>
                        <th>Advisor</th>
                    </tr>
                    </thead>
                    <tbody>
                            {
                                dummyData.map( (item) => {
                                    return <StudentNAdvisees
                                        key={item.studentCUId}
                                        id = {item.studentCUId}
                                        name ={item.name}
                                        advisor = {item.studyPlan.advisor}
                                    />
                                } )
                            }
                    </tbody>
                </Table>
            </div>
        </div>
    );




}

export default SelectAdvisees;