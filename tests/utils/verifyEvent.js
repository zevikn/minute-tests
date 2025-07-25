import { expect } from '@playwright/test';

export async function verifyRequest(request, type, videoTime, userId) {
    let requestPostData;

    try {
        requestPostData = JSON.parse(request.postData());
    } catch (err) {
        throw new Error('Failed to parse request POST data: ' + err.message);
    }

    console.log('📤 requestPostData:', requestPostData);
    expect(requestPostData.type).toBe(type);
    expect(requestPostData.videoTime).toBeGreaterThanOrEqual(videoTime);
    expect(requestPostData.userId).toBe(userId);
    expect(requestPostData.timestamp).toBeDefined();
}

export async function verifyResponse(response, statusCode, okStatus) {
    const responseBody = await response.json();
    console.log('responseBody:', responseBody);
    expect(response.status()).toBe(statusCode);
    expect(responseBody.ok).toBe(okStatus);
}
