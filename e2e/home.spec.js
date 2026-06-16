import { test, expect } from '@playwright/test'

test.describe('ホームページ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('ページタイトルが表示される', async ({ page }) => {
    await expect(page).toHaveTitle(/ikaruga\.org/)
  })

  test('NavBar に「About me」リンクが表示される', async ({ page }) => {
    const navLink = page.locator('.navbar-item[href="/me"]')
    await expect(navLink).toBeVisible()
    await expect(navLink).toHaveText('About me')
  })

  test('記事リストが1件以上表示される', async ({ page }) => {
    const listItems = page.locator('.list .list-item')
    await expect(listItems).toHaveCount(6)
  })

  test('各記事にタイトルリンクと日付が表示される', async ({ page }) => {
    const firstItem = page.locator('.list .list-item').first()
    await expect(firstItem.locator('.item-title')).toBeVisible()
    await expect(firstItem.locator('time.item-date')).toBeVisible()
  })

  test('TimeAgo が <time> 要素を datetime 属性付きで描画する', async ({ page }) => {
    const timeEl = page.locator('.list .list-item time').first()
    await expect(timeEl).toHaveAttribute('datetime', /.+/)
    await expect(timeEl).toHaveAttribute('pubdate', 'pubdate')
    // テキストが空でないこと
    const text = await timeEl.textContent()
    expect(text?.trim()).toBeTruthy()
  })

  test('ページネーションリンクが表示される（記事数が 6 件超のため）', async ({ page }) => {
    const nextLink = page.locator('.pagination a[href="/page/2/"]')
    await expect(nextLink).toBeVisible()
    await expect(nextLink).toHaveText('next')
  })

  test('フッターに現在年と著者名が表示される', async ({ page }) => {
    const footer = page.locator('footer.footer')
    await expect(footer).toContainText(String(new Date().getFullYear()))
    await expect(footer).toContainText('ikaruga')
  })

  test('フッターに VitePress へのリンクが含まれる', async ({ page }) => {
    const vitepressLink = page.locator('footer a[href="https://vitepress.dev/"]')
    await expect(vitepressLink).toBeVisible()
  })
})
