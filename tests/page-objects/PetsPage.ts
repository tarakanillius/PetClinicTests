import { type Page, type Locator, expect } from '@playwright/test';
import { Pet } from '../types/types';

export class PetsPage {
    private addPetLink: Locator;

    constructor(private page: Page) {
        this.addPetLink = page.getByRole('link', { name: /add new pet/i });
    }

    async addNewPet(pet: Pet) {
        await this.addPetLink.click();
        await this.page.locator('form#pet input#name').fill(pet.name);

        // Handle the date picker using JavaScript evaluation
        const birthDateInput = this.page.locator('input#birthDate');
        await birthDateInput.evaluate((el, value) => {
            el.value = value;
            el.dispatchEvent(new Event('input'));
            el.dispatchEvent(new Event('change'));
        }, pet.birthDate);

        await this.page.locator('#type').selectOption(pet.type);
        await this.page.getByRole('button', { name: /add pet/i }).click();
    }

    async verifyPetInTable(pet: Pet) {
        await expect(async () => {
            const petsTable = this.page.locator('table.table-striped[aria-describedby="petsAndVisits"]');
            await expect(petsTable).toContainText(pet.name);
            await expect(petsTable).toContainText(pet.birthDate);
            await expect(petsTable).toContainText(pet.type);
        }).toPass({ timeout: 10000 });
    }
}
