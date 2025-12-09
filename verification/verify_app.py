
from playwright.sync_api import sync_playwright

def verify_app():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            # Wait for server to start - Changed to 3000 as per server.log
            page.goto("http://localhost:3000", timeout=30000)

            # Check for client configuration elements
            # 1. Check for Parlor Name (from default config)
            page.wait_for_selector("text=TattooCrate Studio", timeout=10000)

            # 2. Check for Powered By Footer
            page.wait_for_selector("text=Powered by", timeout=10000)

            # 3. Take screenshot
            page.screenshot(path="verification/app_screenshot.png")
            print("Screenshot taken successfully")

        except Exception as e:
            print(f"Error: {e}")
            # Take screenshot even on error if possible
            try:
                page.screenshot(path="verification/error_screenshot.png")
            except:
                pass
        finally:
            browser.close()

if __name__ == "__main__":
    verify_app()
