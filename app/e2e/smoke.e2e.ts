import { expect, test, type Page } from '@playwright/test';

// Phase 7 Stage 4 smoke test. Deliberately small: it proves the built app's
// routes, navigation links and stylesheet work end to end — Explore →
// Exercise Detail → Decide → Build → Exercise Detail — and that a Decide
// decision survives a reload and back/forward. It never depends on YouTube
// or any other network service (off-origin requests are blocked), on copy
// that's likely to change, or on which exercise the engine recommends.

function guard(page: Page) {
  const problems: string[] = [];
  page.on('pageerror', (error) => problems.push(`page error: ${error.message}`));
  page.on('response', (response) => {
    if (response.status() >= 400) problems.push(`${response.status()} ${response.url()}`);
  });
  page.on('requestfailed', (request) => {
    if (new URL(request.url()).hostname === 'localhost') problems.push(`failed ${request.url()}`);
  });
  return problems;
}

test.beforeEach(async ({ page }) => {
  await page.route(
    (url) => url.hostname !== 'localhost',
    (route) => route.abort()
  );
});

const primaryNav = (page: Page) => page.locator('header').getByRole('navigation', { name: 'Primary' });

async function expectStyled(page: Page) {
  // An unstyled page would leave the header as a plain block box.
  await expect(page.locator('header.app-header')).toHaveCSS('display', 'flex');
}

async function expectExerciseDetail(page: Page, name?: string) {
  await expect(page).toHaveURL(/\/exercises\/[a-z0-9-]+$/);
  const heading = page.getByRole('heading', { level: 1 });
  await expect(heading).toBeVisible();
  if (name) await expect(heading).toHaveText(name);
  await expect(page.locator('.exercise-detail')).toBeVisible();
  await expectStyled(page);
}

test('Explore → Exercise Detail → Decide → Build → Exercise Detail', async ({ page }) => {
  const problems = guard(page);
  await page.goto('./');
  await expectStyled(page);

  // Explore
  await primaryNav(page).getByRole('link', { name: 'Explore' }).click();
  await expect(page).toHaveURL(/\/exercises$/);
  const firstCard = page.locator('a.exercise-card-link').first();
  await expect(firstCard).toBeVisible();
  const exploreName = (await firstCard.locator('h3').textContent())!.trim();

  // Exercise Detail
  await firstCard.click();
  await expectExerciseDetail(page, exploreName);

  // Decide
  await primaryNav(page).getByRole('link', { name: 'Decide' }).click();
  await expect(page).toHaveURL(/\/decide$/);
  await page.getByRole('radio', { name: /direct \/ advanced/i }).check();
  await page.getByLabel(/region or physique target/i).selectOption('region:chest');
  await page.getByLabel(/what are you trying to accomplish/i).selectOption('build-base');
  await page.getByRole('button', { name: /get recommendation/i }).click();
  await expect(page).toHaveURL(/\/decide\?region=chest&goal=build-base$/);
  await expect(page.locator('.decision-result-best .decision-result-name')).toBeVisible();

  // Build
  await primaryNav(page).getByRole('link', { name: 'Build' }).click();
  await expect(page).toHaveURL(/\/build$/);
  await page.locator('a.muscle-group-card').first().click();
  await expect(page).toHaveURL(/\/build\/[a-z0-9-]+/);
  const packageExercise = page.locator('a.package-exercise-name').first();
  await expect(packageExercise).toBeVisible();
  const packageName = (await packageExercise.textContent())!.trim();

  // Exercise Detail, reached from a package
  await packageExercise.click();
  await expectExerciseDetail(page, packageName);

  expect(problems).toEqual([]);
});

test('a Decide URL restores the same state and recommendation across reload and back/forward', async ({ page }) => {
  const problems = guard(page);
  const goal = page.getByLabel(/what are you trying to accomplish/i);
  const bestFit = page.locator('.decision-result-best .decision-result-name');

  async function expectFirstState() {
    await expect(page.getByRole('radio', { name: /appearance/i })).toBeChecked();
    await expect(page.getByLabel(/body area/i)).toHaveValue('calves');
    await expect(page.getByLabel(/how do you want it to look/i)).toHaveValue('calf-width-shape');
    await expect(goal).toHaveValue('build-base');
    await expect(page.getByLabel(/fatigue tolerance/i)).toHaveValue('low');
  }

  // 1–2. Open Decide with a valid state; it appears without submitting.
  await page.goto('decide?outcome=calf-width-shape&goal=build-base&fatigue=low');
  await expectFirstState();
  await expect(bestFit).toBeVisible();
  const firstPick = await bestFit.textContent();

  // 3–4. Reload: same state, same recommendation.
  await page.reload();
  await expectFirstState();
  await expect(bestFit).toHaveText(firstPick!);

  // 5. A second decision, then back and forward.
  await goal.selectOption('low-fatigue');
  await page.getByRole('button', { name: /get recommendation/i }).click();
  await expect(page).toHaveURL(/goal=low-fatigue/);
  await expect(goal).toHaveValue('low-fatigue');
  const secondPick = await bestFit.textContent();

  await page.goBack();
  await expect(page).toHaveURL(/goal=build-base/);
  await expectFirstState();
  await expect(bestFit).toHaveText(firstPick!);

  await page.goForward();
  await expect(page).toHaveURL(/goal=low-fatigue/);
  await expect(goal).toHaveValue('low-fatigue');
  await expect(bestFit).toHaveText(secondPick!);

  expect(problems).toEqual([]);
});

test('a malformed Decide URL falls back to the empty form', async ({ page }) => {
  const problems = guard(page);
  await page.goto('decide?outcome=nope&goal=%25&region=nowhere&equipment=laser&setup=extreme');
  await expect(page.getByRole('button', { name: /get recommendation/i })).toBeVisible();
  await expect(page.getByLabel(/what are you trying to accomplish/i)).toHaveValue('');
  await expect(page.locator('.decision-result-best')).toHaveCount(0);
  expect(problems).toEqual([]);
});
