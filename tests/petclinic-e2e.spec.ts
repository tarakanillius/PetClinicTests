import { test, expect } from '@playwright/test';

// Test data
const testData = {
  owner: {
    firstName: 'John',
    lastName: 'Doe',
    address: '123 Main St',
    city: 'Springfield',
    telephone: '1234567890',
  },
  pet: {
    name: 'Buddy',
    birthDate: new Date().toISOString().split('T')[0],
    type: 'dog',
  },
  visit: {
    description: 'Regular checkup',
  }
};

test.describe('PetClinic E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080/', { waitUntil: 'networkidle' });
  });

  test('should create a new owner, add a pet, and create a visit', async ({ page }) => {
    // Set longer timeout for complex operations
    test.slow();

    // Go to Find Owners and Add Owner page
    await page.getByRole('link', { name: /find owners/i }).click();
    await page.getByRole('link', { name: /add owner/i }).click();

    // Fill Owner form
    await page.locator('form#add-owner-form input#firstName').fill(testData.owner.firstName);
    await page.locator('form#add-owner-form input#lastName').fill(testData.owner.lastName);
    await page.locator('form#add-owner-form input#address').fill(testData.owner.address);
    await page.locator('form#add-owner-form input#city').fill(testData.owner.city);
    await page.locator('form#add-owner-form input#telephone').fill(testData.owner.telephone);

    await page.getByRole('button', { name: /add owner/i }).click();

    // Assert owner was added with retry
    await expect(async () => {
      const ownerTable = page.locator('table[aria-describedby="ownerInformation"]');
      await expect(ownerTable).toContainText(testData.owner.firstName);
      await expect(ownerTable).toContainText(testData.owner.lastName);
      await expect(ownerTable).toContainText(testData.owner.address);
      await expect(ownerTable).toContainText(testData.owner.city);
      await expect(ownerTable).toContainText(testData.owner.telephone);
    }).toPass({ timeout: 10000 });

    // Add a new Pet
    await page.getByRole('link', { name: /add new pet/i }).click();

    await page.locator('form#pet input#name').fill(testData.pet.name);

    // Handle the date picker using JavaScript evaluation
    const birthDateInput = page.locator('input#birthDate');
    await birthDateInput.evaluate((el, value) => {
      el.value = value;
      el.dispatchEvent(new Event('input'));
      el.dispatchEvent(new Event('change'));
    }, testData.pet.birthDate);

    await page.locator('#type').selectOption(testData.pet.type);
    await page.getByRole('button', { name: /add pet/i }).click();

    // Assert pet was added with retry
    await expect(async () => {
      const petsTable = page.locator('table.table-striped[aria-describedby="petsAndVisits"]');
      await expect(petsTable).toContainText(testData.pet.name);
      await expect(petsTable).toContainText(testData.pet.birthDate);
      await expect(petsTable).toContainText(testData.pet.type);
    }).toPass({ timeout: 10000 });

    // Add a Visit for the Pet
    await page.getByRole('link', { name: /add visit/i }).click();

    // Verify validation message
    await page.getByRole('button', { name: /add visit/i }).click();
    await expect(page.locator('#visit .help-inline')).toContainText('must not be empty');

    await page.locator('form#visit input#description').fill(testData.visit.description);
    await page.getByRole('button', { name: /add visit/i }).click();

    // Assert visit was added with retry
    await expect(async () => {
      const visitsTable = page.locator('table.table-condensed[aria-describedby="petsAndVisits"]');
      await expect(visitsTable).toContainText(testData.visit.description);
    }).toPass({ timeout: 10000 });

    // Verify owner search
    await page.getByRole('link', { name: /find owners/i }).click();
    await page.getByRole('textbox').fill(testData.owner.lastName);
    await page.getByRole('button', { name: /find owner/i }).click();

    // Assert that the owner appears in the search results
    await expect(page.locator('tbody')).toContainText(`${testData.owner.firstName} ${testData.owner.lastName}`);
  });
});