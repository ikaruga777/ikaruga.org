import { test, expect } from '@playwright/test'

test.describe('キーボードナビゲーション', () => {
  test('ArrowRight キーでページ 2 に遷移する', async ({ page }) => {
    await page.goto('/')
    // 次のページが存在することを確認
    await expect(page.locator('.pagination a[href="/page/2/"]')).toBeVisible()

    await page.keyboard.press('ArrowRight')

    await expect(page).toHaveURL('/page/2/')
    await expect(page.locator('.list .list-item')).toHaveCount(6)
  })

  test('ページ 2 で ArrowLeft キーを押すとトップページに戻る', async ({ page }) => {
    await page.goto('/page/2/')

    await page.keyboard.press('ArrowLeft')

    await expect(page).toHaveURL('/')
  })

  test('ページ 1 で ArrowLeft キーを押しても遷移しない', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('ArrowLeft')

    await expect(page).toHaveURL('/')
  })

  test('最終ページで ArrowRight キーを押しても遷移しない', async ({ page }) => {
    // 最後のページ: next リンクが存在しないことを先に確認する
    await page.goto('/page/33/')
    await expect(page.locator('.pagination a', { hasText: 'next' })).not.toBeVisible()
    const currentUrl = page.url()

    await page.keyboard.press('ArrowRight')

    await expect(page).toHaveURL(currentUrl)
  })
})

test.describe('ページネーションリンク', () => {
  test('next リンクをクリックするとページ 2 に遷移する', async ({ page }) => {
    await page.goto('/')
    await page.locator('.pagination a', { hasText: 'next' }).click()

    await expect(page).toHaveURL('/page/2/')
  })

  test('ページ 2 の prev リンクをクリックするとトップに戻る', async ({ page }) => {
    await page.goto('/page/2/')
    await page.locator('.pagination a', { hasText: 'prev' }).click()

    await expect(page).toHaveURL('/')
  })

  test('ページ 2 に next と prev の両方が表示される', async ({ page }) => {
    await page.goto('/page/2/')

    await expect(page.locator('.pagination a', { hasText: 'prev' })).toBeVisible()
    await expect(page.locator('.pagination a', { hasText: 'next' })).toBeVisible()
  })
})

test.describe('404 ページ', () => {
  test('存在しないページでは 404 が表示される', async ({ page }) => {
    await page.goto('/this-page-does-not-exist', { waitUntil: 'networkidle' })

    await expect(page.locator('.layout-404 h1')).toHaveText('404')
    await expect(page.locator('.layout-404 p')).toHaveText('Seems nothing here.')
  })

  test('404 ページの「Back to home」リンクでトップに戻れる', async ({ page }) => {
    await page.goto('/this-page-does-not-exist', { waitUntil: 'networkidle' })

    await page.locator('.layout-404 a[href="/"]').click()

    await expect(page).toHaveURL('/')
    await expect(page.locator('.list')).toBeVisible()
  })
})
