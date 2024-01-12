import React, { useState } from "react";
import { expect, jest, test } from "@jest/globals";
import Login from "../../../src/Login/Login";
import * as router from "react-router";
import { cleanup, fireEvent, getByTestId, render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AppContext from "../../../src/store/store";

const setAccountType = jest.fn();
const navigate = jest.fn();

describe("Login Component", () => {
    beforeEach(() => {
        jest.spyOn(router, "useNavigate").mockImplementation(() => navigate);
    });

    afterEach(() => {
        jest.clearAllMocks();
        cleanup();
    });

    test("Test if user can input values", async () => {
        // Arrange
        const { getByTestId, queryByTestId } = render(
            <AppContext.Provider value={{ accountType: 0, setAccountType }}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </AppContext.Provider>,
        );

        // Act
        fireEvent.change(getByTestId("emailaddress"), { target: { value: "abcd@gmail.com" } });
        fireEvent.change(getByTestId("password"), { target: { value: "abcd" } });

        // Assert
        expect(queryByTestId("emailaddress-error-label")).toBeNull();
        expect(queryByTestId("password-error-label")).toBeNull();
    });

    test("Test if invalid email address displays error message", async () => {
        // Arrange
        const { getByTestId } = render(
            <AppContext.Provider value={{ accountType: 0, setAccountType }}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </AppContext.Provider>,
        );

        // Act
        fireEvent.change(getByTestId("emailaddress"), { target: { value: "n@gmail" } });
        fireEvent.click(getByTestId("signIn"));

        // Assert
        expect(getByTestId("emailaddress-error-label")).toBeTruthy();
    });

    test("Test no error message is displayed if email address is valid", async () => {
        // Arrange
        const { getByTestId, queryByTestId } = render(
            <AppContext.Provider value={{ accountType: 0, setAccountType }}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </AppContext.Provider>,
        );

        // Act
        fireEvent.change(getByTestId("emailaddress"), { target: { value: "n@gmail.com" } });
        fireEvent.click(getByTestId("signIn"));

        // Assert
        expect(queryByTestId("emailaddress-error-label")).toBeNull();
    });
});
