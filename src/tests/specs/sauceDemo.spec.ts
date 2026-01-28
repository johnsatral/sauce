import { expect} from '@playwright/test';
import { test } from '../fixtures/sauceDemo.fx.ts';
import { username, password, firstName, lastName, postalCode, baseURL  } from "../../utils/localVariables.ts";


test.describe('SauceDemo basic tests', () => {
    test("saucedemo happy flow, checkout and validate final price", async ({ 
        page,
        loginPage,
        inventoryPage,
        cartPage,
        checkoutPage,
        overviewPage,
        completePage
    }) => {
        await page.goto(baseURL);  
        await loginPage.waitForLoginPage();

        await Promise.all([
            loginPage.login(username, password),
            inventoryPage.waitForInventoryPage()
        ]);

        await inventoryPage.addItems();

        await Promise.all([
            inventoryPage.goToShoppingCart(),
            cartPage.waitForCartPage()
        ]);

        await Promise.all([
            cartPage.proceedToCheckout(),
            checkoutPage.waitForCheckoutPage()
        ]);

        await checkoutPage.fillCheckoutInformation(firstName, lastName, postalCode);

        await Promise.all([
            checkoutPage.proceedToCheckout(),
            overviewPage.waitForOverviewPage()
        ]);

        expect(await overviewPage.getItemTotal()).toBe(39.98);
        expect(await overviewPage.getTotal()).toBe(43.18);

        await Promise.all([
            overviewPage.finishCheckout(),
            completePage.waitForCompletePage()
        ]);

        expect(await completePage.getCompletionMessage()).toBeTruthy();

    });

    test("test sorting functionality on inventory page", async ({
        page,
        loginPage,
        inventoryPage
    }) => {

        await page.goto(baseURL);
        await loginPage.waitForLoginPage();

        await Promise.all([
            loginPage.login(username, password),
            inventoryPage.waitForInventoryPage()
        ]);

        const ascSortedItems = await inventoryPage.getAllItemsListinAscOrderAndSortInDesc();
        const descSortedItems = await inventoryPage.getAllItemsInDescOrder();
        console.log("Ascending Sorted Items: ", ascSortedItems);
        console.log("Descending Sorted Items: ", descSortedItems);

        expect(ascSortedItems).toEqual(descSortedItems);

    });

    test("invalid login test", async ({
        page,
        loginPage
    }) => {
        await page.goto(baseURL);
        await loginPage.waitForLoginPage(); 
        await loginPage.login("invalid", "invalid");

        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toHaveText("Epic sadface: Username and password do not match any user in this service");
    });

});