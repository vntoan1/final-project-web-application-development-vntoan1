const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3001",  // Đặt URL cơ bản cho user
    defaultCommandTimeout: 30000, // Thời gian chờ mặc định cho các lệnh
    // pageLoadTimeout: 65000, // Thời gian chờ tải trang
    video: true, // Bật ghi video trong quá trình kiểm thử
    screenshotsFolder: "cypress/screenshots", // Thư mục lưu ảnh chụp khi thất bại
    viewportWidth: 1280, // Kích thước chiều rộng viewport
    viewportHeight: 720, // Kích thước chiều cao viewport
    browser: "chrome", // Sử dụng Chrome thay vì Electron
  },
});
