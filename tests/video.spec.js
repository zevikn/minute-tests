import { test, expect } from '@playwright/test';

test.describe('MyPlayer Web Client Tests', () => {
    const baseURL = 'http://localhost:3000';
    let consoleErrors = [];

    test.beforeEach(async ({ page }) => {
        consoleErrors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });
        await page.goto(baseURL);
        await page.waitForSelector('video');
    });

    test.afterEach(async ({ page }) => {
        expect(consoleErrors, 'Console errors found').toEqual([]);
    });

    test('Play video and verify event', async ({ page }) => {
        const [playEvent] = await Promise.all([
            page.waitForRequest(req =>
                req.url().includes('/api/event') &&
                req.method() === 'POST' &&
                req.postData()?.includes('"type":"play"')
            ),
            await page.evaluate(() => {
                const video = document.getElementById('video');
                video.play();
            }),
            await page.waitForTimeout(500)
        ]);

        const event = JSON.parse(playEvent.postData());
        console.log('📤 event:', event);
        expect(event.type).toBe('play');
        expect(event.videoTime).toBeGreaterThanOrEqual(0);
        expect(event.userId).toBe('user-123');
        expect(event.timestamp).toBeDefined();
    });

    test('Pause video and verify event', async ({ page }) => {
        await page.evaluate(() => {
            const video = document.getElementById('video');
            video.play();
        });
        await page.waitForTimeout(500);
        const [pauseEvent] = await Promise.all([
            page.waitForRequest(req =>
                req.url().includes('/api/event') &&
                req.method() === 'POST' &&
                req.postData()?.includes('"type":"pause"')
            ),
            await page.evaluate(() => {
                const video = document.getElementById('video');
                video.pause();
            })
        ]);

        const event = JSON.parse(pauseEvent.postData());
        console.log('📤 event:', event);
        expect(event.type).toBe('pause');
        expect(event.videoTime).toBeGreaterThanOrEqual(0);
        expect(event.userId).toBe('user-123');
        expect(event.timestamp).toBeDefined();
    });

    test('Seek video and verify event', async ({ page }) => {
        await page.evaluate(() => {
            const video = document.getElementById('video');
            video.play();
        });
        await page.waitForTimeout(500);
        const [seekEvent] = await Promise.all([
            page.waitForRequest(req =>
                req.url().includes('/api/event') &&
                req.method() === 'POST' &&
                req.postData()?.includes('"type":"seeked"')
            ),
            await page.evaluate(() => {
                const video = document.getElementById('video');
                video.currentTime = 5;
            })
        ]);

        const event = JSON.parse(seekEvent.postData());
        console.log('📤 event:', event);
        expect(event.type).toBe('seeked');
        expect(event.videoTime).toBeCloseTo(5);
        expect(event.userId).toBe('user-123');
        expect(event.timestamp).toBeDefined();
    });

    test('Scroll the page and verify event', async ({ page }) => {
        await page.evaluate(() => {
            const video = document.getElementById('video');
            video.play();
        });
        await page.waitForTimeout(500);
        const [scrollEvent] = await Promise.all([
            page.waitForRequest(req =>
                req.url().includes('/api/event') &&
                req.method() === 'POST' &&
                req.postData()?.includes('"type":"scroll"')
            ),
            await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
        ]);

        const event = JSON.parse(scrollEvent.postData());
        console.log('📤 event:', event);
        expect(event.type).toBe('scroll');
        expect(event.videoTime).toBeGreaterThanOrEqual(0);
        expect(event.userId).toBe('user-123');
        expect(event.timestamp).toBeDefined();
    });
});
