    // 2.1 Admin Login Flow
    describe('Admin Login Flow', () => {
      it('Logs in successfully as admin', () => {
        cy.visit('http://localhost:3000/login');
        cy.get('input[name="email"]').type('admin@example.com');
        cy.get('input[name="password"]').type('adminpassword');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/admin/dashboard');
      });
  
      it('Displays error for invalid admin credentials', () => {
        cy.visit('http://localhost:3000/login');
        cy.get('input[name="email"]').type('admin@example.com');
        cy.get('input[name="password"]').type('wrongpassword');
        cy.get('button[type="submit"]').click();
        cy.contains('Thông tin đăng nhập không chính xác').should('be.visible');
      });
    });
  
    // 2.2 Product Management
    describe('Admin Product Management', () => {
      it('Adds a new product successfully', () => {
        cy.visit('/admin');
        cy.get('button.add-product').click();
        cy.get('input[name="name"]').type('New Product');
        cy.get('input[name="price"]').type('1000');
        cy.get('input[name="category"]').type('Category1');
        cy.get('button[type="submit"]').click();
        cy.contains('Thêm sản phẩm thành công').should('be.visible');
      });
  
      it('Edits a product successfully', () => {
        cy.visit('/admin');
        cy.get('.product-edit-button').first().click();
        cy.get('input[name="name"]').clear().type('Updated Product');
        cy.get('button[type="submit"]').click();
        cy.contains('Cập nhật sản phẩm thành công').should('be.visible');
      });
  
      it('Deletes a product successfully', () => {
        cy.visit('/admin');
        cy.get('.product-delete-button').first().click();
        cy.contains('Xóa sản phẩm thành công').should('be.visible');
      });
    });
  
    // Similar tests can be added for managing categories, banners, orders, and users.
  
  });
  