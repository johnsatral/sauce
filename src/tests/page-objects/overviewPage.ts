import { Page, Locator, test } from "@playwright/test";

export class OverviewPage {
    readonly page: Page;
    readonly overView: Locator;
    readonly itemTotalLabel: Locator;
    readonly totalLabel: Locator;
    readonly finishButton: Locator;


    constructor(page: Page) {
        this.page = page;
        this.overView = page.getByTestId("checkout-summary-container");
        this.itemTotalLabel = page.getByTestId("subtotal-label");   
        this.totalLabel = page.getByTestId("total-label"); 
        this.finishButton = page.getByTestId("finish");
    }

    async waitForOverviewPage()
    {
        await test.step("Wait for overview page to be visible", async () => {
            await this.overView.waitFor({ state: "visible", timeout: 5000 });
        });
    }

    async getItemTotal(): Promise<number> {
        return await test.step("Get item total from overview page", async () => {
            const itemTotalText = await this.itemTotalLabel.innerText();
            const itemTotalMatch = itemTotalText.match(/Item total: \$([0-9]+\.[0-9]{2})/);
            if (itemTotalMatch && itemTotalMatch[1]) {
                return parseFloat(itemTotalMatch[1]);
            }
            throw new Error("Item total not found on overview page");
        });
    }

    async getTotal(): Promise<number> {
        return await test.step("Get total from overview page", async () => {
            const totalText = await this.totalLabel.innerText();
            const totalMatch = totalText.match(/Total: \$([0-9]+\.[0-9]{2})/);
            if (totalMatch && totalMatch[1]) {
                return parseFloat(totalMatch[1]);
            }
            throw new Error("Total not found on overview page");
        });
    }

    async finishCheckout() {
        await test.step("Finish checkout from overview page", async () => {
            await this.finishButton.click();
        });
    }
}