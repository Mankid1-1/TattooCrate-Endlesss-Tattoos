from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("http://localhost:4173")

    # Wait for the app to load
    page.wait_for_selector("text=Tattoo Concept", state="visible")

    # Scroll to the Style Grid section
    try:
         style_label = page.get_by_text("04. Tattoo Style")
         style_label.scroll_into_view_if_needed()
    except:
         print("Could not scroll to Tattoo Style label")

    # TattooStyle.NEO_TRADITIONAL value is 'Neo-Traditional'
    # The button aria-label should be 'Select Neo-Traditional style'
    target_aria_label = "Select Neo-Traditional style"

    try:
        neo_trad_button = page.get_by_label(target_aria_label)

        # Wait a bit
        page.wait_for_timeout(2000)

        if neo_trad_button.is_visible():
            print("Neo Traditional button found")
            neo_trad_button.click()
            # Verify it is selected (aria-pressed=true)
            page.wait_for_timeout(500)
            if neo_trad_button.get_attribute("aria-pressed") == "true":
                 print("Neo Traditional button successfully selected")
            else:
                 print("Failed to select Neo Traditional button")
        else:
            print("Neo Traditional button NOT found via label")
            # Dump all buttons to debug
            print("Visible buttons:")
            for btn in page.get_by_role("button").all():
                 if btn.is_visible():
                      label = btn.get_attribute("aria-label") or btn.text_content()
                      print(f" - {label}")

    except Exception as e:
        print(f"Error interacting with button: {e}")

    # Take a screenshot of the form area
    page.screenshot(path="verification/stylegrid.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
