# Sauce Demo E2E Test Plan

## Application Overview

Sauce Demo (https://www.saucedemo.com) is a demo e-commerce application built for test-automation practice. It exposes a login page with several canned accounts (standard_user, locked_out_user, problem_user, performance_glitch_user, error_user, visual_user), all sharing password "secret_sauce". Once authenticated, users land on an inventory/product-listing page where they can sort products, view product detail pages, add/remove items from a cart, and proceed through a three-step checkout (information entry, order overview, confirmation). A hamburger menu provides navigation to All Items, a Dynamic Catalog, an external About link, Logout, and Reset App State. This plan covers login, inventory/sorting, product detail, cart, checkout, and session/navigation flows with both positive and negative scenarios.

## Test Scenarios

### 1. Authentication

**Seed:** `seed.spec.ts`

#### 1.1. Successful login with standard_user

**File:** `tests/auth/login-standard-user.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com
    - expect: Login form is displayed with Username and Password fields and a Login button
  2. Enter username 'standard_user' and password 'secret_sauce'
  3. Click the Login button
    - expect: User is redirected to /inventory.html
    - expect: Products page header 'Products' is visible
    - expect: Six product items are listed

#### 1.2. Login fails with locked_out_user

**File:** `tests/auth/login-locked-out.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com
  2. Enter username 'locked_out_user' and password 'secret_sauce'
  3. Click the Login button
    - expect: User remains on the login page
    - expect: An error message 'Epic sadface: Sorry, this user has been locked out.' is displayed
    - expect: Error field has red outline / alert role is shown

#### 1.3. Login fails with invalid username

**File:** `tests/auth/login-invalid-username.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com
  2. Enter username 'invalid_user' and password 'secret_sauce'
  3. Click the Login button
    - expect: Error message 'Epic sadface: Username and password do not match any user in this service' is displayed
    - expect: User stays on login page

#### 1.4. Login fails with invalid password

**File:** `tests/auth/login-invalid-password.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com
  2. Enter username 'standard_user' and password 'wrong_password'
  3. Click the Login button
    - expect: Error message about username/password mismatch is displayed
    - expect: User stays on login page

#### 1.5. Login fails with empty username and password

**File:** `tests/auth/login-empty-fields.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com
  2. Leave Username and Password fields empty and click Login
    - expect: Error message 'Epic sadface: Username is required' is displayed
  3. Enter a username only, leave password empty, click Login
    - expect: Error message 'Epic sadface: Password is required' is displayed

#### 1.6. Error message can be dismissed

**File:** `tests/auth/login-dismiss-error.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com and attempt login with invalid credentials
    - expect: Error banner with an 'X' dismiss icon is displayed
  2. Click the dismiss (X) icon on the error banner
    - expect: Error banner disappears
    - expect: Login form fields are still present and usable

#### 1.7. Successful login with problem_user and performance_glitch_user

**File:** `tests/auth/login-other-users.spec.ts`

**Steps:**
  1. Login with username 'problem_user' and password 'secret_sauce'
    - expect: User is redirected to /inventory.html (note: this account is known to have broken product images/behavior - visually verify but do not fail purely on image src)
  2. Logout, then login with username 'performance_glitch_user' and password 'secret_sauce'
    - expect: Login succeeds after a noticeably longer delay
    - expect: User lands on /inventory.html

#### 1.8. Logout returns user to login page and clears session

**File:** `tests/auth/logout.spec.ts`

**Steps:**
  1. Login as standard_user and reach the inventory page
  2. Open the hamburger menu and click Logout
    - expect: User is redirected to the login page (/)
    - expect: Username/password fields are empty
  3. Attempt to navigate directly to https://www.saucedemo.com/inventory.html via URL
    - expect: User is redirected back to the login page or shown an error, confirming the session was cleared

### 2. Inventory and Sorting

**Seed:** `seed.spec.ts`

#### 2.1. Inventory page lists all six products with name, price, and image

**File:** `tests/inventory/inventory-listing.spec.ts`

**Steps:**
  1. Login as standard_user
  2. Inspect the product grid on /inventory.html
    - expect: Exactly 6 products are displayed: Sauce Labs Backpack, Bike Light, Bolt T-Shirt, Fleece Jacket, Onesie, Test.allTheThings() T-Shirt (Red)
    - expect: Each product shows an image, name, description, price, and an 'Add to cart' button

#### 2.2. Sort products by Name (A to Z) - default

**File:** `tests/inventory/sort-name-asc.spec.ts`

**Steps:**
  1. Login as standard_user and go to inventory page
    - expect: Sort dropdown defaults to 'Name (A to Z)'
  2. Read the list of product names in order
    - expect: Product names are sorted alphabetically ascending

#### 2.3. Sort products by Name (Z to A)

**File:** `tests/inventory/sort-name-desc.spec.ts`

**Steps:**
  1. Login as standard_user and go to inventory page
  2. Select 'Name (Z to A)' from the sort dropdown
    - expect: Product names are sorted alphabetically descending

#### 2.4. Sort products by Price (low to high)

**File:** `tests/inventory/sort-price-asc.spec.ts`

**Steps:**
  1. Login as standard_user and go to inventory page
  2. Select 'Price (low to high)' from the sort dropdown
    - expect: Product prices are in ascending numeric order starting at $7.99

#### 2.5. Sort products by Price (high to low)

**File:** `tests/inventory/sort-price-desc.spec.ts`

**Steps:**
  1. Login as standard_user and go to inventory page
  2. Select 'Price (high to low)' from the sort dropdown
    - expect: Product prices are in descending numeric order starting at $49.99

#### 2.6. Hamburger menu navigation options are functional

**File:** `tests/inventory/menu-navigation.spec.ts`

**Steps:**
  1. Login as standard_user and open the hamburger menu
    - expect: Menu shows 'All Items', 'Dynamic Catalog', 'About', 'Logout', 'Reset App State' options
  2. Click 'All Items'
    - expect: User remains/returns to /inventory.html
  3. Re-open menu and click 'Close Menu' (X icon)
    - expect: Menu closes without navigating
  4. Re-open menu and click 'About'
    - expect: Navigates (new tab or same tab) to https://saucelabs.com/

#### 2.7. Reset App State clears the cart

**File:** `tests/inventory/reset-app-state.spec.ts`

**Steps:**
  1. Login as standard_user and add two products to the cart
    - expect: Cart badge shows '2'
  2. Open the hamburger menu and click 'Reset App State'
    - expect: Cart badge disappears or resets to empty
    - expect: Previously added items show 'Add to cart' button again instead of 'Remove'

### 3. Product Detail

**Seed:** `seed.spec.ts`

#### 3.1. Navigate to product detail page from inventory

**File:** `tests/product-detail/view-detail.spec.ts`

**Steps:**
  1. Login as standard_user
  2. Click on the product name or image for 'Sauce Labs Backpack'
    - expect: User is navigated to a product detail page showing the full description, price, and an 'Add to cart' button
    - expect: A 'Back to products' button is visible

#### 3.2. Add to cart and remove from product detail page

**File:** `tests/product-detail/add-remove-detail.spec.ts`

**Steps:**
  1. Login as standard_user and open a product detail page
  2. Click 'Add to cart'
    - expect: Button changes to 'Remove'
    - expect: Cart badge count increments by 1
  3. Click 'Remove'
    - expect: Button reverts to 'Add to cart'
    - expect: Cart badge count decrements/disappears

#### 3.3. Back to products button returns to inventory page

**File:** `tests/product-detail/back-to-products.spec.ts`

**Steps:**
  1. Login as standard_user and open a product detail page
  2. Click 'Back to products'
    - expect: User is returned to /inventory.html with the full product grid visible

### 4. Cart

**Seed:** `seed.spec.ts`

#### 4.1. Add single item to cart updates badge and button state

**File:** `tests/cart/add-single-item.spec.ts`

**Steps:**
  1. Login as standard_user
    - expect: Cart icon shows no badge (empty cart)
  2. Click 'Add to cart' for Sauce Labs Backpack
    - expect: Cart badge shows '1'
    - expect: Button for that product changes to 'Remove'

#### 4.2. Add multiple items to cart

**File:** `tests/cart/add-multiple-items.spec.ts`

**Steps:**
  1. Login as standard_user
  2. Click 'Add to cart' on three different products
    - expect: Cart badge shows '3'
  3. Open the cart page
    - expect: All three selected products are listed with correct names, descriptions, and prices
    - expect: Quantity for each is 1

#### 4.3. Remove item from inventory page

**File:** `tests/cart/remove-from-inventory.spec.ts`

**Steps:**
  1. Login as standard_user and add a product to cart
    - expect: Cart badge shows '1'
  2. Click 'Remove' on the same product from the inventory grid
    - expect: Cart badge disappears
    - expect: Button reverts to 'Add to cart'

#### 4.4. Remove item from the cart page

**File:** `tests/cart/remove-from-cart-page.spec.ts`

**Steps:**
  1. Login as standard_user and add two products to cart, then open the cart page
    - expect: Both products listed
  2. Click 'Remove' for one of the listed products
    - expect: That product disappears from the cart list
    - expect: Cart badge decrements to '1'

#### 4.5. Cart persists across navigation within session

**File:** `tests/cart/cart-persistence.spec.ts`

**Steps:**
  1. Login as standard_user and add a product to the cart
  2. Navigate to a product detail page and back to inventory
    - expect: Cart badge still shows '1' and the item remains in the cart

#### 4.6. Continue Shopping button returns from cart to inventory

**File:** `tests/cart/continue-shopping.spec.ts`

**Steps:**
  1. Login as standard_user, add an item, and open the cart page
  2. Click 'Continue Shopping'
    - expect: User is returned to /inventory.html
    - expect: Added item is still in cart (badge shows '1')

#### 4.7. Checkout button is disabled or blocked when cart is empty

**File:** `tests/cart/empty-cart-checkout.spec.ts`

**Steps:**
  1. Login as standard_user without adding any items, open the cart page directly
    - expect: Cart page shows no line items
  2. Click the 'Checkout' button
    - expect: Application either proceeds to an empty checkout-step-one form or blocks checkout; verify actual behavior and that no items appear in the subsequent overview totaling $0.00 if it proceeds

### 5. Checkout Flow

**Seed:** `seed.spec.ts`

#### 5.1. Successful end-to-end checkout with a single item

**File:** `tests/checkout/checkout-happy-path.spec.ts`

**Steps:**
  1. Login as standard_user and add 'Sauce Labs Backpack' to the cart
  2. Open the cart page and click 'Checkout'
    - expect: Navigates to checkout-step-one.html, 'Checkout: Your Information' heading shown
  3. Fill First Name = 'Tiago', Last Name = 'Roque', Zip/Postal Code = '12345', then click 'Continue'
    - expect: Navigates to checkout-step-two.html 'Checkout: Overview'
    - expect: Item total $29.99, Tax $2.40, Total $32.39 are displayed and correctly calculated
    - expect: Payment info 'SauceCard #31337' and shipping 'Free Pony Express Delivery!' are shown
  4. Click 'Finish'
    - expect: Navigates to checkout-complete.html
    - expect: 'Thank you for your order!' confirmation message and pony icon are displayed
  5. Click 'Back Home'
    - expect: User returns to /inventory.html with an empty cart (badge cleared)

#### 5.2. Checkout with multiple items calculates correct totals

**File:** `tests/checkout/checkout-multiple-items.spec.ts`

**Steps:**
  1. Login as standard_user and add three different products to the cart, noting their prices
  2. Proceed through checkout filling valid information
    - expect: Checkout overview lists all three items with correct quantities and prices
    - expect: Item total equals the sum of individual prices
    - expect: Tax is calculated correctly (8% of item total, rounded)
    - expect: Total equals item total plus tax
  3. Click 'Finish'
    - expect: Order completes successfully with confirmation message

#### 5.3. Checkout step one validation - missing First Name

**File:** `tests/checkout/validation-missing-firstname.spec.ts`

**Steps:**
  1. Login as standard_user, add an item, go to checkout step one
  2. Leave First Name empty, fill Last Name and Zip, click 'Continue'
    - expect: Error 'Error: First Name is required' is displayed
    - expect: User remains on checkout-step-one.html

#### 5.4. Checkout step one validation - missing Last Name

**File:** `tests/checkout/validation-missing-lastname.spec.ts`

**Steps:**
  1. Login as standard_user, add an item, go to checkout step one
  2. Fill First Name, leave Last Name empty, fill Zip, click 'Continue'
    - expect: Error 'Error: Last Name is required' is displayed
    - expect: User remains on checkout-step-one.html

#### 5.5. Checkout step one validation - missing Postal Code

**File:** `tests/checkout/validation-missing-zip.spec.ts`

**Steps:**
  1. Login as standard_user, add an item, go to checkout step one
  2. Fill First Name and Last Name, leave Zip/Postal Code empty, click 'Continue'
    - expect: Error 'Error: Postal Code is required' is displayed
    - expect: User remains on checkout-step-one.html

#### 5.6. Checkout step one validation - all fields empty

**File:** `tests/checkout/validation-all-empty.spec.ts`

**Steps:**
  1. Login as standard_user, add an item, go to checkout step one
  2. Click 'Continue' without filling any field
    - expect: Error 'Error: First Name is required' (first validation failure) is displayed
    - expect: User remains on checkout-step-one.html

#### 5.7. Cancel from checkout step one returns to cart

**File:** `tests/checkout/cancel-step-one.spec.ts`

**Steps:**
  1. Login as standard_user, add an item, go to checkout step one
  2. Click 'Cancel'
    - expect: User is returned to /cart.html
    - expect: The item remains in the cart

#### 5.8. Cancel from checkout overview (step two) returns to inventory

**File:** `tests/checkout/cancel-step-two.spec.ts`

**Steps:**
  1. Login as standard_user, add an item, complete step one with valid data to reach checkout-step-two.html
  2. Click 'Cancel'
    - expect: User is returned to /inventory.html
    - expect: Cart still contains the item (badge shows the same count)

#### 5.9. Direct URL access to checkout-step-two without completing step one

**File:** `tests/checkout/direct-url-step-two.spec.ts`

**Steps:**
  1. Login as standard_user and add an item to the cart
  2. Navigate directly to https://www.saucedemo.com/checkout-step-two.html via the address bar
    - expect: Verify actual behavior: page may load the overview with cached/empty customer info, or redirect. Document and assert whichever is the real behavior

#### 5.10. Special character and boundary input in checkout form

**File:** `tests/checkout/boundary-input.spec.ts`

**Steps:**
  1. Login as standard_user, add an item, go to checkout step one
  2. Enter very long strings (e.g. 100+ characters) for First Name and Last Name, and a non-numeric Zip code such as 'ABCDE'
    - expect: Continue button is clicked and application proceeds to step two without client-side format validation on these fields (Sauce Demo does not restrict format) - confirm and document actual tolerance
