from playwright.sync_api import sync_playwright

def verify_frontend():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            # Navigate to the preview server
            page.goto("http://localhost:4173")

            # Wait for the page to load
            page.wait_for_selector('text=TattooCrate', timeout=10000)

            # Check for PlacementGrid elements
            # They should be visible and selectable
            placement_button = page.locator('button[aria-label="Select Arm / Sleeve placement"]')
            if placement_button.count() > 0:
                print("Placement grid loaded successfully")
                placement_button.click()
            else:
                print("Placement grid not found")

            # Check for StyleGrid elements
            style_button = page.locator('button[aria-label="Select American Traditional (Old School) style"]')
            if style_button.count() > 0:
                print("Style grid loaded successfully")
                style_button.click()
            else:
                print("Style grid not found")

            # Take a screenshot to verify UI integrity
            page.screenshot(path="verification/verification.png")
            print("Screenshot saved to verification/verification.png")

        except Exception as e:
            print(f"Verification failed: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_frontend()
