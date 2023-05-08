# Ứng dụng quản lí thú cưng
# Pet Manager - Assignment 02

Author: Phạm Quang Hoàn
Dự án Assignment 02 - PRF192x_2.1-A_VN Kỹ thuật lập trình với Javascript

Giới thiệu và Tính năng
1. Hệ thống CSDL
- Bảng pets: Lưu trữ thông tin về thú nuôi
- Bảng breeds: Lưu trữ thông tin về giống / chủng loại
- Loại lưu trữ: localStorage

2. Aside bar ( Bổ sung Animation cho Sidebar )
- Mặc định là giao diện thu gọn, khi người dùng bấm vào phím mở rộng hoặc phần trắng của aside, aside sẽ mở rộng ( điều này không có tính năng đảo ngược )
- Giữ trạng thái aside, nếu người dùng đặt aside là mở, tải lại trang vẫn sẽ mở
- Tự động thu gọn aside khi kích thước màn hình thay đổi

3. Trang index.html
- Có thể thêm PET mới, tính năng thêm PET mới sẽ bị vô hiệu hóa nếu chưa có chủng loại nào được tạo
- Không thể thêm PET trùng lặp ID
- BMI sẽ tự động được tính toán khi thêm pet
- Có thể xóa PET
- Bộ lọc nhanh

4. Trang tìm kiếm - bộ lọc nâng cao
- Lọc tất cả PET dựa trên tiêu chí nhập vào
- Dữ liệu nhập vào không phân biệt viết hoa hay viết thường
- Ngăn chặn việc tìm kiếm rỗng

5. Chỉnh sửa danh sách thú

6. Trang breed.html - quản lí giống
- Có thể thêm / sửa / xóa giống
- Tự cập nhật số lượng thú nuôi trong giống đó
- Nếu xáo chủng loại, tất cả thú nuôi trong chủng loại đó cũng bị xóa
- Nếu đổi tên chủng loại, tất cả thú nuôi trong chủng loại cũng được thay đổi
- Note: Không thể thay đổi type

7. Trang quản lí dữ liệu

8. Tìm hiểu về Export và Import
- Có thể export tại search và data
- Dữ liệu export có thể tùy chọn
- File import phải là JSON
- Với mỗi thú cưng được import:
  + Tạo chủng loại mới nếu chủng loại chưa tồn tại
  + Tự động cập nhập id chủng loại tương ứng và bổ sung vào chủng loại đó
  + Nếu id thú cưng đã tồn tại thì sẽ bị ghi đè