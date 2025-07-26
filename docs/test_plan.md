## Test Plan – MyPlayer Web Client

### Objective
To verify the functionality, reliability, and backend integration of the MyPlayer video client, focusing on video controls and event tracking via automation and manual testing.

---

### Functional Test Cases

| Test Case ID | Description | Type | Expected Result |
|--------------|-------------|------|-----------------|
| TC_UI_01 | Play video | Automated | Video starts playing, `play` event is sent |
| TC_UI_02 | Pause video | Automated | Video pauses, `pause` event is sent |
| TC_UI_03 | Seek to 3 seconds | Automated | Video jumps to 3s, `seeked` event is sent |
| TC_UI_04 | Seek to 4.123 seconds | Automated | Video jumps to 4.123s, `seeked` event is sent |
| TC_UI_05 | Scroll page | Automated | User scrolls down, `scroll` event is sent |
| TC_UI_06 | Video can replay after ending | Automated | Video plays again, a new `play` event is sent |
| TC_UI_07 | Double-click play rapidly | Automated | only one `play` event is sent |
| TC_UI_08 | Double-click pause rapidly | Automated | only one `pause` event is sent |
| TC_UI_09 | Seek video after pause | Automated | `seeked` event is sent |
| TC_UI_10 | Pause event is sent at movie end | Automated | `pause` event is sent |
| TC_UI_11 | Video loads without buffering | Manual | Video plays instantly on fast connection |
| TC_UI_12 | Check Player's Other Controlls | Manual | Sound on/off, Full screen, Download, Speed, PiP all works fine |
| TC_UI_13 | Verify player works on resized window | Manual | Resize browser window and verify that player still works fine |
| TC_UI_14 | Check video controls hidden when disabled | Manual | Controls are hidden if `show all controls` is unchecked  |
| TC_UI_15 | Check right-click options on video | Manual | Validate that all right-click options work fine  |
| TC_UI_16 | Network Throttling Test | Manual | Video buffers or stalls appropriately under slow connection   |
| TC_UI_17 | Concurrent Video Sessions  | Manual | Two tabs/players send separate events correctly    |
| TC_UI_18 | Reload page while video is playing  | Manual | Video restarts from beginning    |

---

### Edge Test Cases

| Test Case ID | Description | Type | Expected Result |
|--------------|-------------|------|-----------------|
| TC_EDGE_01 | Seek to video end | Automated | `seeked` event is sent with max videoTime |
| TC_EDGE_02 | Seek video to negative time | Automated | `seeked` event is sent with 0 videoTime |
| TC_EDGE_03 | Scroll without playing video | Automated | `scroll` event sent with videoTime 0 |
| TC_EDGE_04 | Scroll after video has finished to play | Automated | `scroll` event sent with max videoTime |
| TC_EDGE_05 | Missing `userId` in request | Automated | Backend responds with 4xx error |
| TC_EDGE_06 | Empty `userId` in request | Automated | Backend responds with 4xx error |
| TC_EDGE_07 | Empty event type sent | Automated | Backend responds with 4xx error |
| TC_EDGE_08 | Invalid event type sent (e.g., `playyy`) | Automated | Backend rejects request |
| TC_EDGE_09 | Invalid videoTime sent (e.g., `abc`) | Automated | Backend rejects request |
| TC_EDGE_10 | Malformed backend response (simulate error 500) | Manual | No crash; error handled gracefully |

---

### Tools & Justification

| Tool | Purpose | Why |
|------|---------|-----|
| **Playwright** | UI Automation | Fast, reliable, built-in network mocking, and reporting |
| **Playwright Test API** | API Testing | Allows sending custom HTTP POST requests |
| **Docker Compose** | App startup | Consistent environment |
| **GitHub Actions** | CI | Easy setup, integrated with GitHub |
| **Playwright HTML Report / Allure** | Reporting | Rich UI, screenshot/log support |

---

### Manual vs Automated Testing

| Test Area | Method |
|-----------|--------|
| Basic video controls | Automated |
| Event tracking POST validation | Automated |
| Edge cases (e.g., scroll, seek to end) | Automated |
| Backend error handling | Partially Manual |
| Visual inspection of buffering/play etc.| Manual |
| Developer console check | Automated |

---

### Test Artifacts

- Automation code: `/tests/`
- Reports: `/playwright-report/`
- Screenshots (failures): `/playwright-report/data/`

