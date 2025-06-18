import { type Page, type Locator, expect } from '@playwright/test';
import { Visit } from '../types/types';

export class VisitsPage {
    private addVisitLink: Locator;

    constructor(private page: Page) {
        this.addVisitLink = page.getByRole('link', { name: /add visit/i });
    }

    async addNewVisit(visit: Visit) {
        await this.addVisitLink.click();

        // Click add visit button to trigger validation
        await this.page.getByRole('button', { name: /add visit/i }).click();
        await expect(this.page.locator('#visit .help-inline')).toContainText('must not be empty');

        await this.page.locator('form#visit input#description').fill(visit.description);
        await this.page.getByRole('button', { name: /add visit/i }).click();
    }

    async verifyVisitInTable(visit: Visit) {
        await expect(async () => {
            const visitsTable = this.page.locator('table.table-condensed[aria-describedby="petsAndVisits"]');
            await expect(visitsTable).toContainText(visit.description);
        }).toPass({ timeout: 10000 });
    }
}
