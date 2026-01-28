import { Page, Locator, test } from "@playwright/test";

export class CompletePage {
    readonly page: Page;
    readonly completePage: Locator;
    readonly orderCompletionMessage: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.completePage = page.getByTestId("checkout-complete-container");
        this.orderCompletionMessage = page.getByTestId("complete-header");
        
    }

    async waitForCompletePage()
    {
        await test.step("Wait for complete order page to be visible", async () => {
            await this.completePage.waitFor({ state: "visible", timeout: 5000 });
        });
    }

    async getCompletionMessage(): Promise<string> {
        return await test.step("Get order completion message", async () => {
            const messageLocator = this.orderCompletionMessage;
            await messageLocator.waitFor({ state: "visible", timeout: 5000 });
            return await messageLocator.textContent() ?? "";
        });
    }
}