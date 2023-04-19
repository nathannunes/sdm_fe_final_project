import React from 'react';
import { describe, expect } from '@jest/globals';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CatalogItem from '../components/CatalogItem';
import conc from '../components/concentrations.json';

// this will check that session storage for user name and role are set as expected
describe('CatalogItem', () => {
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

    it('renders CatalogItem component: student, academic advisor', () => {
        render(<CatalogItem
                    concentration={mock_item.concentration}
                    subjects={mock_item.subjectsList}
                    key={mock_item.concentration}
                    isAAdm={false}
              />);

        // checks for the concentration title
        expect(screen.getByText(mock_item.concentration)).toBeInTheDocument();

        // checks for the presence of each subject code and name
        for (let i = 0; i < mock_item.subjectsList.length; i++) {
            let item = mock_item.subjectsList[i];
            expect(screen.getByText(item.code)).toBeInTheDocument();
            expect(screen.getByText(": " + item.name)).toBeInTheDocument();
        }

        expect(screen.getByRole("heading")).toHaveTextContent(mock_item.concentration);
        expect(screen.getByRole("button", { name: mock_item.concentration })).toBeInTheDocument();
        expect(screen.getByRole("table")).toBeInTheDocument();
    });

    it('renders CatalogItem component: academic administrator', () => {
        render(<CatalogItem
            concentration={mock_item.concentration}
            subjects={mock_item.subjectsList}
            key={mock_item.concentration}
            isAAdm={true}
        />);

        // checks for the concentration title
        expect(screen.getByText(mock_item.concentration)).toBeInTheDocument();

        // checks for the presence of each subject code and name
        for (let i = 0; i < mock_item.subjectsList.length; i++) {
            let item = mock_item.subjectsList[i];
            expect(screen.getByText(item.code)).toBeInTheDocument();
            expect(screen.getByText(": " + item.name)).toBeInTheDocument();
        }

        // check for show button for each subject
        const mod = screen.getAllByRole("button", { name: "Show Dates" });
        expect(mod.length === mock_item.subjectsList.length);

        expect(screen.getByRole("heading")).toHaveTextContent(mock_item.concentration);
        expect(screen.getByRole("button", { name: mock_item.concentration })).toBeInTheDocument();
        expect(screen.getByRole("table")).toBeInTheDocument();
    });

    it('checks schedule modify overlay', () => {
        const { rerender } = render(<CatalogItem
                                        concentration={mock_item.concentration}
                                        subjects={mock_item.subjectsList}
                                        key={mock_item.concentration}
                                        isAAdm={true}
                                    />);
        
        // get all of the "Show Dates" buttons - will test one of them,
        // since they are all rendered and connected to the same callbacks
        // in the ScheduleItem component
        const show = screen.getAllByRole("button", { name: "Show Dates" });
        
        // simulate clicking the button, which should show the overlay
        act( () => {
            userEvent.click(show[0]);
        });

        // allow the effects of the action to happen...
        waitFor( () => {
            screen.getAllByRole("button");
        });

        // re-render the page
        rerender(<CatalogItem 
            concentration={mock_item.concentration}
            subjects={mock_item.subjectsList}
            key={mock_item.concentration}
            isAAdm={true}/>);

        // now get all the modify buttons that are shown, select one to
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