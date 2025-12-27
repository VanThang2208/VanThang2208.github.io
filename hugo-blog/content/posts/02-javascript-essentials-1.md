---
title: "JavaScript Essentials 1: Nền tảng cho Network Automation"
date: 2023-10-15
draft: false
category: "LẬP TRÌNH"
tags: ["javascript", "automation", "programming", "beginner"]
image: "/images/post-02-javascript-essentials-1.png"
summary: "Tại sao Network Engineer cần học JavaScript? Khám phá cú pháp cơ bản, biến, kiểu dữ liệu, vòng lặp và cách áp dụng JavaScript vào tự động hóa mạng."
---

## Tại sao Network Engineer cần học JavaScript?

Trong thời đại **Network Automation** và **DevOps**, việc chỉ biết cấu hình thiết bị qua CLI là chưa đủ. JavaScript đang trở thành ngôn ngữ quan trọng cho Network Engineers vì:

- 🌐 **Node.js**: Xây dựng công cụ automation và API servers
- 📊 **Web Dashboards**: Tạo giao diện quản lý mạng
- 🔄 **REST API**: Tương tác với thiết bị SDN, Cisco DNA Center
- 📦 **npm**: Hàng nghìn thư viện hỗ trợ networking (netmiko-js, node-telnet-client)

## Cài đặt môi trường

### Cài Node.js

```bash
# Windows (sử dụng Chocolatey)
choco install nodejs

# macOS (sử dụng Homebrew)
brew install node

# Linux (Ubuntu/Debian)
sudo apt update
sudo apt install nodejs npm

# Kiểm tra cài đặt
node --version   # v18.x.x
npm --version    # 9.x.x
```

### Tạo project đầu tiên

```bash
mkdir network-automation
cd network-automation
npm init -y
```

## Biến và Kiểu dữ liệu

### Khai báo biến

JavaScript có 3 cách khai báo biến:

```javascript
// let: Biến có thể thay đổi, scope trong block
let hostname = "Router1";
hostname = "Switch1"; // OK

// const: Hằng số, không thể thay đổi
const managementIP = "192.168.1.1";
// managementIP = "10.0.0.1"; // ERROR!

// var: Cách cũ, tránh sử dụng
var vlan = 10;
```

**Best practice cho Network Scripts:**
```javascript
const MANAGEMENT_VLAN = 99;        // Hằng số viết HOA
let deviceStatus = "active";       // Biến thường camelCase
const MAX_RETRY_ATTEMPTS = 3;
```

### Các kiểu dữ liệu cơ bản

#### 1. String (Chuỗi)

```javascript
let deviceName = "Cisco-2960-Switch";
let interfaceName = 'GigabitEthernet0/1';
let command = `show interface ${interfaceName}`; // Template literals

// String methods hữu ích
console.log(deviceName.length);           // 18
console.log(deviceName.toUpperCase());    // CISCO-2960-SWITCH
console.log(deviceName.includes("2960")); // true
console.log(deviceName.split("-"));       // ["Cisco", "2960", "Switch"]
```

#### 2. Number

```javascript
let vlanId = 10;
let bandwidth = 1000.5; // Mbps
let temperature = 45.7; // Celsius

// Các phép toán
let totalPorts = 24 + 24; // 48
let utilizationPercent = (450 / 1000) * 100; // 45%

// Math functions
let roundedTemp = Math.round(temperature); // 46
let maxVlan = Math.max(10, 20, 30);       // 30
```

#### 3. Boolean

```javascript
let isInterfaceUp = true;
let isConfigSaved = false;

// Logic cho network monitoring
if (isInterfaceUp && !isConfigSaved) {
    console.log("Interface is up but config not saved!");
}
```

#### 4. Array (Mảng)

```javascript
// Danh sách VLANs
let vlans = [10, 20, 30, 40];

// Danh sách interface names
let interfaces = [
    "GigabitEthernet0/1",
    "GigabitEthernet0/2",
    "GigabitEthernet0/3"
];

// Truy cập phần tử
console.log(vlans[0]);        // 10
console.log(interfaces[1]);   // "GigabitEthernet0/2"

// Array methods
vlans.push(50);               // Thêm VLAN 50
vlans.pop();                  // Xóa phần tử cuối
console.log(vlans.length);    // Số lượng VLANs
```

#### 5. Object (Đối tượng)

```javascript
// Thông tin thiết bị mạng
let router = {
    hostname: "R1-Core",
    model: "Cisco ISR 4331",
    managementIP: "192.168.1.1",
    interfaces: 4,
    isOnline: true,
    uptime: 86400 // seconds
};

// Truy cập thuộc tính
console.log(router.hostname);         // "R1-Core"
console.log(router["managementIP"]); // "192.168.1.1"

// Thêm thuộc tính mới
router.location = "Building A";
router.firmware = "16.9.5";
```

## Cấu trúc điều khiển

### If-Else Statement

```javascript
let interfaceSpeed = 1000; // Mbps

if (interfaceSpeed >= 1000) {
    console.log("Gigabit interface");
} else if (interfaceSpeed >= 100) {
    console.log("Fast Ethernet interface");
} else {
    console.log("Ethernet interface");
}
```

**Ví dụ thực tế: Kiểm tra VLAN ID**
```javascript
let vlanId = 99;

if (vlanId >= 1 && vlanId <= 1005) {
    console.log("Normal VLAN range");
} else if (vlanId >= 1006 && vlanId <= 4094) {
    console.log("Extended VLAN range");
} else {
    console.log("Invalid VLAN ID");
}
```

### Switch Statement

```javascript
let deviceType = "router";

switch (deviceType) {
    case "router":
        console.log("Routing device - Layer 3");
        break;
    case "switch":
        console.log("Switching device - Layer 2/3");
        break;
    case "firewall":
        console.log("Security device");
        break;
    default:
        console.log("Unknown device type");
}
```

## Vòng lặp (Loops)

### For Loop

```javascript
// Tạo cấu hình cho 10 VLANs
for (let vlan = 10; vlan <= 100; vlan += 10) {
    console.log(`vlan ${vlan}`);
    console.log(`  name VLAN_${vlan}`);
}

/* Output:
vlan 10
  name VLAN_10
vlan 20
  name VLAN_20
...
*/
```

### For...of Loop (Duyệt mảng)

```javascript
let devices = ["Router1", "Switch1", "Firewall1"];

for (let device of devices) {
    console.log(`Checking ${device}...`);
    console.log(`  Status: Online`);
}
```

### While Loop

```javascript
// Retry logic cho kết nối thiết bị
let retryCount = 0;
let maxRetries = 5;
let connected = false;

while (retryCount < maxRetries && !connected) {
    console.log(`Attempt ${retryCount + 1}...`);
    
    // Giả lập kết nối (thực tế sẽ là SSH/Telnet)
    connected = Math.random() > 0.5;
    
    if (!connected) {
        retryCount++;
        console.log("Connection failed, retrying...");
    }
}

if (connected) {
    console.log("Connected successfully!");
} else {
    console.log("Failed to connect after maximum retries");
}
```

## Functions (Hàm)

### Function Declaration

```javascript
function calculateSubnet(ip, cidr) {
    // Tính toán subnet (simplified)
    let parts = ip.split('.');
    let networkBits = cidr;
    let hostBits = 32 - networkBits;
    let totalHosts = Math.pow(2, hostBits) - 2;
    
    return {
        network: ip,
        cidr: cidr,
        usableHosts: totalHosts
    };
}

let subnet = calculateSubnet("192.168.1.0", 24);
console.log(subnet);
// { network: '192.168.1.0', cidr: 24, usableHosts: 254 }
```

### Arrow Functions (Modern)

```javascript
// Kiểm tra IP có phải private không
const isPrivateIP = (ip) => {
    return ip.startsWith("10.") ||
           ip.startsWith("172.16.") ||
           ip.startsWith("192.168.");
};

console.log(isPrivateIP("192.168.1.1")); // true
console.log(isPrivateIP("8.8.8.8"));     // false
```

## Ví dụ thực tế: Script quản lý VLAN

```javascript
// vlan-manager.js

const vlans = [];

// Hàm thêm VLAN
function addVLAN(id, name) {
    if (id < 1 || id > 4094) {
        console.log(`Error: Invalid VLAN ID ${id}`);
        return false;
    }
    
    // Kiểm tra trùng lặp
    const exists = vlans.some(v => v.id === id);
    if (exists) {
        console.log(`Error: VLAN ${id} already exists`);
        return false;
    }
    
    vlans.push({ id, name });
    console.log(`VLAN ${id} (${name}) added successfully`);
    return true;
}

// Hàm xóa VLAN
function removeVLAN(id) {
    const index = vlans.findIndex(v => v.id === id);
    if (index === -1) {
        console.log(`Error: VLAN ${id} not found`);
        return false;
    }
    
    vlans.splice(index, 1);
    console.log(`VLAN ${id} removed successfully`);
    return true;
}

// Hàm hiển thị tất cả VLANs
function showVLANs() {
    console.log("\n=== VLAN Database ===");
    if (vlans.length === 0) {
        console.log("No VLANs configured");
        return;
    }
    
    vlans.sort((a, b) => a.id - b.id);
    vlans.forEach(vlan => {
        console.log(`VLAN ${vlan.id}: ${vlan.name}`);
    });
}

// Sử dụng
addVLAN(10, "Management");
addVLAN(20, "Sales");
addVLAN(30, "Engineering");
addVLAN(40, "Guest");
showVLANs();

removeVLAN(40);
showVLANs();
```

**Chạy script:**
```bash
node vlan-manager.js
```

## Làm việc với JSON (Quan trọng cho API)

```javascript
// Device configuration dưới dạng JSON
const deviceConfig = {
    hostname: "SW-Core-01",
    interfaces: [
        {
            name: "GigabitEthernet1/0/1",
            vlan: 10,
            status: "up",
            speed: 1000
        },
        {
            name: "GigabitEthernet1/0/2",
            vlan: 20,
            status: "down",
            speed: 1000
        }
    ],
    vlans: [
        { id: 10, name: "Management" },
        { id: 20, name: "Sales" }
    ]
};

// Convert to JSON string
const jsonString = JSON.stringify(deviceConfig, null, 2);
console.log(jsonString);

// Parse JSON string
const parsed = JSON.parse(jsonString);
console.log(parsed.hostname); // "SW-Core-01"
```

## Bài tập thực hành

### Bài 1: Subnet Calculator
Viết hàm tính số host khả dụng từ CIDR notation:
```javascript
function calculateHosts(cidr) {
    // Your code here
}

console.log(calculateHosts(24)); // 254
console.log(calculateHosts(16)); // 65534
```

### Bài 2: Interface Status Checker
Tạo script kiểm tra trạng thái interfaces:
```javascript
const interfaces = [
    { name: "Gi0/1", status: "up", vlan: 10 },
    { name: "Gi0/2", status: "down", vlan: 20 },
    { name: "Gi0/3", status: "up", vlan: 10 }
];

// Đếm số interface up và down
// In ra các interface down cần troubleshoot
```

### Bài 3: Configuration Generator
Tạo script sinh cấu hình switch tự động:
```javascript
function generateSwitchConfig(hostname, vlans, interfaces) {
    // Generate Cisco IOS commands
}
```

## Kết luận

JavaScript là nền tảng quan trọng cho Network Automation. Những kiến thức cơ bản về biến, vòng lặp, hàm là bước đầu tiên để bạn có thể:

- Viết script tự động hóa
- Làm việc với REST APIs
- Xây dựng network monitoring tools
- Tạo configuration management systems

Trong **JavaScript Essentials 2**, chúng ta sẽ học về:
- Objects và Arrays nâng cao
- Async/Await cho API calls
- Node.js modules
- Làm việc với SSH/Telnet libraries

## Tài liệu tham khảo

- MDN Web Docs: JavaScript Guide
- Node.js Documentation
- Cisco DevNet: Network Programmability
- JavaScript Essentials 1 - Cisco Networking Academy

---

*Hãy thực hành các bài tập và chia sẻ kết quả với mình nhé!*
