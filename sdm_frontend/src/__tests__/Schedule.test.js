import * as React from 'react';
import { describe, expect } from '@jest/globals';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Schedule from '../pages/Schedule';
import conc from '../components/concentrations.json';

// render the component for testing
// this will check that components are rendered as expected
describe('Schedule', () => {
    let log;
    let consoleOutput;
    let mockedLog;

    let spy;

    beforeEach( () => {
        // this is needed due to some internal dependencies in bootstrap that are needed
        // for the OffCanvas component
        // solution from: https://stackoverflow.com/questions/73874391/react-bootstrap-nabar-offcanvas-causing-errors-with-jest-testing-library-tests
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: jest.fn().mockImplementation(query => ({
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
        mockedLog = output => consoleOutput.push(output);
        console.log = mockedLog;

        // TODO - verify this will still be used once Schedule is completed
        // and connected to the API
        spy = jest.spyOn(React, 'useEffect')
                        .mockImplementation(() => {});
    });

    // clean up local storage after each test
    // reset mocks
    afterEach( () => {
        console.log = log;

        sessionStorage.clear();
        jest.restoreAllMocks();
    });

    it('renders Schedule component: not logged in', () => {
        render(<Schedule />);

        // check displayed text and elements
        expect(screen.getByRole("heading", { name: "Please login to access this page" } )).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Email address (@clemson.edu)" })).toBeInTheDocument();
        expect(screen.getByText(/Password/)).toBeInTheDocument();
        expect(screen.getByRole("checkbox", { name: "New user, register me" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Submit" } )).toBeInTheDocument();
    })

    // TODO - update this test after the Schedule page has been filled in/completed
    // TODO - add a test for the student/academic advisor roles, once more roles are available to test
    // TODO - update this test as needed to properly reflect the differences in rendering between student/
    // academic advisor and academic administrator (namely, the presense of "Add Course" and "Modify" buttons)
    it('renders Catalog component: logged in (academic administrator)', () => {
        sessionStorage.setItem("token", JSON.stringify("yes"));
        sessionStorage.setItem("user", JSON.stringify("testuser"));
        sessionStorage.setItem("role", JSON.stringify("USER"));
        
        render(<Schedule />)

        // only need to check a few items displayed which haven't been tested in other suites
        expect(screen.getByRole("heading", { name: "Course Schedule" })).toBeInTheDocument();
        //: School of Computing (" + dummy_data.level + ")" })).toBeInTheDocument();

    //     let totalCourses = 0;
    //     for(let i = 0; i < dummy_data.courses.length; i++) {
    //         let conc = dummy_data.courses[i];

    //         expect(screen.getByRole("heading", { name: conc.concentration }));

    //         totalCourses = totalCourses + conc.subjectsList.length;  // calcuate the total number of courses displayed

    //         for(let j = 0; j < conc.subjectsList.length; j++) {
    //             expect(screen.getByRole("cell", { name: conc.subjectsList[j].code })).toBeInTheDocument();
    //             expect(screen.getByRole("cell", { name: conc.subjectsList[j].name })).toBeInTheDocument();
    //         }
    //     }

    //     // this test may be a bit redundant of CatalogItem tests
    //     expect(screen.getAllByRole("cell", { name: "Modify" }).length).toBe(totalCourses);

        // check for the "Add" button, which is only visible for academic administrators
        expect(screen.getByRole("button", { name: "Add entry" })).toBeInTheDocument();
    });

    // limited testing is done here (rendering only) since functionality of the overlay
    // is tested in EditSchedule suites
    it('checks add course overlay', () => {
        // TODO - update these when academic administrator role is added
        // TODO - this test may also need to be updated for consistency
        sessionStorage.setItem("token", JSON.stringify("yes"));
        sessionStorage.setItem("user", JSON.stringify("testuser"));
        sessionStorage.setItem("role", JSON.stringify("USER"));
        
        const { rerender} = render(<Schedule />)

        const addBtn = screen.getByRole("button", { name: "Add entry" });  // get the "Add Course" button element

        // simulate clicking the button, which should show the overlay
        act( () => {
            userEvent.click(addBtn);
        });

        // allow the effects of the action to happen...
        waitFor( () => {
            screen.getAllByRole("button");
        });

        // re-render the page
        rerender(<Schedule />);

        // check that components of the overlay are present in the render
        const sbmtBtn = screen.getByRole("button", { name: "Submit" });
        const clsBtn = screen.getByRole("button", { name: "Close" });
        expect(sbmtBtn).toBeInTheDocument();
        expect(clsBtn).toBeInTheDocument();

        const cmbBox = screen.getByRole("combobox", { name: "Concentration" }); 
        expect(cmbBox).toBeInTheDocument();  // check for combobox

        // check that concentration options are available
        for (let i = 0; i < conc.length; i++) {
            expect(screen.getByRole("option", { name: conc[i] })).toBeInTheDocument();
        }

        // check for textboxes to enter code, name, and year
        expect(screen.getByRole("textbox", { name: "Course code" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Course name" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Year(s) offered" })).toBeInTheDocument();

        // check for checkboxes for semesters
        expect(screen.getByRole("checkbox", { name: "Spring" })).toBeInTheDocument();
        expect(screen.getByRole("checkbox", { name: "Summer" })).toBeInTheDocument();
        expect(screen.getByRole("checkbox", { name: "Fall" })).toBeInTheDocument();

        // simulate clicking the close button
        act( () => {
            userEvent.click(clsBtn);
        });

        // allow the effects of the action to happen...
        waitFor( () => {
            screen.getByRole("header");
        });

        expect(consoleOutput).toContain('add course');
        expect(consoleOutput).toContain('close add window');
    });
});
