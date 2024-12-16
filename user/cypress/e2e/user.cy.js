// describe('Authentication Flow', () => {
//   const baseUrl = 'http://localhost:3001'; // URL cơ sở cho ứng dụng

//   beforeEach(() => {
//     cy.visit(`${baseUrl}/account`); // Đảm bảo luôn truy cập trang Login/Register trước mỗi test
//   });

//   it('should toggle between Login and Register forms', () => {
//     // Kiểm tra form mặc định là Login
//     cy.get('[data-cy="toggle-login"]').should('have.class', 'active');
//     cy.get('[data-cy="toggle-register"]').should('not.have.class', 'active');

//     // Chuyển sang form Register
//     cy.get('[data-cy="toggle-register"]').click();
//     cy.get('[data-cy="toggle-register"]').should('have.class', 'active');
//     cy.get('[data-cy="toggle-login"]').should('not.have.class', 'active');
//   });

//   it('should allow a user to log in successfully', () => {
//     // Truy cập trang /account
//     cy.visit('/account');
  
//     // Đảm bảo form đang ở chế độ đăng nhập
//     cy.get('[data-cy="toggle-login"]').click();
  
//     // Điền thông tin đăng nhập
//     cy.get('input[name="email"]').type('testuser@example.com');
//     cy.get('input[name="password"]').type('password123');
  
//     // Submit form
//     cy.get('button[type="submit"]').click();
  
//     // Kiểm tra điều hướng thành công
//     cy.url({ timeout: 40000 }).should('include', '/home');
//   });  

//   it('should show an error for invalid login credentials', () => {
//     // Nhập thông tin không hợp lệ
//     cy.get('input[name="email"]').type('invaliduser@example.com');
//     cy.get('input[name="password"]').type('wrongpassword');

//     // Nhấn login và kiểm tra thông báo lỗi
//     cy.get('button[type="submit"]').click();
//     cy.get('.error', { timeout: 10000 }).should('contain.text', 'Invalid login credentials!');
//   });

//   it('should allow a new user to register', () => {
//     // Chuyển sang form Register
//     cy.get('[data-cy="toggle-register"]').click();

//     // Nhập thông tin đăng ký
//     cy.get('input[name="username"]').type('newuser');
//     cy.get('input[name="email"]').type(`newuser${Date.now()}@example.com`); // Tạo email ngẫu nhiên
//     cy.get('input[name="password"]').type('password123');

//     // Đăng ký và kiểm tra URL điều hướng
//     cy.get('button[type="submit"]').click();
//     cy.url({ timeout: 20000 }).should('include', '/home'); // Điều hướng về trang Home
//   });

//   it('should show an error for email already in use', () => {
//     // Chuyển sang form Register
//     cy.get('[data-cy="toggle-register"]').click();

//     // Nhập email đã tồn tại
//     cy.get('input[name="username"]').type('existinguser');
//     cy.get('input[name="email"]').type('testuser@example.com'); // Email đã tồn tại
//     cy.get('input[name="password"]').type('password123');

//     // Đăng ký và kiểm tra thông báo lỗi
//     cy.get('button[type="submit"]').click();
//     cy.get('.error', { timeout: 30000 }).should('contain.text', 'Email is already in use');
//   });

//   it('should allow a logged-in user to access profile and orders', () => {
//     // Đăng nhập trước
//     cy.visit('/account');
//     cy.get('[data-cy="toggle-login"]').click();
//     cy.get('input[name="email"]').type('testuser@example.com');
//     cy.get('input[name="password"]').type('password123');
//     cy.get('button[type="submit"]').click();
  
//     // Chờ điều hướng thành công
//     cy.url({ timeout: 30000 }).should('include', '/home');
  
//     // Kiểm tra phần tử chứa tên người dùng trong span.account-name và nhấp vào
//     cy.get('.account-name').contains('existinguser').should('be.visible').click();
  
//     // Chờ cho nút "Profile" và "My Orders" xuất hiện
//     cy.get('a').contains('Thông tin cá nhân').as('profileButton');
//     cy.get('@profileButton').should('be.visible').click({ force: true });
  
//     // Kiểm tra điều hướng tới trang hồ sơ người dùng
//     cy.url().should('include', '/user-profile');
  
//     // Kiểm tra nút "My Orders" sau khi vào trang hồ sơ người dùng
//     cy.get('a').contains('Đơn hàng của tôi').as('ordersButton');
//     cy.get('@ordersButton').should('be.visible').click({ force: true });
  
//     // Kiểm tra điều hướng tới trang đơn hàng
//     cy.url().should('include', '/orders');
//   });  

//   it('should allow a logged-in user to log out successfully', () => {
//     // Đăng nhập trước
//     cy.visit('/account');
//     cy.get('[data-cy="toggle-login"]').click();
//     cy.get('input[name="email"]').type('testuser@example.com');
//     cy.get('input[name="password"]').type('password123');
//     cy.get('button[type="submit"]').click();
  
//     // Chờ điều hướng thành công
//     cy.url({ timeout: 30000 }).should('include', '/home');
    
//     // Kiểm tra phần tử chứa tên người dùng trong span.account-name và nhấp vào
//     cy.get('.account-name').contains('existinguser').should('be.visible').click();
  
//     // Đợi menu xuất hiện và tìm nút Đăng xuất
//     cy.get('.account-menu').should('be.visible');  // Kiểm tra menu xuất hiện
//     cy.get('.account-menu .logout-btn').click();  // Nhấp vào nút Đăng xuất
  
//     // Kiểm tra chuyển về trang đăng nhập
//     cy.url().should('include', '/home');  // Kiểm tra chuyển về trang tài khoản
//     cy.get('a').contains('Tài khoản').should('be.visible');  // Kiểm tra hiển thị liên kết đăng nhập
//   });  
// });


describe('User Shopping Flow', () => {

  beforeEach(() => {
    // Truy cập vào trang chủ
    cy.visit('/');
  });

  // it('Displays products and banners correctly', () => {
  //   // Kiểm tra rằng banner hiển thị
  //   cy.get('.banner-container').should('be.visible'); // Kiểm tra container banner
  //   cy.get('.banner-image').should('have.length.greaterThan', 0); // Kiểm tra hình ảnh banner

  //   // Kiểm tra hiển thị sản phẩm
  //   cy.get('.product-list').should('be.visible'); // Kiểm tra danh sách sản phẩm
  //   cy.get('.product-card').should('have.length.greaterThan', 0); // Kiểm tra có ít nhất một sản phẩm

  //   // Kiểm tra sản phẩm hiển thị đúng thông tin
  //   cy.get('.product-card').first().within(() => {
  //     cy.get('h3').should('exist'); // Kiểm tra tên sản phẩm (trong thẻ <h3>)
  //     cy.get('.product-price').should('exist'); // Kiểm tra giá sản phẩm
  //     cy.get('.product-image-container').should('exist'); // Kiểm tra hình ảnh sản phẩm
  //   });
  // });

    // it('Filters products by category', () => {
    //   // Visit the homepage or a page where the category navigation is present
    //   cy.visit('/'); // Adjust this if the category navigation is on a different page
  
    //   // Check if category navigation links are displayed
    //   cy.get('.category-nav').should('be.visible');
    //   cy.get('.category-link').should('have.length.greaterThan', 0);
  
    //   // Assuming categories are dynamically loaded, we'll interact with one category
    //   cy.get('.category-link').first().click(); // Click on the first category link
  
    //   // Verify that the URL contains the category ID (indicating that the correct category page is loaded)
    //   cy.url().should('include', '/category/');
  
    //   // Wait for the products to load, ensuring the product list is displayed
    //   cy.get('ul').should('be.visible'); // Ensure the product list (ul element) is visible
    //   cy.get('.product-card').should('have.length.greaterThan', 0); // Ensure there are products listed
  
    //   // Check that each product card has a link to the product detail page
    //   cy.get('.product-card').each(($card) => {
    //     cy.wrap($card)
    //       .find('a.product-link') // Find the <a> tag with class "product-link"
    //       .should('have.attr', 'href') // Ensure it has an 'href' attribute
    //       .and('include', '/product/'); // Verify the 'href' includes the product's path
    //   });
  
    //   // Optionally: Check if the hover behavior is working for product images (if relevant to your test)
    //   cy.get('.product-card').first().find('.product-image').trigger('mouseenter'); // Hover over the first product image
    //   cy.get('.product-card').first().find('img').should('have.attr', 'src').and('not.equal', 'default-image-url.jpg'); // Ensure the image source changes on hover
    // });
  
    it('Views product details', () => {
      // Visit the homepage or the page where products are listed
      cy.visit('/'); // Adjust this if the product list is on a different page
    
      // Ensure the product list is visible and contains products
      cy.get('.product-card').should('have.length.greaterThan', 0); // Check if products are listed
    
      // Click on the first product link to view its details
      cy.get('.product-card').first().find('a.product-link').click(); // Click on the first product link
    
      // Verify that the URL changes to the product detail page URL
      cy.url().should('include', '/product/'); // Ensure the URL contains '/product/{id}'
    
      // Check if product name, price, and description are displayed
      cy.get('.product-info').should('be.visible'); // Check for product name
      cy.get('.price').should('be.visible'); // Check for product price
      cy.get('.description').should('be.visible'); // Check for product description
    
      // Optionally, check if the product image is visible and properly displayed
      cy.get('.main-image').should('be.visible'); // Check product image
    
      // Use a more flexible assertion for product name
      cy.get('.product-info').should('include.text', 'Áo khoác unisex phối mũ'); // Use a partial match or more flexible text
    
      // For price, ensure it follows the expected format or includes the actual price
      cy.get('.price').should('include.text', '3.19 VND'); // Replace with actual expected price or format
    
      // If the product has multiple images, check if the correct image is displayed
      cy.get('.main-image').should('have.attr', 'src').and('not.include', 'default-image-url.png'); // Ensure image is different from default
    
      // Optionally, you can test if the "Add to Cart" button works on the product detail page
      cy.get('.add-to-cart-button').should('be.visible'); // Ensure the "Add to Cart" button is visible
      cy.get('.add-to-cart-button').click(); // Simulate clicking the button to add the product to the cart
    
      // Verify that the product was added to the cart (e.g., show cart notification, or check localStorage/cart)
      cy.get('.cart-notification').should('be.visible'); // You can customize this based on your app's behavior
    });    

//   it('Adds a product to the cart', () => {
//     // Click vào sản phẩm để xem chi tiết
//     cy.get('.product-card').first().click();

//     // Kiểm tra nút "Thêm vào giỏ hàng" và click vào đó
//     cy.get('.add-to-cart-button').click();

//     // Kiểm tra giỏ hàng đã có sản phẩm
//     cy.get('.cart').click(); // Click vào giỏ hàng
//     cy.get('.cart-item').should('have.length.greaterThan', 0); // Kiểm tra có ít nhất một sản phẩm trong giỏ
//   });

//   it('Completes checkout and saves order to Firebase', () => {
//     // Thêm sản phẩm vào giỏ hàng
//     cy.get('.product-card').first().click();
//     cy.get('.add-to-cart-button').click();

//     // Truy cập vào giỏ hàng và kiểm tra sản phẩm trong giỏ
//     cy.get('.cart').click();
//     cy.get('.cart-item').should('have.length.greaterThan', 0); // Kiểm tra giỏ có sản phẩm

//     // Tiến hành thanh toán (checkout)
//     cy.get('.checkout-button').click(); // Giả sử có nút checkout

//     // Kiểm tra URL có chứa '/checkout'
//     cy.url().should('include', '/checkout');
    
//     // Điền thông tin thanh toán
//     cy.get('#name').type('Nguyễn Văn A');  // Nhập tên
//     cy.get('#address').type('123 Đường ABC'); // Nhập địa chỉ
//     cy.get('#payment-method').select('Credit Card'); // Chọn phương thức thanh toán

//     // Hoàn tất đơn hàng
//     cy.get('.complete-order-button').click(); // Giả sử có nút hoàn tất đơn hàng

//     // Kiểm tra trang xác nhận đơn hàng
//     cy.get('.order-confirmation').should('be.visible');
//     cy.get('.order-id').should('exist'); // Kiểm tra mã đơn hàng

//     // Kiểm tra đơn hàng đã được lưu vào Firebase (thông qua phần tử trên UI hoặc API)
//     // Giả sử API lưu đơn hàng vào Firebase và bạn có thể kiểm tra điều này thông qua phản hồi UI
//   });

});
