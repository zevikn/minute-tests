import { test, expect } from '@playwright/test';
import { verifyRequest, verifyResponse } from './utils/verifyEvent';
import { videoPlay, videoPause, videoSeek, videoScroll } from './utils/videoUtils';

test.describe('MyPlayer Web Client - Functional Tests', () => {
    const videoSelector = 'video';
    let consoleErrors = [];

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

    test('TC_UI_01 - Play video and verify `play` event', async ({ page }) => {
        const [playEvent] = await Promise.all([
            page.waitForRequest(req =>
                req.url().includes('/api/event') &&
                req.method() === 'POST' &&
                req.postData()?.includes('"type":"play"')
            ),
            await videoPlay(page, videoSelector) //trigger play
        ]);
        await verifyRequest(playEvent, 'play', 0, 'user-123');
    });

    // test('TC_UI_02 - Pause video and verify `pause` event', async ({ page }) => {
    //     await videoPlay(page, videoSelector);
    //     const [pauseEvent] = await Promise.all([
    //         page.waitForRequest(req =>
    //             req.url().includes('/api/event') &&
    //             req.method() === 'POST' &&
    //             req.postData()?.includes('"type":"pause"')
    //         ),
    //         await videoPause(page, videoSelector) //trigger pause
    //     ]);
    //     await verifyRequest(pauseEvent, 'pause', 0, 'user-123');
    // });

    // test('TC_UI_03 - Seek video to 5s and verify `seek` event', async ({ page }) => {
    //     await videoPlay(page, videoSelector);
    //     const [seekEvent] = await Promise.all([
    //         page.waitForRequest(req =>
    //             req.url().includes('/api/event') &&
    //             req.method() === 'POST' &&
    //             req.postData()?.includes('"type":"seeked"')
    //         ),
    //         await videoSeek(page, videoSelector, 5) //trigger seek
    //     ]);
    //     await verifyRequest(seekEvent, 'seeked', 5, 'user-123');
    // });

    // test('TC_UI_04 - Seek video to 7.123s and verify `seek` event', async ({ page }) => {
    //     await videoPlay(page, videoSelector);
    //     const [seekEvent] = await Promise.all([
    //         page.waitForRequest(req =>
    //             req.url().includes('/api/event') &&
    //             req.method() === 'POST' &&
    //             req.postData()?.includes('"type":"seeked"')
    //         ),
    //         await videoSeek(page, videoSelector, 7.123) //trigger seek
    //     ]);
    //     await verifyRequest(seekEvent, 'seeked', 7.123, 'user-123');
    // });

    // test('TC_UI_05 - Scroll the page and verify `scroll` event', async ({ page }) => {
    //     await videoPlay(page, videoSelector);
    //     const [scrollEvent] = await Promise.all([
    //         page.waitForRequest(req =>
    //             req.url().includes('/api/event') &&
    //             req.method() === 'POST' &&
    //             req.postData()?.includes('"type":"scroll"')
    //         ),
    //         await videoScroll(page) //trigger scroll
    //     ]);
    //     await verifyRequest(scrollEvent, 'scroll', 0, 'user-123');
    // });

});
