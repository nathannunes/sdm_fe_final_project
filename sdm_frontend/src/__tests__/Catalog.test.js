import * as React from "react";
import { describe, expect } from "@jest/globals";
import { render, screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Catalog from "../pages/Catalog";
import conc from "../components/concentrations.json";

// render the component for testing
// this will check that components are rendered as expected
describe("Catalog", () => {
  let log;
  let consoleOutput;
  let mockedLog;

  let spy;

  // this is fragile because it depends on the dummy data defined in Catalog.js
  // TODO - update this test after Catalog.js has been finalized/fully connected to API
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

  beforeEach(() => {
    // this is needed due to some internal dependencies in bootstrap that are needed
    // for the OffCanvas component
    // solution from: https://stackoverflow.com/questions/73874391/react-bootstrap-nabar-offcanvas-causing-errors-with-jest-testing-library-tests
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    // setup to get console output
    consoleOutput = [];
    log = console.log;
    mockedLog = (output) => consoleOutput.push(output);
    console.log = mockedLog;

    spy = jest.spyOn(React, "useEffect").mockImplementation(() => {});
  });

  // clean up local storage after each test
  // reset mocks
  afterEach(() => {
    console.log = log;

    sessionStorage.clear();
    jest.restoreAllMocks();
  });

  it("renders Catalog component: not logged in", () => {
    render(<Catalog />);

    // check displayed text and elements
    expect(
      screen.getByRole("heading", { name: "Please login to access this page" })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Email address (@clemson.edu)" })
    ).toBeInTheDocument();
    expect(screen.getByText(/Password/)).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: "New user, register me" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  // TODO - add a test for the student/academic advisor roles, once more roles are available to test
  // TODO - update this test as needed to properly reflect the differences in rendering between student/
  // academic advisor and academic administrator (namely, the presense of "Add Course" and "Modify" buttons)
  it("renders Catalog component: logged in (academic administrator)", () => {
    sessionStorage.setItem("token", JSON.stringify("yes"));
    sessionStorage.setItem("user", JSON.stringify("testuser"));
    sessionStorage.setItem("role", JSON.stringify("USER"));

    render(<Catalog />);

    // only need to check a few items displayed which haven't been tested in other suites
    expect(
      screen.getByRole("heading", {
        name: "Course Catalog: School of Computing (" + dummy_data.level + ")",
      })
    ).toBeInTheDocument();

    let totalCourses = 0;
    for (let i = 0; i < dummy_data.courses.length; i++) {
      let conc = dummy_data.courses[i];

      expect(screen.getByRole("heading", { name: conc.concentration }));
      //
      totalCourses = totalCourses + conc.subjectsList.length; // calcuate the total number of courses displayed

      for (let j = 0; j < conc.subjectsList.length; j++) {
        expect(
          screen.getByRole("cell", { name: conc.subjectsList[j].code })
        ).toBeInTheDocument();
        expect(
          screen.getByRole("cell", { name: conc.subjectsList[j].name })
        ).toBeInTheDocument();
      }
    }

    // this test may be a bit redundant of CatalogItem tests
    expect(screen.getAllByRole("cell", { name: "Modify" }).length).toBe(
      totalCourses
    );

    // check for the "Add" button, which is only visible for academic administrators
    expect(
      screen.getByRole("button", { name: "Add course" })
    ).toBeInTheDocument();
  });

  // this is similar to the test for CatalogItem, as it uses the same overlay (EditCatalog)
  // limited testing is done here (rendering only) since this component is tested in other suites
  it("checks add course overlay", () => {
    // TODO - update these when academic administrator role is added
    // TODO - this test may also need to be updated for consistency
    sessionStorage.setItem("token", JSON.stringify("yes"));
    sessionStorage.setItem("user", JSON.stringify("testuser"));
    sessionStorage.setItem("role", JSON.stringify("USER"));

    const { rerender } = render(<Catalog />);

    const addBtn = screen.getByRole("button", { name: "Add course" }); // get the "Add Course" button element

    // simulate clicking the button, which should show the overlay
    act(() => {
      userEvent.click(addBtn);
    });

    // allow the effects of the action to happen...
    waitFor(() => {
      screen.getAllByRole("button");
    });

    // re-render the page
    rerender(<Catalog />);

    // check that components of the overlay are present in the render
    const sbmtBtn = screen.getByRole("button", { name: "Submit" });
    const clsBtn = screen.getByRole("button", { name: "Close" });
    expect(sbmtBtn).toBeInTheDocument();
    expect(clsBtn).toBeInTheDocument();

    const cmbBox = screen.getByRole("combobox", { name: "Concentration" });
    expect(cmbBox).toBeInTheDocument(); // check for combobox

    // check that concentration options are available
    for (let i = 0; i < conc.length; i++) {
      expect(screen.getByRole("option", { name: conc[i] })).toBeInTheDocument();
    }

    // check for textboxes to enter code and name
    expect(
      screen.getByRole("textbox", { name: "Course code" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Course Credit Hours" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", { name: "Course name" })
    ).toBeInTheDocument(); // for some reason the Course name box is not named
    // even though it is named in EditCatalog (and test)
    expect(
      screen.getByRole("textbox", { name: "Course description" })
    ).toBeInTheDocument();

    // simulate clicking the close button//
    act(() => {
      userEvent.click(clsBtn);
    });

    // allow the effects of the action to happen...
    waitFor(() => {
      screen.getByRole("header");
    });

    expect(consoleOutput).toContain("add course");
    expect(consoleOutput).toContain("close add window");
  });
});
