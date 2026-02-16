from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    try:
        page.goto("http://localhost:4321/portfolio")
        print("Page loaded")

        # Scroll to footer
        # Use evaluate to scroll to footer if needed, but screenshot of element works too.
        # But for visibility checks, scrolling is good.
        footer_locator = page.locator("footer#contacto")
        footer_locator.scroll_into_view_if_needed()

        # Email
        email_link = footer_locator.locator("a[href^='mailto:']")
        email_href = email_link.get_attribute("href")
        email_text = email_link.inner_text()
        print(f"Email href: {email_href}")
        print(f"Email text: {email_text}")

        # LinkedIn
        linkedin_link = footer_locator.locator("a[href*='linkedin.com']")
        linkedin_href = linkedin_link.get_attribute("href")
        print(f"LinkedIn href: {linkedin_href}")

        # GitHub
        github_link = footer_locator.locator("a[href*='github.com']")
        github_href = github_link.get_attribute("href")
        print(f"GitHub href: {github_href}")

        # Take screenshot of footer
        page.screenshot(path="footer_verification.png", full_page=True) # Full page to see context if needed, but element screenshot is cleaner.
        footer_locator.screenshot(path="footer_only.png")
        print("Screenshots saved.")

    except Exception as e:
        print(f"Error: {e}")
        try:
            page.screenshot(path="error_screenshot.png")
        except:
            pass
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
