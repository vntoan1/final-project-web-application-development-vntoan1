describe('User Tests', () => {
  // 1.1 User Registration Flow
  describe('User Registration Flow', () => {
    it('Registers successfully with valid information', () => {
      cy.visit('http://localhost:3001/account');
      cy.get('input[name="ten người dùng"]').type('test');
      cy.get('input[name="email"]').type('testuser@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();
      cy.contains('Đăng ký thành công').should('be.visible');
      cy.url().should('include', '/home');
    });

    it('Displays error for invalid registration', () => {
      cy.visit('http://localhost:3001/account');
      cy.get('input[name="email"]').type('invalidemail');
      cy.get('button[type="submit"]').click();
      cy.contains('Email không hợp lệ').should('be.visible');
    });
  });

  // 1.2 User Login Flow
  describe('User Login Flow', () => {
    it('Logs in successfully with valid credentials', () => {
      cy.visit('http://localhost:3001/account');
      cy.get('input[name="email"]').type('testuser@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/home');
    });

    it('Displays error for invalid credentials', () => {
      cy.visit('http://localhost:3001/account');
      cy.get('input[name="email"]').type('testuser@example.com');
      cy.get('input[name="password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();
      cy.contains('Thông tin đăng nhập không chính xác').should('be.visible');
    });
  });

  // 1.3 User Shopping Flow
  describe('User Shopping Flow', () => {
    it('Displays products and banners correctly', () => {
      cy.visit('http://localhost:3001/home');
      cy.get('.product-list').should('be.visible');
      cy.get('.banner-container img').should('have.length.greaterThan', 0);
    });

    it('Filters products by category', () => {
      cy.visit('http://localhost:3001/home');
      cy.get('.category-filter').select('Category1');
      cy.get('.product-card').each(($product) => {
        cy.wrap($product).contains('Category1');
      });
    });

    it('Views product details', () => {
      cy.visit('http://localhost:3001/home');
      cy.get('.product-card').first().click();
      cy.url().should('include', '/product/');
      cy.get('.product-details').should('be.visible');
    });

    it('Adds a product to the cart', () => {
      cy.visit('http://localhost:3001/home');
      cy.get('.product-card').first().contains('Thêm vào giỏ hàng').click();
      cy.get('.cart-badge').should('contain', '1');
    });

    it('Completes checkout and saves order to Firebase', () => {
      cy.visit('http://localhost:3001/cart');
      cy.get('button.checkout').click();
      cy.contains('Thanh toán thành công').should('be.visible');
    });
  });

  // 1.4 Personal Info Update
  describe('User Profile Update Flow', () => {
    it('Successfully updates phone and address', () => {
      cy.visit('http://localhost:3001/user-profile');
      cy.get('input[name="phone"]').clear().type('0987654321');
      cy.get('input[name="address"]').clear().type('456 New Street');
      cy.get('button[type="submit"]').click();
      cy.contains('Cập nhật thông tin thành công').should('be.visible');
    });

    it('Displays error for invalid information', () => {
      cy.visit('http://localhost:3001/user-profile');
      cy.get('input[name="phone"]').clear().type('invalidphone');
      cy.get('button[type="submit"]').click();
      cy.contains('Thông tin không hợp lệ').should('be.visible');
    });
  });
});
