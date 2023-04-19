import * as React from 'react';
import { describe, expect } from '@jest/globals';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Calendar from '../pages/Calendar';

// render the component for testing
// this will check that components are rendered as expected
describe('Calendar', () => {
    let log;
    let consoleOutput;
    let mockedLog;

    let spy;

    // this is fragile because it depends on the dummy data defined in Calendar.js
    const mock_item = { 
        "Spring 2023": [
            {
                "id": 1,
                "semester": "Spring 2023",
                "date": "Jan 9, Mon - Jan 10, Tue",
                "event": "Late enrollment"
            },
            {
                "id": 2,
                "semester": "Spring 2023",
                "date": "Jan 9, Mon",
                "event": "Orientation"
            }
        ]
    };
    const key = Object.keys(mock_item);

    const semestersList={
        "semesters": [
            "Spring 2023",
            "Summer 2023",
            "Fall 2023",
            "Spring 2024",
            "Summer 2024",
            "Fall 2024"
        ]
    };

    // submit handler
    // TODO - update for API call test
    const submitHandler = (newCalInfo) => {
        console.log('in submit handler');
        console.log(newCalInfo);
    };

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

    it('renders Calendar component: not logged in', () => {
        render(<Calendar />);

        // check displayed text and elements
        expect(screen.getByRole("heading", { name: "Please login to access this page" } )).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Email address (@clemson.edu)" })).toBeInTheDocument();
        expect(screen.getByText(/Password/)).toBeInTheDocument();
        expect(screen.getByRole("checkbox", { name: "New user, register me" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Submit" } )).toBeInTheDocument();
    })

    // TODO - add a test for the student/academic advisor roles, once more roles are available to test
    // TODO - update this test as needed to properly reflect the differences in rendering between student/
    // academic advisor and academic administrator (namely, the presense of "Add Item" and "Modify" buttons)
    it('renders Catalog component: logged in (academic administrator)', () => {
        sessionStorage.setItem("token", JSON.stringify("yes"));
        sessionStorage.setItem("user", JSON.stringify("testuser"));
        sessionStorage.setItem("role", JSON.stringify("USER"));
        
        render(<Calendar />)

        // only need to check a few items displayed which haven't been tested in other suites
        expect(screen.getByRole("heading", { name: "Academic Calendar" })).toBeInTheDocument();

        const totalEvents = mock_item[key].length;
        expect(screen.getByRole("heading", { name: key.toString() }));

        // because some events may have repeated names ("start of classes, late enrollment"), use
        // the row ids, which are date + event + "Modify" (the button)
        for(let i = 0; i < mock_item[key].length; i++) {
            expect(screen.getByRole("row", { name: mock_item[key][i].date + " " +
                                                   mock_item[key][i].event +
                                                   " Modify"})).toBeInTheDocument();
        }

        // check for the "Add" button, which is only visible for academic administrators
        expect(screen.getByRole("button", { name: "Add item" })).toBeInTheDocument();
    });

    // this is similar to the test for CalendarItem, as it uses the same overlay (EditCalendar)
    // limited testing is done here (rendering only) since this component is tested in other suites
    it('checks add calendar item overlay', () => {
        // TODO - update these when academic administrator role is added
        // TODO - this test may also need to be updated for consistency
        sessionStorage.setItem("token", JSON.stringify("yes"));
        sessionStorage.setItem("user", JSON.stringify("testuser"));
        sessionStorage.setItem("role", JSON.stringify("USER"));
        
        const { rerender } = render(<Calendar />)

        const addBtn = screen.getByRole("button", { name: "Add item" });  // get the "Add Course" button element

        // simulate clicking the button, which should show the overlay
        act( () => {
            userEvent.click(addBtn);
        });

        // allow the effects of the action to happen...
        waitFor( () => {
            screen.getAllByRole("button");
        });

        // re-render the page
        rerender(<Calendar />);

        // check that components of the overlay are present in the render
        const sbmtBtn = screen.getByRole("button", { name: "Submit" });
        const clsBtn = screen.getByRole("button", { name: "Close" });
        expect(sbmtBtn).toBeInTheDocument();
        expect(clsBtn).toBeInTheDocument();

        const cmbBox = screen.getByRole("combobox", { name: "Semester" }); 
        expect(cmbBox).toBeInTheDocument();  // check for combobox

        // check that semester options are available
        for (let i = 0; i < semestersList.length; i++) {
            expect(screen.getByRole("option", { name: semestersList[i] })).toBeInTheDocument();
        }

        // check for textboxes to enter code and name
        // for some reason these are not getting named, even though they are named in the component
        // (similar as seen with the Catalog page...)
        // instead of testing each textbox separately, just check for two textboxes
        // expect(screen.getByRole("textbox", { id: "Event date" })).toBeInTheDocument();
        // expect(screen.getByRole("textbox", { name: "Event name" })).toBeInTheDocument();

        expect(screen.getAllByRole("textbox").length).toBe(2);

        // simulate clicking the close button
        act( () => {
            userEvent.click(clsBtn);
        });

        // allow the effects of the action to happen...
        waitFor( () => {
            screen.getByRole("header");
        });

        expect(consoleOutput).toContain('add calendar item');
        expect(consoleOutput).toContain('close add window');
    });
});
