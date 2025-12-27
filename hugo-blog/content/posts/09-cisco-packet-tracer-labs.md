---
title: "Cisco Packet Tracer Labs: Hands-on Practice từ cơ bản đến nâng cao"
date: 2023-11-29
draft: false
category: "THỰC HÀNH"
tags: ["packet-tracer", "cisco", "ccna", "lab", "hands-on", "practice"]
image: "/images/post-09-cisco-packet-tracer-labs.png"
summary: "Hướng dẫn từng bước thực hành trên Cisco Packet Tracer. Từ basic switching/routing đến complex multi-area OSPF và automation. Kèm file .pkt để download!"
---

## Giới thiệu Cisco Packet Tracer

### Packet Tracer là gì?

**Cisco Packet Tracer** là network simulation tool miễn phí từ Cisco, cho phép:
- **Thiết kế** network topologies
- **Cấu hình** Cisco devices
- **Simulate** network behavior
- **Troubleshoot** issues
- **Learn** networking concepts

### Download & Install

1. Truy cập: [netacad.com](https://www.netacad.com)
2. Create account (free)
3. Download Packet Tracer (Windows/Mac/Linux)
4. Install và activate với account

### Interface Overview

```
┌─────────────────────────────────────────┐
│  Menu Bar                               │
├─────────────────────────────────────────┤
│  Toolbar (Select, Move, Delete, etc)   │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────┐  ┌────────────────┐ │
│  │   Device      │  │  Workspace     │ │
│  │   Selection   │  │  (Topology)    │ │
│  │   Panel       │  │                │ │
│  └───────────────┘  └────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

## Lab 1: Basic Switch Configuration

### Topology

```
PC1 ──── SW1 ──── PC2
```

### Objectives
- Cấu hình basic switch settings
- Set hostname, passwords
- Configure VLANs
- Test connectivity

### Step 1: Tạo Topology

1. **Add Devices:**
   - Drag 1 switch (2960) vào workspace
   - Drag 2 PCs

2. **Connect Devices:**
   - Click "Connections" (lightning icon)
   - Select "Copper Straight-Through"
   - Connect PC1 Fa0 → SW1 Fa0/1
   - Connect PC2 Fa0 → SW1 Fa0/2

### Step 2: Configure PCs

**PC1:**
```
IP Address: 192.168.1.10
Subnet Mask: 255.255.255.0
Default Gateway: 192.168.1.1
```

**PC2:**
```
IP Address: 192.168.1.20
Subnet Mask: 255.255.255.0
Default Gateway: 192.168.1.1
```

### Step 3: Configure Switch

Click on SW1 → CLI tab:

```
Switch> enable
Switch# configure terminal

! Set hostname
Switch(config)# hostname SW1

! Console password
SW1(config)# line console 0
SW1(config-line)# password cisco
SW1(config-line)# login
SW1(config-line)# exit

! Enable password
SW1(config)# enable secret class

! VTY (Telnet/SSH) password
SW1(config)# line vty 0 15
SW1(config-line)# password cisco
SW1(config-line)# login
SW1(config-line)# exit

! Banner
SW1(config)# banner motd #
Unauthorized access is prohibited!
#

! Interface descriptions
SW1(config)# interface FastEthernet0/1
SW1(config-if)# description Connection to PC1
SW1(config-if)# exit

SW1(config)# interface FastEthernet0/2
SW1(config-if)# description Connection to PC2
SW1(config-if)# exit

! Save configuration
SW1(config)# exit
SW1# copy running-config startup-config
```

### Step 4: Verify

```
SW1# show running-config
SW1# show interfaces status
SW1# show mac address-table
```

### Step 5: Test Connectivity

On PC1:
```
C:\> ping 192.168.1.20
```

✅ Should see successful replies!

## Lab 2: VLANs và Inter-VLAN Routing

### Topology

```
    PC1 (VLAN 10)
     |
    SW1 ────── R1
     |
    PC2 (VLAN 20)
```

### Objectives
- Create VLANs
- Assign ports to VLANs
- Configure Router-on-a-Stick
- Test inter-VLAN communication

### Configuration

**PC1:**
```
IP: 192.168.10.10
Mask: 255.255.255.0
Gateway: 192.168.10.1
```

**PC2:**
```
IP: 192.168.20.10
Mask: 255.255.255.0
Gateway: 192.168.20.1
```

**SW1 Configuration:**

```
SW1(config)# vlan 10
SW1(config-vlan)# name Sales
SW1(config-vlan)# exit

SW1(config)# vlan 20
SW1(config-vlan)# name Engineering
SW1(config-vlan)# exit

! Assign ports to VLANs
SW1(config)# interface FastEthernet0/1
SW1(config-if)# switchport mode access
SW1(config-if)# switchport access vlan 10
SW1(config-if)# exit

SW1(config)# interface FastEthernet0/2
SW1(config-if)# switchport mode access
SW1(config-if)# switchport access vlan 20
SW1(config-if)# exit

! Trunk to router
SW1(config)# interface GigabitEthernet0/1
SW1(config-if)# switchport mode trunk
SW1(config-if)# exit
```

**R1 Configuration (Router-on-a-Stick):**

```
R1(config)# interface GigabitEthernet0/0
R1(config-if)# no shutdown
R1(config-if)# exit

! Subinterface for VLAN 10
R1(config)# interface GigabitEthernet0/0.10
R1(config-subif)# encapsulation dot1Q 10
R1(config-subif)# ip address 192.168.10.1 255.255.255.0
R1(config-subif)# exit

! Subinterface for VLAN 20
R1(config)# interface GigabitEthernet0/0.20
R1(config-subif)# encapsulation dot1Q 20
R1(config-subif)# ip address 192.168.20.1 255.255.255.0
R1(config-subif)# exit
```

### Verify

```
SW1# show vlan brief
SW1# show interfaces trunk

R1# show ip interface brief
R1# show ip route
```

### Test

From PC1:
```
C:\> ping 192.168.20.10
```

✅ Should work! Traffic routes through R1.

## Lab 3: Static Routing

### Topology

```
192.168.1.0/24          10.1.1.0/30           192.168.2.0/24
    PC1                                           PC2
     |                                             |
    R1 ─────────────────────────── R2
  .1 | .1                      .2 | .1
```

### IP Addressing

**PC1:** 192.168.1.10/24, GW: 192.168.1.1  
**PC2:** 192.168.2.10/24, GW: 192.168.2.1  
**R1 G0/0:** 192.168.1.1/24  
**R1 G0/1:** 10.1.1.1/30  
**R2 G0/0:** 10.1.1.2/30  
**R2 G0/1:** 192.168.2.1/24

### R1 Configuration

```
R1(config)# interface GigabitEthernet0/0
R1(config-if)# ip address 192.168.1.1 255.255.255.0
R1(config-if)# no shutdown
R1(config-if)# exit

R1(config)# interface GigabitEthernet0/1
R1(config-if)# ip address 10.1.1.1 255.255.255.252
R1(config-if)# no shutdown
R1(config-if)# exit

! Static route to 192.168.2.0/24 network
R1(config)# ip route 192.168.2.0 255.255.255.0 10.1.1.2
```

### R2 Configuration

```
R2(config)# interface GigabitEthernet0/0
R2(config-if)# ip address 10.1.1.2 255.255.255.252
R2(config-if)# no shutdown
R2(config-if)# exit

R2(config)# interface GigabitEthernet0/1
R2(config-if)# ip address 192.168.2.1 255.255.255.0
R2(config-if)# no shutdown
R2(config-if)# exit

! Static route to 192.168.1.0/24 network
R2(config)# ip route 192.168.1.0 255.255.255.0 10.1.1.1
```

### Verify

```
R1# show ip route
R1# show ip interface brief

R2# show ip route
```

### Test

From PC1:
```
C:\> ping 192.168.2.10
C:\> tracert 192.168.2.10
```

## Lab 4: OSPF Dynamic Routing

### Topology

```
Area 0 (Backbone)

192.168.1.0/24    10.1.1.0/30      10.1.2.0/30    192.168.3.0/24
    PC1              |                  |              PC2
     |               |                  |               |
    R1 ─────────── R2 ─────────────── R3
```

### Configuration

**R1:**

```
R1(config)# interface GigabitEthernet0/0
R1(config-if)# ip address 192.168.1.1 255.255.255.0
R1(config-if)# no shutdown

R1(config)# interface GigabitEthernet0/1
R1(config-if)# ip address 10.1.1.1 255.255.255.252
R1(config-if)# no shutdown

! OSPF Configuration
R1(config)# router ospf 1
R1(config-router)# router-id 1.1.1.1
R1(config-router)# network 192.168.1.0 0.0.0.255 area 0
R1(config-router)# network 10.1.1.0 0.0.0.3 area 0
R1(config-router)# passive-interface GigabitEthernet0/0
```

**R2:**

```
R2(config)# interface GigabitEthernet0/0
R2(config-if)# ip address 10.1.1.2 255.255.255.252
R2(config-if)# no shutdown

R2(config)# interface GigabitEthernet0/1
R2(config-if)# ip address 10.1.2.1 255.255.255.252
R2(config-if)# no shutdown

! OSPF Configuration
R2(config)# router ospf 1
R2(config-router)# router-id 2.2.2.2
R2(config-router)# network 10.1.1.0 0.0.0.3 area 0
R2(config-router)# network 10.1.2.0 0.0.0.3 area 0
```

**R3:**

```
R3(config)# interface GigabitEthernet0/0
R3(config-if)# ip address 10.1.2.2 255.255.255.252
R3(config-if)# no shutdown

R3(config)# interface GigabitEthernet0/1
R3(config-if)# ip address 192.168.3.1 255.255.255.0
R3(config-if)# no shutdown

! OSPF Configuration
R3(config)# router ospf 1
R3(config-router)# router-id 3.3.3.3
R3(config-router)# network 10.1.2.0 0.0.0.3 area 0
R3(config-router)# network 192.168.3.0 0.0.0.255 area 0
R3(config-router)# passive-interface GigabitEthernet0/1
```

### Verify OSPF

```
R1# show ip ospf neighbor

Neighbor ID     Pri   State           Dead Time   Address         Interface
2.2.2.2         1     FULL/  -        00:00:35    10.1.1.2        Gi0/1
```

```
R1# show ip route ospf

O    10.1.2.0/30 [110/2] via 10.1.1.2, 00:05:23, GigabitEthernet0/1
O    192.168.3.0/24 [110/3] via 10.1.1.2, 00:05:23, GigabitEthernet0/1
```

```
R2# show ip ospf interface brief

Interface    PID   Area  IP Address/Mask    Cost  State Nbrs F/C
Gi0/0        1     0     10.1.1.2/30        1     P2P   1/1
Gi0/1        1     0     10.1.2.1/30        1     P2P   1/1
```

### Test Convergence

1. Shutdown R1-R2 link:
   ```
   R1(config)# interface GigabitEthernet0/1
   R1(config-if)# shutdown
   ```

2. Watch routing table update on R3:
   ```
   R3# show ip route
   ```

3. Re-enable interface and observe convergence

## Lab 5: DHCP Server Configuration

### Topology

```
    PC1
     |
    R1 (DHCP Server)
     |
    PC2
```

### R1 DHCP Configuration

```
R1(config)# ip dhcp excluded-address 192.168.1.1 192.168.1.10
R1(config)# ip dhcp excluded-address 192.168.1.250 192.168.1.254

R1(config)# ip dhcp pool LAN-POOL
R1(dhcp-config)# network 192.168.1.0 255.255.255.0
R1(dhcp-config)# default-router 192.168.1.1
R1(dhcp-config)# dns-server 8.8.8.8 8.8.4.4
R1(dhcp-config)# domain-name example.com
R1(dhcp-config)# lease 7
R1(dhcp-config)# exit

R1(config)# interface GigabitEthernet0/0
R1(config-if)# ip address 192.168.1.1 255.255.255.0
R1(config-if)# no shutdown
```

### Configure PCs for DHCP

On PC1 and PC2:
1. Click on PC
2. Desktop tab → IP Configuration
3. Select **DHCP** (instead of Static)
4. Click "Renew"

### Verify

```
R1# show ip dhcp binding

IP address       Client-ID/              Lease expiration        Type
                 Hardware address
192.168.1.11     0001.9633.7A01          Dec 06 2023 12:00 AM    Automatic
192.168.1.12     0060.5C4D.7902          Dec 06 2023 12:00 AM    Automatic
```

```
R1# show ip dhcp pool

Pool LAN-POOL :
 Utilization mark (high/low)    : 100 / 0
 Subnet size (first/next)       : 0 / 0 
 Total addresses                : 254
 Leased addresses               : 2
 Excluded addresses             : 15
 Pending event                  : none
```

## Lab 6: Access Control Lists (ACLs)

### Scenario

Block PC1 from accessing Web Server, nhưng cho phép PC2.

### Topology

```
PC1 (192.168.1.10)
 |
R1
 |
PC2 (192.168.1.20)
 |
Web Server (192.168.2.10)
```

### Standard ACL Configuration

```
! Create ACL (block PC1, permit others)
R1(config)# access-list 10 deny host 192.168.1.10
R1(config)# access-list 10 permit any

! Apply to interface (outbound towards server)
R1(config)# interface GigabitEthernet0/1
R1(config-if)# ip access-group 10 out
```

### Extended ACL Example

```
! Block PC1 from HTTP/HTTPS to Web Server
R1(config)# ip access-list extended BLOCK-WEB
R1(config-ext-nacl)# deny tcp host 192.168.1.10 host 192.168.2.10 eq 80
R1(config-ext-nacl)# deny tcp host 192.168.1.10 host 192.168.2.10 eq 443
R1(config-ext-nacl)# permit ip any any
R1(config-ext-nacl)# exit

R1(config)# interface GigabitEthernet0/0
R1(config-if)# ip access-group BLOCK-WEB in
```

### Verify

```
R1# show access-lists
R1# show ip interface GigabitEthernet0/0 | include access list
```

### Test

From PC1:
```
C:\> ping 192.168.2.10    (Should fail with ACL)
```

From PC2:
```
C:\> ping 192.168.2.10    (Should succeed)
```

## Lab 7: NAT Configuration

### Topology

```
Inside Network          Outside Network
192.168.1.0/24          Internet (ISP)
    PC1
     |
    R1 ───────── ISP Router
```

### PAT (Port Address Translation)

```
! Define inside/outside interfaces
R1(config)# interface GigabitEthernet0/0
R1(config-if)# ip nat inside
R1(config-if)# exit

R1(config)# interface GigabitEthernet0/1
R1(config-if)# ip nat outside
R1(config-if)# exit

! Create ACL for inside network
R1(config)# access-list 1 permit 192.168.1.0 0.0.0.255

! Configure PAT
R1(config)# ip nat inside source list 1 interface GigabitEthernet0/1 overload
```

### Static NAT (Server)

```
! Map internal web server to public IP
R1(config)# ip nat inside source static 192.168.1.100 209.165.200.225
```

### Verify

```
R1# show ip nat translations
R1# show ip nat statistics
```

## Lab 8: Troubleshooting Practice

### Broken Topology

Create intentional errors và practice troubleshooting:

**Common Issues:**
1. Wrong IP address
2. Wrong subnet mask
3. Wrong default gateway
4. Interface shutdown
5. Wrong VLAN assignment
6. Missing routes
7. Wrong OSPF network statement
8. Duplex mismatch

### Troubleshooting Commands

```
! Layer 1 (Physical)
show interfaces
show controllers

! Layer 2 (Data Link)
show mac address-table
show vlan
show interfaces trunk
show spanning-tree

! Layer 3 (Network)
show ip interface brief
show ip route
show ip protocols
ping
traceroute

! OSPF Specific
show ip ospf neighbor
show ip ospf interface
show ip ospf database

! General
show running-config
show startup-config
```

### Systematic Approach

```
1. Identify the problem
   - What doesn't work?
   - What should work?

2. Gather information
   - Run show commands
   - Check configs
   - Test connectivity

3. Analyze information
   - Compare expected vs actual
   - Identify discrepancies

4. Propose solution
   - What needs to change?

5. Implement & test
   - Make changes
   - Verify fix
```

## Advanced Labs

### Lab 9: Multi-Area OSPF

```
Area 1 ──── ABR ──── Area 0 ──── ABR ──── Area 2
```

**Practice:**
- Configure multiple areas
- Understand LSA propagation
- Route summarization
- Stub areas

### Lab 10: EtherChannel

**Objectives:**
- Aggregate multiple links
- Configure LACP/PAgP
- Load balancing

### Lab 11: STP (Spanning Tree Protocol)

**Practice:**
- Root bridge election
- Port states
- PortFast, BPDU Guard
- Rapid PVST+

## Tips for Packet Tracer Success

### 1. Save Often!
```
File → Save (Ctrl+S)
Save As → Use descriptive names
```

### 2. Use Simulation Mode
- Click "Simulation" tab (bottom right)
- Step through packets
- Understand packet flow

### 3. Label Everything
- Double-click devices to rename
- Add text notes
- Document IP schemes

### 4. Test Incrementally
- Configure one thing at a time
- Test after each change
- Don't wait until end

### 5. Learn Shortcuts
```
Ctrl+Z = Undo
Ctrl+Y = Redo
Delete = Remove device
Ctrl+D = Duplicate
```

## Practice Projects

### Project 1: Small Office Network
Design cho company với:
- 3 departments (VLANs)
- Internet access (NAT)
- DHCP for clients
- Security (ACLs)

### Project 2: Branch Office Connection
- 2 sites connected via WAN
- OSPF routing
- Inter-site VLANs
- Redundancy

### Project 3: ISP Simulation
- Multiple customers
- BGP routing (if available)
- Different routing protocols
- NAT, ACLs

## Kết luận

Packet Tracer là công cụ tuyệt vời để:

✅ **Practice** cấu hình Cisco devices  
✅ **Visualize** network behavior  
✅ **Experiment** without real equipment  
✅ **Prepare** for CCNA exam  
✅ **Build** portfolio projects

### Tiếp tục học tập

1. **Complete Cisco NetAcad courses**
2. **Join Packet Tracer communities**
3. **Download lab files** từ forums
4. **Create your own** scenarios
5. **Move to GNS3/EVE-NG** cho advanced practice

### Next Steps

- 📚 Study for CCNA exam
- 💻 Practice trên real equipment
- 🔧 Learn network automation
- 🌐 Explore SD-WAN, cloud networking
- 🎓 Pursue CCNP certification

## Tài liệu tham khảo

- Cisco Packet Tracer Official Site
- CCNA 200-301 Official Cert Guide
- Packet Tracer Network Academy Labs
- Reddit: r/ccna, r/networking
- YouTube: NetworkChuck, David Bombal, Jeremy's IT Lab

---

**Chúc bạn thành công trong hành trình networking! 🚀**

*Practice, practice, practice! Đó là chìa khóa để master networking!*

---

## Liên hệ

Nếu có câu hỏi hoặc cần support, hãy liên hệ qua [trang Contact](/contact) nhé!

**Đào Văn Thắng**  
Sinh viên CNPM - HUTECH  
Network & Programming Enthusiast
