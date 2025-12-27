---
title: "Subnetting & VLSM: Bí kíp chia mạng hiệu quả"
date: 2023-11-01
draft: false
category: "CƠ BẢN"
tags: ["subnetting", "vlsm", "ip-addressing", "networking", "ccna"]
image: "/images/post-05-subnetting-vlsm.png"
summary: "Hướng dẫn chi tiết về Subnetting và Variable Length Subnet Masking (VLSM) - kỹ năng bắt buộc cho mọi network engineer. Bao gồm công thức, ví dụ thực tế và bài tập."
---

## Giới thiệu

Subnetting là kỹ năng quan trọng nhất mà một network engineer cần có. Nó giúp:
- **Tối ưu hóa** việc sử dụng IP addresses
- **Tăng bảo mật** bằng cách chia nhỏ broadcast domains
- **Cải thiện hiệu suất** mạng
- **Quản lý** địa chỉ IP hiệu quả hơn

## IP Address Structure

### IPv4 Address Format

Một địa chỉ IPv4 có **32 bits**, chia làm 4 octets:

```
192.168.1.100
 |   |   |  |
 8   8   8  8  bits

Binary: 11000000.10101000.00000001.01100100
```

### Các lớp IP (Classful Addressing)

| Class | Range | Default Mask | CIDR | Hosts |
|-------|-------|--------------|------|-------|
| A | 1.0.0.0 - 126.255.255.255 | 255.0.0.0 | /8 | 16,777,214 |
| B | 128.0.0.0 - 191.255.255.255 | 255.255.0.0 | /16 | 65,534 |
| C | 192.0.0.0 - 223.255.255.255 | 255.255.255.0 | /24 | 254 |
| D | 224.0.0.0 - 239.255.255.255 | - | - | Multicast |
| E | 240.0.0.0 - 255.255.255.255 | - | - | Reserved |

### Private IP Ranges

```
Class A: 10.0.0.0/8        (10.0.0.0 - 10.255.255.255)
Class B: 172.16.0.0/12     (172.16.0.0 - 172.31.255.255)
Class C: 192.168.0.0/16    (192.168.0.0 - 192.168.255.255)
```

## Subnet Mask

### Subnet Mask là gì?

Subnet mask xác định phần nào của IP address là **Network** và phần nào là **Host**.

```
IP Address:    192.168.1.100
Subnet Mask:   255.255.255.0

Binary:
IP:     11000000.10101000.00000001.01100100
Mask:   11111111.11111111.11111111.00000000
        [---- Network ----][- Host -]
```

### CIDR Notation

| Subnet Mask | CIDR | Binary Representation | Usable Hosts |
|-------------|------|-----------------------|--------------|
| 255.255.255.255 | /32 | 11111111.11111111.11111111.11111111 | 0 |
| 255.255.255.254 | /31 | 11111111.11111111.11111111.11111110 | 0 (P2P) |
| 255.255.255.252 | /30 | 11111111.11111111.11111111.11111100 | 2 |
| 255.255.255.248 | /29 | 11111111.11111111.11111111.11111000 | 6 |
| 255.255.255.240 | /28 | 11111111.11111111.11111111.11110000 | 14 |
| 255.255.255.224 | /27 | 11111111.11111111.11111111.11100000 | 30 |
| 255.255.255.192 | /26 | 11111111.11111111.11111111.11000000 | 62 |
| 255.255.255.128 | /25 | 11111111.11111111.11111111.10000000 | 126 |
| 255.255.255.0 | /24 | 11111111.11111111.11111111.00000000 | 254 |

## Công thức Subnetting

### 1. Số Subnets

```
Number of Subnets = 2^n
(n = số bits mượn từ host portion)
```

### 2. Số Hosts per Subnet

```
Number of Hosts = 2^h - 2
(h = số bits còn lại cho host, -2 cho Network và Broadcast)
```

### 3. Block Size

```
Block Size = 256 - Subnet Mask Value (trong octet interesting)
```

## Bài toán Subnetting cơ bản

### Ví dụ 1: Chia mạng /24 thành 4 subnets

**Đề bài:** Chia 192.168.1.0/24 thành 4 subnets bằng nhau.

**Giải:**

1. **Xác định số bits cần mượn:**
   - Cần 4 subnets → 2^n ≥ 4 → n = 2 bits
   - New mask: /24 + 2 = /26

2. **Tính số hosts per subnet:**
   - Host bits còn lại: 32 - 26 = 6 bits
   - Hosts = 2^6 - 2 = 62 hosts

3. **Tính block size:**
   - Block size = 256 - 192 = 64
   - (192 là giá trị của octet thứ 4 trong mask 255.255.255.192)

4. **Liệt kê các subnets:**

| Subnet | Network | First Host | Last Host | Broadcast |
|--------|---------|------------|-----------|-----------|
| 1 | 192.168.1.0/26 | 192.168.1.1 | 192.168.1.62 | 192.168.1.63 |
| 2 | 192.168.1.64/26 | 192.168.1.65 | 192.168.1.126 | 192.168.1.127 |
| 3 | 192.168.1.128/26 | 192.168.1.129 | 192.168.1.190 | 192.168.1.191 |
| 4 | 192.168.1.192/26 | 192.168.1.193 | 192.168.1.254 | 192.168.1.255 |

### Ví dụ 2: Thiết kế mạng cho công ty

**Đề bài:** Công ty có 4 phòng ban:
- Sales: 50 users
- IT: 25 users
- HR: 10 users
- Management: 5 users

Được cấp mạng: **192.168.10.0/24**

**Giải theo VLSM:**

1. **Sắp xếp theo thứ tự từ lớn đến nhỏ:**
   - Sales: 50 hosts → cần /26 (62 hosts)
   - IT: 25 hosts → cần /27 (30 hosts)
   - HR: 10 hosts → cần /28 (14 hosts)
   - Management: 5 hosts → cần /29 (6 hosts)

2. **Phân bổ subnets:**

**Sales Department (50 hosts):**
```
Network:    192.168.10.0/26
First Host: 192.168.10.1
Last Host:  192.168.10.62
Broadcast:  192.168.10.63
```

**IT Department (25 hosts):**
```
Network:    192.168.10.64/27
First Host: 192.168.10.65
Last Host:  192.168.10.94
Broadcast:  192.168.10.95
```

**HR Department (10 hosts):**
```
Network:    192.168.10.96/28
First Host: 192.168.10.97
Last Host:  192.168.10.110
Broadcast:  192.168.10.111
```

**Management (5 hosts):**
```
Network:    192.168.10.112/29
First Host: 192.168.10.113
Last Host:  192.168.10.118
Broadcast:  192.168.10.119
```

**Còn lại:** 192.168.10.120 - 192.168.10.255 (dự phòng)

## VLSM (Variable Length Subnet Masking)

VLSM cho phép sử dụng subnet masks khác nhau trong cùng một mạng.

### Ưu điểm của VLSM

1. **Tiết kiệm địa chỉ IP**
2. **Linh hoạt** trong thiết kế
3. **Tối ưu** cho các mạng có kích thước khác nhau
4. **Giảm lãng phí** IP addresses

### Quy trình VLSM

```
1. Liệt kê yêu cầu (từ lớn → nhỏ)
2. Xác định subnet mask phù hợp cho mỗi yêu cầu
3. Phân bổ subnets theo thứ tự
4. Verify không bị overlap
```

### Ví dụ VLSM phức tạp

**Đề bài:** Thiết kế mạng cho 1 chi nhánh công ty với:
- LAN 1: 120 users
- LAN 2: 60 users
- LAN 3: 28 users
- LAN 4: 12 users
- 3 Point-to-Point links (router connections)

**Được cấp:** 172.16.50.0/23

**Giải:**

1. **Sắp xếp yêu cầu:**
   - LAN 1: 120 hosts → /25 (126 hosts)
   - LAN 2: 60 hosts → /26 (62 hosts)
   - LAN 3: 28 hosts → /27 (30 hosts)
   - LAN 4: 12 hosts → /28 (14 hosts)
   - P2P Link 1, 2, 3: 2 hosts each → /30 (2 hosts)

2. **Phân bổ:**

```
LAN 1: 172.16.50.0/25
  Network:   172.16.50.0
  First:     172.16.50.1
  Last:      172.16.50.126
  Broadcast: 172.16.50.127

LAN 2: 172.16.50.128/26
  Network:   172.16.50.128
  First:     172.16.50.129
  Last:      172.16.50.190
  Broadcast: 172.16.50.191

LAN 3: 172.16.50.192/27
  Network:   172.16.50.192
  First:     172.16.50.193
  Last:      172.16.50.222
  Broadcast: 172.16.50.223

LAN 4: 172.16.50.224/28
  Network:   172.16.50.224
  First:     172.16.50.225
  Last:      172.16.50.238
  Broadcast: 172.16.50.239

P2P Link 1: 172.16.50.240/30
  Network:   172.16.50.240
  First:     172.16.50.241
  Last:      172.16.50.242
  Broadcast: 172.16.50.243

P2P Link 2: 172.16.50.244/30
  Network:   172.16.50.244
  First:     172.16.50.245
  Last:      172.16.50.246
  Broadcast: 172.16.50.247

P2P Link 3: 172.16.50.248/30
  Network:   172.16.50.248
  First:     172.16.50.249
  Last:      172.16.50.250
  Broadcast: 172.16.50.251
```

## Route Summarization (Supernetting)

### Tóm tắt routes để giảm routing table

**Ví dụ:** Tóm tắt các networks sau:
```
192.168.0.0/24
192.168.1.0/24
192.168.2.0/24
192.168.3.0/24
```

**Cách làm:**

1. **Chuyển sang binary:**
```
192.168.0.0   = 11000000.10101000.00000000.00000000
192.168.1.0   = 11000000.10101000.00000001.00000000
192.168.2.0   = 11000000.10101000.00000010.00000000
192.168.3.0   = 11000000.10101000.00000011.00000000
```

2. **Tìm common bits:**
```
Common: 11000000.10101000.000000
                               ^ khác nhau từ bit này
```

3. **Summary route:**
```
192.168.0.0/22
(22 bits giống nhau)
```

**Verify:** 192.168.0.0/22 cover từ 192.168.0.0 → 192.168.3.255 ✓

## Python Script: Subnet Calculator

```python
import ipaddress

def subnet_calculator(network, num_subnets=None, hosts_per_subnet=None):
    """
    Tính toán subnets
    """
    try:
        net = ipaddress.ip_network(network, strict=False)
        
        print(f"\n{'='*60}")
        print(f"Original Network: {net}")
        print(f"Netmask: {net.netmask}")
        print(f"Wildcard: {net.hostmask}")
        print(f"Total Addresses: {net.num_addresses}")
        print(f"Usable Hosts: {net.num_addresses - 2}")
        print(f"{'='*60}\n")
        
        if num_subnets:
            # Tính new prefix length
            import math
            bits_needed = math.ceil(math.log2(num_subnets))
            new_prefix = net.prefixlen + bits_needed
            
            if new_prefix > 32:
                print("Error: Cannot create that many subnets")
                return
            
            subnets = list(net.subnets(new_prefix=new_prefix))
            
            print(f"Creating {len(subnets)} subnets with /{new_prefix}:")
            print(f"Hosts per subnet: {subnets[0].num_addresses - 2}\n")
            
            for i, subnet in enumerate(subnets, 1):
                hosts = list(subnet.hosts())
                print(f"Subnet {i}: {subnet}")
                print(f"  Network:   {subnet.network_address}")
                if hosts:
                    print(f"  First Host: {hosts[0]}")
                    print(f"  Last Host:  {hosts[-1]}")
                print(f"  Broadcast: {subnet.broadcast_address}")
                print()
                
    except ValueError as e:
        print(f"Error: {e}")

def vlsm_calculator(network, requirements):
    """
    VLSM Calculator
    requirements = [(name, num_hosts), ...]
    """
    try:
        net = ipaddress.ip_network(network, strict=False)
        available_ip = net.network_address
        
        print(f"\nVLSM Design for {net}")
        print(f"{'='*70}\n")
        
        # Sort by hosts (largest first)
        requirements.sort(key=lambda x: x[1], reverse=True)
        
        for name, num_hosts in requirements:
            # Calculate required hosts (including network and broadcast)
            required = num_hosts + 2
            
            # Find minimum prefix length
            import math
            host_bits = math.ceil(math.log2(required))
            prefix_len = 32 - host_bits
            
            # Create subnet
            subnet_str = f"{available_ip}/{prefix_len}"
            subnet = ipaddress.ip_network(subnet_str, strict=False)
            hosts = list(subnet.hosts())
            
            print(f"{name} ({num_hosts} hosts) - {subnet}")
            print(f"  Network:    {subnet.network_address}")
            if hosts:
                print(f"  First Host: {hosts[0]}")
                print(f"  Last Host:  {hosts[-1]}")
            print(f"  Broadcast:  {subnet.broadcast_address}")
            print(f"  Usable:     {len(hosts)} hosts")
            print()
            
            # Update available IP to next subnet
            available_ip = subnet.broadcast_address + 1
            
    except Exception as e:
        print(f"Error: {e}")

# Ví dụ sử dụng
if __name__ == "__main__":
    # Subnetting
    print("EXAMPLE 1: Basic Subnetting")
    subnet_calculator("192.168.1.0/24", num_subnets=4)
    
    print("\n" + "="*70 + "\n")
    
    # VLSM
    print("EXAMPLE 2: VLSM Design")
    requirements = [
        ("Sales", 50),
        ("IT", 25),
        ("HR", 10),
        ("Management", 5)
    ]
    vlsm_calculator("192.168.10.0/24", requirements)
```

## Tips & Tricks

### 1. Nhớ Block Sizes

```
/30 → Block 4   (2 hosts)   [P2P links]
/29 → Block 8   (6 hosts)
/28 → Block 16  (14 hosts)
/27 → Block 32  (30 hosts)
/26 → Block 64  (62 hosts)
/25 → Block 128 (126 hosts)
/24 → Block 256 (254 hosts)
```

### 2. Quick Check

**Is IP in subnet?**
```
Network: 192.168.10.64/27
Check: 192.168.10.75

Block size = 32
64 + 32 = 96
→ Subnet range: 64-95
→ 75 is IN the subnet ✓
```

### 3. Wildcard Mask

```
Wildcard = 255.255.255.255 - Subnet Mask

Example:
Subnet Mask: 255.255.255.192
Wildcard:    0.0.0.63
```

## Bài tập thực hành

### Bài 1
Chia 10.0.0.0/8 thành 8 subnets bằng nhau. Tính:
- New subnet mask
- Hosts per subnet
- Liệt kê 3 subnets đầu tiên

### Bài 2
Thiết kế VLSM cho mạng 172.20.0.0/22:
- Building A: 400 users
- Building B: 200 users
- Building C: 100 users
- Server Farm: 50 servers
- 5 P2P links

### Bài 3
Tóm tắt (summarize) các routes:
```
192.168.16.0/24
192.168.17.0/24
192.168.18.0/24
192.168.19.0/24
192.168.20.0/24
192.168.21.0/24
192.168.22.0/24
192.168.23.0/24
```

## Kết luận

Subnetting và VLSM là nền tảng của network design. Master những kỹ năng này sẽ giúp bạn:

- Thiết kế mạng hiệu quả
- Tối ưu IP addressing
- Hiểu sâu về routing
- Vượt qua CCNA exam!

Trong bài tiếp theo, chúng ta sẽ học về **OSPF Routing Protocol** - dynamic routing trong thực tế!

## Tài liệu tham khảo

- RFC 1519 - CIDR
- RFC 1918 - Private Address Space
- Cisco CCNA Official Cert Guide
- IPv4 Subnetting Practice (subnettingpractice.com)

---

*Luyện tập mỗi ngày để thành thạo subnetting!*
