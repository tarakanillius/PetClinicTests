import { test, expect } from '@playwright/test';
import { HomePage } from './page-objects/HomePage';
import { OwnersPage } from './page-objects/OwnersPage';
import { PetsPage } from './page-objects/PetsPage';
import { VisitsPage } from './page-objects/VisitsPage';
import { Owner, Pet, Visit } from './types/types';

const testData = {
    owner: {
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Main St',
        city: 'Springfield',
        telephone: '1234567890',
    } as Owner,
    pet: {
        name: 'Buddy',
        birthDate: new Date('2025-06-18').toISOString().split('T')[0],
        type: 'dog',
    } as Pet,
    visit: {
        description: 'Regular checkup',
    } as Visit
};

test.describe('PetClinic E2E', () => {
    let homePage: HomePage;
    let ownersPage: OwnersPage;
    let petsPage: PetsPage;
    let visitsPage: VisitsPage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        ownersPage = new OwnersPage(page);
        petsPage = new PetsPage(page);
        visitsPage = new VisitsPage(page);

        await homePage.goto();
    });

    test('should create a new owner, add a pet, and create a visit', async () => {
        // Navigate to Add Owner page
        await homePage.navigateToFindOwners();
        await ownersPage.addNewOwner(testData.owner);
        await ownersPage.verifyOwnerInTable(testData.owner);

        // Add a new Pet
        await petsPage.addNewPet(testData.pet);
        await petsPage.verifyPetInTable(testData.pet);

        // Add a Visit for the Pet
        await visitsPage.addNewVisit(testData.visit);
        await visitsPage.verifyVisitInTable(testData.visit);

        // Verify owner search
        await homePage.navigateToFindOwners();
        await ownersPage.searchOwner(testData.owner.lastName);
        await ownersPage.verifyOwnerInSearchResults(testData.owner.firstName, testData.owner.lastName);
    });
});