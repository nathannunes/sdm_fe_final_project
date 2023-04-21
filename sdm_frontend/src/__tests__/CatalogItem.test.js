import React from "react";
import { describe, expect } from "@jest/globals";
import { render, screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CatalogItem from "../components/CatalogItem";
import conc from "../components/concentrations.json";

// this will check that session storage for user name and role are set as expected
describe("CatalogItem", () => {
  let log;
  let consoleOutput;
  let mockedLog;
  let showModifyOverlay;

  const mock_item = {
    concentration: "Human Centered Computing (HCC)",
    subjectsList: [
      {
        code: "CPSC-6110",
        name: "Virtual Reality Systems",
        prerequisites: null,
      },
      {
        code: "CPSC-6120",
        name: "Eye Tracking Methodology and Applications",
        prerequisites: null,
      },
    ],
    showModifyOverlay: (itemToModify, concentration) => {},
  };

  beforeEach(() => {
    // this is needed due to some internal dependencies in bootstrap that are needed
    // for the OffCanvas component
    // solution from: https://stackoverflow.com/questions/73874391/react-bootstrap-nabar-offcanvas-causing-errors-with-jest-testing-library-tests
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
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
    mockedLog = (output) => consoleOutput.push(output);
    console.log = mockedLog;
  });

  afterEach(() => {
    console.log = log;
  });

  it("renders CatalogItem component: student, academic advisor", () => {
    render(
      <CatalogItem
        concentration={mock_item.concentration}
        subjects={mock_item.subjectsList}
        key={mock_item.concentration}
        isAAdm={false}
        showModifyOverlay={showModifyOverlay}
      />
    );

    // checks for the concentration title
    expect(screen.getByText(mock_item.concentration)).toBeInTheDocument();

    // checks for the presence of each subject code and name
    for (let i = 0; i < mock_item.subjectsList.length; i++) {
      let item = mock_item.subjectsList[i];
      expect(screen.getByText(item.code)).toBeInTheDocument();
      expect(screen.getByText(item.name)).toBeInTheDocument();
    }

    expect(screen.getByRole("heading")).toHaveTextContent(
      mock_item.concentration
    );
    expect(screen.getByRole("button")).toHaveTextContent(
      mock_item.concentration
    );
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("renders CatalogItem component: academic administrator", () => {
    render(
      <CatalogItem
        concentration={mock_item.concentration}
        subjects={mock_item.subjectsList}
        key={mock_item.concentration}
        isAAdm={true}
      />
    );

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

    expect(screen.getByRole("heading")).toHaveTextContent(
      mock_item.concentration
    );
    expect(
      screen.getByRole("button", { name: mock_item.concentration })
    ).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
  });
});
