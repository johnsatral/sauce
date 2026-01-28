import { Page, Locator, test } from "@playwright/test";

export class LoginPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;  
    readonly pageTitle;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.getByTestId("username");
        this.passwordInput = page.getByTestId("password");
        this.loginButton = page.getByTestId("login-button");
        this.pageTitle = page.locator(".login_logo");
    }

    async waitForLoginPage()
    {
        await test.step("Wait for login page to be visible", async () => {
            await this.pageTitle.waitFor({ state: "visible", timeout: 5000 });
        });
    }

    async login(username: string, password: string) {
        await test.step(`Login with username: ${username}`, async () => {
            await this.usernameInput.fill(username);
            await this.passwordInput.fill(password);
            await this.loginButton.click();
        });
    }
}