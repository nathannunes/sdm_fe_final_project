import * as React from 'react';
import { describe, expect } from '@jest/globals';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import EditCalendar from '../components/EditCalendar';

// this will check that the submit handler for editing the calendar works as intended
describe('EditCalendar', () => {
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

    // use a dummy submit handler (the API call will be tested for the Calendar page)
    const submitHandler = (newCalInfo) => {
        console.log('in submit handler');
        console.log(newCalInfo);
    };
      
    it('renders EditCalendar component', () => {
        render(<EditCalendar
                    item={mock_item[key][0]}
                    submit={submitHandler}
        />);

        // should display a drop-down list, containing concentrations as options,
        // text boxes to enter course number and name, and a submit button
        const comb = screen.getByRole("combobox", { name: "Semester" });
        expect(comb).toBeInTheDocument();
        expect(comb).toHaveValue(key.toString());

        for (let i = 0; i < semestersList.length; i++) {
            expect(screen.getByRole("option", { name: semestersList[i] })).toBeInTheDocument();
        }

        expect(screen.getByRole("textbox", { name: "Event date", placeholder: mock_item[key][0].date })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Event name", placeholder: mock_item[key][0].event })).toBeInTheDocument();

        expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
    });

    it('tests submit handler', () => {
        const new_item = { semester: "Fall 2023", date: "Dec 15, Fri", event: "Final exams"};

        let consoleOutput = [];
        const log = console.log;
        const mockedLog = output => consoleOutput.push(output);
        console.log = mockedLog;

        render(<EditCalendar
            item={mock_item[key][0]}
            submit={submitHandler}
        />);

        const semBx = screen.getByRole("combobox", { name: "Semester" } );
        const dateBx = screen.getByRole("textbox", { name: "Event date" });
        const evtBx = screen.getByRole("textbox", { name: "Event name" });

        // simulate editing the item, selecting a new semester and entering
        // new event dat and name, following by clicking submit
        act( () => {
            userEvent.selectOptions(semBx, new_item.semester);
            userEvent.type(dateBx, new_item.date);
            userEvent.type(evtBx, new_item.event);
            userEvent.click(screen.getByRole("button", { name: "Submit" }));
        })

        waitFor( () => {
            screen.getByRole("button");
        });

        // check that the textboxes have the correct values
        expect(dateBx).toHaveValue(new_item.date);
        expect(evtBx).toHaveValue(new_item.event);

        // check console log for indication that the submit handler (local) was called and that
        // the new course information is as it was entered
        expect(consoleOutput).toContain('in submit handler');
        expect(consoleOutput[1].semester).toBe(new_item.semester);
        expect(consoleOutput[1].date).toBe(new_item.date);
        expect(consoleOutput[1].event).toBe(new_item.event);

        console.log = log;
    });
})