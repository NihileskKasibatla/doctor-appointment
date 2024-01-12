import React from "react";
import { expect, jest, test, } from "@jest/globals";
import {cleanup, fireEvent, render} from '@testing-library/react';
import Login from "../../../src/Login/Login";
const $ = require('jquery');
import * as router from 'react-router'
import renderer from 'react-test-renderer';

const navigate = jest.fn()

/**
 * @jest-environment jsdom
 */

describe("<Login />", () => {
    beforeEach(() => {
        jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate)
    });

    afterEach(() => {
        jest.clearAllMocks();
        cleanup();
    });

    describe("Login Component", () => {
        test("There should be a sign up element on the screen", () => {
            const element = document.getElementsByClassName("sign-up");
            expect(element).toBeTruthy();
        });

        test("There should be sign in button on the screen", () => {
            const element = document.getElementsByClassName("sign-in-btn");
            expect(element).toBeTruthy();
        });
    
        test("Email address should have error label", () => {
            $('.sign-in-btn').trigger( "click");
            const e = document.getElementById("emailaddress-label");
            expect(e).not.toBeTruthy();
        });
    });
});
