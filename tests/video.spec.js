import { test, expect } from '@playwright/test';
import { verifyEvent } from './utils/verifyEvent';
import { videoPlay, videoPause, videoSeek, videoScroll } from './utils/videoUtils';

test.describe('MyPlayer Web Client Tests', () => {
    let consoleErrors = [];
    const videoSelector = 'video';

    test.beforeEach(async ({ page }) => {
        consoleErrors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });
        await page.goto('/');
        await page.waitForSelector(videoSelector);
        const isReady = await page.$eval(videoSelector, video => video.readyState >= 3);
        expect(isReady).toBe(true);
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
            await videoPlay(page, videoSelector) //trigger play
        ]);
        await verifyEvent(playEvent, 'play', 0, 'user-123');
    });

    test('Pause video and verify event', async ({ page }) => {
        await videoPlay(page, videoSelector);
        const [pauseEvent] = await Promise.all([
            page.waitForRequest(req =>
                req.url().includes('/api/event') &&
                req.method() === 'POST' &&
                req.postData()?.includes('"type":"pause"')
            ),
            await videoPause(page, videoSelector) //trigger pause
        ]);
        await verifyEvent(pauseEvent, 'pause', 0, 'user-123');
    });

    test('Seek video and verify event', async ({ page }) => {
        await videoPlay(page, videoSelector);
        const [seekEvent] = await Promise.all([
            page.waitForRequest(req =>
                req.url().includes('/api/event') &&
                req.method() === 'POST' &&
                req.postData()?.includes('"type":"seeked"')
            ),
            await videoSeek(page, videoSelector) //trigger seek
        ]);
        await verifyEvent(seekEvent, 'seeked', 5, 'user-123');
    });

    test('Scroll the page and verify event', async ({ page }) => {
        await videoPlay(page, videoSelector);
        const [scrollEvent] = await Promise.all([
            page.waitForRequest(req =>
                req.url().includes('/api/event') &&
                req.method() === 'POST' &&
                req.postData()?.includes('"type":"scroll"')
            ),
            await videoScroll(page) //trigger scroll
        ]);
        await verifyEvent(scrollEvent, 'scroll', 0, 'user-123');
    });

    test('Reject invalid event type', async ({ request }) => {
        const response = await request.post('http://localhost:3000/api/event', {
            data: {
                userId: 'user-123',
                type: 'playyy', // Invalid type
                videoTime: 5,
                timestamp: new Date().toISOString()
            }
        });

        // Expect it to return 400 or similar error
        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body.ok).not.toBe(true);
        console.log('response:', body);
    });

    test('Reject missing userId', async ({ request }) => {
        const response = await request.post('http://localhost:3000/api/event', {
            data: {
                // userId is intentionally missing
                type: 'pause', // Invalid type
                videoTime: 2.5,
                timestamp: new Date().toISOString()
            }
        });

        // Expect it to return 400 or similar error
        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body.ok).not.toBe(true);
        console.log('response:', body);
    });


});
