import { type Page } from '@playwright/test';

export class HomePage {
    constructor(private page: Page) {}

    async navigateToFindOwners() {
        await this.page.getByRole('link', { name: /find owners/i }).click();
    }

    async goto() {
        await this.page.goto('http://localhost:8080/', { waitUntil: 'networkidle' });
    }
}
