import { test, expect } from '@playwright/test'

test.describe('記事ページ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('記事リンクをクリックすると記事ページに遷移する', async ({ page }) => {
    const firstPostLink = page.locator('.list .item-title').first()
    const postTitle = await firstPostLink.textContent()
    await firstPostLink.click()

    await expect(page.locator('.post-view')).toBeVisible()
    await expect(page.locator('.post-title')).toContainText(postTitle?.trim() ?? '')
  })

  test('記事ページに <h1> タイトルが表示される', async ({ page }) => {
    await page.locator('.list .item-title').first().click()

    const h1 = page.locator('.post-title')
    await expect(h1).toBeVisible()
    const text = await h1.textContent()
    expect(text?.trim()).toBeTruthy()
  })

  test('記事ページに TimeAgo コンポーネントが datetime 属性付きで表示される', async ({ page }) => {
    await page.locator('.list .item-title').first().click()

    const timeEl = page.locator('time.post-date')
    await expect(timeEl).toBeVisible()
    await expect(timeEl).toHaveAttribute('datetime', /.+/)
    await expect(timeEl).toHaveAttribute('pubdate', 'pubdate')
  })

  test('記事ページにコンテンツエリアが表示される', async ({ page }) => {
    await page.locator('.list .item-title').first().click()

    // VitePress の <Content /> が描画するエリア
    await expect(page.locator('.post-view')).toBeVisible()
  })
})
