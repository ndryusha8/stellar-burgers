import { test, expect } from '@playwright/test';

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });

    await page.route('**/api/auth/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: { email: 'test@test.com', name: 'Test User' }
        })
      });
    });

    await page.route('**/api/orders', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            order: { number: 12345 }
          })
        });
      } else {
        await route.continue();
      }
    });

    await page.context().addCookies([
      {
        name: 'accessToken',
        value: 'fakeToken',
        domain: 'localhost',
        path: '/'
      }
    ]);

    await page.goto('/');
    await page.waitForSelector('[data-testid="ingredient"]', { timeout: 1000 });
  });

  test('добавление булки и начинки в конструктор', async ({ page }) => {
    const ingredientsContainer = page.locator(
      '[data-testid="burger-ingredients"]'
    );
    const constructorContainer = page.locator(
      '[data-testid="burger-constructor"]'
    );

    const bunCategory = ingredientsContainer.locator(
      '[data-testid="category-Булки"]'
    );
    const bun = bunCategory.locator('[data-testid="ingredient"]').first();
    await bun.locator('button', { hasText: 'Добавить' }).click();

    await expect(
      constructorContainer.locator('[data-testid="constructor-bun-top"]')
    ).toBeVisible();
    await expect(
      constructorContainer.locator('[data-testid="constructor-bun-bottom"]')
    ).toBeVisible();

    const mainCategory = ingredientsContainer.locator(
      '[data-testid="category-Начинки"]'
    );
    const filling = mainCategory.locator('[data-testid="ingredient"]').first();

    await filling.locator('button', { hasText: 'Добавить' }).click();

    const ingredientsList = constructorContainer.locator(
      '[data-testid="constructor-ingredients-list"]'
    );

    await expect(ingredientsList.locator('li')).toHaveCount(1);
  });

  test('открытие и закрытие модального окна ингредиента', async ({ page }) => {
    const ingredient = page.locator('[data-testid="ingredient"]').first();
    const ingredientName = await ingredient
      .locator('p.text_type_main-default')
      .textContent();

    expect(ingredientName, 'Имя ингредиента не найдено').not.toBeNull();

    await ingredient.click();

    const modal = page.locator('[data-testid="modal"]');
    await expect(modal).toBeVisible();

    await expect(modal.locator('[data-testid="title"]')).toContainText(
      'Детали ингредиента'
    );

    await expect(modal.locator('[data-testid="nameIngredient"]')).toContainText(
      ingredientName!
    );

    await page.locator('[data-testid="modal-close"]').click();
    await expect(modal).not.toBeVisible();

    await ingredient.click();
    await expect(modal).toBeVisible();

    await expect(modal.locator('[data-testid="nameIngredient"]')).toContainText(
      ingredientName!
    );

    await page.mouse.click(2, 2);
    await expect(modal).not.toBeVisible();
  });

  test('оформление заказа', async ({ page }) => {
    const ingredientsContainer = page.locator(
      '[data-testid="burger-ingredients"]'
    );
    const constructorContainer = page.locator(
      '[data-testid="burger-constructor"]'
    );

    const bunCategory = ingredientsContainer.locator(
      '[data-testid="category-Булки"]'
    );
    await bunCategory
      .locator('[data-testid="ingredient"]')
      .first()
      .locator('button', { hasText: 'Добавить' })
      .click();

    const mainCategory = ingredientsContainer.locator(
      '[data-testid="category-Начинки"]'
    );
    await mainCategory
      .locator('[data-testid="ingredient"]')
      .first()
      .locator('button', { hasText: 'Добавить' })
      .click();
    const orderButton = constructorContainer.locator(
      '[data-testid="order-button"]'
    );
    await orderButton.click();

    const orderModal = page.locator('[data-testid="modal"]');
    await expect(orderModal).toBeVisible();

    const orderNumber = await orderModal
      .locator('[data-testid="order-number"]')
      .textContent();
    expect(orderNumber).toBe('12345');

    await expect(
      constructorContainer.locator('[data-testid="constructor-bun-top"]')
    ).toHaveCount(0);
    await expect(
      constructorContainer.locator('[data-testid="constructor-bun-bottom"]')
    ).toHaveCount(0);
    await expect(
      constructorContainer.locator(
        '[data-testid="constructor-empty-ingredients"]'
      )
    ).toBeVisible();

    await orderModal.locator('[data-testid="modal-close"]').click();
    await expect(orderModal).not.toBeVisible();
  });
});
