# Data Model: Clothes E-Commerce App

## Entity Definitions

### User
**Description**: Customer account information including authentication details, profile data, and preferences

**Fields**:
- id (string): Unique identifier for the user
- email (string): User's email address (unique, required)
- displayName (string): User's display name
- phoneNumber (string): Contact phone number
- addresses (array): Array of address objects
  - street (string): Street address
  - city (string): City name
  - state (string): State/province
  - zipCode (string): Postal/ZIP code
  - country (string): Country name
  - isDefault (boolean): Whether this is the default shipping address
- createdAt (timestamp): Account creation date
- updatedAt (timestamp): Last update timestamp
- isActive (boolean): Account status flag

**Validation Rules**:
- Email must be valid format and unique
- Display name must be 2-50 characters
- At least one address required after registration

### Product
**Description**: Clothing item details including name, description, pricing, and inventory

**Fields**:
- id (string): Unique product identifier
- name (string): Product name (required)
- description (string): Detailed product description
- price (number): Price in smallest currency unit (e.g., cents)
- category (string): Product category (men, women, kids, accessories)
- subcategory (string): Subcategory (shirts, pants, shoes, etc.)
- sizes (array): Available sizes (S, M, L, XL, etc.)
- colors (array): Available colors
- images (array): URLs to product images
- inStock (number): Quantity available in inventory
- isFeatured (boolean): Whether product is featured
- tags (array): Array of product tags for search
- rating (number): Average customer rating (0-5)
- numReviews (number): Number of customer reviews
- createdAt (timestamp): Product creation date
- updatedAt (timestamp): Last update timestamp
- isActive (boolean): Product availability status

**Validation Rules**:
- Price must be positive number
- At least one size required
- At least one image required
- Inventory count must be non-negative

### CartItem
**Description**: Temporary storage of selected products with quantities before checkout

**Fields**:
- id (string): Unique cart item identifier
- userId (string): Reference to user who owns this cart item
- productId (string): Reference to the product
- quantity (number): Number of items (required, min 1)
- selectedSize (string): Size selected for this item
- selectedColor (string): Color selected for this item
- priceAtTime (number): Price when added to cart (for consistency)
- createdAt (timestamp): Item addition timestamp
- updatedAt (timestamp): Last update timestamp

**Validation Rules**:
- Quantity must be between 1 and available inventory
- Selected size must be available for the product
- One cart item per user/product/size/color combination

### Order
**Description**: Purchase transaction record including items, pricing, and fulfillment status

**Fields**:
- id (string): Unique order identifier
- userId (string): Reference to user who placed the order
- items (array): Array of order item objects
  - productId (string): Reference to the product
  - productName (string): Product name at time of order
  - quantity (number): Quantity ordered
  - price (number): Price per item at time of order
  - size (string): Size selected
  - color (string): Color selected
- totalAmount (number): Total order amount
- shippingAddress (object): Shipping address information
  - street (string): Street address
  - city (string): City name
  - state (string): State/province
  - zipCode (string): Postal/ZIP code
  - country (string): Country name
- billingAddress (object): Billing address (may differ from shipping)
- paymentMethod (string): Payment method used ('COD')
- status (string): Order status ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')
- orderDate (timestamp): Date the order was placed
- estimatedDelivery (timestamp): Estimated delivery date
- notes (string): Customer notes for the order
- createdAt (timestamp): Order creation timestamp
- updatedAt (timestamp): Last status update timestamp

**Validation Rules**:
- At least one item required
- Total amount must match sum of item prices
- Status transitions must follow valid sequence
- Addresses must be valid format

### OrderItem
**Description**: Individual items within an order (included as nested object in Order)

**Fields**:
- productId (string): Reference to the product
- productName (string): Product name at time of order
- quantity (number): Quantity ordered
- price (number): Price per item at time of order
- size (string): Size selected
- color (string): Color selected

### ChatSession
**Description**: WhatsApp interaction record linking user conversations to potential orders

**Fields**:
- id (string): Unique chat session identifier
- userId (string): Reference to user (if authenticated)
- phoneNumber (string): WhatsApp phone number (if not registered)
- sessionId (string): Session identifier from WhatsApp API
- messages (array): Array of message objects
  - sender (string): 'user' or 'bot'
  - message (string): Message content
  - timestamp (timestamp): Message timestamp
  - type (string): 'text', 'image', 'order_confirmation', etc.
- currentIntent (string): Current user intent ('browsing', 'viewing_product', 'placing_order', 'support')
- associatedOrderId (string): Reference to order if one was created from this session
- status (string): Session status ('active', 'ended', 'converted_to_order')
- createdAt (timestamp): Session start time
- updatedAt (timestamp): Last activity timestamp

**Validation Rules**:
- Either userId or phoneNumber must be provided
- Messages array length limited to prevent excessive storage

## Relationships

### User Relationships
- One-to-many with CartItem (user has many cart items)
- One-to-many with Order (user has many orders)
- One-to-many with ChatSession (user has many chat sessions)

### Product Relationships
- One-to-many with CartItem (product appears in many cart items)
- One-to-many with OrderItem (product appears in many order items)

### Order Relationships
- Many-to-one with User (many orders belong to one user)
- One-to-many with OrderItem (order has many items)

### CartItem Relationships
- Many-to-one with User (many cart items belong to one user)
- Many-to-one with Product (many cart items reference one product)

## Indexes

### Firestore Indexes Required
- users: email (unique)
- products: category, isActive (compound index for category filtering)
- products: isFeatured, isActive (compound index for featured products)
- orders: userId, createdAt (compound index for user order history)
- orders: status, createdAt (compound index for order management)

## State Transitions

### Order Status Transitions
- pending → confirmed → processing → shipped → delivered
- pending → cancelled (before confirmation)
- confirmed → cancelled (before processing)

### CartItem Lifecycle
- Created when user adds item to cart
- Updated when user changes quantity or removes item
- Converted to OrderItem when user completes checkout
- Deleted when user removes from cart or checkout is completed

## Data Validation Rules

### Universal Rules
- All timestamps use UTC timezone
- All currency values stored in smallest unit (cents) to avoid floating point issues
- All IDs follow consistent string format
- All text fields have appropriate length limits

### Specific Validations
- Email format validation using standard regex
- Phone number validation for international format
- Price values must be positive integers (in cents)
- Quantity values must be positive integers
- Image URLs must be properly formatted and accessible