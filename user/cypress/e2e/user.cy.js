describe('Authentication and Shopping Flow', () => {
  const baseUrl = 'http://localhost:3001'; // URL cơ sở cho ứng dụng

  beforeEach(() => {
    // Clear localStorage để đảm bảo mỗi test đều bắt đầu từ trạng thái sạch
    cy.clearLocalStorage();
  });

  describe('Authentication Flow', () => {
    it('should toggle between Login and Register forms', () => {
      cy.visit(`${baseUrl}/account`);
      cy.get('[data-cy="toggle-login"]').should('have.class', 'active');
      cy.get('[data-cy="toggle-register"]').should('not.have.class', 'active');

      cy.get('[data-cy="toggle-register"]').click();
      cy.get('[data-cy="toggle-register"]').should('have.class', 'active');
      cy.get('[data-cy="toggle-login"]').should('not.have.class', 'active');
    });

    it('should allow a user to log in successfully', () => {
      cy.visit(`${baseUrl}/account`);
      cy.get('[data-cy="toggle-login"]').click();
      cy.get('input[name="email"]').type('testuser@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();
      cy.url({ timeout: 40000 }).should('include', '/home');
    });

    it('should show an error for invalid login credentials', () => {
      cy.visit(`${baseUrl}/account`);
      cy.get('[data-cy="toggle-login"]').click();
      // Nhập thông tin không hợp lệ
      cy.get('input[name="email"]').type('invaliduser@example.com');
      cy.get('input[name="password"]').type('wrongpassword'); 
      // Nhấn login và kiểm tra thông báo lỗi
      cy.get('button[type="submit"]').click();
      cy.get('.error', { timeout: 10000 }).should('contain.text', 'Invalid login credentials!');
    });      

    it('should allow a new user to register', () => {
      // Chuyển sang form Register
      cy.visit(`${baseUrl}/account`);
      cy.get('[data-cy="toggle-register"]').click();
      // Nhập thông tin đăng ký
      cy.get('input[name="username"]').type('newuser');
      cy.get('input[name="email"]').type(`newuser${Date.now()}@example.com`); // Tạo email ngẫu nhiên
      cy.get('input[name="password"]').type('password123');
      // Đăng ký và kiểm tra URL điều hướng
      cy.get('button[type="submit"]').click();
      cy.url({ timeout: 20000 }).should('include', '/home'); // Điều hướng về trang Home
    });

    it('should show an error for email already in use', () => {
      // Chuyển sang form Register
      cy.visit(`${baseUrl}/account`);
      cy.get('[data-cy="toggle-register"]').click();
      // Nhập email đã tồn tại
      cy.get('input[name="username"]').type('existinguser');
      cy.get('input[name="email"]').type('testuser@example.com'); // Email đã tồn tại
      cy.get('input[name="password"]').type('password123');

      // Đăng ký và kiểm tra thông báo lỗi
      cy.get('button[type="submit"]').click();
      cy.get('.error', { timeout: 30000 }).should('contain.text', 'Email is already in use');
    });

    it('should allow a logged-in user to access profile and orders', () => {
      cy.visit(`${baseUrl}/account`);
      cy.get('[data-cy="toggle-login"]').click();
      cy.get('input[name="email"]').type('testuser@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();
      cy.url({ timeout: 30000 }).should('include', '/home');
      cy.get('.account-name').contains('existinguser').should('be.visible').click();
      cy.get('a').contains('Thông tin cá nhân').should('be.visible').click({ force: true });
      cy.url().should('include', '/user-profile');
      cy.get('button').contains('Chỉnh sửa').click();
      cy.get('input[name="phone"]').clear().type('1234567890');
      cy.get('input[name="address"]').clear().type('38 co nhu');
      cy.get('button').contains('Lưu').click();
      cy.on('window:alert', (text) => {
        expect(text).to.contains('Cập nhật thông tin thành công!');
      });
      cy.get('.account-name').contains('existinguser').should('be.visible').click();
      cy.get('a').contains('Đơn hàng của tôi').should('be.visible').click({ force: true });
      cy.url().should('include', '/orders');
    });

    it('should allow a logged-in user to log out successfully', () => {
      cy.visit(`${baseUrl}/account`);
      cy.get('[data-cy="toggle-login"]').click();
      cy.get('input[name="email"]').type('testuser@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();
      cy.url({ timeout: 30000 }).should('include', '/home');
      cy.get('.account-name').contains('existinguser').should('be.visible').click();
      cy.get('.account-menu').should('be.visible');
      cy.get('.account-menu .logout-btn').click();
      cy.url().should('include', '/home');
      cy.get('a').contains('Tài khoản').should('be.visible');
    });
  });

  describe('User Shopping Flow', () => {
    beforeEach(() => {
      cy.visit('/'); // Truy cập vào trang chủ
    });

    it('Displays products and banners correctly', () => {
      cy.get('.banner-container').should('be.visible');
      cy.get('.banner-image').should('have.length.greaterThan', 0);
      cy.get('.product-list').should('be.visible');
      cy.get('.product-card').should('have.length.greaterThan', 0);
      cy.get('.product-card').first().within(() => {
        cy.get('h3').should('exist');
        cy.get('.product-price').should('exist');
        cy.get('.product-image-container').should('exist');
      });
    });

    it('Filters products by category', () => {
      cy.get('.category-nav').should('be.visible');
      cy.get('.category-link').should('have.length.greaterThan', 0);
      cy.get('.category-link').first().click();
      cy.url().should('include', '/category/');
      cy.get('ul').should('be.visible');
      cy.get('.product-card').should('have.length.greaterThan', 0);
      cy.get('.product-card').each(($card) => {
        cy.wrap($card)
          .find('a.product-link')
          .should('have.attr', 'href')
          .and('include', '/product/');
      });
      cy.get('.product-card').first().find('.product-image').trigger('mouseenter');
      cy.get('.product-card').first().find('img').should('have.attr', 'src').and('not.equal', 'default-image-url.jpg');
    });

    it('Views product details', () => {
      cy.get('.product-card').first().find('a.product-link').click();
      cy.url().should('include', '/product/');
      cy.get('.product-info').should('be.visible');
      cy.get('.price').should('be.visible');
      cy.get('.description').should('be.visible');
      cy.get('.main-image img').should('be.visible').and('have.attr', 'src').and('not.include', 'default-image-url.jpg');
      cy.get('.sizes button').first().click();
      cy.get('.add-to-cart').click();
      cy.window().then((win) => {
        const cart = JSON.parse(win.localStorage.getItem('cart'));
        expect(cart).to.be.an('array').that.is.not.empty;
        const lastProduct = cart[cart.length - 1];
        expect(lastProduct).to.have.property('name');
        expect(lastProduct).to.have.property('quantity', 1);
      });
      cy.on('window:alert', (text) => {
        expect(text).to.contains('Sản phẩm đã được thêm vào giỏ hàng.');
      });
    });
  });

  describe('Test Buy Now functionality', () => {
    it('should display an alert if no size is selected', () => {
      cy.visit('/product/xqbymziypF0oDiuOzd68');
      cy.get('.product-detail').should('exist');
      cy.get('.buy-now').should('be.visible');
      cy.get('.buy-now').click();
      cy.on('window:alert', (str) => {
        expect(str).to.equal('Vui lòng chọn kích thước trước khi mua ngay.');
      });
    });

    it('should display an alert if user is not logged in', () => {
      cy.visit('/product/xqbymziypF0oDiuOzd68');
      cy.get('.sizes button').first().click();
      cy.window().then((win) => {
        win.auth = { currentUser: null };
      });
      cy.get('.buy-now').click();
      cy.on('window:alert', (str) => {
        expect(str).to.equal('Vui lòng đăng nhập trước khi mua hàng.');
      });
    });

    it('should allow a logged-in user to create an order', () => {
      cy.visit('/account');
      cy.get('[data-cy="toggle-login"]').click();
      cy.get('input[name="email"]').type('testuser@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();
      cy.url().should('not.include', '/account');
      cy.visit('/product/xqbymziypF0oDiuOzd68');
      cy.get('.sizes button').first().click();
      cy.get('.buy-now').click();
      cy.on('window:alert', (str) => {
        expect(str).to.equal('Đơn hàng ORD123456 của bạn đã được tạo thành công!');
      });
    });
  });
  describe('Add Product to Cart', () => {
    const product = {
      id: 'xqbymziypF0oDiuOzd68',
      name: 'MLB - Áo sweatshirt unisex cổ tròn tay dài Varsity',
      price: 2.49,
      sizes: ['X', 'XL', 'XXL'],
      image: 'sample-product.jpg',
    };
  
    beforeEach(() => {
      cy.visit('/product/xqbymziypF0oDiuOzd68');
    });
  
    it('should display an alert if no size is selected', () => {
      cy.get('.add-to-cart').click(); // Nhấn nút "Thêm vào giỏ hàng"
      cy.on('window:alert', (str) => {
        expect(str).to.equal('Vui lòng chọn kích thước.');
      });
    });
  
    it('should add the product to cart when a size is selected', () => {
      cy.get('.sizes').should('exist');
      cy.get('.sizes button').contains('X').should('be.visible').click();
  
      cy.get('.add-to-cart').click();
  
      // Kiểm tra thông báo alert
      cy.on('window:alert', (str) => {
        expect(str).to.equal('Sản phẩm đã được thêm vào giỏ hàng.');
      });
  
      // Kiểm tra nội dung giỏ hàng trong localStorage
      cy.window().then((win) => {
        const cart = JSON.parse(win.localStorage.getItem('cart'));
        expect(cart).to.be.an('array').that.is.not.empty;
        expect(cart[0]).to.have.property('id', product.id);
        expect(cart[0]).to.have.property('name', product.name);
        expect(cart[0]).to.have.property('price', product.price);
        expect(cart[0]).to.have.property('sizes', 'X');
        expect(cart[0]).to.have.property('quantity', 1);
      });
    });
  });  
});
