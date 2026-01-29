import { expect, test, request, APIRequestContext } from '@playwright/test';
import { apiBaseURL, apiUsername, apiPassword } from '../../../utils/localVariables.ts';

let apiContext: APIRequestContext;

test.beforeAll(async () => {
  apiContext = await request.newContext({
    extraHTTPHeaders: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      Referer: 'https://fakestoreapi.com/',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
    },
  });
});

test.afterAll(async () => {
  await apiContext.dispose();
});

test.describe('FakeStore API tests', () => {
  test('successful login test for fakestore api, using existing users', async () => {
    const response = await apiContext.post(`${apiBaseURL}/auth/login`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        username: apiUsername,
        password: apiPassword,
      },
    });
    console.log('request info', response.headers());
    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('token');
  });

  test('get users to do the login tests', async () => {
    const newUser = await apiContext.get(`${apiBaseURL}/users`);
    expect(newUser.status()).toBe(200);
  });

  test('get products to do the test with  products', async () => {
    const prods = await apiContext.get(`${apiBaseURL}/products`);
    expect(prods.status()).toBe(200);
  });

  test('get product and validate its content', async () => {
    const newUser = await apiContext.get(`${apiBaseURL}/products/5`);
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

  test('create a new cart', async ({ request }) => {
    const newUser = await request.post(`${apiBaseURL}/carts`, {
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

  test('delete a user', async ({ request }) => {
    const deleteUser = await request.delete(`${apiBaseURL}/users/5`, {});
    expect(deleteUser.status()).toBe(200);
  });

  //negative scenario 1
  test('updating a product, but forgetting to add a parameter', async ({ request }) => {
    const updateProduct = await request.put(`${apiBaseURL}/products`, {
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
  test('login with invalid creds', async ({ request }) => {
    const response = await request.post(`${apiBaseURL}/auth/login`, {
      data: {
        username: 'invalid',
        password: 'invalid',
      },
    });
    expect(response.status()).toBe(401);
  });
});
