import { test, expect } from '@playwright/test'

// 基本サイズ16pxに 8/n を掛けた調和数列スケール（n = 3..10）
const BASE = 16
const HARMONIC_SCALE = [3, 4, 5, 6, 7, 8, 9, 10].map(n => (BASE * 8) / n)

const computed = (locator, prop) =>
  locator.evaluate((el, p) => parseFloat(getComputedStyle(el)[p]), prop)

const expectOnHarmonicScale = (fontSize) => {
  const hit = HARMONIC_SCALE.some(size => Math.abs(size - fontSize) < 0.05)
  expect(hit, `font-size ${fontSize}px は調和数列スケール上にない`).toBe(true)
}

const expectOn4pxGrid = (lineHeight) => {
  expect(lineHeight % 4, `line-height ${lineHeight}px は4pxグリッド上にない`).toBeCloseTo(0, 1)
}

// 最新記事（見出しh2を含む）へ一覧から遷移する
const gotoLatestPost = async (page) => {
  await page.goto('/')
  await page.locator('.list .item-title').first().click()
  await page.waitForURL(/\/\d{4}\/\d{2}\/\d{2}\//)
}

test.describe('タイポグラフィ', () => {
  test('本文は16pxで、行送りは4pxの整数倍である', async ({ page }) => {
    await page.goto('/')
    const body = page.locator('body')
    expect(await computed(body, 'fontSize')).toBe(16)
    expectOn4pxGrid(await computed(body, 'lineHeight'))
  })

  test('本文の行長は全角40字分である', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await gotoLatestPost(page)
    expect(await computed(page.locator('.post-view p').first(), 'width')).toBe(BASE * 40)
  })

  test('記事一覧のタイトルと日付は調和数列スケールと4pxグリッドに乗っている', async ({ page }) => {
    await page.goto('/')
    for (const selector of ['.item-title', '.item-date']) {
      const el = page.locator(selector).first()
      expectOnHarmonicScale(await computed(el, 'fontSize'))
      expectOn4pxGrid(await computed(el, 'lineHeight'))
    }
  })

  test('記事ページの見出し・本文・メタ情報は調和数列スケールと4pxグリッドに乗っている', async ({ page }) => {
    await gotoLatestPost(page)
    await expect(page.locator('.post-view h2').first()).toBeVisible()
    for (const selector of ['.post-title', '.post-date', '.post-view h2', '.post-view p', '.post-nav-label']) {
      const el = page.locator(selector).first()
      expectOnHarmonicScale(await computed(el, 'fontSize'))
      expectOn4pxGrid(await computed(el, 'lineHeight'))
    }
  })

  test('段落と見出しの余白は本文の行送りの整数倍である', async ({ page }) => {
    await gotoLatestPost(page)
    const lineHeight = await computed(page.locator('body'), 'lineHeight')
    const p = page.locator('.post-view p').first()
    const h2 = page.locator('.post-view h2').first()
    for (const [el, prop] of [[p, 'marginTop'], [p, 'marginBottom'], [h2, 'marginTop'], [h2, 'marginBottom']]) {
      const value = await computed(el, prop)
      expect(value % lineHeight, `${prop} ${value}px は行送り${lineHeight}pxの整数倍ではない`).toBeCloseTo(0, 1)
    }
  })
})
