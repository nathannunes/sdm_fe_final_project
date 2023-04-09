import * as React from 'react';
import { describe, expect } from '@jest/globals';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Catalog from '../pages/Catalog';

// render the component for testing
// this will check that components are rendered as expected
describe('Catalog render', () => {
    let log;
    let consoleOutput;
    let mockedLog;

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

        fetch.resetMocks();
    });

    // clean up local storage after each test
    // reset mocks
    afterEach( () => {
        console.log = log;

        sessionStorage.clear();
        jest.restoreAllMocks();
    });

    it('renders Catalog component: not logged in', () => {
        render(<Catalog />);

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
    // academic advisor and academic administrator (namely, the presense of "Add Course" and "Modify" buttons)
    it('renders Catalog component: logged in (academic administrator)', () => {
        sessionStorage.setItem("token", JSON.stringify("yes"));
        sessionStorage.setItem("user", JSON.stringify("testuser"));
        sessionStorage.setItem("role", JSON.stringify("USER"));

        // this is fragile because it depends on the dummy data defined in Catalog.js
        // TODO - update this test after Catalog.js has been finalized/fully connected to API
        const dummy_data = 
        { 
            level: "Graduate",
            courses: [ 
                { concentration: "Human Centered Computing (HCC)",
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
                },
                { concentration: "Software Engineering",
                subjectsList: 
                [ { code: "CPSC-6160",
                    name: "2-D Game Engine Construction",
                    prerequisites: null
                    },
                    { code: "CPSC-6720",
                    name: "Software Development Methodology",
                    prerequisites: null
                    }
                ]
                }
            ]
        };

        const spy = jest.spyOn(React, 'useEffect')
                        .mockImplementation(() => {})
        
        render(<Catalog />)

        // only need to check a few items displayed which haven't been tested in other suites
        expect(screen.getByRole("heading", { name: "Course Catalog: School of Computing (" + dummy_data.level + ")" })).toBeInTheDocument();

        let totalCourses = 0;
        for(let i = 0; i < dummy_data.courses.length; i++) {
            let conc = dummy_data.courses[i];

            expect(screen.getByRole("heading", { name: conc.concentration }));

            totalCourses = totalCourses + conc.subjectsList.length;  // calcuate the total number of courses displayed

            for(let j = 0; j < conc.subjectsList.length; j++) {
                expect(screen.getByRole("cell", { name: conc.subjectsList[j].code })).toBeInTheDocument();
                expect(screen.getByRole("cell", { name: conc.subjectsList[j].name })).toBeInTheDocument();
            }
        }

        // this test may be a bit redundant of CatalogItem tests
        expect(screen.getAllByRole("cell", { name: "Modify" }).length).toBe(totalCourses);

        const addBtn = screen.getByRole("button", { name: "Add course" });
        expect(addBtn).toBeInTheDocument();
    })
});

// // this will test that functionality of the Login page makes changes as expected
// // lower-level functionality (session storage) is tested separately for respective components
// describe('Login function', () => {
//     let log;
//     let reloadMock;
//     let consoleOutput;
//     let mockedLog;

//     beforeEach(() => {
//         fetch.resetMocks();

//         consoleOutput = [];
//         log = console.log;
//         mockedLog = output => consoleOutput.push(output);
//         console.log = mockedLog;

//         reloadMock = jest.fn().mockName("reload mock");
//     });

//     afterEach(() => {
//         console.log = log;
//         jest.restoreAllMocks();
//     });

//     it('checks API call response: register', () => {
//         const mockRegisterResponse = {
//             "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0dXNlcjUiLCJpYXQiOjE2Nzc4NTEyNTcsImV4cCI6MTY3Nzg1MjY5N30.pJWgqDbTyk2EfVHmCUnpRNKIqmot1L2FXI4WrAL363I",
//             "user": {
//                 "id": 4,
//                 "username": "testuser",
//                 "password": "$2a$10$ybLjCupo6sFdvGM.WOgXK.zySPjIVVUP9xcDfrAHBi3VnnOB4ZytS",
//                 "enabled": true,
//                 "role": [
//                     {
//                         "id": 0,
//                         "authority": "USER",
//                         "user": null
//                     }
//                 ],
//                 "accountNonExpired": true,
//                 "accountNonLocked": true,
//                 "credentialsNonExpired": true
//             }
//         };

//         render(<Login reloadPage={reloadMock}/>);

//         fetch.mockResponseOnce(JSON.stringify(mockRegisterResponse));  // TODO - improve the mock here?

//         act( () => {
//             userEvent.type(screen.getByRole('textbox'), 'testuser');
//             userEvent.click(screen.getByRole('checkbox'));
//             userEvent.click(screen.getByRole('button'));
//         });

//         waitFor( () => {
//             screen.getByRole('header');
//         });

//         expect(consoleOutput).toContain('In submit handler');
//         expect(consoleOutput).toContain('contact registration service');
//     })

//     it('checks API call response: login', () => {
//         const mockLoginResponse = {
//             "headers": {
//                 "authorization": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0dXNlcjEiLCJpYXQiOjE2ODAwNTIyNjUsImV4cCI6MTY4MDA1MzcwNX0.XFsvV9G5r6XxoA2npSvkyO5flS97Hu97D5hIyevww-w"
//             },
//             "body": {
//                 "id": 1,
//                 "username": "testuser1",
//                 "password": "$2a$10$wsBsq32kWMMVy25Qq.6AM.H8kRKCuzPGfSK/ka.nCA5IYwp7jWI9u",
//                 "enabled": true,
//                 "role": [
//                     {
//                         "id": 1,
//                         "authority": "USER"
//                     }
//                 ],
//                 "accountNonExpired": true,
//                 "credentialsNonExpired": true,
//                 "accountNonLocked": true
//             }
//         };

//         render(<Login reloadPage={reloadMock}/>);

//         fetch.mockResponseOnce(JSON.stringify(mockLoginResponse));

//         act( () => {
//             userEvent.type(screen.getByRole('textbox'), 'testuser');
//             userEvent.click(screen.getByRole('button'));
//         });

//         waitFor( () => {
//             screen.getByRole('header');
//         });

//         expect(consoleOutput).toContain('In submit handler');
//         expect(consoleOutput).toContain('contact login service');
//     })
// })