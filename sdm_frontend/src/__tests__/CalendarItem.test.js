import React from 'react';
import { describe, expect } from '@jest/globals';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CalendarItem from '../components/CalendarItem';

// this will check that session storage for user name and role are set as expected
describe('CalendarItem', () => {
    let log;
    let consoleOutput;
    let mockedLog;

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

    it('renders CalendarItem component: student, academic advisor', () => {
        render(<CalendarItem 
                    semester={key}
                    dates={mock_item[key]}
                    isAAdm={false}
                    submit={jest.fn()}
              />);

        // checks for the concentration title
        expect(screen.getByText(key)).toBeInTheDocument();

        // checks for the presence of each sub-item (date and event name)
        for (let i = 0; i < mock_item[key].length; i++) {
            let item = mock_item[key][i];
            expect(screen.getByText(item.date)).toBeInTheDocument();
            expect(screen.getByText(item.event)).toBeInTheDocument();
        }

        expect(screen.getByRole("heading")).toHaveTextContent(key);
        expect(screen.getByRole("button")).toHaveTextContent(key);
        expect(screen.getByRole("table")).toBeInTheDocument();
    });

    it('renders CalendarItem component: academic administrator', () => {
        render(<CalendarItem 
                    semester={key}
                    dates={mock_item[key]}
                    isAAdm={true}
                    submit={jest.fn()}
              />);

    // checks for the concentration title
    expect(screen.getByText(key)).toBeInTheDocument();

    // checks for the presence of each sub-item (date and event name)
    for (let i = 0; i < mock_item[key].length; i++) {
        let item = mock_item[key][i];
        expect(screen.getByText(item.date)).toBeInTheDocument();
        expect(screen.getByText(item.event)).toBeInTheDocument();
    }

        // check for modify button for each item
        const mod = screen.getAllByRole("button", { name: "Modify" });
        expect(mod.length === mock_item[key].length);

        expect(screen.getByRole("heading")).toHaveTextContent(key);
        expect(screen.getByRole("button", { name: key })).toBeInTheDocument();
        expect(screen.getByRole("table")).toBeInTheDocument();
    });

    it('checks calendar item modify overlay', () => {
        const { rerender } = render(<CalendarItem 
                                        semester={key}
                                        dates={mock_item[key]}
                                        isAAdm={true}
                                        submit={jest.fn()}
                                    />);
        
        // get all of the "Modify" buttons - will test one of them,
        // since they are all rendered and connected to the same callbacks
        // in the CatalogItem component
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
        rerender(<CalendarItem 
            semester={key}
            dates={mock_item[key]}
            isAAdm={true}
            submit={jest.fn()}
        />);

        // check for the submit and close buttons
        const cls = screen.getAllByRole("button", { name: "Close" }); 
        expect(cls.length >= 1);
        expect(screen.getAllByRole("button", { name: "Submit" }).length >= 1);

        // check the dropdown box and its options
        expect(screen.getAllByRole("combobox").length >= 1);

        for (let i = 0; i < semestersList.length; i++) {
            expect(screen.getAllByRole("option", { name: semestersList[i] }).length >= 1);
        }

        // check for textboxes to enter code and name
        expect(screen.getAllByRole("textbox", { name: "Event date" }).length >= 1);
        expect(screen.getAllByRole("textbox", { name: "Event name"}).length >=1 );

        // simulate clicking the close button, which should hide the overlay
        act( () => {
            userEvent.click(cls[0]);
        });
    
        // allow the effects of the action to happen...
        waitFor( () => {
            screen.getByRole("header");
        });

        expect(consoleOutput).toContain('modify calendar item');
        expect(consoleOutput).toContain('close modify window');
    });

})