import React from 'react';
import { describe, expect } from '@jest/globals';
import useToken from '../components/useToken';

// this will check that useToken updates the sessionStorage as expected
describe('useToken', () => {
    it('checks setToken', () => {
        const useStateMock = jest.spyOn(React, 'useState');

        const setState = jest.fn();
        useStateMock.mockImplementation(init => [init, setState]);

        const {setToken} = useToken();
        
        const mockToken = {
            "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0dXNlcjUiLCJpYXQiOjE2Nzc4NTEyNTcsImV4cCI6MTY3Nzg1MjY5N30.pJWgqDbTyk2EfVHmCUnpRNKIqmot1L2FXI4WrAL363I",
        };

        setToken(mockToken.token);

        expect(global.sessionStorage.getItem("token")).toContain(mockToken.token);

        global.sessionStorage.clear("token");
    })
})