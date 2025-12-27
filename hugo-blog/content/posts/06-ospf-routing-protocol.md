---
title: "OSPF Routing Protocol: Dynamic Routing trong doanh nghiệp"
date: 2023-11-08
draft: false
category: "NÂNG CAO"
tags: ["ospf", "routing", "dynamic-routing", "ccna", "cisco"]
image: "/images/post-06-ospf-routing-protocol.png"
summary: "Tìm hiểu về OSPF - giao thức định tuyến động phổ biến nhất trong doanh nghiệp. Từ lý thuyết đến cấu hình thực tế trên Cisco routers."
---

## Giới thiệu OSPF

**OSPF (Open Shortest Path First)** là link-state routing protocol được sử dụng rộng rãi trong doanh nghiệp. 

### Đặc điểm chính

- **Standard**: RFC 2328 (OSPFv2), RFC 5340 (OSPFv3)
- **Metric**: Cost (dựa trên bandwidth)
- **Algorithm**: Dijkstra's Shortest Path First (SPF)
- **Administrative Distance**: 110
- **Protocol Number**: 89 (không dùng TCP/UDP)
- **Multicast**: 224.0.0.5 (All OSPF Routers), 224.0.0.6 (DR/BDR)

### So sánh với RIP

| Feature | RIP | OSPF |
|---------|-----|------|
| Type | Distance Vector | Link State |
| Metric | Hop Count (max 15) | Cost (bandwidth) |
| Convergence | Slow | Fast |
| Scalability | Small networks | Large networks |
| VLSM Support | RIPv2: Yes | Yes |
| Updates | Full table every 30s | Triggered updates |
| Algorithm | Bellman-Ford | Dijkstra SPF |

## OSPF Hoạt động như thế nào?

### 1. Neighbor Discovery

Routers tìm neighbors bằng **Hello packets** (mỗi 10s trên broadcast networks).

```
Hello Packet contains:
- Router ID
- Hello/Dead intervals
- Area ID
- Network Mask
- Authentication
- Neighbors list
```

### 2. Database Synchronization

Routers trao đổi **LSAs (Link-State Advertisements)** để xây dựng **LSDB (Link-State Database)** giống nhau.

### 3. SPF Calculation

Mỗi router chạy Dijkstra algorithm trên LSDB để tính:
- **Shortest path** đến mọi destination
- Xây dựng **routing table**

### 4. Route Installation

Best routes được cài vào routing table.

## OSPF Areas

OSPF sử dụng **hierarchical design** với Areas để scale.

```
        [Area 0 - Backbone]
               |
    +----------+----------+
    |          |          |
[Area 1]   [Area 2]   [Area 3]
```

### Loại Areas

| Area Type | Description | LSAs Allowed |
|-----------|-------------|--------------|
| **Backbone (Area 0)** | Core area, all others connect to it | All types |
| **Standard Area** | Can receive all LSA types | All types |
| **Stub Area** | No external routes (Type 5 LSA) | 1, 2, 3 |
| **Totally Stubby** | Only default route from ABR | 1, 2 |
| **NSSA** | Stub with external routes converted | 1, 2, 3, 7 |

### Router Types

1. **Internal Router (IR)**: Tất cả interfaces trong cùng 1 area
2. **Backbone Router (BR)**: Có interface trong Area 0
3. **Area Border Router (ABR)**: Kết nối nhiều areas
4. **Autonomous System Boundary Router (ASBR)**: Redistribute routes từ external sources

## OSPF Metric - Cost

### Công thức Cost

```
Cost = Reference Bandwidth / Interface Bandwidth

Default Reference Bandwidth = 100 Mbps

Examples:
- FastEthernet (100 Mbps): 100/100 = 1
- GigabitEthernet (1000 Mbps): 100/1000 = 1 (!)
- 10GigE (10000 Mbps): 100/10000 = 1 (!)
```

⚠️ **Problem**: Tất cả interfaces ≥ 100Mbps đều có cost = 1!

### Solution: Thay đổi Reference Bandwidth

```
Router(config-router)# auto-cost reference-bandwidth 10000
```

Giờ:
- FastEthernet: 10000/100 = 100
- GigabitEthernet: 10000/1000 = 10
- 10GigE: 10000/10000 = 1

## Cấu hình OSPF cơ bản

### Topology ví dụ

```
        10.1.1.0/30
R1 -------------------- R2
.1  Gi0/0      Gi0/0  .2
   |                    |
   | 192.168.1.0/24     | 192.168.2.0/24
   |                    |
  LAN1                 LAN2
```

### Cấu hình R1

```
R1(config)# router ospf 1
R1(config-router)# router-id 1.1.1.1
R1(config-router)# network 192.168.1.0 0.0.0.255 area 0
R1(config-router)# network 10.1.1.0 0.0.0.3 area 0
R1(config-router)# passive-interface GigabitEthernet0/1
```

**Giải thích:**
- `router ospf 1`: Process ID (local significance)
- `router-id`: Unique identifier (dùng IP nếu không config)
- `network`: Advertise networks vào OSPF
- `passive-interface`: Không gửi Hello packets (LAN side)

### Cấu hình R2

```
R2(config)# router ospf 1
R2(config-router)# router-id 2.2.2.2
R2(config-router)# network 192.168.2.0 0.0.0.255 area 0
R2(config-router)# network 10.1.1.0 0.0.0.3 area 0
R2(config-router)# passive-interface GigabitEthernet0/1
```

### Verify Configuration

```
R1# show ip ospf neighbor

Neighbor ID     Pri   State           Dead Time   Address         Interface
2.2.2.2         1     FULL/  -        00:00:35    10.1.1.2        Gi0/0
```

```
R1# show ip route ospf

O    192.168.2.0/24 [110/2] via 10.1.1.2, 00:05:23, GigabitEthernet0/0
```

## Multi-Area OSPF

### Topology phức tạp

```
         Area 0 (Backbone)
              |
    +---------+---------+
    |                   |
  Area 1             Area 2
  (Branch 1)       (Branch 2)
```

### Cấu hình ABR

Router kết nối Area 0 và Area 1:

```
R-ABR(config)# router ospf 1
R-ABR(config-router)# router-id 10.0.0.1
R-ABR(config-router)# network 10.0.0.0 0.0.0.255 area 0
R-ABR(config-router)# network 192.168.10.0 0.0.0.255 area 1
```

## DR/BDR Election

Trên **multi-access networks** (Ethernet), OSPF bầu:
- **DR (Designated Router)**: Trung tâm LSA exchange
- **BDR (Backup DR)**: Backup nếu DR fail

### Election Process

1. **Highest Priority** (0-255, default 1) wins
2. Nếu bằng nhau: **Highest Router ID**
3. Priority 0 = không tham gia election

### Cấu hình Priority

```
R1(config)# interface GigabitEthernet0/0
R1(config-if)# ip ospf priority 100
```

### Verify DR/BDR

```
R1# show ip ospf interface GigabitEthernet0/0

...
Designated Router (ID) 1.1.1.1, Interface address 10.1.1.1
Backup Designated router (ID) 2.2.2.2, Interface address 10.1.1.2
...
```

## OSPF Authentication

Bảo mật OSPF bằng authentication.

### Plain Text Authentication (không khuyến nghị)

```
R1(config)# interface GigabitEthernet0/0
R1(config-if)# ip ospf authentication
R1(config-if)# ip ospf authentication-key MyPassword123
```

### MD5 Authentication (khuyến nghị)

```
R1(config)# interface GigabitEthernet0/0
R1(config-if)# ip ospf authentication message-digest
R1(config-if)# ip ospf message-digest-key 1 md5 SecurePass456
```

**Lưu ý:** Tất cả routers trong cùng segment phải cùng key!

## Tuning OSPF

### 1. Thay đổi Hello/Dead Timers

```
R1(config-if)# ip ospf hello-interval 5
R1(config-if)# ip ospf dead-interval 20
```

Default: Hello 10s, Dead 40s (broadcast/p2p)

### 2. Thay đổi Cost manually

```
R1(config-if)# ip ospf cost 50
```

### 3. Default Route Propagation

```
R-ASBR(config)# router ospf 1
R-ASBR(config-router)# default-information originate
```

Hoặc với route-map:

```
R-ASBR(config-router)# default-information originate always route-map CHECK-DEFAULT
```

## Troubleshooting OSPF

### Common Issues

1. **Neighbors không lên FULL**
   - Hello/Dead interval mismatch
   - Area ID mismatch
   - Authentication mismatch
   - Network type mismatch

2. **Routes không xuất hiện**
   - Wrong area configuration
   - Interface passive
   - ACL blocking OSPF

3. **Routing loops**
   - Incorrect cost configuration
   - Area design issues

### Debug Commands

```
R1# show ip ospf neighbor
R1# show ip ospf interface brief
R1# show ip ospf database
R1# show ip route ospf
R1# show ip protocols

R1# debug ip ospf hello
R1# debug ip ospf adj
R1# debug ip ospf packet
```

### Verify OSPF Operation

```
R1# show ip ospf

 Routing Process "ospf 1" with ID 1.1.1.1
 Start time: 00:00:05.123, Time elapsed: 00:15:32.456
 ...
 Number of areas in this router is 1. 1 normal 0 stub 0 nssa
 ...
```

```
R1# show ip ospf interface GigabitEthernet0/0

GigabitEthernet0/0 is up, line protocol is up 
  Internet Address 10.1.1.1/30, Area 0
  Process ID 1, Router ID 1.1.1.1, Network Type POINT_TO_POINT, Cost: 1
  Transmit Delay is 1 sec, State POINT_TO_POINT
  Timer intervals configured, Hello 10, Dead 40, Wait 40, Retransmit 5
  ...
```

## OSPF LSA Types

| LSA Type | Name | Generated By | Purpose |
|----------|------|--------------|---------|
| Type 1 | Router LSA | All routers | Router's directly connected links |
| Type 2 | Network LSA | DR | Multi-access network info |
| Type 3 | Summary LSA | ABR | Inter-area routes |
| Type 4 | ASBR Summary | ABR | Location of ASBR |
| Type 5 | External LSA | ASBR | External routes (redistributed) |
| Type 7 | NSSA External | ASBR (trong NSSA) | External routes trong NSSA |

## Lab Practice: OSPF Configuration

### Topology

```
                 Area 0
    R1 -------- R2 -------- R3
    |                        |
   LAN1                     LAN2
192.168.1.0/24         192.168.3.0/24
```

### Step-by-Step Configuration

**1. R1 Configuration:**

```
R1(config)# interface Gi0/0
R1(config-if)# ip address 10.1.1.1 255.255.255.252
R1(config-if)# no shutdown

R1(config)# interface Gi0/1
R1(config-if)# ip address 192.168.1.1 255.255.255.0
R1(config-if)# no shutdown

R1(config)# router ospf 1
R1(config-router)# router-id 1.1.1.1
R1(config-router)# network 10.1.1.0 0.0.0.3 area 0
R1(config-router)# network 192.168.1.0 0.0.0.255 area 0
R1(config-router)# passive-interface Gi0/1
```

**2. R2 Configuration:**

```
R2(config)# interface Gi0/0
R2(config-if)# ip address 10.1.1.2 255.255.255.252
R2(config-if)# no shutdown

R2(config)# interface Gi0/1
R2(config-if)# ip address 10.1.2.1 255.255.255.252
R2(config-if)# no shutdown

R2(config)# router ospf 1
R2(config-router)# router-id 2.2.2.2
R2(config-router)# network 10.1.1.0 0.0.0.3 area 0
R2(config-router)# network 10.1.2.0 0.0.0.3 area 0
```

**3. R3 Configuration:**

```
R3(config)# interface Gi0/0
R3(config-if)# ip address 10.1.2.2 255.255.255.252
R3(config-if)# no shutdown

R3(config)# interface Gi0/1
R3(config-if)# ip address 192.168.3.1 255.255.255.0
R3(config-if)# no shutdown

R3(config)# router ospf 1
R3(config-router)# router-id 3.3.3.3
R3(config-router)# network 10.1.2.0 0.0.0.3 area 0
R3(config-router)# network 192.168.3.0 0.0.0.255 area 0
R3(config-router)# passive-interface Gi0/1
```

**4. Verification:**

```
R1# ping 192.168.3.1
R1# show ip route ospf
R1# show ip ospf neighbor
```

## Best Practices

1. **Always use Area 0** as backbone
2. **Configure Router IDs** manually (dùng Loopback)
3. **Use passive-interface** cho LAN segments
4. **Tune reference-bandwidth** cho modern networks
5. **Summarize routes** tại ABRs
6. **Enable authentication** trong production
7. **Monitor OSPF neighbors** thường xuyên
8. **Document area design** rõ ràng

## Kết luận

OSPF là giao thức định tuyến mạnh mẽ và phổ biến trong doanh nghiệp. Việc hiểu rõ OSPF giúp bạn:

- Thiết kế mạng lớn hiệu quả
- Troubleshoot routing issues
- Tối ưu network convergence
- Vượt qua CCNA/CCNP exams

Trong bài tiếp theo, chúng ta sẽ học về **Network Automation với Python** - kỹ năng cần thiết cho kỷ nguyên DevNet!

## Tài liệu tham khảo

- RFC 2328 - OSPF Version 2
- Cisco OSPF Design Guide
- CCNA Official Cert Guide - OSPF Chapter
- Routing TCP/IP Volume 1 - Jeff Doyle

---

*Practice makes perfect! Hãy thực hành trên Cisco Packet Tracer hoặc GNS3!*
