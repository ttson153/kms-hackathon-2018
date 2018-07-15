# DỰ ÁN `THANOS`

## Tổng quan
Server được viết bằng Node.js, sử dụng framework Express, database deploy trên MongoDB
Tính năng của hệ thống:
  * Cho phép chia sẽ thông tin việc làm thời vụ. Giúp kết nối giữ người sử dụng lao động và người lao động thời vụ
  * Tìm kiếm công việc phù hợp dữ trên kinh nghiệm hả kỹ năng của người lao động
  * Để hạng chế việc phân loại các kĩ năng trong phân mô tả công việc. Hệ thống sử dụng hệ thống đánh hash tags.
  
## Kiến trúc phần mềm

Phần mềm thiết kế theo mô hình client-server được thiết kể để hoạt động trên môi trường web.


## Cài đặt

Các thư viện và framework:
```
    "cookie-parser": "^1.4.3",
    "body-parser": "^1.18.3",
    "elasticsearch": "^15.1.1",
    "escape-html": "^1.0.3",
    "express": "^4.16.3",
    "mongodb": "^3.0.1"
```

Cài đặt các thư viện phụ thuộc:
```
cd <root of project> 
npm install
```

## Chạy server trên localhost:
```
node index.js
```

Instance server sẽ chạy trên localhost, listen ở port 3000, app client
