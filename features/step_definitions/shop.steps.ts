import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

const BASE_URL = 'https://www.saucedemo.com';
const PASSWORD = 'secret_sauce';

Given('I am logged in as {string}', async ({ page }, username: string) => {
  await page.goto(BASE_URL);
  await page.getByPlaceholder('Username').fill(username);
  await page.getByPlaceholder('Password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/inventory/);
});

Then('the products page title should be {string}', async ({ page }, title: string) => {
  await expect(page.locator('.title')).toHaveText(title);
});

Then('there should be {int} inventory items', async ({ page }, count: number) => {
  await expect(page.locator('.inventory_item')).toHaveCount(count);
});

When('I add the first inventory item to the cart', async ({ page }) => {
  await page.locator('.inventory_item').first().getByRole('button', { name: 'Add to cart' }).click();
});

Then('the cart badge should show {string}', async ({ page }, count: string) => {
  await expect(page.locator('.shopping_cart_badge')).toHaveText(count);
});

When('I open the cart', async ({ page }) => {
  await page.locator('.shopping_cart_link').click();
  await expect(page).toHaveURL(/cart/);
});

When(
  'I checkout with first name {string}, last name {string} and zip {string}',
  async ({ page }, firstName: string, lastName: string, zip: string) => {
    await page.getByRole('button', { name: 'Checkout' }).click();
    await page.getByPlaceholder('First Name').fill(firstName);
    await page.getByPlaceholder('Last Name').fill(lastName);
    await page.getByPlaceholder('Zip/Postal Code').fill(zip);
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.locator('.summary_info')).toBeVisible();
  }
);

When('I finish the checkout', async ({ page }) => {
  await page.getByRole('button', { name: 'Finish' }).click();
});

Then('I should see the order confirmation {string}', async ({ page }, message: string) => {
  await expect(page.locator('.complete-header')).toHaveText(message);
});

When('I log out', async ({ page }) => {
  await page.locator('#react-burger-menu-btn').click();
  const logoutLink = page.locator('#logout_sidebar_link');
  await logoutLink.waitFor({ state: 'visible' });
  await logoutLink.click();
});

Then('the login button should be visible', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
});
