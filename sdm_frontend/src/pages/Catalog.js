import React, { useState, useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Offcanvas from "react-bootstrap/Offcanvas";

import CatalogItem from "../components/CatalogItem";
import EditCatalog from "../components/EditCatalog";
import Dashboard from "../components/Dashboard";
import SelectRole from "../components/SelectRole";
import Login from "../components/Login";
import useToken from "../components/useToken";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

import "../components/Button.css";

// TODO - add links to course content
// search query to modify:
// https://catalog.clemson.edu/search_advanced.php?cur_cat_oid=36&ecpage=1&cpage=1&ppage=1&pcpage=1&spage=1&tpage=1&search_database=Search&filter%5Bkeyword%5D=CPSC+6110&filter%5Bexact_match%5D=1&filter%5B3%5D=1&filter%5B31%5D=1

const dummy_data = {
  level: "Graduate",
  courses: [
    {
      concentration: "Human Centered Computing (HCC)",
      subjectsList: [
        {
          code: "CPSC-6110",
          name: "Virtual Reality Systems",
          prerequisites: null,
        },
        {
          code: "CPSC-6120",
          name: "Eye Tracking Methodology and Applications",
          prerequisites: null,
        },
      ],
    },
    {
      concentration: "Software Engineering",
      subjectsList: [
        {
          code: "CPSC-6160",
          name: "2-D Game Engine Construction",
          prerequisites: null,
        },
        {
          code: "CPSC-6720",
          name: "Software Development Methodology",
          prerequisites: null,
        },
      ],
    },
  ],
};

// TODO: Add editing capability (new, modify, remove) -- connect to backend

function Catalog() {
  const { token } = useToken();
  const [isLoggedIn, setLogin] = useState(!!token);
  const [show, setShow] = useState(false);
  const [isAAdm, setAAdm] = useState(true);
  const [courseData, setCourseData] = useState(dummy_data);
  const [againFetchData, setAgainFetchData] = useState(true);
  const [showModify, setShowModify] = useState(false);
  const [courseToModify, setCourseToModify] = useState({});

  const reload = () => {
    const newToken = JSON.parse(sessionStorage.getItem("token"));
    setLogin(!!newToken);
  };

  const showOverlay = (event) => {
    event.preventDefault();
    console.log("add course");
    setShow(true);
  };

  const closeOverlay = () => {
    console.log("close add window");
    setShow(false);
  };

  const submitNewHandler = (newCourseInfo) => {
    // this will eventually also update the database in the backend
    // TODO - think about how best to link everything together
    // TODO - need to do input validation: course number not being correct, concentration selected as "select from dropdown", etc.
    console.log(newCourseInfo);
    /*{
      sample input json
      “code” : “CPSC-1000",
      “name” : “Test Course”,
      “creditHours” : 3,
      “courseDescription” : “test”,
      “concentration” : “Software Engineering”,
      “offerDate” : “”,
      “prerequisites” : “”,
      “courseSemester” : “”
  }*/

    newCourseInfo.offerDate = "";
    newCourseInfo.prerequisites = "";
    newCourseInfo.courseSemester = "";
    let options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newCourseInfo),
    };
    fetch(`soc/courses/createNewCourse`, options).then((response) => {
      showToastFun("Course Created Successfully", "success");
    });

    setShow(false);
  };

  // this will eventually be removed/moved to system administration-related component
  const roleChangeHandler = (newRole) => {
    console.log(newRole);
    if (newRole === "Academic Administrator") {
      setAAdm(true);
    } else {
      setAAdm(false);
    }
  };

  // this will only get data from the API when the listed variables are changed
  useEffect(() => {
    console.log("loaded");
    if (isLoggedIn) {
      console.log("logged in, fetching data");
      const url = "soc/courses/findAll";
      fetch(url, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          }
        })
        .then((data) => {
          // this section is added to avoid warnings about repeated keys
          // when creating the accordion display
          // note this will only check for replicated course codes and only
          // keep the first one encountered (a very basic implementation that
          // does not try to make a decision as to which one to use)
          console.log("removing repeated values in subject lists");
          for (let i = 0; i < data.courses.length; i++) {
            // loop through concentrations
            let course = data.courses[i];
            console.log(course);
            let seenSubjects = {};

            course.subjectsList = course.subjectsList.filter((subj) => {
              if (subj.code in seenSubjects) {
                return false;
              } else {
                seenSubjects[subj.code] = true;
                return true;
              }
            });
          }

          console.log("setting data");
          console.log(data);
          setCourseData(data);
        })
        .catch(function (error) {
          console.log(error);
          // TODO - properly notify user of error
        });
    }
  }, [againFetchData]);
  const [showToast, setShowToast] = useState(false);
  const [toastData, setToastData] = useState({ toastBody: "", toastType: "" });
  function showToastFun(toastBody, toastType) {
    console.log("toastType ", toastType);
    setToastData({ toastBody: toastBody, toastType: toastType });
    setShowToast(true);
  }
  function renderUpdatedCode(newCourseInfo) {
    setAgainFetchData((prev) => !prev);
  }
  const submitModifyHandler = (newCourseInfo) => {
    // this will eventually also upddate the database in the backend
    // TODO - think about how best to link everything together
    let options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newCourseInfo),
    };
    fetch(`soc/courses/modifyByCode?code=${newCourseInfo.code}`, options).then(
      (response) => {
        showToastFun("Course Updated", "success");
      }
    );

    //delete newCourseInfo.description;
    renderUpdatedCode(newCourseInfo);
    setShowModify(false);
  };

  const showModifyOverlay = (itemToModify, concentration) => {
    itemToModify.concentration = concentration;
    setCourseToModify(itemToModify);
    setShowModify(true);
  };

  const closeModifyOverlay = () => {
    setShowModify(false);
  };

  if (!isLoggedIn) {
    return (
      <div style={{ backgroundColor: "whitesmoke" }}>
        <h1 align="center" style={{ color: "#e27f0b" }}>
          Please login to access this page
        </h1>
        <Login reloadPage={reload} />
      </div>
    );
  }

  // TODO - remove "select role" drop-down once users are available for testing each role
  //        this will still be used for "system administrator" role, once implemented
  return (
    <>
      <div align="center">
        <h1 align="center" style={{ color: "#e27f0b" }}>
          Course Catalog: School of Computing ({dummy_data.level})
        </h1>
        <ToastContainer position="top-end">
          <Toast
            onClose={() => setShowToast(false)}
            bg={toastData.toastType || ""}
            show={showToast}
            delay={5000}
            animation
            autohide
          >
            <Toast.Body>{toastData.toastBody}</Toast.Body>
          </Toast>
        </ToastContainer>
        <Table size="sm">
          <tbody>
            <tr>
              <td width="55%">
                <Dashboard />
              </td>
              <td>
                <SelectRole roleChange={roleChangeHandler} />
              </td>
              <td width="25%" style={{ verticalAlign: "middle" }}>
                {isAAdm && (
                  <Button bsPrefix="btn-custom" onClick={showOverlay}>
                    Add course
                  </Button>
                )}
                <Offcanvas show={show} onHide={closeOverlay}>
                  <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Add Course</Offcanvas.Title>
                  </Offcanvas.Header>
                  <Offcanvas.Body>
                    <EditCatalog
                      isNew={true}
                      concentration={"Select from dropdown"}
                      code={"CPSC-"}
                      subject={""}
                      courseDescription={""}
                      creditHours={0}
                      submit={submitNewHandler}
                    />
                  </Offcanvas.Body>
                </Offcanvas>
              </td>
            </tr>
          </tbody>
        </Table>
        <Accordion>
          {
            // NOTE - using dummy data here to avoid issues realted to the API respons.
            // This is a bug in the backend and has been report (AB101), but seems to
            // sporadically cause a problem with the front end display.
            courseData.courses.map((item) => {
              return (
                <CatalogItem
                  concentration={item.concentration}
                  subjects={item.subjectsList}
                  key={item.concentration}
                  isAAdm={isAAdm}
                  showToastFun={showToastFun}
                  renderUpdatedCode={renderUpdatedCode}
                  showModifyOverlay={showModifyOverlay}
                />
              );
            })
          }
        </Accordion>
      </div>
      <div>
        {courseToModify && (
          <Offcanvas show={showModify} onHide={closeModifyOverlay}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>
                Modify Course: {courseToModify.code}
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              Note: leave placeholder text for items not changed
              <EditCatalog
                isNew={false}
                concentration={courseToModify.concentration}
                code={courseToModify.code}
                subject={courseToModify.name}
                courseDescription={courseToModify.courseDescription}
                creditHours={courseToModify.creditHours}
                submit={submitModifyHandler}
              />
            </Offcanvas.Body>
          </Offcanvas>
        )}
      </div>
    </>
  );
}

export default Catalog;
