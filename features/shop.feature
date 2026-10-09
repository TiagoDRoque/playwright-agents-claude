Feature: SauceDemo shop

  Background:
    Given I am logged in as "standard_user"

  Scenario: Login succeeds and shows inventory
    Then the products page title should be "Products"
    And there should be 6 inventory items

  Scenario: Add single item to cart and verify badge
    When I add the first inventory item to the cart
    Then the cart badge should show "1"

  Scenario: Complete checkout with one item
    When I add the first inventory item to the cart
    And I open the cart
    And I checkout with first name "Tiago", last name "Roque" and zip "1000"
    And I finish the checkout
    Then I should see the order confirmation "Thank you for your order!"

  Scenario: Logout returns to login page
    When I log out
    Then the login button should be visible
