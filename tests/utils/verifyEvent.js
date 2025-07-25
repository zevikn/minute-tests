import { expect } from '@playwright/test';

export async function verifyRequest(request, type, videoTime, userId) {
    let requestPostData;
    try {
        requestPostData = JSON.parse(request.postData());
    } catch (err) {
        throw new Error('Failed to parse request POST data: ' + err.message);
    }
    expect(requestPostData.type).toBe(type);
    expect(requestPostData.videoTime).toBeGreaterThanOrEqual(videoTime);
    expect(requestPostData.userId).toBe(userId);
    expect(requestPostData.timestamp).toBeDefined();
    //console.log('📤 requestPostData:', requestPostData); //use for debug only
}

export async function verifyResponse(response, statusCode, okStatus) {
    const responseBody = await response.json();
    expect(response.status()).toBe(statusCode);
    expect(responseBody.ok).toBe(okStatus);
    //console.log('responseBody:', responseBody); //use for debug only
}
