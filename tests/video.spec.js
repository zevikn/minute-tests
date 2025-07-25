import { test, expect } from '@playwright/test';

test.describe('MyPlayer Video Controls', () => {
    const baseURL = 'http://localhost:3000';

    test.beforeEach(async ({ page }) => {
        await page.goto(baseURL);
        await page.waitForSelector('video');

        // await page.evaluate(() => {
        //     const video = document.getElementById('video');
        //     video.muted = true;
        //     video.play();
        // });
        // await page.waitForTimeout(500);

        // const readyState = await page.evaluate(() => {
        //     return document.getElementById('video').readyState;
        // });
        //console.log('Video readyState:', readyState); // Should be >= 3 for playback

        // const error = await page.evaluate(() => {
        //     const err = document.getElementById('video').error;
        //     return err ? err.message || err.code : null;
        // });
        // console.log('Video error:', error);

        //page.on('console', msg => console.log(msg.text()));

        // page.on('request', req => {
        //     if (req.url().includes('/api/event')) {
        //         console.log('📤 *** Zeev Request:', req.method(), req.postData());
        //     }
        // });

        // page.on('response', async resp => {
        //     if (resp.url().includes('/api/event')) {
        //         const body = await resp.json();
        //         console.log('📥 *** Zeev Response:', body);
        //     }
        // });
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
