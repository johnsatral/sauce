import { Page, Locator, test } from "@playwright/test";

export class CheckoutPage {
    readonly page: Page;
    readonly checkoutPage: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly postalCodeInput: Locator;
    readonly continueButton: Locator;


    constructor(page: Page) {
        this.page = page;
        this.checkoutPage = page.getByTestId("checkout-info-container");
        this.firstNameInput = page.getByTestId("firstName");
        this.lastNameInput = page.getByTestId("lastName");
        this.postalCodeInput = page.getByTestId("postalCode");
        this.continueButton = page.getByTestId("continue");
        
    }

    async waitForCheckoutPage()
    {
        await test.step("Wait for checkout page to be visible", async () => {
            await this.checkoutPage.waitFor({ state: "visible", timeout: 5000 });
        });
    }

    async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string) {
        await test.step("Fill in checkout information", async () => {
            await this.firstNameInput.fill(firstName);
            await this.lastNameInput.fill(lastName);
            await this.postalCodeInput.fill(postalCode);
        });
    }

    async proceedToCheckout() {
        await test.step("Proceed to checkout from the checkout page", async () => {
            await this.continueButton.click();
        }); 
    }
}