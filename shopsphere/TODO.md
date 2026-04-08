# Oracle DB Integration for ShopSphere

## Status: In Progress (4/12 steps complete)

### 1. [x] Create TODO.md
### 2. [x] Create server/.env with Oracle credentials
### 3. [x] Create server/db/queries.js with CRUD functions for all tables
### 4. [x] Test Oracle connection via node script (server started: Oracle pool created)
### 5. [ ] Refactor authController.js (register/login → Oracle)
### 6. [x] Refactor productController.js (getProducts → Oracle JOIN query - now shows real DB products)
### 7. [ ] Refactor orderController.js (createOrder → Transaction with ORDER_ITEMS)
### 8. [ ] Refactor vendorController.js (if exists)
### 9. [ ] Update db.js to export query helpers
### 10. [ ] Add DB seed script for sample data
### 11. [ ] Test all APIs end-to-end
### 12. [ ] Remove mock fallback dependency
### 5. [ ] Refactor authController.js (register/login → Oracle)
### 6. [ ] Refactor productController.js (getProducts → JOIN query)
### 7. [ ] Refactor orderController.js (createOrder → Transaction with ORDER_ITEMS)
### 8. [ ] Refactor vendorController.js (if exists)
### 9. [ ] Update db.js to export query helpers
### 10. [ ] Add DB seed script for sample data
### 11. [ ] Test all APIs end-to-end
### 12. [ ] Remove mock fallback dependency

**Notes**: 
- Credentials: shopsphere/Shop1234
- Connect string: Adjust in .env (e.g., localhost:1521/XE)
- Fallback to mock preserved for safety.

