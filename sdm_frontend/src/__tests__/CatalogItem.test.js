import React from 'react';
import { describe, expect } from '@jest/globals';
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
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
                prerequisites: null
              },
              { code: "CPSC-6120",
                name: "Eye Tracking Methodology and Applications",
                prerequisites: null
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
            expect(screen.getByText(item.name)).toBeInTheDocument();
        }

        expect(screen.getByRole("heading")).toHaveTextContent(mock_item.concentration);
        expect(screen.getByRole("button")).toHaveTextContent(mock_item.concentration);
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
            expect(screen.getByText(item.name)).toBeInTheDocument();
        }

        // check for modify button for each subject
        const mod = screen.getAllByRole("button", { name: "Modify" });
        expect(mod.length === mock_item.subjectsList.length);

        expect(screen.getByRole("heading")).toHaveTextContent(mock_item.concentration);
        expect(screen.getByRole("button", { name: mock_item.concentration })).toBeInTheDocument();
        expect(screen.getByRole("table")).toBeInTheDocument();
    });

    it('checks course modify overlay', () => {
        const { rerender } = render(<CatalogItem
                                        concentration={mock_item.concentration}
                                        subjects={mock_item.subjectsList}
                                        key={mock_item.concentration}
                                        isAAdm={true}
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
        rerender(<CatalogItem 
            concentration={mock_item.concentration}
            subjects={mock_item.subjectsList}
            key={mock_item.concentration}
            isAAdm={true}/>);

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

        // simulate clicking the close button, which should hide the overlay
        act( () => {
            userEvent.click(cls[0]);
        });
    
        // allow the effects of the action to happen...
        waitFor( () => {
            screen.getByRole("header");
        });
    
        expect(consoleOutput).toContain('modify course');
        expect(consoleOutput).toContain('close modify window');
    });

    it('checks adding new course', () => {
        const new_item = { conc: "Software Engineering", code: "CPSC-1234", name: "New Course"};

        const { rerender } = render(<CatalogItem
                                        concentration={mock_item.concentration}
                                        subjects={mock_item.subjectsList}
                                        key={mock_item.concentration}
                                        isAAdm={true}
                                    />);
        
        // activate the modify overlay
        const mod = screen.getAllByRole("button", { name: "Modify" });
        act( () => {
            userEvent.click(mod[0]);
        });

        // allow the effects of the action to happen...
        waitFor( () => {
            screen.getByRole("header");
        });

        // re-render the page
        rerender(<CatalogItem 
            concentration={mock_item.concentration}
            subjects={mock_item.subjectsList}
            key={mock_item.concentration}
            isAAdm={true}/>);

        // collect all the elements that will be changed
        const sub = screen.getAllByRole("button", { name: "Submit" });
        const combo = screen.getAllByRole("combobox");
        const code = screen.getAllByRole("textbox", { name: "Course code", placeholder: mock_item.subjectsList[0].code });
        const name = screen.getAllByRole("textbox", { name: "Course name", placeholder: mock_item.subjectsList[0].name });

        // simulate filling in textitems and clicking the submit button, which should 
        // print the new course data to the console and then hide the overlay
        // due to some issues with the handlers in the EditCatalog component, the tests
        // for the text boxes are included here - testing of the submit handler is done
        // as part of the EditCatalog test suite
        act( () => {
            userEvent.selectOptions(combo[0], new_item.conc);
            userEvent.type(code[0], new_item.code);
            expect(code[0]).toHaveValue(new_item.code);
            userEvent.type(name[0], new_item.name);
            expect(name[0]).toHaveValue(new_item.name);
            userEvent.click(sub[0]);
        });
    
        // allow the effects of the action to happen...
        waitFor( () => {
            screen.getByRole("header");
        });

        expect(consoleOutput).toContain('modify course');
        expect(consoleOutput[1].concentration).toBe(new_item.conc);  // need to test this here, since it can't be checked above

        console.log=log;
    });

})