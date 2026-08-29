# SK Sport WhatsApp Shop

SK SPORT STORE — WHATSAPP-FIRST SPORTS ECOMMERCE WEBSITE

Build a modern, production-ready ecommerce-style website for SK Sport Store.

SK Sport Store is a sports retail store selling sports equipment, accessories, apparel and related products.

The website should provide a complete ecommerce browsing experience, but customers should NOT pay through the website.

The buying workflow is:

Browse Products
↓
Product Details
↓
Add to Cart
↓
Cart
↓
Customer Details
↓
Order on WhatsApp
↓
Pre-filled WhatsApp Message
↓
Customer taps Send
↓
SK Sport Store manually confirms the order


There is no online payment gateway in the MVP.

1. PRIMARY GOAL

Create a professional sports ecommerce storefront that makes it extremely easy for customers to:

Discover sports products

Browse categories

Search and filter products

View detailed product information

Add products to cart

Edit cart quantities

Review subtotal

Enter customer/delivery details

Send the complete order through WhatsApp

The website should look and behave like a modern ecommerce store, while WhatsApp is the actual order submission channel.

2. TECHNOLOGY STACK

Use:

TypeScript

React

Vite

React Router

Tailwind CSS

Supabase

PostgreSQL through Supabase

Supabase Storage

Browser localStorage for cart persistence

WhatsApp wa.me for order submission

Keep dependencies minimal.

Do not add unnecessary frameworks or libraries.

3. UNIVERSAL ARCHITECTURE

The application must follow:

UI
↓
API
↓
Services
↓
Database Adapter
↓
Database


Storage must follow:

UI
↓
Services
↓
Storage Adapter
↓
Storage Provider


The architecture must NOT directly couple the UI to Supabase.

4. CRITICAL ARCHITECTURE RULE

Never call Supabase directly from:

React components

Pages

Product cards

Cart components

UI hooks

UI event handlers

Do NOT write:

supabase.from(...)


inside UI components or pages.

All Supabase-specific implementation must remain behind the database adapter.

The application should be able to replace Supabase later without rewriting the UI.

5. PROJECT STRUCTURE

Use this architecture:

src/
│
├── api/
│   ├── productsApi.ts
│   ├── categoriesApi.ts
│   └── ordersApi.ts
│
├── services/
│   ├── productService.ts
│   ├── categoryService.ts
│   ├── cartService.ts
│   ├── orderService.ts
│   ├── whatsappService.ts
│   └── storageService.ts
│
├── db/
│   ├── database.ts
│   ├── types.ts
│   │
│   ├── adapters/
│   │   ├── DatabaseAdapter.ts
│   │   └── SupabaseDatabaseAdapter.ts
│   │
│   └── supabase/
│       └── supabaseClient.ts
│
├── models/
│   ├── Product.ts
│   ├── Category.ts
│   ├── Cart.ts
│   ├── Customer.ts
│   └── Order.ts
│
├── components/
│   ├── layout/
│   ├── navigation/
│   ├── products/
│   ├── categories/
│   ├── cart/
│   ├── checkout/
│   └── common/
│
├── pages/
│   ├── Home.tsx
│   ├── Products.tsx
│   ├── Category.tsx
│   ├── ProductDetails.tsx
│   ├── Cart.tsx
│   ├── About.tsx
│   ├── Contact.tsx
│   ├── FAQ.tsx
│   ├── Shipping.tsx
│   ├── Returns.tsx
│   ├── Privacy.tsx
│   └── Terms.tsx
│
└── config/
    └── config.ts


You may adjust filenames if necessary, but preserve the separation of responsibilities.

6. UNIVERSAL DATABASE LAYER

Create a generic database interface:

interface DatabaseAdapter {
  find<T>(
    table: string,
    filters?: Record<string, unknown>
  ): Promise<T[]>;

  findById<T>(
    table: string,
    id: string
  ): Promise<T | null>;

  create<T>(
    table: string,
    data: Partial<T>
  ): Promise<T>;

  update<T>(
    table: string,
    id: string,
    data: Partial<T>
  ): Promise<T>;

  delete(
    table: string,
    id: string
  ): Promise<void>;
}


Implement:

DatabaseAdapter
       ↑
       │
SupabaseDatabaseAdapter


The services should depend on the interface, not directly on Supabase.

7. SUPABASE

Use Supabase as the initial implementation of:

PostgreSQL database

Authentication if needed later

Storage

Do not tightly couple application logic to Supabase.

Create a centralized Supabase client.

Use environment variables:

VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_WHATSAPP_NUMBER


Never expose a Supabase service-role key in frontend code.

8. UNIVERSAL STORAGE LAYER

Create:

storageService


with methods such as:

uploadImage()
deleteImage()
getImageUrl()


Create:

interface StorageAdapter {
  uploadImage(
    file: File,
    path: string
  ): Promise<string>;

  deleteImage(
    path: string
  ): Promise<void>;

  getImageUrl(
    path: string
  ): string;
}


Implement:

StorageAdapter
      ↑
      │
SupabaseStorageAdapter


The UI must never directly call Supabase Storage.

This should allow future replacement with:

Cloudinary

AWS S3

Cloudflare R2

Firebase Storage

another provider

without rewriting the UI.

9. DATABASE MODEL

Create a proper relational product catalog.

categories

id
name
slug
description
image_url
is_active
sort_order
created_at
updated_at


products

id
category_id
name
slug
sku
description
short_description
price
compare_at_price
image_url
size
brand
sport
gender
material
stock_status
is_featured
is_active
sort_order
created_at
updated_at


Products belong to categories.

Use stable UUIDs for database IDs.

SKU must be separate from the database ID.

Example:

id: UUID
sku: SK001
name: Professional Cricket Bat


10. SPORTS CATEGORIES

Design the catalog architecture to support categories such as:

Cricket
Football
Badminton
Tennis
Basketball
Volleyball
Running
Fitness & Gym
Sports Shoes
Sports Apparel
Sports Accessories
Protective Gear
Training Equipment


Do not assume these are the final categories.

Make categories database-driven.

The store owner should eventually be able to add/remove categories without changing frontend code.

11. PRODUCT DATA

Product information must come from the database.

Do NOT hardcode product data inside components.

A product should contain at least:

id
name
slug
sku
price
image
category
description
stock status


Additional fields should support:

brand
sport
size
material
gender
features
specifications


12. CART ARCHITECTURE

The cart must use browser localStorage.

Use exactly:

cart


as the localStorage key.

The cart should store only:

[
  {
    "productId": "uuid",
    "quantity": 2
  }
]


Do not store the entire product database inside localStorage.

Product information should come from the product service.

13. CART SERVICE

Create:

cartService


with:

getCart()
addItem()
updateQuantity()
removeItem()
clearCart()
getItemCount()
calculateSubtotal()


Components must NOT directly use:

localStorage.getItem()
localStorage.setItem()
localStorage.removeItem()


Instead:

cartService.addItem(productId)
cartService.updateQuantity(productId, quantity)
cartService.removeItem(productId)


Keep localStorage implementation inside the cart service.

14. PRODUCT SERVICE

Create:

productService


with:

getProducts()
getProductById()
getProductBySlug()
getFeaturedProducts()
getProductsByCategory()
searchProducts()
filterProducts()


All product-related UI should communicate through this service.

15. CATEGORY SERVICE

Create:

categoryService


with:

getCategories()
getCategoryBySlug()
getCategoryProducts()


16. WHATSAPP SERVICE

Create:

whatsappService


Responsibilities:

buildOrderMessage()
generateWhatsAppUrl()
openWhatsApp()


The service receives:

Customer details
Cart items
Quantities
Prices
Subtotal


and creates a pre-filled WhatsApp message.

17. WHATSAPP MESSAGE

Generate a clean message such as:

SK SPORT STORE — NEW ORDER

Customer:
[Name]

Phone:
[Phone]

Items:

1. Product Name
Qty: 2
₹1,499 × 2 = ₹2,998

2. Product Name
Qty: 1
₹799 × 1 = ₹799

-------------------------
Subtotal: ₹3,797
-------------------------

Delivery Address:
[Address]

Please confirm product availability,
final amount, payment and delivery details.


Use URL encoding.

Open:

https://wa.me/<WHATSAPP_NUMBER>?text=<ENCODED_MESSAGE>


The WhatsApp number must come from configuration.

Do not hardcode it into components.

18. IMPORTANT WHATSAPP BEHAVIOR

The website must NOT claim:

Order Confirmed
Payment Successful
Order Submitted


when WhatsApp is opened.

The correct state is:

Your order message is ready in WhatsApp.
Tap Send to submit your order.


The customer manually sends the message.

SK Sport Store manually confirms the order.

19. HOME PAGE

Create a modern sports retail homepage.

Sections:

01 — Announcement Bar

Examples:

Free delivery above ₹X
New arrivals are here
Order directly through WhatsApp


Use configurable content where practical.

02 — Header

Desktop:

SK SPORT STORE

Home
Shop
Categories
About
Contact

Search
Cart


Mobile:

Logo
Search
Cart
Menu


Cart should display item count.

03 — Hero Section

Create a strong sports-focused hero.

Example direction:

EQUIP YOUR GAME

Everything you need to train,
compete and perform better.

[ Shop Sports ]

[ Explore Categories ]


Use high-quality sports imagery.

The hero should communicate:

Sports retail

Product range

Performance

Shopping CTA

20. SHOP BY SPORT

Display major sports categories.

Example:

Shop by Sport

Cricket
Football
Badminton
Tennis
Basketball
Fitness
Running


Each category should link to the relevant catalog.

21. FEATURED PRODUCTS

Display featured products from the database.

Each card:

Product Image
Brand
Product Name
Price
Compare-at Price if applicable
Stock Status
Add to Cart


Keep the card visually clean.

22. SHOP BY CATEGORY

Provide broader product categories:

Sports Equipment
Sports Shoes
Apparel
Accessories
Protective Gear
Training Equipment


Use real categories from the database when available.

23. WHY SHOP WITH SK SPORT STORE

Use genuine business advantages.

Possible examples only if true:

Quality Sports Products
Competitive Prices
Wide Product Selection
Easy WhatsApp Ordering
Local Customer Support


Do not invent certifications, partnerships or claims.

24. NEW ARRIVALS

Show recently added active products.

Use database ordering by:

created_at


or an explicit sort order.

25. BEST SELLERS

If actual sales data is not available, do not falsely label products as "Best Sellers".

Instead use:

Popular Picks


only if there is a legitimate basis.

Otherwise omit the section.

26. HOW TO ORDER

Explain the WhatsApp workflow:

01
Choose Your Products

02
Add to Cart

03
Review Your Order

04
Send Through WhatsApp

05
SK Sport Store Confirms


Make this very obvious because the site does not have normal checkout/payment.

27. BRAND / STORE STORY

Introduce SK Sport Store.

Use:

About SK Sport Store

Who we are
What we offer
Who we serve
Why customers choose us

[ Learn More ]


Do not invent company history.

28. TESTIMONIALS

Only display genuine customer reviews.

If none are available, do not fabricate testimonials.

29. FAQ

Include common questions:

How do I place an order?
How does WhatsApp ordering work?
Do you deliver?
What are the delivery charges?
How can I pay?
How long does delivery take?
Can I cancel an order?
Can I return a product?
How do I know if a product is available?


30. FINAL CTA

End the homepage with:

READY TO PLAY?

Find the equipment you need.

[ Shop Products ]

[ Order on WhatsApp ]


31. PRODUCTS PAGE

Route:

/products


Include:

Page title
Search
Sport filters
Category filters
Brand filter
Price filter
Availability filter
Sort
Product grid


Desktop should support a sidebar/filter area.

Mobile should use a filter drawer/modal.

32. SEARCH

Implement client-side or service-level product search for the MVP.

Search should support:

Product name
Brand
SKU
Sport
Category


Example:

Searching:

"bat"


can return cricket bats.

33. PRODUCT FILTERS

Support where applicable:

Sport
Category
Brand
Price Range
Gender
Size
Availability


Only show filters relevant to the available data.

Do not create empty/useless filters.

34. PRODUCT DETAILS PAGE

Route:

/products/:slug


Structure:

Breadcrumb

Product Image Gallery

Brand
Product Name
Rating if real data exists
Price
Compare-at Price
Stock Status
Size / Variant
Quantity

[ Add to Cart ]

[ Order on WhatsApp ]

Description
Features
Specifications
Size Information
Material
Product Details
Related Products


Do not invent ratings or reviews.

35. PRODUCT CARD

Reusable product card:

Image
Brand
Product Name
Price
Compare-at Price
Discount if valid
Stock Status
Add to Cart


Clicking the product opens its details page.

36. CART PAGE

Route:

/cart


Display:

Your Cart

Product
Image
Price
Quantity
Line Total
Remove

Subtotal

[ Continue Shopping ]

[ Order on WhatsApp ]


Empty state:

Your cart is empty.

Find the equipment you need.

[ Shop Products ]


37. CUSTOMER DETAILS

Before opening WhatsApp, collect:

Name *
Phone Number *
Delivery Address *


Validate required fields.

Then show:

Order Summary
Customer Details
Subtotal

[ Send Order on WhatsApp ]


38. ABOUT PAGE

Route:

/about


Sections:

Hero
About SK Sport Store
Our Product Range
Our Approach
Why Customers Choose Us
Store Information
CTA


39. CONTACT PAGE

Route:

/contact


Include:

WhatsApp
Phone
Email
Store Address
Business Hours
Map


WhatsApp should be a primary CTA.

40. FAQ PAGE

Route:

/faq


Organize FAQs:

Ordering
Products
Payment
Delivery
Returns


41. POLICY PAGES

Create:

/shipping
/returns
/privacy
/terms


Use the actual store policies.

Do not generate fake legal commitments.

42. NAVIGATION

Desktop navigation:

SK SPORT STORE

Home
Shop
Sports
Categories
About
Contact

Search
Cart


Do not overload the navigation with too many links.

Mobile navigation should be compact and easy to use.

43. RESPONSIVE DESIGN

Design mobile-first.

Support:

Mobile
Tablet
Desktop
Large Desktop


Pay special attention to:

Product browsing

Filters

Product images

Product details

Cart

Forms

WhatsApp CTA

Navigation

44. VISUAL DESIGN DIRECTION

Create a modern sports retail aesthetic.

Design principles:

Strong typography

High contrast

Clean product presentation

Energetic but professional

Spacious layout

Strong CTA hierarchy

Premium ecommerce feel

Mobile-first

Fast scanning

Do not make it look like a generic template.

The design should feel like a real sports store.

45. COMPONENT ARCHITECTURE

Create reusable components:

components/
│
├── layout/
│   ├── Header
│   ├── Footer
│   └── AnnouncementBar
│
├── navigation/
│   ├── DesktopNav
│   ├── MobileNav
│   ├── SearchBar
│   └── Breadcrumb
│
├── products/
│   ├── ProductCard
│   ├── ProductGrid
│   ├── ProductGallery
│   ├── ProductPrice
│   ├── ProductFilters
│   └── CategoryCard
│
├── cart/
│   ├── CartItem
│   ├── CartSummary
│   ├── QuantitySelector
│   └── EmptyCart
│
├── checkout/
│   ├── CustomerDetailsForm
│   ├── OrderSummary
│   └── WhatsAppOrderButton
│
└── common/
    ├── Button
    ├── Input
    ├── Modal
    ├── LoadingState
    ├── ErrorState
    └── EmptyState


Avoid duplicated UI.

46. STATE MANAGEMENT

Do not introduce Redux unless genuinely required.

Use:

React state

Context where appropriate

cartService

localStorage

Cart should have one clear source of truth.

47. LOADING / ERROR / EMPTY STATES

Every data-driven screen must handle:

Loading
Success
Empty
Error


Examples:

Products unavailable
Product not found
No products match your filters
Cart is empty
Unable to prepare WhatsApp order


Never silently fail.

48. ACCESSIBILITY

Implement:

Semantic HTML

Keyboard navigation

Proper labels

Accessible buttons

Image alt text

Sufficient contrast

Focus states

Form validation messages

49. SEO

Implement basic SEO:

Page titles

Meta descriptions

Clean URLs

Product slugs

Semantic headings

Image alt text

Open Graph metadata where practical

Product URLs should use:

/products/professional-cricket-bat


instead of exposing database IDs.

50. PERFORMANCE

Optimize:

Product images

Lazy loading

Component rendering

Database queries

Unnecessary network requests

Do not load every product image unnecessarily on the homepage.

51. SECURITY

Never expose:

SUPABASE_SERVICE_ROLE_KEY


in frontend code.

Use only public/client-safe Supabase configuration.

Configure Supabase Row Level Security.

Public users should only be able to read required active catalog information.

Do not create public write permissions unnecessarily.

52. FUTURE EXTENSIBILITY

The architecture must support adding later:

Admin Dashboard
Authentication
Customer Accounts
Online Payments
Order Database
Order Tracking
Inventory Management
Coupons
Discounts
Wishlist
Reviews
Product Variants
Shipping Integration
Analytics
Notifications
Email
SMS


Do not build these now unless required.

The architecture should simply make them possible later.

53. MVP — DO NOT OVERBUILD

The first production version must focus on:

Home
Products
Categories
Product Details
Cart
Customer Details
WhatsApp Order
About
Contact
FAQ
Policies


Do not build:

Online Payment
Customer Login
Order Tracking
Admin Dashboard
Wishlist
Reviews System
Coupons
Complex Inventory


unless specifically requested later.

54. BUILD ORDER

Build the project in this order.

Step 1 — Foundation

Create:

TypeScript setup

React setup

Routing

Tailwind

Environment configuration

Folder architecture

Step 2 — Models

Create:

Product
Category
Cart
Customer
Order


Step 3 — Database Layer

Create:

DatabaseAdapter
SupabaseDatabaseAdapter
database provider


Step 4 — Storage Layer

Create:

StorageAdapter
SupabaseStorageAdapter
storageService


Step 5 — Supabase Schema

Create:

categories
products


with proper relationships and indexes.

Step 6 — Services

Create:

productService
categoryService
cartService
whatsappService
orderService


Step 7 — Product Catalog

Build:

Products
Categories
Product Details
Search
Filters


Step 8 — Cart

Build:

Add
Quantity
Remove
Subtotal
Persistence


Step 9 — WhatsApp

Build:

Customer Details
Order Summary
Message Generator
WhatsApp URL


Step 10 — Homepage

Build the full homepage.

Step 11 — Informational Pages

Build:

About
Contact
FAQ
Shipping
Returns
Privacy
Terms


Step 12 — QA

Test all flows.

Step 13 — Responsive Polish

Test:

Mobile
Tablet
Desktop


55. TESTING CHECKLIST

Verify:

Product

Products load correctly

Categories load correctly

Search works

Filters work

Product detail works

Invalid product displays not-found state

Cart

Add to Cart works

Cart persists after refresh

Quantity increase works

Quantity decrease works

Remove works

Subtotal is correct

Cart count is correct

Empty state works

WhatsApp

Customer details validate

Correct product names appear

Correct quantities appear

Correct prices appear

Correct subtotal appears

Delivery address appears

WhatsApp URL is encoded correctly

WhatsApp opens correctly

No false order confirmation

Architecture

Verify there are no direct Supabase calls inside:

components/
pages/


Verify there are no direct localStorage calls outside:

cartService


Verify Supabase-specific code is contained inside:

db/
storage adapters
supabase provider


56. FINAL ARCHITECTURE

The finished application must follow:

                    UI
                     ↓
                    API
                     ↓
                 SERVICES
                     ↓
              DATABASE ADAPTER
                     ↓
                  SUPABASE


For files/images:

                    UI
                     ↓
                 SERVICES
                     ↓
              STORAGE ADAPTER
                     ↓
             SUPABASE STORAGE


For cart:

UI
 ↓
cartService
 ↓
localStorage


For ordering:

Cart
 ↓
Customer Details
 ↓
orderService
 ↓
whatsappService
 ↓
wa.me
 ↓
WhatsApp
 ↓
Manual Store Confirmation


This architecture is mandatory.

Do not bypass these layers for convenience.

57. IMPORTANT FINAL INSTRUCTION

Before implementing the visual design, establish and verify the architecture, models, database layer, storage layer, services and cart abstraction.

Do not generate a giant monolithic component.

Do not hardcode products.

Do not directly couple UI to Supabase.

Do not directly couple UI to localStorage.

Do not implement traditional online checkout.

Build a clean, scalable foundation first, then build the SK Sport Store ecommerce experience on top of it.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ee60c7a5-b831-4ffe-9f74-b35bc8a3696d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
