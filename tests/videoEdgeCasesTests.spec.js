import { test, expect } from '@playwright/test';
import { verifyRequest, verifyResponse } from './utils/verifyEvent';
import { videoPlay, videoPause, videoSeek, videoScroll } from './utils/videoUtils';

test.describe('MyPlayer Web Client Edge Cases Tests', () => {
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

    test('Reject invalid event type', async ({ request }) => {
        const response = await request.post( '/api/event', {
            data: {
                userId: 'user-123',
                type: 'playyy', // Invalid type
                videoTime: 5,
                timestamp: new Date().toISOString()
            }
        });
        await verifyResponse(response,400,false);
    });

    test('Reject missing userId', async ({ request }) => {
        const response = await request.post('/api/event', {
            data: {
                // userId is intentionally missing
                type: 'pause', // Invalid type
                videoTime: 2.5,
                timestamp: new Date().toISOString()
            }
        });
        await verifyResponse(response,400,false);
    });

});
