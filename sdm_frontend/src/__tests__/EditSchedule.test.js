import * as React from 'react';
import { describe, expect } from '@jest/globals';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import EditSchedule from '../components/EditSchedule';
import conc from '../components/concentrations.json';

// this will check that session storage for user name and role are set as expected
describe('EditSchedule', () => {
    const mock_item = { 
        concentration: "Human Centered Computing (HCC)",
        subjectsList:  
            [ { code: "CPSC-6110",
                name: "Virtual Reality Systems",
                prerequisites: null
              } ],
        semesters: {
            spring: true,
            summer: true,
            fall: false
        },
        years: ["2023", "2024"]
    };

    const submitHandler = (newSchedInfo) => {
        console.log('in submit handler');
        console.log(newSchedInfo);
    };
      
    it('renders EditSchedule component', () => {
        render(<EditSchedule
                    concentration={mock_item.concentration}
                    code={mock_item.subjectsList[0].code} subject={mock_item.subjectsList[0].name} 
                    inSpring={mock_item.semesters.spring} inSummer={mock_item.semesters.summer} inFall={mock_item.semesters.fall}
                    years={mock_item.years}
                    submit={submitHandler}
        />);

        // should display a drop-down list, containing concentrations as options,
        // text boxes to enter course number, name, and years offered, checkboxes
        // to select the semesters offered, and a submit button
        const comb = screen.getByRole("combobox", { name: "Concentration" });
        expect(comb).toBeInTheDocument();
        expect(comb).toHaveValue(mock_item.concentration);

        for (let i = 0; i < conc.length; i++) {
            expect(screen.getByRole("option", { name: conc[i] })).toBeInTheDocument();
        }

        expect(screen.getByRole("textbox", { name: "Course code", placeholder: mock_item.subjectsList[0].code })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Course name", placeholder: mock_item.subjectsList[0].name })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Year(s) offered", placeholder: mock_item.years.toString() })).toBeInTheDocument();

        const sprChk = screen.getByRole("checkbox", { name: "Spring" });
        const sumChk = screen.getByRole("checkbox", { name: "Summer" });
        const faChk = screen.getByRole("checkbox", { name: "Fall" });

        expect(sprChk).toBeInTheDocument();
        expect(sumChk).toBeInTheDocument();
        expect(faChk).toBeInTheDocument();

        expect(sprChk.checked).toBe(mock_item.semesters.spring);
        expect(sumChk.checked).toBe(mock_item.semesters.summer);
        expect(faChk.checked).toBe(mock_item.semesters.fall);

        expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
    });

    it('tests submit handler', () => {
        const new_item = { conc: "Software Engineering",
                           code: "CPSC-1234", 
                           name: "New Course",
                           years: [ "2025" ]
                         };

        let consoleOutput = [];
        const log = console.log;
        const mockedLog = output => consoleOutput.push(output);
        console.log = mockedLog;

        render(<EditSchedule
            concentration={mock_item.concentration}
            code={mock_item.subjectsList[0].code} subject={mock_item.subjectsList[0].name} 
            inSpring={false} inSummer={false} inFall={false}
            years={mock_item.years}
            submit={submitHandler}
        />);

        const concBx = screen.getByRole("combobox", { name: "Concentration" });
        const codeBx = screen.getByRole("textbox", { name: "Course code" });
        const nameBx = screen.getByRole("textbox", { name: "Course name" });
        const sprChk = screen.getByRole("checkbox", { name: "Spring" });
        const sumChk = screen.getByRole("checkbox", { name: "Summer" });
        const faChk = screen.getByRole("checkbox", { name: "Fall" });
        const yearBx = screen.getByRole("textbox", { name: "Year(s) offered" });

        // simulate editing the item, selecting a new concentration and entering
        // new course code and name, following by clicking submit
        act( () => {
            userEvent.selectOptions(concBx, new_item.conc);
            userEvent.type(codeBx, new_item.code);
            userEvent.type(nameBx, new_item.name);
            userEvent.click(sprChk);
            userEvent.click(sumChk);
            userEvent.click(faChk);
            userEvent.type(yearBx, new_item.years.toString());
            userEvent.click(screen.getByRole("button", { name: "Submit" }));
        })

        waitFor( () => {
            screen.getByRole("button");
        });

        // check that the textboxes have the correct values
        expect(codeBx).toHaveValue(new_item.code);
        expect(nameBx).toHaveValue(new_item.name);
        expect(yearBx).toHaveValue(new_item.years.toString());

        // check console log for indication that the submit handler (local) was called and that
        // the new course information is as it was entered
        expect(consoleOutput).toContain('in submit handler');
        expect(consoleOutput[1].concentration).toBe(new_item.conc);
        expect(consoleOutput[1].code).toBe(new_item.code);
        expect(consoleOutput[1].subject).toBe(new_item.name);
        expect(consoleOutput[1].spring).toBe(true);
        expect(consoleOutput[1].summer).toBe(true);
        expect(consoleOutput[1].fall).toBe(true);

        for (let i = 0; i < new_item.years.length; i++) {
            expect(consoleOutput[1].years).toContain(new_item.years[i]);
        }

        console.log = log;
    });
})