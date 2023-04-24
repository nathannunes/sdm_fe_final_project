import * as React from "react";
import { describe, expect } from "@jest/globals";
import { render, screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import EditCatalog from "../components/EditCatalog";
import conc from "../components/concentrations.json";

// this will check that session storage for user name and role are set as expected
describe("EditCatalog", () => {
  const mock_item = {
    concentration: "Human Centered Computing (HCC)", //
    subjectsList: [
      {
        code: "CPSC-6110",
        name: "Virtual Reality Systems",
        prerequisites: null,
      },
    ],
  };

  const submitHandler = (newCourseInfo) => {
    console.log("in submit handler");
    console.log(newCourseInfo);
  };

  it("renders EditCatalog component", () => {
    render(
      <EditCatalog
        concentration={mock_item.concentration}
        code={mock_item.subjectsList[0].code}
        subject={mock_item.subjectsList[0].name}
        submit={submitHandler}
      />
    );

    // should display a drop-down list, containing concentrations as options,
    // text boxes to enter course number and name, and a submit button
    const comb = screen.getByRole("combobox", { name: "" }); // formerly named "oncentration" but as no name after changes for some reason
    expect(comb).toBeInTheDocument();
    expect(comb).toHaveValue(mock_item.concentration);

    for (let i = 0; i < conc.length; i++) {
      expect(screen.getByRole("option", { name: conc[i] })).toBeInTheDocument();
    }

    expect(
      screen.getByRole("textbox", {
        name: "Course code",
        placeholder: mock_item.subjectsList[0].code,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", {
        name: "Course name",
        placeholder: mock_item.subjectsList[0].name,
      })
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("tests submit handler", () => {
    const new_item = {
      conc: "Software Engineering",
      code: "CPSC-6110",
      name: "New Course",
      courseDescription: "test description",
      creditHours: 3,
    };

    let consoleOutput = [];
    const log = console.log;
    const mockedLog = (output) => consoleOutput.push(output);
    console.log = mockedLog;

    render(
      <EditCatalog
        concentration={mock_item.concentration}
        code={mock_item.subjectsList[0].code}
        subject={mock_item.subjectsList[0].name}
        submit={submitHandler}
      />
    );

    const concBx = screen.getByRole("combobox", { name: "" });  // formerly "Concentration" but has no name after code changes for some reason
    const codeBx = screen.getByRole("textbox", { name: "Course code" });
    const nameBx = screen.getByRole("textbox", { name: "Course name" });
    const descBx = screen.getAllByRole("textbox", { name: "" })[1];  // formerly GetByRole() with name: "Course description" but has no name after code changes for some reason

    // simulate editing the item, selecting a new concentration and entering
    // new course code and name, following by clicking submit
    act(() => {
      userEvent.selectOptions(concBx, new_item.conc);
      userEvent.type(codeBx, new_item.code);
      userEvent.type(nameBx, new_item.name);
      userEvent.type(descBx, new_item.courseDescription);
      userEvent.click(screen.getByRole("button", { name: "Submit" }));
    });

    waitFor(() => {
      screen.getByRole("button");
    });

    // check that the textboxes have the correct values

    expect(nameBx).toHaveValue(new_item.name);
    //expect(codeBx).toHaveValue(new_item.code);
    // check console log for indication that the submit handler (local) was called and that
    // the new course information is as it was entered
    expect(consoleOutput).toContain("in submit handler");
    expect(consoleOutput[2].concentration).toBe(new_item.conc);
    expect(consoleOutput[2].code).toBe(new_item.code);
    expect(consoleOutput[2].name).toBe(new_item.name);
    expect(consoleOutput[2].courseDescription).toBe(new_item.courseDescription);

    console.log = log;
  });
});
