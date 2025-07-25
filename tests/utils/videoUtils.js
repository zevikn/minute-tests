
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

export async function videoSeek(page, videoSelector) {
    await page.evaluate((selector) => {
        const video = document.getElementById(selector);
        video.currentTime = 5;
    }, videoSelector);
}

export async function videoScroll(page) {
    await page.evaluate(()=> window.scrollTo(0, document.body.scrollHeight))
}
