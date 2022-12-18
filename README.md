# ShopIt


## Endpoints

### Admin Route
01. GET http://localhost:8080/admin/add-product
02. GET http://localhost:8080/admin/products
03. POST http://localhost:8080/admin/add-product
04. GET http://localhost:8080/admin/edit-product/:productId
05. POST http://localhost:8080/admin/edit-product
06. DELETE http://localhost:8080/admin/product/:productId

### Shop Route
01. GET http://localhost:8080/
02. GET http://localhost:8080/products
03. GET: http://localhost:8080/products/:productId
04. GET http://localhost:8080/cart
05. POST http://localhost:8080/cart
06. GET http://localhost:8080/checkout
07. GET http://localhost:8080/checkout/success
08. GET http://localhost:8080/checkout/cancel
09. GET http://localhost:8080/orders
10. GET http://localhost:8080/orders/:orderId
11. GET http://localhost:8080/cart-delete-item

### Auth Route
01. GET http://localhost:8080/login
02. GET http://localhost:8080/signup
03. POST http://localhost:8080/login
04. POST http://localhost:8080/signup
05. POST http://localhost:8080/logout
06. GET http://localhost:8080/reset
07. POST http://localhost:8080/reset
08. GET http://localhost:8080/reset/:token
09. POST http://localhost:8080/new-password

## Authentication