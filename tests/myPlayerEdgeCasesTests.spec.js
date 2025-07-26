import { test, expect } from '@playwright/test';
import { verifyRequest, verifyResponse } from './utils/verifyEvent';
import { videoPlay, videoSeek, videoScroll } from './utils/videoUtils';

test.describe('MyPlayer Web Client - Edge Cases Tests', () => {
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

    test('TC_EDGE_01 - Seek video to its end and verify `seek` event is with max videoTime', async ({ page }) => {
        const [seekEvent] = await Promise.all([
            page.waitForRequest(req =>
                req.url().includes('/api/event') &&
                req.method() === 'POST' &&
                req.postData()?.includes('"type":"seeked"')
            ),
            await videoPlay(page, videoSelector),
            await videoSeek(page, videoSelector, 'max') //trigger seek
        ]);
        const videoDuration = await page.$eval(videoSelector, video => video.duration);
        await verifyRequest(seekEvent, 'seeked', videoDuration, 'user-123');
    });

    test('TC_EDGE_02 - Seek video to a negative time and verify `seek` event is with 0 videoTime', async ({ page }) => {
        const [seekEvent] = await Promise.all([
            page.waitForRequest(req =>
                req.url().includes('/api/event') &&
                req.method() === 'POST' &&
                req.postData()?.includes('"type":"seeked"')
            ),
            await videoPlay(page, videoSelector),
            await videoSeek(page, videoSelector, -99) //trigger seek
        ]);
        await verifyRequest(seekEvent, 'seeked', 0, 'user-123');
    });

    test('TC_EDGE_03 - Scroll the page without playing the video and verify `scroll` event', async ({ page }) => {
        const [scrollEvent] = await Promise.all([
            page.waitForRequest(req =>
                req.url().includes('/api/event') &&
                req.method() === 'POST' &&
                req.postData()?.includes('"type":"scroll"')
            ),
            await videoScroll(page) //trigger scroll
        ]);
        await verifyRequest(scrollEvent, 'scroll', 0, 'user-123');
    });

    test('TC_EDGE_04 - Scroll the page after the video has finished to play and verify `scroll` event is with max videoTime', async ({ page }) => {
        const [seekEvent] = await Promise.all([
            page.waitForRequest(req =>
                req.url().includes('/api/event') &&
                req.method() === 'POST' &&
                req.postData()?.includes('"type":"scroll"')
            ),
            await videoPlay(page, videoSelector),
            await videoSeek(page, videoSelector, 'max'),
            await videoScroll(page) //trigger scroll
        ]);
        const videoDuration = await page.$eval(videoSelector, video => video.duration);
        await verifyRequest(seekEvent, 'scroll', videoDuration, 'user-123');
    });

    test('TC_EDGE_05 - Verify error 400 for missing userId', async ({ request }) => {
        const response = await request.post('/api/event', {
            data: {
                // userId is intentionally missing
                type: 'pause',
                videoTime: 2.5,
                timestamp: new Date().toISOString()
            }
        });
        await verifyResponse(response,400,false);
    });

    test('TC_EDGE_06 - Verify error 400 for empty userId', async ({ request }) => {
        const response = await request.post('/api/event', {
            data: {
                userId: '',
                type: 'pause',
                videoTime: 2.5,
                timestamp: new Date().toISOString()
            }
        });
        await verifyResponse(response,400,false);
    });

    test('TC_EDGE_07 - Verify error 400 for empty event type', async ({ request }) => {
        const response = await request.post('/api/event', {
            data: {
                userId: 'user-123',
                type: '', //Empty type
                videoTime: 2.5,
                timestamp: new Date().toISOString()
            }
        });
        await verifyResponse(response,400,false);
    });

    test('TC_EDGE_08 - Verify error 400 for invalid event type', async ({ request }) => {
        const response = await request.post( '/api/event', {
            data: {
                userId: 'user-123',
                type: 'playyy', //Invalid type
                videoTime: 5,
                timestamp: new Date().toISOString()
            }
        });
        await verifyResponse(response,400,false);
    });

    test('TC_EDGE_09 - Verify error 400 for invalid videoTime', async ({ request }) => {
        const response = await request.post( '/api/event', {
            data: {
                userId: 'user-123',
                type: 'play',
                videoTime: 'abc', //invalid videoTime
                timestamp: new Date().toISOString()
            }
        });
        await verifyResponse(response,400,false);
    });

});
