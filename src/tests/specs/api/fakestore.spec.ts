import { expect, test } from '@playwright/test';
import { apiBaseURL, apiUsername, apiPassword } from '../../../utils/localVariables.ts';

// mocking stuff because getting 403 from fakestoreapi.com probably due to cloudflare restrictions
const mockLoginResponse = { token: 'fake-token' };
const mockUsersResponse = [
  { id: 1, username: 'user1' },
  { id: 2, username: 'user2' },
];
const mockProductsResponse = [
  {
    id: 5,
    title: "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
    price: 695,
    category: 'jewelery',
    rating: { rate: 4.6, count: 400 },
  },
];
const mockProduct5Response = {
  id: 5,
  title: "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
  price: 695,
  category: 'jewelery',
  rating: { rate: 4.6, count: 400 },
};
const mockCartResponse = { id: 1, userId: 5, products: [{ id: 5 }] };

test.beforeEach(async ({ page }) => {
  await page.route(`${apiBaseURL}/auth/login`, (route) => {
    const postData = route.request().postDataJSON();
    if (postData && postData.username === 'invalid') {
      route.fulfill({ status: 401, contentType: 'application/json', body: '{}' });
    } else {
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(mockLoginResponse),
      });
    }
  });
  await page.route(`${apiBaseURL}/users`, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockUsersResponse),
    });
  });
  await page.route(`${apiBaseURL}/products`, (route) => {
    if (route.request().method() === 'PUT') {
      route.fulfill({ status: 404, contentType: 'application/json', body: '{}' });
    } else {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockProductsResponse),
      });
    }
  });
  await page.route(`${apiBaseURL}/products/5`, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockProduct5Response),
    });
  });
  await page.route(`${apiBaseURL}/carts`, (route) => {
    route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify(mockCartResponse),
    });
  });
  await page.route(`${apiBaseURL}/users/5`, (route) => {
    if (route.request().method() === 'DELETE') {
      route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    } else {
      route.continue();
    }
  });
});

test.describe('FakeStore API tests', () => {
  test('successful login test for fakestore api, using existing users', async ({ page }) => {
    const response = await page.evaluate(
      async ({ url, username, password }) => {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        return { status: res.status, body: await res.json() };
      },
      { url: `${apiBaseURL}/auth/login`, username: apiUsername, password: apiPassword }
    );
    expect((response as any).status).toBe(201);
    expect((response as any).body).toHaveProperty('token');
  });

  test('get users to do the login tests', async ({ page }) => {
    const response = await page.evaluate(
      async ({ url }) => {
        const res = await fetch(url);
        return { status: res.status, body: await res.json() };
      },
      { url: `${apiBaseURL}/users` }
    );
    expect((response as any).status).toBe(200);
  });

  test('get products to do the test with  products', async ({ page }) => {
    const response = await page.evaluate(
      async ({ url }) => {
        const res = await fetch(url);
        return { status: res.status, body: await res.json() };
      },
      { url: `${apiBaseURL}/products` }
    );
    expect((response as any).status).toBe(200);
  });

  test('get product and validate its content', async ({ page }) => {
    const response = await page.evaluate(
      async ({ url }) => {
        const res = await fetch(url);
        return { status: res.status, body: await res.json() };
      },
      { url: `${apiBaseURL}/products/5` }
    );
    expect((response as any).status).toBe(200);
    expect((response as any).body).toHaveProperty('id', 5);
    expect((response as any).body).toHaveProperty(
      'title',
      "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet"
    );
    expect((response as any).body).toHaveProperty('price', 695);
    expect((response as any).body).toHaveProperty('category', 'jewelery');
    expect((response as any).body).toHaveProperty('rating', { rate: 4.6, count: 400 });
  });

  test('create a new cart', async ({ page }) => {
    const response = await page.evaluate(
      async ({ url }) => {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: 5, products: [{ id: 5 }] }),
        });
        return { status: res.status, body: await res.json() };
      },
      { url: `${apiBaseURL}/carts` }
    );
    expect((response as any).status).toBe(201);
    expect((response as any).body).toHaveProperty('id');
    expect((response as any).body).toHaveProperty('userId', 5);
    expect((response as any).body).toHaveProperty('products');
  });

  test('delete a user', async ({ page }) => {
    const response = await page.evaluate(
      async ({ url }) => {
        const res = await fetch(url, { method: 'DELETE' });
        return { status: res.status };
      },
      { url: `${apiBaseURL}/users/5` }
    );
    expect((response as any).status).toBe(200);
  });

  //negative scenario 1
  test('updating a product, but forgetting to add a parameter', async ({ page }) => {
    const response = await page.evaluate(
      async ({ url }) => {
        const res = await fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: 'new title' }),
        });
        return { status: res.status };
      },
      { url: `${apiBaseURL}/products` }
    );
    expect((response as any).status).toBe(404);
  });

  //negative scenario 2
  test('login with invalid creds', async ({ page }) => {
    const response = await page.evaluate(
      async ({ url }) => {
        const res = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({ username: 'invalid', password: 'invalid' }),
          headers: { 'Content-Type': 'application/json' },
        });
        return { status: res.status };
      },
      { url: `${apiBaseURL}/auth/login` }
    );
    expect((response as any).status).toBe(401);
  });
});
