#Nhập môn công nghệ phần mềm
Nhóm 18
20120553-20120567-20120565-20120581

Cách setup đồ án

1. Chạy online :
	- Chỉ cần chạy đường link : https://can-tin-nhom-18-frontend.netlify.app/
	- Tài khoản Admin và tài khoản user :

		+ Tài khoản: febquan1@gmail.com
		+ Mật khẩu: Hello123
			(chữ H trong hello viết hoa)
		+ Có thể tạo tài khoản User cho riêng mình, không thể tạo tài khoản Admin

	-Lưu ý khi chạy online :
		+ Vì chúng em deploy free trên các nền tảng deploy nên có thể sẽ chậm khi đăng nhập lần đầu tiên ( 2-3 phút ) -> không phải lỗi
			vì backend sau một hồi lâu không dùng sẽ bị nền tảng đưa vào trạng thái indie
		+ Và vì deploy free nên các task được hẹn giờ để chạy, CÓ THỂ sẽ không được chạy vì backend ở trong trạng thái indie
			- xóa đơn hàng sau một ngày vào 6h chiều
			- Cập nhập lại doanh số thống kê vào 6h chiều
			- Cập nhập lại số lượng món ăn theo ngày vào 12h đêm
			v.v

2.Chạy offline :
	-Trong thư mục source code sẽ có front-end và back-end
	-Chạy back-end trước:
		+Mở thư mục back-end bằng Vscode và gõ :
			npm install
			npm run start:dev
	-Chạy front-end :
		+Mở thư mục front-end bằng Vscode và gõ :
			npm install
			npm run serve
		+ front-end sẽ được chạy trên :
			http://localhost:8080/

	-Tài khoản admin và user sẽ giống như trên
