import { test, expect } from '@playwright/test'

test.describe('記事の前後ナビゲーション', () => {
  test.beforeEach(async ({ page }) => {
    // 一覧の先頭（最新）記事に移動
    await page.goto('/')
    await page.locator('.list .item-title').first().click()
    await page.waitForURL(/\/\d{4}\/\d{2}\/\d{2}\//)
  })

  test('次の記事リンクが表示される（最新記事には前の記事が存在する）', async ({ page }) => {
    const nextNav = page.locator('.post-nav-next')
    await expect(nextNav).toBeVisible()
    await expect(nextNav.locator('.post-nav-label')).toHaveText('次の記事')
    await expect(nextNav.locator('.post-nav-title')).not.toBeEmpty()
  })

  test('最新記事には「前の記事」リンクが表示されない', async ({ page }) => {
    await expect(page.locator('.post-nav-prev')).not.toBeVisible()
  })

  test('次の記事リンクをクリックすると別の記事に遷移する', async ({ page }) => {
    const nextTitle = await page.locator('.post-nav-next .post-nav-title').textContent()
    await page.locator('.post-nav-next').click()

    await expect(page.locator('.post-title')).toContainText(nextTitle?.trim() ?? '')
    // 遷移先でも post-view が描画されること
    await expect(page.locator('.post-view')).toBeVisible()
  })

  test('次の記事に移動すると「前の記事」リンクで戻れる', async ({ page }) => {
    const originalTitle = await page.locator('.post-title').textContent()
    await page.locator('.post-nav-next').click()

    const prevNav = page.locator('.post-nav-prev')
    await expect(prevNav).toBeVisible()
    await expect(prevNav.locator('.post-nav-label')).toHaveText('前の記事')

    await prevNav.click()
    await expect(page.locator('.post-title')).toContainText(originalTitle?.trim() ?? '')
  })
})

test.describe('記事ナビゲーションの端ケース', () => {
  test('一覧 2 ページ目の記事にはナビゲーションが両方表示される', async ({ page }) => {
    // 2ページ目の記事（最古でも最新でもない）
    await page.goto('/page/2/')
    await page.locator('.list .item-title').first().click()

    await expect(page.locator('.post-nav-prev')).toBeVisible()
    await expect(page.locator('.post-nav-next')).toBeVisible()
  })
})
