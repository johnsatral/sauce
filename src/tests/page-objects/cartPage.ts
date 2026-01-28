import { Page, Locator, test } from "@playwright/test";

export class CartPage {
    readonly page: Page;
    readonly cartPage: Locator;
    readonly checkoutButton: Locator;


    constructor(page: Page) {
        this.page = page;
        this.cartPage = page.getByTestId("cart-contents-container");
        this.checkoutButton = page.getByTestId("checkout");
        
    }

    async waitForCartPage()
    {
        await test.step("Wait for cart page to be visible", async () => {
            await this.cartPage.waitFor({ state: "visible", timeout: 5000 });
        });
    }

    async proceedToCheckout() {
        await test.step("Proceed to checkout", async () => {
            await this.checkoutButton.click();
        }); 
    }
}