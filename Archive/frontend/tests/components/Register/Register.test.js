import React, { useState } from "react";
import { expect, jest, test } from "@jest/globals";
import Register from "../../../src/Register/Register";
import * as router from "react-router";
import { cleanup, fireEvent, getByTestId, render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AppContext from "../../../src/store/store";

const setAccountType = jest.fn();
const navigate = jest.fn();

describe("Register Component", () => {
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
            <AppContext.Provider value={{ accountType: 1, setAccountType }}>
                <BrowserRouter>
                    <Register />
                </BrowserRouter>
            </AppContext.Provider>,
        );

        // Act
        fireEvent.change(getByTestId("phonenumber"), { target: { value: "1234567890" } });

        // Assert
        expect(queryByTestId("password-error-label")).toBeNull();
    });

    test("Test if invalid phone number displays error message", async () => {
        // Arrange
        const { getByTestId } = render(
            <AppContext.Provider value={{ accountType: 1, setAccountType }}>
                <BrowserRouter>
                    <Register />
                </BrowserRouter>
            </AppContext.Provider>,
        );

        // Act
        fireEvent.change(getByTestId("phonenumber"), { target: { value: "846589" } });
        fireEvent.click(getByTestId("registerBtn"));

        // Assert
        expect(getByTestId("phonenumber-error-label")).toBeTruthy();
    });

    test("Test no error message is displayed if phone number is valid", async () => {
        // Arrange
        const { getByTestId, queryByTestId } = render(
            <AppContext.Provider value={{ accountType: 1, setAccountType }}>
                <BrowserRouter>
                    <Register />
                </BrowserRouter>
            </AppContext.Provider>,
        );

        // Act
        fireEvent.change(getByTestId("phonenumber"), { target: { value: "1234567890" } });
        fireEvent.click(getByTestId("registerBtn"));

        // Assert
        const element = queryByTestId("phonenumber-error-label");
        expect(element).toBeNull();
    });
});
