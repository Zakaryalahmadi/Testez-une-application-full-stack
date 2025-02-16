/// <reference types="cypress" />

import { getByDataCy } from "../utils/get-by-data-cy"

describe("Register page e2e", () => {
    const VALID_REGISTER_FORM_VALUES = {
        email: "valid@gmail.com",
        firstName:"zakarya",
        lastName: "lahmadi",
        password: "123456"
    }

    beforeEach(() => {
        cy.visit('/register')
    })

    const register = (email: string, firstName: string, lastName: string, password: string) => {
        getByDataCy("email-input").type(email);
        getByDataCy("firstName-input").type(firstName);
        getByDataCy("lastName-input").type(lastName);
        getByDataCy("password-input").type(password);
        getByDataCy("register-submit").click();
    }
 
    describe("Register attempts", () => {
        it("Should register successfully with valid credentials", () =>{
            cy.request({
                method: 'POST',
                url: 'http://localhost:8080/api/test/reset-db',
                failOnStatusCode: false
              })
            const {email, firstName, lastName, password} = VALID_REGISTER_FORM_VALUES;
            register(email, firstName, lastName, password);

            cy.url().should('include','/login');
        })

        it("Should fail with already existant User", () => {
            const {email, firstName, lastName, password} = VALID_REGISTER_FORM_VALUES;
            register(email, firstName, lastName, password);

            getByDataCy('error').should('be.visible').and('contain','An error occurred')
        })
    })
})