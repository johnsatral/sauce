import { LoginPage } from "../page-objects/loginPage.ts";
import { globalFixture } from "../../globalFixture.fx.ts";
import { InventoryPage } from "../page-objects/inventoryPage.ts";
import { OverviewPage } from "../page-objects/overviewPage.ts";
import { CompletePage } from "../page-objects/orderCompletePage.ts";
import { CartPage } from "../page-objects/cartPage.ts";
import { CheckoutPage } from "../page-objects/checkoutPage.ts";


interface SauceDemoFixtures {
    loginPage: LoginPage;
    inventoryPage: InventoryPage;
    overviewPage: OverviewPage;
    completePage: CompletePage;
    cartPage: CartPage;
    checkoutPage: CheckoutPage;
    orderCompletePage: CompletePage;
}

export const test = globalFixture.extend<SauceDemoFixtures>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },
    inventoryPage: async ({ page }, use) => {
        const inventoryPage = new InventoryPage(page);
        await use(inventoryPage);
    },
    overviewPage: async ({ page }, use) => {
        const overviewPage = new OverviewPage(page);
        await use(overviewPage);
    },
    completePage: async ({ page }, use) => {
        const completePage = new CompletePage(page);        
        await use(completePage);
    },
    cartPage: async ({ page }, use) => {
        const cartPage = new CartPage(page);
        await use(cartPage);
    },
    checkoutPage: async ({ page }, use) => {
        const checkoutPage = new CheckoutPage(page);
        await use(checkoutPage);
    },
    orderCompletePage: async ({ page }, use) => {
        const orderCompletePage = new CompletePage(page);
        await use(orderCompletePage);
    },
});