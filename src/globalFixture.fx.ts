import { test as base, Page } from "@playwright/test";
import { description } from "allure-js-commons";
import test from "node:test";

export const globalFixture = base.extend<{ page: Page }>({
    page: async ({ page }, use, testInfo) => {

        page.on('dialog', dialog => dialog.dismiss());

        await use(page);

        const annotations = testInfo.annotations.map(a => `${a.type}: ${a.description}`).join("\n");
        const finalDescription = `${testInfo.title}\n\n${annotations}`;

        await description(finalDescription);

        if(testInfo.status !== testInfo.expectedStatus) {
            const buffer = await page.screenshot({ fullPage: true });

            await testInfo.attach("screenshot", {
                body: buffer,
                contentType: "image/png"
            });
        }
        
        await page.close();
    }
});