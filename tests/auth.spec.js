
import { test, expect } from "@playwright/test";

const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/labels",
  "/archive",
  "/trash",
  "/reminders",
  "/csv"
];

test.describe("UC10 - Authentication Security", () => {
  for (const route of protectedRoutes) {
    test(`Guest cannot access ${route}`, async ({ page }) => {
      // Each Playwright test starts with fresh browser storage.
      await page.goto(route);

      await expect(page).toHaveURL(/\/login$/);

      await expect(
        page.locator('input[type="password"]')
      ).toBeVisible();
    });
  }

  test("Backend rejects requests without JWT", async ({
    request
  }) => {
    const response = await request.get(
      "/api/users/auth-check"
    );

    expect([401, 403]).toContain(response.status());
  });

  test("Logout page cannot be accessed through a protected URL",
    async ({ page }) => {
      await page.goto("/dashboard");

      await expect(page).toHaveURL(/\/login$/);

      await page.goto("/reminders");

      await expect(page).toHaveURL(/\/login$/);
    }
  );
});
