import React from 'react';
import { describe, expect } from '@jest/globals';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ScheduleItem from '../components/ScheduleItem';
import conc from '../components/concentrations.json';

// this will check that session storage for user name and role are set as expected
describe('ScheduleItem', () => {
    let log;
    let consoleOutput;
    let mockedLog;

    const mock_item = { 
        concentration: "Human Centered Computing (HCC)",
        subjectsList:  
            [ { code: "CPSC-6110",
                name: "Virtual Reality Systems",
                prerequisites: null,
                offer_date: ["2023", "2024"],
                course_semester: ["FALL"]
              },
              { code: "CPSC-6120",
                name: "Eye Tracking Methodology and Applications",
                prerequisites: null,
                offer_date: ["2023"],
                course_semester: ["SPR", "SUM"]
              }
            ]
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
    });

    afterEach(() => {
        console.log = log;
    });

    it('renders ScheduleItem component: student, academic advisor', () => {
        render(<table><tbody><ScheduleItem course={mock_item.subjectsList[0].code}
                            name={mock_item.subjectsList[0].name}
                            concentration={mock_item.concentration}
                            years={mock_item.subjectsList[0].offer_date[0]}
                            semesters={mock_item.subjectsList[0].course_semester}
                            isAAdm={false}
                            showDate={true}
        /></tbody></table>);

        // when showing dates, this will only display buttons with the offer_date in props.years
        expect(screen.getByRole("button", { name: mock_item.subjectsList[0].offer_date[0] })).toBeInTheDocument();
    });

    it('renders ScheduleItem component: academic administrator', () => {
        render(<table><tbody><ScheduleItem course={mock_item.subjectsList[0].code}
            name={mock_item.subjectsList[0].name}
            concentration={mock_item.concentration}
            years={mock_item.subjectsList[0].offer_date[0]}
            semesters={mock_item.subjectsList[0].course_semester}
            isAAdm={true}
            showDate={true}
        /></tbody></table>);

        // when showing dates, this will only display buttons with the offer_date in props.years
        expect(screen.getByRole("button", { name: mock_item.subjectsList[0].offer_date[0] })).toBeInTheDocument();

        // also expect there to be a modify button for each
        expect(screen.getByRole("button", { name: "Modify" })).toBeInTheDocument();
    });

    it('checks schedule modify overlay', () => {
        const { rerender } = render(<table><tbody><ScheduleItem course={mock_item.subjectsList[0].code}
                                        name={mock_item.subjectsList[0].name}
                                        concentration={mock_item.concentration}
                                        years={mock_item.subjectsList[0].offer_date}
                                        semesters={mock_item.subjectsList[0].course_semester}
                                        isAAdm={true}
                                        showDate={true}
                            /></tbody></table>);

        // get all the modify buttons that are shown, select one to
        // test the overlay, since they are all connected to the same
        // EditSchedule component
        const mod = screen.getAllByRole("button", { name: "Modify" });
        
        // simulate clicking the button, which should show the overlay
        act( () => {
            userEvent.click(mod[0]);
        });

        // allow the effects of the action to happen...
        waitFor( () => {
            screen.getAllByRole("button");
        });

        // re-render the page
        rerender(<table><tbody><ScheduleItem course={mock_item.subjectsList[0].code}
            name={mock_item.subjectsList[0].name}
            concentration={mock_item.concentration}
            years={mock_item.subjectsList[0].offer_date}
            semesters={mock_item.subjectsList[0].course_semester}
            isAAdm={true}
            showDate={true}
        /></tbody></table>);

        // check for the submit and close buttons
        const cls = screen.getAllByRole("button", { name: "Close" }); 
        expect(cls.length >= 1);
        expect(screen.getAllByRole("button", { name: "Submit" }).length >= 1);

        // check the dropdown box and its options
        expect(screen.getAllByRole("combobox").length >= 1);

        for (let i = 0; i < conc.length; i++) {
            expect(screen.getAllByRole("option", { name: conc[i] }).length >= 1);
        }

        // check for textboxes to enter code and name
        expect(screen.getAllByRole("textbox", { name: "Course code" }).length >= 1);
        expect(screen.getAllByRole("textbox", { name: "Course name"}).length >=1 );

        expect(screen.getByRole("checkbox", { name: "Spring" })).toBeInTheDocument();
        expect(screen.getByRole("checkbox", { name: "Summer" })).toBeInTheDocument();
        expect(screen.getByRole("checkbox", { name: "Fall" })).toBeInTheDocument();

        // simulate clicking the close button, which should hide the overlay
        act( () => {
            userEvent.click(cls[0]);
        });
    
        // allow the effects of the action to happen...
        waitFor( () => {
            screen.getByRole("header");
        });
    
        expect(consoleOutput).toContain('modify course schedule');
        expect(consoleOutput).toContain('close modify window');
    });
})