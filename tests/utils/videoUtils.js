
export async function videoPlay(page, videoSelector) {
    await page.evaluate((selector) => {
        const video = document.getElementById(selector);
        video.play();
    }, videoSelector);
    await page.waitForTimeout(500);
}

export async function videoPause(page, videoSelector) {
    await page.evaluate((selector) => {
        const video = document.getElementById(selector);
        video.pause();
    }, videoSelector);
}

export async function videoMute(page, videoSelector) {
    await page.evaluate((selector) => {
        const video = document.getElementById(selector);
        video.muted = true;
    }, videoSelector);
}

export async function videoSeek(page, videoSelector, seekTime) {
    await page.evaluate(({ selector, time }) => {
        const video = document.getElementById(selector);
        if (video) {
            video.currentTime = time;
        }
    }, { selector: videoSelector, time: seekTime });
}

export async function videoScroll(page) {
    await page.evaluate(()=> window.scrollTo(0, document.body.scrollHeight))
}
