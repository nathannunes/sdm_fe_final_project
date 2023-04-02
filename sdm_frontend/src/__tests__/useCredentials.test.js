import React from 'react';
import { describe, expect } from '@jest/globals';
import useCredentials from '../components/useCredentials';

// this will check that session storage for user name and role are set as expected
describe('useCredentials', () => {
    it('checks setToken', () => {
        const useStateMock = jest.spyOn(React, 'useState');

        const setState = jest.fn();
        useStateMock.mockImplementation(init => [init, setState]);

        const {setUser, setRole} = useCredentials();
        
        const mockCredentials = {
            "user": {
                "username": "testuser",
                "role": [
                    {
                        "id": 0,
                        "authority": "USER",
                        "user": null
                    }
                ]
            }
        };

        setUser(mockCredentials.user.username);
        setRole(mockCredentials.user.role[0].authority)

        expect(global.sessionStorage.getItem("userName")).toContain(mockCredentials.user.username);
        expect(global.sessionStorage.getItem("userRole")).toContain(mockCredentials.user.role[0].authority);

        global.sessionStorage.clear("token");
    })
})