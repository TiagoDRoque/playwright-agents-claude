import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com';
const USER = 'standard_user';
const PASSWORD = 'secret_sauce';

test.describe('SauceDemo shop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.getByPlaceholder('Username').fill(USER);
    await page.getByPlaceholder('Password').fill(PASSWORD);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/inventory/);
  });

  test('login succeeds and shows inventory', async ({ page }) => {
    await expect(page.locator('.title')).toHaveText('Products');
    await expect(page.locator('.inventory_item')).toHaveCount(6);
  });

  test('add single item to cart and verify badge', async ({ page }) => {
    await page.locator('.inventory_item').first().getByRole('button', { name: 'Add to cart' }).click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('complete checkout with one item', async ({ page }) => {
    await page.locator('.inventory_item').first().getByRole('button', { name: 'Add to cart' }).click();
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/cart/);

    await page.getByRole('button', { name: 'Checkout' }).click();
    await page.getByPlaceholder('First Name').fill('Tiago');
    await page.getByPlaceholder('Last Name').fill('Roque');
    await page.getByPlaceholder('Zip/Postal Code').fill('1000');
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.locator('.summary_info')).toBeVisible();
    await page.getByRole('button', { name: 'Finish' }).click();

    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });

  test('logout returns to login page', async ({ page }) => {
    await page.locator('#react-burger-menu-btn').click();
    const logoutLink = page.locator('#logout_sidebar_link');
    await logoutLink.waitFor({ state: 'visible' });
    await logoutLink.click();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });
});
