import * as React from 'react';
import { describe, expect } from '@jest/globals';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import EditCatalog from '../components/EditCatalog';
import conc from '../components/concentrations.json';

// this will check that session storage for user name and role are set as expected
describe('EditCatalog', () => {
    const mock_item = { 
        concentration: "Human Centered Computing (HCC)",
        subjectsList:  
            [ { code: "CPSC-6110",
                name: "Virtual Reality Systems",
                prerequisites: null
              } ]
    };

    const submitHandler = (newCourseInfo) => {
        console.log('in submit handler');
        console.log(newCourseInfo);
    };
      
    it('renders EditCatalog component', () => {
        render(<EditCatalog 
                    concentration={mock_item.concentration}
                    code={mock_item.subjectsList[0].code} subject={mock_item.subjectsList[0].name}
                    submit={submitHandler} 
        />);

        // should display a drop-down list, containing concentrations as options,
        // text boxes to enter course number and name, and a submit button
        const comb = screen.getByRole("combobox", { name: "Concentration" });
        expect(comb).toBeInTheDocument();
        expect(comb).toHaveValue(mock_item.concentration);

        for (let i = 0; i < conc.length; i++) {
            expect(screen.getByRole("option", { name: conc[i] })).toBeInTheDocument();
        }

        expect(screen.getByRole("textbox", { name: "Course code", placeholder: mock_item.subjectsList[0].code })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Course name", placeholder: mock_item.subjectsList[0].name })).toBeInTheDocument();

        expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
    });

    it('tests submit handler', () => {
        const new_item = { conc: "Software Engineering", code: "CPSC-1234", name: "New Course"};

        let consoleOutput = [];
        const log = console.log;
        const mockedLog = output => consoleOutput.push(output);
        console.log = mockedLog;

        render(<EditCatalog 
            concentration={mock_item.concentration}
            code={mock_item.subjectsList[0].code} subject={mock_item.subjectsList[0].name}
            submit={submitHandler}
        />);

        const concBx = screen.getByRole("combobox", { name: "Concentration" } );
        const codeBx = screen.getByRole("textbox", { name: "Course code" });
        const nameBx = screen.getByRole("textbox", { name: "Course name" });

        // simulate editing the item, selecting a new concentration and entering
        // new course code and name, following by clicking submit
        act( () => {
            userEvent.selectOptions(concBx, new_item.conc);
            userEvent.type(codeBx, new_item.code);
            userEvent.type(nameBx, new_item.name);
            userEvent.click(screen.getByRole("button", { name: "Submit" }));
        })

        waitFor( () => {
            screen.getByRole("button");
        });

        // check that the textboxes have the correct values
        expect(codeBx).toHaveValue(new_item.code);
        expect(nameBx).toHaveValue(new_item.name);

        // check console log for indication that the submit handler (local) was called and that
        // the new course information is as it was entered
        expect(consoleOutput).toContain('in submit handler');
        expect(consoleOutput[1].concentration).toBe(new_item.conc);
        expect(consoleOutput[1].code).toBe(new_item.code);
        expect(consoleOutput[1].subject).toBe(new_item.name);

        console.log = log;
    });
})