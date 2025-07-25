## Test Plan – MyPlayer Web Client

### Objective
To verify the functionality, reliability, and backend integration of the MyPlayer video client, focusing on video controls and event tracking via automation and manual testing.

---

### Functional Test Cases

| Test Case ID | Description | Type | Expected Result |
|--------------|-------------|------|-----------------|
| TC_UI_01 | Play video | Automated | Video starts playing, `play` event is sent |
| TC_UI_02 | Pause video | Automated | Video pauses, `pause` event is sent |
| TC_UI_03 | Seek to 5 seconds | Automated | Video jumps to 5s, `seeked` event is sent |
| TC_UI_04 | Seek to 10 seconds | Automated | Video jumps to 10s, `seeked` event is sent |
| TC_UI_05 | Scroll page | Automated | User scrolls down, `scroll` event is sent |
| TC_UI_06 | Video loads without buffering | Manual | Video plays instantly on fast connection |
| TC_UI_07 | Check Other Controlls | Manual | Sound on/off, Full screen, Download, Speed, PiP all works fine |

---

### Edge Test Cases

| Test Case ID | Description | Type | Expected Result |
|--------------|-------------|------|-----------------|
| TC_EDGE_01 | Seek to video end | Automated | `seeked` event is sent with max videoTime |
| TC_EDGE_02 | Double-click pause rapidly | Automated | Only one `pause` event is sent |
| TC_EDGE_03 | Scroll without playing video | Automated | `scroll` event sent with videoTime 0 |
| TC_EDGE_04 | Scroll after playing video | Automated | `scroll` event sent with max videoTime |
| TC_EDGE_05 | Malformed backend response (simulate error 500) | Manual | No crash; error handled gracefully |
| TC_EDGE_06 | Missing `userId` in request | Automated | Backend responds with 4xx error |
| TC_EDGE_07 | Invalid event type sent (e.g., `playyy`) | Automated | Backend rejects request |

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

