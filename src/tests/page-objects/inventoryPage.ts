import { Page, Locator, test } from "@playwright/test";

export class InventoryPage {
    readonly page: Page;
    readonly inventoryPage: Locator;
    readonly backpackItem: Locator;
    readonly bikeLIghtItem: Locator;
    readonly shoppingCartLink: Locator;
    readonly clickSelector: Locator;
    readonly items: Locator;

    constructor(page: Page) {
        this.page = page;
        this.inventoryPage = page.getByTestId("inventory-container");
        this.backpackItem = page.getByTestId("add-to-cart-sauce-labs-backpack");
        this.bikeLIghtItem = page.getByTestId("add-to-cart-sauce-labs-bike-light");
        this.shoppingCartLink = page.getByTestId("shopping-cart-link");
        this.clickSelector = page.getByTestId("product-sort-container");
        this.items = page.getByTestId("inventory-item-name");
        
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

    async getAllItemsListinAscOrderAndSortInDesc(): Promise<string[]> {
        return await test.step("Get all items list from inventory page for Ascending order", async () => {
            await this.clickSelector.selectOption("az");
            const itemsList: string[] = await this.getAllItemsList();
            itemsList.sort((a, b) => b.localeCompare(a));
            return itemsList;
        });
    }

    async getAllItemsInDescOrder(): Promise<string[]> {
        return await test.step("Get all items list from inventory page for Descending order", async () => {
            await this.clickSelector.selectOption("za");    
            return await this.getAllItemsList();
        });
    }

    async getAllItemsList(): Promise<string[]> {
        return await test.step("Get all items list from inventory page", async () => {
            const itemsLocator = this.items;
            const itemCount = await itemsLocator.count();
            const itemsList: string[] = [];
            for (let i = 0; i < itemCount; i++) {
                const itemName = await itemsLocator.nth(i).textContent() ?? "";
                itemsList.push(itemName);
            }
            return itemsList;
        });
    }

}