---
title: "Nhập môn Networking Basics: Mô hình OSI và TCP/IP"
date: 2023-10-12
draft: false
category: "CƠ BẢN"
tags: ["networking", "osi", "tcp/ip", "cơ bản"]
image: "https://picsum.photos/seed/net1/600/400"
summary: "Tìm hiểu chi tiết về mô hình OSI 7 tầng và bộ giao thức TCP/IP - nền tảng cốt lõi của mạng máy tính hiện đại. Bài viết phù hợp cho người mới bắt đầu học networking."
---

## Giới thiệu

Trong thế giới mạng máy tính, việc hiểu rõ cách các thiết bị giao tiếp với nhau là vô cùng quan trọng. Hai mô hình được sử dụng rộng rãi nhất là **mô hình OSI** (Open Systems Interconnection) và **bộ giao thức TCP/IP**. Bài viết này sẽ giúp bạn nắm vững những kiến thức nền tảng này.

## Mô hình OSI - 7 tầng cơ bản

Mô hình OSI được tổ chức ISO phát triển vào năm 1984, chia quá trình truyền thông mạng thành 7 tầng riêng biệt:

### 1. Physical Layer (Tầng Vật lý)
- **Chức năng**: Truyền tải các bit dữ liệu qua môi trường vật lý (cáp đồng, cáp quang, sóng radio)
- **Thiết bị**: Hub, Repeater, Cables
- **Đặc điểm**: Chuyển đổi dữ liệu thành tín hiệu điện, quang học hoặc sóng radio

```
Ví dụ: Khi bạn cắm dây mạng RJ-45 vào máy tính, tầng Physical sẽ 
xử lý việc truyền tín hiệu điện qua 8 sợi dây đồng trong cáp.
```

### 2. Data Link Layer (Tầng Liên kết dữ liệu)
- **Chức năng**: Đóng gói dữ liệu thành frame, kiểm soát lỗi và điều khiển luồng
- **Giao thức**: Ethernet, Wi-Fi (802.11), PPP
- **Địa chỉ**: MAC Address (48-bit)
- **Thiết bị**: Switch, Bridge

**Cấu trúc Ethernet Frame:**
```
|Preamble|Destination MAC|Source MAC|Type|Data|FCS|
```

### 3. Network Layer (Tầng Mạng)
- **Chức năng**: Định tuyến gói tin từ nguồn đến đích qua nhiều mạng
- **Giao thức**: IP (IPv4/IPv6), ICMP, OSPF, BGP
- **Địa chỉ**: IP Address
- **Thiết bị**: Router, Layer 3 Switch

**Ví dụ IPv4 Packet Header:**
```
Version | IHL | ToS | Total Length
Identification | Flags | Fragment Offset
TTL | Protocol | Header Checksum
Source IP Address
Destination IP Address
```

### 4. Transport Layer (Tầng Giao vận)
- **Chức năng**: Đảm bảo truyền dữ liệu tin cậy giữa hai host
- **Giao thức chính**:
  - **TCP** (Transmission Control Protocol): Hướng kết nối, đảm bảo tin cậy
  - **UDP** (User Datagram Protocol): Không kết nối, nhanh nhưng không đảm bảo
- **Khái niệm**: Port Number (0-65535)

**So sánh TCP vs UDP:**
| Tiêu chí | TCP | UDP |
|----------|-----|-----|
| Kết nối | Có (3-way handshake) | Không |
| Độ tin cậy | Cao (có ACK) | Thấp |
| Tốc độ | Chậm hơn | Nhanh hơn |
| Sử dụng | HTTP, FTP, SSH | DNS, Streaming, Gaming |

### 5. Session Layer (Tầng Phiên)
- **Chức năng**: Quản lý phiên làm việc giữa các ứng dụng
- **Giao thức**: NetBIOS, PPTP, RPC

### 6. Presentation Layer (Tầng Trình bày)
- **Chức năng**: Mã hóa, giải mã, nén dữ liệu
- **Chức năng**: SSL/TLS, JPEG, MPEG

### 7. Application Layer (Tầng Ứng dụng)
- **Chức năng**: Giao diện giữa người dùng và mạng
- **Giao thức**: HTTP, FTP, SMTP, DNS, SSH, Telnet

## Mô hình TCP/IP

Mô hình TCP/IP (còn gọi là Internet Protocol Suite) là mô hình thực tế được sử dụng trên Internet, gồm 4 tầng:

### 1. Network Access Layer
- Tương ứng với Physical + Data Link trong OSI
- Xử lý việc truyền dữ liệu trên phương tiện vật lý cụ thể

### 2. Internet Layer
- Tương ứng Network Layer trong OSI
- Giao thức chính: **IP, ICMP, ARP**

**Ví dụ IPv4 Address:**
```
192.168.1.100/24
- Network: 192.168.1.0
- Host: 100
- Subnet Mask: 255.255.255.0
- Broadcast: 192.168.1.255
```

### 3. Transport Layer
- Giống Transport Layer trong OSI
- TCP/UDP

### 4. Application Layer
- Kết hợp Session, Presentation, Application của OSI

## So sánh OSI vs TCP/IP

```
OSI Model              TCP/IP Model
-----------            -------------
Application   ------>  Application
Presentation  ------>  
Session       ------>  
-----------            -------------
Transport     ------>  Transport
-----------            -------------
Network       ------>  Internet
-----------            -------------
Data Link     ------>  Network Access
Physical      ------>  
```

## Quá trình truyền dữ liệu

### Encapsulation (Đóng gói dữ liệu)

Khi gửi dữ liệu, mỗi tầng thêm header riêng:

1. **Application**: Data
2. **Transport**: Segment (Data + TCP/UDP Header)
3. **Network**: Packet (Segment + IP Header)
4. **Data Link**: Frame (Packet + Ethernet Header + Trailer)
5. **Physical**: Bits

### De-encapsulation (Mở gói dữ liệu)

Khi nhận dữ liệu, quá trình ngược lại:

```
Bits -> Frame -> Packet -> Segment -> Data
```

## Ví dụ thực tế: Truy cập website

Khi bạn truy cập `https://google.com`:

1. **Application Layer**: Trình duyệt tạo HTTP Request
2. **Transport Layer**: TCP thiết lập kết nối (3-way handshake)
3. **Network Layer**: IP định tuyến gói tin đến server Google
4. **Data Link**: Ethernet đóng gói thành frame
5. **Physical**: Truyền tín hiệu qua cáp mạng

## Thực hành với Wireshark

Để hiểu rõ hơn, bạn nên sử dụng Wireshark để bắt và phân tích gói tin:

```bash
# Cài đặt Wireshark trên Windows/Mac/Linux
# Sau đó bắt gói tin trên interface mạng đang sử dụng
```

**Bài tập**: Hãy bắt gói tin khi ping đến google.com và quan sát:
- ICMP Request/Reply
- IP Header (TTL, Source/Dest IP)
- Ethernet Frame

## Tầm quan trọng của việc hiểu OSI/TCP-IP

- **Troubleshooting**: Xác định vấn đề ở tầng nào
- **Security**: Hiểu cách tấn công và phòng thủ ở từng tầng
- **Thiết kế mạng**: Lựa chọn thiết bị và giao thức phù hợp
- **Học các giao thức nâng cao**: OSPF, BGP, MPLS, SDN

## Kết luận

Hiểu rõ mô hình OSI và TCP/IP là nền tảng không thể thiếu cho bất kỳ ai muốn trở thành Network Engineer. Mặc dù OSI là mô hình lý thuyết và TCP/IP là mô hình thực tế, việc nắm vững cả hai sẽ giúp bạn có cái nhìn toàn diện về cách Internet hoạt động.

Trong bài viết tiếp theo, chúng ta sẽ đi sâu vào **Subnetting và VLSM** - kỹ năng quan trọng cho việc thiết kế mạng IP.

## Tài liệu tham khảo

- RFC 791: Internet Protocol
- RFC 793: Transmission Control Protocol
- Cisco Networking Academy: Networking Basics
- Computer Networks - Andrew S. Tanenbaum

---

*Bạn có câu hỏi nào về mô hình OSI hay TCP/IP? Hãy để lại comment hoặc liên hệ với mình qua trang [Liên hệ](/contact/)!*
