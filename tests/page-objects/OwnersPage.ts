import { type Page, type Locator, expect } from '@playwright/test';
import { Owner } from '../types/types';

export class OwnersPage {
    private addOwnerLink: Locator;
    private searchInput: Locator;
    private findOwnerButton: Locator;

    constructor(private page: Page) {
        this.addOwnerLink = page.getByRole('link', { name: /add owner/i });
        this.searchInput = page.getByRole('textbox');
        this.findOwnerButton = page.getByRole('button', { name: /find owner/i });
    }

    async addNewOwner(owner: Owner) {
        await this.addOwnerLink.click();
        await this.page.locator('form#add-owner-form input#firstName').fill(owner.firstName);
        await this.page.locator('form#add-owner-form input#lastName').fill(owner.lastName);
        await this.page.locator('form#add-owner-form input#address').fill(owner.address);
        await this.page.locator('form#add-owner-form input#city').fill(owner.city);
        await this.page.locator('form#add-owner-form input#telephone').fill(owner.telephone);
        await this.page.getByRole('button', { name: /add owner/i }).click();
    }

    async searchOwner(searchTerm: string) {
        await this.searchInput.fill(searchTerm);
        await this.findOwnerButton.click();
    }

    async verifyOwnerInTable(owner: Owner) {
        await expect(async () => {
            const ownerTable = this.page.locator('table[aria-describedby="ownerInformation"]');
            await expect(ownerTable).toContainText(owner.firstName);
            await expect(ownerTable).toContainText(owner.lastName);
            await expect(ownerTable).toContainText(owner.address);
            await expect(ownerTable).toContainText(owner.city);
            await expect(ownerTable).toContainText(owner.telephone);
        }).toPass({ timeout: 10000 });
    }

    async verifyOwnerInSearchResults(firstName: string, lastName: string) {
        await expect(this.page.locator('tbody')).toContainText(`${firstName} ${lastName}`);
    }
}
