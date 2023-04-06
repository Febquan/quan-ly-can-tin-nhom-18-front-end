#Nhập môn công nghệ phần mềm
Nhóm 18
20120553-20120567-20120565-20120581
all works was done by me ! 

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
	-env file :
		VUE_APP_BACK_END_URL=http://localhost:8081
		# VUE_APP_BACK_END_URL=https://can-tin-nhom-18-backend.onrender.com
		
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


SOME PREVIEW :

ADMID PAGE: 
-Các chức năng ở bên trái đều có thể chạy được 
chức năng nổi bật:
	-Cập nhập đơn hàng theo thời gian thực dùng socket.io.
	-Thanh toán qr.
	-Kết toán tự động theo ngày/ tháng, dựa trên những sản phẩm đã bán
	-Tự động quản lý kho, khách hàng mua trực tiếp từ kho hàng, có quản lý hết hạn, quản lý hết hàng...
	
![image](https://user-images.githubusercontent.com/77763474/230498608-479a92a3-70d0-4a13-b494-5f7e8bb217f6.png)


Client PAGE:
-Chức năng đặt hàng cơ bản, tự tính tiền, thanh toán ....
chức năng nổi bật:
	-Email nhận đơn hàng không cần phải đăng nhập
	-Đặt lịch tương laim, quản lý kho hàng + món ăn chuẩn bị cho admin trong ngày tương lai
	-Quản lý các đơn đã đặt qua email, nhận thông báo thời gian thực đơn hàng đã xong dùng socket.io

![image](https://user-images.githubusercontent.com/77763474/230500024-8a4f06a9-18ed-4722-843f-1fbe28ea5dab.png)
