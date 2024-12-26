describe('Admin Login and Dashboard Tests', () => {
    beforeEach(() => {
      cy.visit('/login'); // Truy cập vào trang đăng nhập
    });
  // sửa đơn hàng và đảm bảo có tk user
    it('Đăng nhập admin thành công', () => {
      // Nhập email và mật khẩu
      cy.get('input[placeholder="Email"]').type('admin@gmail.com');
      cy.get('input[placeholder="Mật khẩu"]').type('admin123');
  
      // Nhấn nút đăng nhập
      cy.get('button[type="submit"]').click();
  
      // Kiểm tra chuyển hướng đến trang dashboard
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
  
    it('Đăng nhập admin thất bại', () => {
      // Nhập sai email và mật khẩu
      cy.get('input[placeholder="Email"]').type('wrong@gmail.com');
      cy.get('input[placeholder="Mật khẩu"]').type('wrong123');
  
      // Nhấn nút đăng nhập
      cy.get('button[type="submit"]').click();
  
      // Kiểm tra hiển thị thông báo lỗi
      cy.get('.error').should('contain', 'Thông tin đăng nhập không chính xác!');
    });
  
    it('Kiểm tra giao diện dashboard', () => {
      // Đăng nhập trước khi kiểm tra
      cy.get('input[placeholder="Email"]').type('admin@gmail.com');
      cy.get('input[placeholder="Mật khẩu"]').type('admin123');
      cy.get('button[type="submit"]').click();
  
      // Kiểm tra header hiển thị logo
      cy.get('.logo-img').should('be.visible');
  
      // Kiểm tra danh sách menu sidebar
      cy.get('nav.sidebar ul li').should('have.length', 5);
      cy.get('nav.sidebar ul li').eq(0).should('contain', 'Quản lý danh mục');
      cy.get('nav.sidebar ul li').eq(1).should('contain', 'Quản lý sản phẩm');
      cy.get('nav.sidebar ul li').eq(2).should('contain', 'Quản lý khách hàng');
      cy.get('nav.sidebar ul li').eq(3).should('contain', 'Quản lý đơn hàng');
      cy.get('nav.sidebar ul li').eq(4).should('contain', 'Quản lý banner');
    });
  
    describe('Admin Dashboard Banner Management', () => {
        beforeEach(() => {
          cy.visit('/login');
          cy.get('input[type=email]').type('admin@gmail.com');
          cy.get('input[type=password]').type('admin123');
          cy.get('button[type=submit]').click();
          cy.contains('Quản lý banner').click();
        });
      
        it('should add a new banner', () => {
          cy.contains('Thêm mới').click();
          cy.get('input[name=image]').type('https://file.hstatic.net/200000642007/file/1920x640_9f62e122e6dc4699a4a2d6c7db6440f3.jpg');
          cy.get('input[name=description]').type('Mô tả banner mới');
        });
      
        it('should edit an existing banner', () => {
          cy.contains('Sửa').first().click();
          cy.get('input[name=image]').clear().type('https://example.com/banner-updated.jpg');
          cy.get('input[name=description]').clear().type('Mô tả banner cập nhật');
          cy.contains('Cập nhật').click();
          cy.contains('Mô tả banner cập nhật').should('exist');
        });
      
        it('should delete an existing banner', () => {
          cy.contains('Thêm mới').click();
          cy.get('input[name=image]').type('https://example.com/banner.jpg');
          cy.get('input[name=description]').type('Mô tả banner mới');
          cy.contains('Thêm mới').click();
          cy.contains('Mô tả banner mới').should('exist');
          cy.contains('Xóa').first().click();
        //   cy.contains('Không có banner nào.', { timeout: 60000 }).should('exist');
        });
      
        it('should logout from admin dashboard', () => {
          cy.contains('Đăng xuất').click();
          cy.url().should('include', '/login');
        });
      });

    describe('CustomersView Tests', () => {
        beforeEach(() => {
          // Visit login page and log in
          cy.visit('/login');
          cy.get('input[type=email]').type('admin@gmail.com');
          cy.get('input[type=password]').type('admin123');
          cy.get('button[type=submit]').click();
      
          // Navigate to the Customers management section
          cy.contains('Quản lý khách hàng').click();
        });
      
        it('should fetch and display customers', () => {
          // Đảm bảo thông báo tải dữ liệu biến mất
          cy.contains('Đang tải dữ liệu...').should('not.exist');
          
          // Đảm bảo bảng danh sách khách hàng được hiển thị
          cy.get('table').should('exist'); 
          
          // Kiểm tra các cột tiêu đề
          cy.get('th').contains('ID').should('exist');
          cy.get('th').contains('Tên người dùng').should('exist');
          cy.get('th').contains('Email').should('exist');
          cy.get('th').contains('Số điện thoại').should('exist');
          cy.get('th').contains('Địa chỉ').should('exist');
          cy.get('th').contains('Vai trò').should('exist');
          cy.get('th').contains('Thao tác').should('exist');
        
          // Kiểm tra một hàng dữ liệu mẫu (nếu đã có khách hàng trên Firestore)
          cy.get('tbody tr').should('have.length.greaterThan', 0); // Ít nhất 1 khách hàng tồn tại
          cy.get('tbody tr').first().within(() => {
            cy.get('td').eq(1).should('not.be.empty'); // Tên người dùng
            cy.get('td').eq(2).should('not.be.empty'); // Email
            cy.get('td').eq(3).should('not.be.empty'); // Số điện thoại hoặc "Chưa cập nhật"
            cy.get('td').eq(4).should('not.be.empty'); // Địa chỉ hoặc "Chưa cập nhật"
            cy.get('td').eq(5).should('not.be.empty'); // Vai trò
          });
        });        
      
        it('should delete a customer', () => {
          cy.get('tbody tr').should('have.length.greaterThan', 0); // Ít nhất 1 khách hàng tồn tại
          cy.get('tbody tr').first().within(() => {
            cy.get('td').eq(1).should('not.be.empty'); // Tên người dùng
            cy.get('td').eq(2).should('not.be.empty'); // Email
            cy.get('td').eq(3).should('not.be.empty'); // Số điện thoại hoặc "Chưa cập nhật"
            cy.get('td').eq(4).should('not.be.empty'); // Địa chỉ hoặc "Chưa cập nhật"
            cy.get('td').eq(5).should('not.be.empty'); // Vai trò
          });
          // Click the delete button on the first customer
          cy.contains('Xóa').first().click();
      
          // Confirm the deletion by accepting the confirm dialog
          cy.on('window:confirm', () => true);
      
          // After deletion, check for the "No customers" message (assuming it's displayed)
          cy.contains('Không có khách hàng nào.').should('exist');
        });
      });
      
    describe('CategoriesView Tests', () => {
      beforeEach(() => {
          // Visit the admin dashboard and assume the admin is logged in
          cy.visit('/');  // Adjust this URL based on your actual routing setup
      });
  
      it('should fetch and display categories', () => {
          cy.get('table').should('exist'); 
          // Kiểm tra các cột tiêu đề
          cy.get('th').contains('ID').should('exist');
          cy.get('th').contains('Tên danh mục').should('exist');
          cy.get('th').contains('Mô tả').should('exist');
          cy.get('th').contains('Thao tác').should('exist');
        
          // Kiểm tra một hàng dữ liệu mẫu (nếu đã có danh mục trên Firestore)
          cy.get('tbody tr').should('have.length.greaterThan', 0); // Ít nhất 1 danh mục tồn tại
          cy.get('tbody tr').first().within(() => {
            cy.get('td').eq(1).should('not.be.empty'); // Tên danh mục
            cy.get('td').eq(2).should('not.be.empty'); // Mô tả
          });
      });
  
      it('should add a new category', () => {
          cy.contains('Thêm mới').click(); // Trigger the "Add New" button
          cy.get('#new-category-id').type('cat_01');  // Enter category ID
          cy.get('#new-category-name').type('Danh mục Test');  // Enter category name
          cy.get('#new-category-description').type('This is a test description for category.');  // Enter description
          cy.contains('Lưu').click();  // Click "Save"
          cy.contains('Danh mục Test').should('exist'); // Verify the category was added
      });
  
      it('should edit a category', () => {
          cy.contains('Sửa').first().click(); // Click edit button for the first category
          cy.get('input[placeholder="Tên danh mục"]').clear().type('Danh mục đã sửa'); // Update name
          cy.get('input[placeholder="Mô tả"]').clear().type('Mô tả đã sửa'); // Update description
          cy.contains('Cập nhật').click(); // Click update button
          cy.contains('Danh mục đã sửa').should('exist'); // Verify updated name
          cy.contains('Mô tả đã sửa').should('exist'); // Verify updated description
      });
  
      it('should delete a category based on rows count', () => {
        // Đếm số hàng ban đầu
        cy.get('tbody tr').then((rowsBefore) => {
          const rowCountBefore = rowsBefore.length;
      
          // Thêm danh mục mới
          cy.contains('Thêm mới').click(); 
          cy.get('#new-category-id').type('cat_02');  
          cy.get('#new-category-name').type('Danh mục Test1');  
          cy.get('#new-category-description').type('This is a test description for category.');  
          cy.contains('Lưu').click();  
      
          // Xác nhận danh mục đã thêm
          cy.contains('Danh mục Test1').should('exist'); 
      
          // Xóa danh mục
          cy.contains('Xóa').first().click(); 
          cy.on('window:confirm', () => true); 
      
          // Đợi dữ liệu cập nhật rồi kiểm tra số hàng giảm
          cy.get('tbody tr').should('have.length', rowCountBefore);
        });
      });      
  });
  
        describe('OrdersView Tests', () => {
            beforeEach(() => {
                // Visit the admin dashboard and assume the admin is logged in
                cy.visit('/');  // Adjust this URL based on your actual routing setup
                cy.contains('Quản lý đơn hàng').click();
              });
          it('should render orders table', () => {
            cy.get('table').should('exist');
            cy.get('th').should('contain', 'ID Đơn hàng');
            cy.get('th').should('contain', 'Trạng thái');
          });
      
          it('should delete an order', () => {
            // Ensure the order exists
            cy.contains('ORD756763').should('exist');
          
            // Delete the order
            cy.contains('ORD756763')
              .parent() // Target the parent row
              .find('button').contains('Xóa')
              .click();
          
            // Confirm popup
            cy.on('window:confirm', () => true);
          
            // Wait for backend response and validate UI
            cy.wait(1000); // Optional, in case of UI delay
            cy.contains('ORD756763').should('not.exist');
          });          
      
          it('should update the status of an order', () => {
            cy.get('button').contains('Xác nhận').first().click(); // Click the "Xác nhận" button on the first order
            cy.get('td').contains('Đã xác nhận').should('exist'); // Assert that the status is updated
          });
        });
      
        describe('ProductsView Tests', () => {
            beforeEach(() => {
                // Visit the admin dashboard and assume the admin is logged in
                cy.visit('/');  // Adjust this URL based on your actual routing setup
                cy.contains('Quản lý sản phẩm').click();
              });
          it('should render the products table', () => {
            cy.get('table').should('exist');
            cy.get('th').should('contain', 'Tên sản phẩm');
            cy.get('th').should('contain', 'Giá');
          });
      
          it('should add a new product', () => {
            cy.get('button').contains('Thêm mới').click(); // Click the "Add New" button
            cy.get('input[placeholder="ID sản phẩm"]').type('P123');
            cy.get('input[placeholder="Tên sản phẩm"]').type('Sản phẩm mới');
            cy.get('input[placeholder="Giá"]').type('100000');
            cy.get('input[placeholder="Giá giảm"]').type('90000');
            cy.get('button').contains('Lưu').click(); // Click the save button
            cy.get('table tbody tr').its('length').should('be.gte', 1);
            cy.get('td').contains('Sản phẩm mới').should('exist');
          });
      
          it('should edit the first product successfully', () => {
            // Đảm bảo bảng dữ liệu sản phẩm đã tải xong
            cy.get('table tbody tr', { timeout: 10000 }).should('have.length.at.least', 1);
            cy.get('table tbody tr').first().as('firstProductRow'); // Alias hàng sản phẩm đầu tiên
            // Nhấn vào nút "Sửa" của sản phẩm đầu tiên
            cy.get('@firstProductRow').find('button').contains('Sửa').click();
        
            // Đợi form chỉnh sửa hiển thị
            cy.get('div.add-new-form').scrollIntoView().should('be.visible');
        
            // Chỉnh sửa các trường dữ liệu
            cy.get('input[placeholder="Tên sản phẩm"]').clear().type('Updated Product Name');
            cy.get('input[placeholder="Giá"]').clear().type('300');
            cy.get('input[placeholder="Giá giảm"]').clear().type('250');
            cy.get('textarea[placeholder="Mô tả"]').clear().type('Mô tả đã cập nhật');
            cy.get('input[placeholder="Số lượng tồn kho"]').clear().type('200');
            cy.get('input[placeholder="ID danh mục"]').clear().type('updated-category-id');
        
            // Nhấn nút cập nhật
            cy.get('button').contains('Cập nhật').click();
        
            // Kiểm tra dữ liệu đã được cập nhật trong bảng
            cy.get('@firstProductRow').within(() => {
              cy.contains('Updated Product Name').should('exist'); // Kiểm tra tên
              cy.contains('300').should('exist'); // Kiểm tra giá
              cy.contains('250').should('exist'); // Kiểm tra giá giảm
              cy.contains('Mô tả đã cập nhật').should('exist'); // Kiểm tra mô tả
              cy.contains('200').should('exist'); // Kiểm tra tồn kho
              cy.contains('updated-category-id').should('exist'); // Kiểm tra danh mục
            });
          });

          it('should delete a product', () => {
            cy.get('button').contains('Thêm mới').click();
            cy.get('input[placeholder="ID sản phẩm"]').type('P125');
            cy.get('input[placeholder="Tên sản phẩm"]').type('Sản phẩm để xóa');
            cy.get('input[placeholder="Giá"]').type('200000');
            cy.get('input[placeholder="Giá giảm"]').type('180000');
            cy.get('button').contains('Lưu').click();
            cy.get('button').contains('Xóa').first().click(); // Click the delete button
            cy.on('window:confirm', () => true); // Bypass any confirm dialogs if present
          });
        }); 
  });
