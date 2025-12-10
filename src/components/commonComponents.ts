import { Page, Locator } from '@playwright/test';
import { logger, logStep } from '../utils/logger';

/**
 * Common UI Components
 * Reusable components used across multiple pages
 * NO CODE DUPLICATION - Define once, use everywhere
 */

// ==================== FORM COMPONENT ====================
export class FormComponent {
  readonly page: Page;
  private baseLocator: string;

  constructor(page: Page, baseLocator: string = 'form') {
    this.page = page;
    this.baseLocator = baseLocator;
  }

  async fillTextInput(fieldName: string, value: string): Promise<void> {
    const locator = this.page.locator(`${this.baseLocator} input[name="${fieldName}"], ${this.baseLocator} [data-testid="${fieldName}"]`);
    await locator.clear();
    await locator.fill(value);
    logger.debug(`✓ Filled ${fieldName}: ${value.substring(0, 20)}...`);
  }

  async selectDropdown(fieldName: string, value: string): Promise<void> {
    const locator = this.page.locator(`${this.baseLocator} select[name="${fieldName}"]`);
    await locator.selectOption(value);
    logger.debug(`✓ Selected ${fieldName}: ${value}`);
  }

  async checkCheckbox(fieldName: string): Promise<void> {
    const locator = this.page.locator(`${this.baseLocator} input[name="${fieldName}"][type="checkbox"]`);
    if (!await locator.isChecked()) {
      await locator.check();
      logger.debug(`✓ Checked: ${fieldName}`);
    }
  }

  async uncheckCheckbox(fieldName: string): Promise<void> {
    const locator = this.page.locator(`${this.baseLocator} input[name="${fieldName}"][type="checkbox"]`);
    if (await locator.isChecked()) {
      await locator.uncheck();
      logger.debug(`✓ Unchecked: ${fieldName}`);
    }
  }

  async selectRadio(fieldName: string, value: string): Promise<void> {
    const locator = this.page.locator(`${this.baseLocator} input[name="${fieldName}"][value="${value}"]`);
    await locator.check();
    logger.debug(`✓ Selected radio: ${fieldName} = ${value}`);
  }

  async submitForm(): Promise<void> {
    const submitButton = this.page.locator(`${this.baseLocator} button[type="submit"], ${this.baseLocator} input[type="submit"]`);
    await submitButton.click();
    logger.debug('✓ Form submitted');
  }

  async resetForm(): Promise<void> {
    const resetButton = this.page.locator(`${this.baseLocator} button[type="reset"]`);
    await resetButton.click();
    logger.debug('✓ Form reset');
  }

  async fillForm(data: Record<string, any>): Promise<void> {
    logStep('Filling form with data');
    for (const [field, value] of Object.entries(data)) {
      await this.fillTextInput(field, String(value));
    }
    logger.info('✓ Form filled with all data');
  }
}

// ==================== TABLE COMPONENT ====================
export class TableComponent {
  readonly page: Page;
  private tableLocator: Locator;

  constructor(page: Page, tableSelector: string = 'table') {
    this.page = page;
    this.tableLocator = page.locator(tableSelector);
  }

  async getRowCount(): Promise<number> {
    return await this.tableLocator.locator('tbody tr').count();
  }

  async getColumnCount(): Promise<number> {
    return await this.tableLocator.locator('thead th').count();
  }

  async getHeaderText(columnIndex: number): Promise<string> {
    const header = this.tableLocator.locator(`thead th:nth-child(${columnIndex + 1})`);
    return await header.textContent() || '';
  }

  async getCellText(row: number, column: number): Promise<string> {
    const cell = this.tableLocator.locator(`tbody tr:nth-child(${row + 1}) td:nth-child(${column + 1})`);
    return await cell.textContent() || '';
  }

  async getRowData(rowIndex: number): Promise<string[]> {
    const cells = this.tableLocator.locator(`tbody tr:nth-child(${rowIndex + 1}) td`);
    const count = await cells.count();
    const data: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const text = await cells.nth(i).textContent();
      data.push(text || '');
    }
    
    return data;
  }

  async clickCellButton(row: number, column: number, buttonText: string): Promise<void> {
    const cell = this.tableLocator.locator(`tbody tr:nth-child(${row + 1}) td:nth-child(${column + 1})`);
    const button = cell.locator(`button:has-text("${buttonText}")`);
    await button.click();
    logger.debug(`✓ Clicked button "${buttonText}" in row ${row}`);
  }

  async searchInTable(searchText: string): Promise<number[]> {
    const rows = await this.getRowCount();
    const matchingRows: number[] = [];
    
    for (let i = 0; i < rows; i++) {
      const rowData = await this.getRowData(i);
      if (rowData.some(cell => cell.includes(searchText))) {
        matchingRows.push(i);
      }
    }
    
    return matchingRows;
  }

  async sortByColumn(columnIndex: number): Promise<void> {
    const header = this.tableLocator.locator(`thead th:nth-child(${columnIndex + 1})`);
    await header.click();
    logger.debug(`✓ Sorted by column ${columnIndex}`);
  }
}

// ==================== MODAL/DIALOG COMPONENT ====================
export class ModalComponent {
  readonly page: Page;
  readonly modalLocator: Locator;
  readonly titleLocator: Locator;
  readonly contentLocator: Locator;
  readonly closeButton: Locator;
  readonly confirmButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page, modalSelector: string = '.modal, [role="dialog"]') {
    this.page = page;
    this.modalLocator = page.locator(modalSelector);
    this.titleLocator = this.modalLocator.locator('.modal-title, [data-testid="modal-title"]');
    this.contentLocator = this.modalLocator.locator('.modal-body, [data-testid="modal-content"]');
    this.closeButton = this.modalLocator.locator('button.close, [data-testid="modal-close"]');
    this.confirmButton = this.modalLocator.locator('button:has-text("Confirm"), button:has-text("OK"), button:has-text("Yes")');
    this.cancelButton = this.modalLocator.locator('button:has-text("Cancel"), button:has-text("No")');
  }

  async waitForModal(): Promise<void> {
    await this.modalLocator.waitFor({ state: 'visible', timeout: 5000 });
    logger.debug('✓ Modal appeared');
  }

  async isModalVisible(): Promise<boolean> {
    return await this.modalLocator.isVisible();
  }

  async getModalTitle(): Promise<string> {
    return await this.titleLocator.textContent() || '';
  }

  async getModalContent(): Promise<string> {
    return await this.contentLocator.textContent() || '';
  }

  async clickClose(): Promise<void> {
    await this.closeButton.click();
    await this.modalLocator.waitFor({ state: 'hidden' });
    logger.debug('✓ Modal closed');
  }

  async clickConfirm(): Promise<void> {
    await this.confirmButton.click();
    await this.modalLocator.waitFor({ state: 'hidden' });
    logger.debug('✓ Modal confirmed');
  }

  async clickCancel(): Promise<void> {
    await this.cancelButton.click();
    await this.modalLocator.waitFor({ state: 'hidden' });
    logger.debug('✓ Modal cancelled');
  }
}

// ==================== DROPDOWN/SELECT COMPONENT ====================
export class DropdownComponent {
  readonly page: Page;
  readonly dropdownLocator: Locator;

  constructor(page: Page, dropdownSelector: string) {
    this.page = page;
    this.dropdownLocator = page.locator(dropdownSelector);
  }

  async selectByValue(value: string): Promise<void> {
    await this.dropdownLocator.selectOption({ value });
    logger.debug(`✓ Selected value: ${value}`);
  }

  async selectByLabel(label: string): Promise<void> {
    await this.dropdownLocator.selectOption({ label });
    logger.debug(`✓ Selected label: ${label}`);
  }

  async selectByIndex(index: number): Promise<void> {
    await this.dropdownLocator.selectOption({ index });
    logger.debug(`✓ Selected index: ${index}`);
  }

  async getSelectedValue(): Promise<string> {
    return await this.dropdownLocator.inputValue();
  }

  async getSelectedText(): Promise<string> {
    const value = await this.getSelectedValue();
    const option = this.dropdownLocator.locator(`option[value="${value}"]`);
    return await option.textContent() || '';
  }

  async getAllOptions(): Promise<string[]> {
    const options = this.dropdownLocator.locator('option');
    const count = await options.count();
    const optionTexts: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const text = await options.nth(i).textContent();
      optionTexts.push(text || '');
    }
    
    return optionTexts;
  }
}

// ==================== NOTIFICATION/TOAST COMPONENT ====================
export class NotificationComponent {
  readonly page: Page;
  readonly notificationLocator: Locator;

  constructor(page: Page, notificationSelector: string = '.toast, .notification, [role="alert"]') {
    this.page = page;
    this.notificationLocator = page.locator(notificationSelector);
  }

  async waitForNotification(timeout: number = 5000): Promise<void> {
    await this.notificationLocator.waitFor({ state: 'visible', timeout });
    logger.debug('✓ Notification appeared');
  }

  async getMessage(): Promise<string> {
    await this.waitForNotification();
    return await this.notificationLocator.textContent() || '';
  }

  async getType(): Promise<string> {
    const classList = await this.notificationLocator.getAttribute('class') || '';
    
    if (classList.includes('success')) return 'success';
    if (classList.includes('error') || classList.includes('danger')) return 'error';
    if (classList.includes('warning')) return 'warning';
    if (classList.includes('info')) return 'info';
    
    return 'unknown';
  }

  async close(): Promise<void> {
    const closeButton = this.notificationLocator.locator('button.close, [data-testid="notification-close"]');
    if (await closeButton.isVisible()) {
      await closeButton.click();
      logger.debug('✓ Notification closed');
    }
  }

  async waitForDismiss(timeout: number = 10000): Promise<void> {
    await this.notificationLocator.waitFor({ state: 'hidden', timeout });
    logger.debug('✓ Notification dismissed');
  }
}

// ==================== PAGINATION COMPONENT ====================
export class PaginationComponent {
  readonly page: Page;
  readonly paginationLocator: Locator;
  readonly nextButton: Locator;
  readonly previousButton: Locator;
  readonly firstButton: Locator;
  readonly lastButton: Locator;

  constructor(page: Page, paginationSelector: string = '.pagination, [data-testid="pagination"]') {
    this.page = page;
    this.paginationLocator = page.locator(paginationSelector);
    this.nextButton = this.paginationLocator.locator('button:has-text("Next"), a:has-text("Next")');
    this.previousButton = this.paginationLocator.locator('button:has-text("Previous"), a:has-text("Previous")');
    this.firstButton = this.paginationLocator.locator('button:has-text("First"), a:has-text("First")');
    this.lastButton = this.paginationLocator.locator('button:has-text("Last"), a:has-text("Last")');
  }

  async goToNextPage(): Promise<void> {
    await this.nextButton.click();
    logger.debug('✓ Navigated to next page');
  }

  async goToPreviousPage(): Promise<void> {
    await this.previousButton.click();
    logger.debug('✓ Navigated to previous page');
  }

  async goToFirstPage(): Promise<void> {
    await this.firstButton.click();
    logger.debug('✓ Navigated to first page');
  }

  async goToLastPage(): Promise<void> {
    await this.lastButton.click();
    logger.debug('✓ Navigated to last page');
  }

  async goToPage(pageNumber: number): Promise<void> {
    const pageButton = this.paginationLocator.locator(`button:has-text("${pageNumber}"), a:has-text("${pageNumber}")`);
    await pageButton.click();
    logger.debug(`✓ Navigated to page ${pageNumber}`);
  }

  async getCurrentPage(): Promise<number> {
    const activeButton = this.paginationLocator.locator('.active, [aria-current="page"]');
    const text = await activeButton.textContent();
    return parseInt(text || '1');
  }

  async isNextEnabled(): Promise<boolean> {
    const isDisabled = await this.nextButton.isDisabled();
    return !isDisabled;
  }

  async isPreviousEnabled(): Promise<boolean> {
    const isDisabled = await this.previousButton.isDisabled();
    return !isDisabled;
  }
}

// ==================== BREADCRUMB COMPONENT ====================
export class BreadcrumbComponent {
  readonly page: Page;
  readonly breadcrumbLocator: Locator;

  constructor(page: Page, breadcrumbSelector: string = '.breadcrumb, [aria-label="breadcrumb"]') {
    this.page = page;
    this.breadcrumbLocator = page.locator(breadcrumbSelector);
  }

  async getBreadcrumbItems(): Promise<string[]> {
    const items = this.breadcrumbLocator.locator('li, a');
    const count = await items.count();
    const breadcrumbs: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const text = await items.nth(i).textContent();
      breadcrumbs.push(text?.trim() || '');
    }
    
    return breadcrumbs;
  }

  async clickBreadcrumb(text: string): Promise<void> {
    const item = this.breadcrumbLocator.locator(`a:has-text("${text}")`);
    await item.click();
    logger.debug(`✓ Clicked breadcrumb: ${text}`);
  }

  async getCurrentPage(): Promise<string> {
    const items = await this.getBreadcrumbItems();
    return items[items.length - 1];
  }
}

// ==================== TAB COMPONENT ====================
export class TabComponent {
  readonly page: Page;
  readonly tabsLocator: Locator;

  constructor(page: Page, tabsSelector: string = '[role="tablist"], .tabs') {
    this.page = page;
    this.tabsLocator = page.locator(tabsSelector);
  }

  async clickTab(tabName: string): Promise<void> {
    const tab = this.tabsLocator.locator(`[role="tab"]:has-text("${tabName}"), button:has-text("${tabName}")`);
    await tab.click();
    logger.debug(`✓ Clicked tab: ${tabName}`);
  }

  async getActiveTab(): Promise<string> {
    const activeTab = this.tabsLocator.locator('[aria-selected="true"], .active');
    return await activeTab.textContent() || '';
  }

  async getAllTabs(): Promise<string[]> {
    const tabs = this.tabsLocator.locator('[role="tab"], button');
    const count = await tabs.count();
    const tabNames: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const text = await tabs.nth(i).textContent();
      tabNames.push(text?.trim() || '');
    }
    
    return tabNames;
  }
}

// ==================== CARD COMPONENT ====================
export class CardComponent {
  readonly page: Page;
  readonly cardLocator: Locator;

  constructor(page: Page, cardSelector: string) {
    this.page = page;
    this.cardLocator = page.locator(cardSelector);
  }

  async getTitle(): Promise<string> {
    const title = this.cardLocator.locator('.card-title, h3, h4, h5');
    return await title.textContent() || '';
  }

  async getContent(): Promise<string> {
    const content = this.cardLocator.locator('.card-body, .card-content');
    return await content.textContent() || '';
  }

  async clickButton(buttonText: string): Promise<void> {
    const button = this.cardLocator.locator(`button:has-text("${buttonText}")`);
    await button.click();
    logger.debug(`✓ Clicked button: ${buttonText}`);
  }

  async getImageSrc(): Promise<string | null> {
    const image = this.cardLocator.locator('img');
    return await image.getAttribute('src');
  }
}

// ==================== FILTER/SIDEBAR COMPONENT ====================
export class FilterComponent {
  readonly page: Page;
  readonly filterLocator: Locator;

  constructor(page: Page, filterSelector: string = '.sidebar, .filters, [data-testid="filters"]') {
    this.page = page;
    this.filterLocator = page.locator(filterSelector);
  }

  async selectCheckboxFilter(filterName: string): Promise<void> {
    const checkbox = this.filterLocator.locator(`input[type="checkbox"][value="${filterName}"], label:has-text("${filterName}") input`);
    await checkbox.check();
    logger.debug(`✓ Applied filter: ${filterName}`);
  }

  async deselectCheckboxFilter(filterName: string): Promise<void> {
    const checkbox = this.filterLocator.locator(`input[type="checkbox"][value="${filterName}"], label:has-text("${filterName}") input`);
    await checkbox.uncheck();
    logger.debug(`✓ Removed filter: ${filterName}`);
  }

  async setPriceRange(min: number, max: number): Promise<void> {
    const minInput = this.filterLocator.locator('input[name="price_min"], input[placeholder*="Min"]');
    const maxInput = this.filterLocator.locator('input[name="price_max"], input[placeholder*="Max"]');
    
    await minInput.fill(String(min));
    await maxInput.fill(String(max));
    logger.debug(`✓ Set price range: ${min} - ${max}`);
  }

  async applyFilters(): Promise<void> {
    const applyButton = this.filterLocator.locator('button:has-text("Apply"), button[type="submit"]');
    await applyButton.click();
    logger.debug('✓ Filters applied');
  }

  async clearFilters(): Promise<void> {
    const clearButton = this.filterLocator.locator('button:has-text("Clear"), button:has-text("Reset")');
    await clearButton.click();
    logger.debug('✓ Filters cleared');
  }
}

// Export all components
export const Components = {
  FormComponent,
  TableComponent,
  ModalComponent,
  DropdownComponent,
  NotificationComponent,
  PaginationComponent,
  BreadcrumbComponent,
  TabComponent,
  CardComponent,
  FilterComponent
};