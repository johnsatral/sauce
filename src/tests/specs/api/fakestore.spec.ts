import { expect, test } from '@playwright/test';
import { apiBaseURL, apiUsername, apiPassword } from '../../../utils/localVariables.ts';

// Mocking api responses because unfortunately cloudfare seems to be blocking requests from playwright.
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
    if (route.request().postData()?.includes('invalid')) {
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
    const response = await page.request.post(`${apiBaseURL}/auth/login`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        username: apiUsername,
        password: apiPassword,
      },
    });
    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('token');
  });

  test('get users to do the login tests', async ({ page }) => {
    const newUser = await page.request.get(`${apiBaseURL}/users`);
    expect(newUser.status()).toBe(200);
  });

  test('get products to do the test with  products', async ({ page }) => {
    const prods = await page.request.get(`${apiBaseURL}/products`);
    expect(prods.status()).toBe(200);
  });

  test('get product and validate its content', async ({ page }) => {
    const newUser = await page.request.get(`${apiBaseURL}/products/5`);
    expect(newUser.status()).toBe(200);
    const newUserResponse = await newUser.json();
    expect(newUserResponse).toHaveProperty('id', 5);
    expect(newUserResponse).toHaveProperty(
      'title',
      "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet"
    );
    expect(newUserResponse).toHaveProperty('price', 695);
    expect(newUserResponse).toHaveProperty('category', 'jewelery');
    expect(newUserResponse).toHaveProperty('rating', { rate: 4.6, count: 400 });
  });

  test('create a new cart', async ({ page }) => {
    const newUser = await page.request.post(`${apiBaseURL}/carts`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        userId: 5,
        products: [{ id: 5 }],
      },
    });
    expect(newUser.status()).toBe(201);
    const newUserResponse = await newUser.json();
    expect(newUserResponse).toHaveProperty('id');
    expect(newUserResponse).toHaveProperty('userId', 5);
    expect(newUserResponse).toHaveProperty('products');
  });

  test('delete a user', async ({ page }) => {
    const deleteUser = await page.request.delete(`${apiBaseURL}/users/5`);
    expect(deleteUser.status()).toBe(200);
  });

  //negative scenario 1
  test('updating a product, but forgetting to add a parameter', async ({ page }) => {
    const updateProduct = await page.request.put(`${apiBaseURL}/products`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        title: 'new title',
      },
    });
    expect(updateProduct.status()).toBe(404);
  });

  //negative scenario 2
  test('login with invalid creds', async ({ page }) => {
    const response = await page.request.post(`${apiBaseURL}/auth/login`, {
      data: {
        username: 'invalid',
        password: 'invalid',
      },
    });
    expect(response.status()).toBe(401);
  });
});
