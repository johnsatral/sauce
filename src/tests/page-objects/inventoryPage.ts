import { Page, Locator, test } from "@playwright/test";

export class InventoryPage {
    readonly page: Page;
    readonly inventoryPage: Locator;
    readonly backpackItem: Locator;
    readonly bikeLIghtItem: Locator;
    readonly shoppingCartLink: Locator;
  

    constructor(page: Page) {
        this.page = page;
        this.inventoryPage = page.getByTestId("inventory-container");
        this.backpackItem = page.getByTestId("add-to-cart-sauce-labs-backpack");
        this.bikeLIghtItem = page.getByTestId("add-to-cart-sauce-labs-bike-light");
        this.shoppingCartLink = page.getByTestId("shopping-cart-link");
        
    }

    async waitForInventoryPage()
    {
        await test.step("Wait for inventory page to be visible", async () => {
            await this.inventoryPage.waitFor({ state: "visible", timeout: 5000 });
        });
    }

    async addItems() {
        await test.step("Add items to cart", async () => {
            await this.backpackItem.click();
            await this.bikeLIghtItem.click();
        });
    }

    async goToShoppingCart() {
        await test.step("Navigate to shopping cart", async () => {
            await this.shoppingCartLink.click();
        });
    }
}