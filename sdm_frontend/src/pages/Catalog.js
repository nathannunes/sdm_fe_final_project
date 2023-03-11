import React, { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Offcanvas from 'react-bootstrap/Offcanvas';

import CatalogItem from '../components/CatalogItem';
import EditCatalog from '../components/EditCatalog';
import Dashboard from '../components/Dashboard';

import '../components/Button.css';

// TODO - add links to course content
// search query to modify:
// https://catalog.clemson.edu/search_advanced.php?cur_cat_oid=36&ecpage=1&cpage=1&ppage=1&pcpage=1&spage=1&tpage=1&search_database=Search&filter%5Bkeyword%5D=CPSC+6110&filter%5Bexact_match%5D=1&filter%5B3%5D=1&filter%5B31%5D=1

const dummy_data = 
    { 
        level: "Graduate",
        courses: [ 
            { concentration: "Human Centered Computing (HCC)",
              subjectsList:  
                [ { code: "CPSC-6110",
                    name: "Virtual Reality Systems",
                    prerequisites: null
                  },
                  { code: "CPSC-6120",
                    name: "Eye Tracking Methodology and Applications",
                    prerequisites: null
                  }
                ]
            },
            { concentration: "Software Engineering",
              subjectsList: 
              [ { code: "CPSC-6160",
                  name: "2-D Game Engine Construction",
                  prerequisites: null
                },
                { code: "CPSC-6720",
                  name: "Software Development Methodology",
                  prerequisites: null
                }
              ]
            }
        ]
    };

// TODO: Add editing capability (new, modify, remove) -- connect to backend

function Catalog() {
    const [show, setShow] = useState(false);

    const showOverlay = (event) => {
        event.preventDefault();
        console.log("add course");
        setShow(true);
    }

    const closeOverlay = () => {
        console.log("close add window");
        setShow(false);
    }

    const submitHandler = (newCourseInfo) => {
        // this will eventually also update the database in the backend
        // TODO - think about how best to link everything together
        // TODO - need to do input validation: course number not being correct, concentration selected as "select from dropdown", etc.
        console.log(newCourseInfo);
        setShow(false);
    }

    return(
        <div align="center">
            <h1 align="center" style={{color: "#e27f0b"}}>Course Catalog: School of Computing ({dummy_data.level})</h1> 
            <Table size="sm">
                <tbody>
                    <tr>
                        <td width="25%"><Dashboard /></td>
                        <td></td>
                        <td width="25%">
                            <Button bsPrefix="btn-custom" onClick={showOverlay}>Add course</Button>
                            <Offcanvas show={show} onHide={closeOverlay}>
                                <Offcanvas.Header closeButton>
                                    <Offcanvas.Title>Add Course</Offcanvas.Title>
                                </Offcanvas.Header>
                                <Offcanvas.Body>
                                    <EditCatalog concentration={"Select from dropdown"} code={"CPSC-"} subject={""} submit={submitHandler} />
                                </Offcanvas.Body>
                            </Offcanvas>
                        </td>
                    </tr>
                </tbody>
            </Table>
            <Accordion>
                {
                    dummy_data.courses.map( (item) => {
                        return <CatalogItem 
                            id={item.concentration}
                            concentration={item.concentration}
                            subjects={item.subjectsList}
                            key={item.concentration}
                        />
                    } )
                }
            </Accordion>
        </div>
    );
}

export default Catalog;