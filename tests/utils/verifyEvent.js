import { expect } from '@playwright/test';

export async function verifyEvent(event, type, videoTime, userId) {
    let eventPostData;

    try {
        eventPostData = JSON.parse(event.postData());
    } catch (err) {
        throw new Error('Failed to parse event POST data: ' + err.message);
    }

    console.log('📤 EventPostData:', eventPostData);
    expect(eventPostData.type).toBe(type);
    expect(eventPostData.videoTime).toBeGreaterThanOrEqual(videoTime);
    expect(eventPostData.userId).toBe(userId);
    expect(eventPostData.timestamp).toBeDefined();
}
