import React, { useState, useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';

import Dashboard from '../components/Dashboard';
import SelectRole from '../components/SelectRole';
import EditSchedule from '../components/EditSchedule';
import CatalogItem from '../components/CatalogItem_2';

import '../components/Button.css';
import Login from '../components/Login';
import useToken from '../components/useToken';

// TODO - this will eventually be combined with the Course Catalog page,
// as they share an API and a large portion of information; kept separate
// due to user story/feature definition and bugs in the API preventing
// receiving course offering dates (fix in process)
// TODO - update this and following once the actual response format is known
const dummy_data = 
    { 
        level: "Graduate",
        courses: [ 
            { concentration: "Human Centered Computing (HCC)",
              subjectsList:  
                [ { code: "CPSC-6110",
                    name: "Virtual Reality Systems",
                    prerequisites: null,
                    offer_date: [ "2023", "2024"],
                    course_semester: ["FALL", "SPR"]
                  },
                  { code: "CPSC-6120",
                    name: "Eye Tracking Methodology and Applications",
                    prerequisites: null,
                    offer_date: [ "2024", "2025"],
                    course_semester: ["FALL"]
                  }
                ]
            },
            { concentration: "Software Engineering",
              subjectsList: 
              [ { code: "CPSC-6160",
                  name: "2-D Game Engine Construction",
                  prerequisites: null,
                  offer_date: [ "2024"],
                  course_semester: ["SUM"]
                },
                { code: "CPSC-6720",
                  name: "Software Development Methodology",
                  prerequisites: null,
                  offer_date: [ "2023", "2024"],
                  course_semester: ["SPR"]
                }
              ]
            }
        ]
    };

function Schedule() {
    const {token} = useToken();
    const [isLoggedIn, setLogin] = useState(!!token);
    const [show, setShow] = useState(false);
    const [isAAdm, setAAdm] = useState(true);
    const [courseData, setCourseData] = useState(dummy_data);

    const reload = () => {
        const newToken = JSON.parse(sessionStorage.getItem('token'));
        setLogin(!!newToken);
    }

    const showOverlay = (event) => {
        event.preventDefault();
        console.log("add course");
        setShow(true);
    }

    const closeOverlay = () => {
        console.log("close add window");
        setShow(false);
    }

    const submitHandler = (newCalendarItem) => {
        // this will eventually also update the database in the backend
        // TODO: add input validation to prevent bad inputs
        console.log(newCalendarItem);
        setShow(false);
    }

    const roleChangeHandler = (newRole) => {
        console.log(newRole);
        if (newRole === "Academic Administrator") {
            setAAdm(true);
        }
        else {
            setAAdm(false);
        }
    }
    
    // this will only get data from the API when the listed variables are changed
    useEffect( () => {
        console.log('loaded');
        if(isLoggedIn) {
            // TODO - use latest backend build and test with API
            // console.log('logged in, fetching data');
            // const url = "soc/courses/findAll";
            // fetch(url, { 
            //     headers: {
            //         "Authorization": "Bearer " + token
            //     }
            // }).then((response) => {
            //     if (response.status === 200) {
            //         return(response.json());
            //     }
            // }).then((data) => {
            //     // this section is added to avoid warnings about repeated keys
            //     // when creating the accordion display
            //     // note this will only check for replicated course codes and only
            //     // keep the first one encountered (a very basic implementation that
            //     // does not try to make a decision as to which one to use)
            //     console.log('removing repeated values in subject lists');
            //     for(let i = 0; i < data.courses.length; i++) {  // loop through concentrations
            //         let course = data.courses[i];
            //         console.log(course)
            //         let seenSubjects = {};

            //         course.subjectsList = course.subjectsList.filter(
            //             (subj) => {
            //                 if (subj.code in seenSubjects) {
            //                     return false;
            //                 } else {
            //                     seenSubjects[subj.code] = true;
            //                     return true;
            //                 }
            //             }
            //         )
            //     }

            //     console.log('setting data');
            //     console.log(data);
            //     setCourseData(data);
            // }).catch(function (error){
            //     console.log(error);
            //     // TODO - properly notify user of error
            // });
        }
    }, []);

    if (!isLoggedIn) {
        return(
            <div style={{backgroundColor: 'whitesmoke'}}>
               <h1 align="center" style={{color: "#e27f0b"}}>Please login to access this page</h1>
               <Login reloadPage={reload} />
            </div>
        );
    }

    // TODO - remove "select role" drop-down once more test users are available with other roles
    return( 
        <div style={{backgroundColor: 'whitesmoke'}}>
            <h1 align="center" style={{color: "#e27f0b"}}>Course Schedule</h1>
            <Table size="sm">
                <tbody>
                    <tr>
                        <td width="55%"><Dashboard /></td>
                        <td><SelectRole roleChange={roleChangeHandler}/></td>
                        <td width="25%" style={{verticalAlign: "middle"}}>
                            {isAAdm && <Button bsPrefix="btn-custom" onClick={showOverlay}>Add entry</Button>}
                            <Offcanvas show={show} onHide={closeOverlay}>
                                <Offcanvas.Header closeButton>
                                    <Offcanvas.Title>Add Entry</Offcanvas.Title>
                                </Offcanvas.Header>
                                <Offcanvas.Body>
                                    <EditSchedule concentration={"Select from dropdown"} code={"CPSC-"} subject={""} 
                                                  inSpring={false} inSummer={false} inFall={false} years={""}
                                                  submit={submitHandler}/>
                                </Offcanvas.Body>
                            </Offcanvas>
                        </td>
                    </tr>
                </tbody>
            </Table>
            <Accordion>
                {
                    // NOTE - this is buliding on the course catalog display, and will eventually
                    // be merged into that page with the different editing capabilities available
                    // NOTE - using dummy data here to avoid issues realted to the API respons.
                    // This is a bug in the backend and has been report (AB101), but seems to
                    // sporadically cause a problem with the front end display.
                    courseData.courses.map( (item) => {
                        return <CatalogItem 
                            concentration={item.concentration}
                            subjects={item.subjectsList}
                            key={item.concentration}
                            isAAdm={isAAdm}
                        />
                    } )
                }
            </Accordion>
        </div>
    );
}


export default Schedule;