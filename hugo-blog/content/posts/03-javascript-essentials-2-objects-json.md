---
title: "JavaScript Essentials 2: Objects, Arrays và JSON cho Network APIs"
date: 2023-10-20
draft: false
category: "NÂNG CAO"
tags: ["javascript", "json", "api", "automation", "advanced"]
image: "https://picsum.photos/seed/net3/600/400"
summary: "Đi sâu vào Objects, Arrays và JSON - định dạng dữ liệu phổ biến nhất trong các API mạng hiện đại. Học cách xử lý dữ liệu phức tạp từ network devices."
---

## Giới thiệu

Trong bài viết trước, chúng ta đã làm quen với JavaScript cơ bản. Bây giờ chúng ta sẽ đi sâu vào cách làm việc với dữ liệu phức tạp - điều cực kỳ quan trọng khi tương tác với REST APIs của thiết bị mạng như Cisco DNA Center, Meraki Dashboard, hay Arista eAPI.

## Arrays nâng cao

###Array Methods quan trọng

```javascript
const devices = [
    { hostname: "R1", type: "router", ip: "192.168.1.1", status: "up" },
    { hostname: "SW1", type: "switch", ip: "192.168.1.2", status: "up" },
    { hostname: "SW2", type: "switch", ip: "192.168.1.3", status: "down" },
    { hostname: "FW1", type: "firewall", ip: "192.168.1.254", status: "up" }
];
```

#### 1. map() - Transform dữ liệu

```javascript
// Lấy danh sách tất cả hostname
const hostnames = devices.map(device => device.hostname);
console.log(hostnames);
// ["R1", "SW1", "SW2", "FW1"]

// Tạo backup configs
const backupCommands = devices.map(device => ({
    hostname: device.hostname,
    command: `copy running-config tftp://backup-server/${device.hostname}-config.txt`
}));
```

#### 2. filter() - Lọc dữ liệu

```javascript
// Tìm tất cả thiết bị down
const downDevices = devices.filter(device => device.status === "down");
console.log(downDevices);
// [{ hostname: "SW2", type: "switch", ip: "192.168.1.3", status: "down" }]

// Tìm tất cả switches
const switches = devices.filter(device => device.type === "switch");

// Tìm devices trong subnet 192.168.1.0/24
const localDevices = devices.filter(device => 
    device.ip.startsWith("192.168.1.")
);
```

#### 3. find() - Tìm một phần tử

```javascript
// Tìm router
const router = devices.find(device => device.type === "router");
console.log(router.hostname); // "R1"

// Tìm device theo IP
const findDeviceByIP = (ip) => {
    return devices.find(device => device.ip === ip);
};

console.log(findDeviceByIP("192.168.1.2")); // SW1
```

#### 4. reduce() - Tính toán tổng hợp

```javascript
const interfaces = [
    { name: "Gi0/1", bandwidth: 1000 },
    { name: "Gi0/2", bandwidth: 1000 },
    { name: "Gi0/3", bandwidth: 100 },
    { name: "Gi0/4", bandwidth: 1000 }
];

// Tính tổng bandwidth
const totalBandwidth = interfaces.reduce((sum, iface) => {
    return sum + iface.bandwidth;
}, 0);

console.log(`Total Bandwidth: ${totalBandwidth} Mbps`); // 3100 Mbps
```

#### 5. sort() - Sắp xếp

```javascript
// Sắp xếp devices theo hostname
devices.sort((a, b) => a.hostname.localeCompare(b.hostname));

// Sắp xếp interfaces theo bandwidth (giảm dần)
interfaces.sort((a, b) => b.bandwidth - a.bandwidth);
```

#### 6. forEach() - Duyệt và thực hiện hành động

```javascript
devices.forEach((device, index) => {
    console.log(`${index + 1}. ${device.hostname} (${device.ip}) - ${device.status}`);
});

/* Output:
1. R1 (192.168.1.1) - up
2. SW1 (192.168.1.2) - up
3. SW2 (192.168.1.3) - down
4. FW1 (192.168.1.254) - up
*/
```

## Objects nâng cao

### Nested Objects (Đối tượng lồng nhau)

```javascript
const router = {
    hostname: "R1-Core",
    model: "Cisco ASR 1001-X",
    management: {
        ip: "192.168.1.1",
        subnet: "255.255.255.0",
        gateway: "192.168.1.254"
    },
    interfaces: [
        {
            name: "GigabitEthernet0/0/0",
            ip: "10.1.1.1",
            subnet: "255.255.255.252",
            status: "up",
            description: "Link to R2"
        },
        {
            name: "GigabitEthernet0/0/1",
            ip: "10.1.2.1",
            subnet: "255.255.255.252",
            status: "up",
            description: "Link to SW1"
        }
    ],
    routing: {
        protocol: "OSPF",
        processId: 1,
        networks: ["10.1.1.0/30", "10.1.2.0/30", "192.168.1.0/24"]
    }
};

// Truy cập nested properties
console.log(router.management.ip);              // "192.168.1.1"
console.log(router.interfaces[0].name);         // "GigabitEthernet0/0/0"
console.log(router.routing.protocol);           // "OSPF"
```

### Destructuring - Rút gọn code

```javascript
// Object destructuring
const { hostname, model, management } = router;
console.log(hostname);  // "R1-Core"
console.log(model);     // "Cisco ASR 1001-X"

// Nested destructuring
const { ip, subnet } = router.management;
console.log(`${ip}/${subnet}`);

// Array destructuring
const [firstInterface, secondInterface] = router.interfaces;
console.log(firstInterface.name); // "GigabitEthernet0/0/0"
```

### Spread Operator (...) - Sao chép và merge

```javascript
// Sao chép object
const routerBackup = { ...router };

// Merge objects
const additionalInfo = {
    location: "DataCenter-A",
    rack: "R01",
    serialNumber: "FCW2143L0GH"
};

const completeRouter = { ...router, ...additionalInfo };

// Thêm/Update properties
const updatedRouter = {
    ...router,
    firmware: "17.3.4a",
    lastBackup: "2023-10-20"
};
```

### Object Methods hữu ích

```javascript
// Object.keys() - Lấy danh sách keys
const keys = Object.keys(router);
console.log(keys); // ["hostname", "model", "management", "interfaces", "routing"]

// Object.values() - Lấy danh sách values
const values = Object.values(router);

// Object.entries() - Lấy cặp key-value
Object.entries(router.management).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
});

/* Output:
ip: 192.168.1.1
subnet: 255.255.255.0
gateway: 192.168.1.254
*/
```

## JSON - JavaScript Object Notation

JSON là định dạng dữ liệu chuẩn cho REST APIs.

### JSON.stringify() - Convert Object thành JSON

```javascript
const vlanConfig = {
    vlanId: 10,
    name: "Management",
    ipAddress: "192.168.10.1",
    subnetMask: "255.255.255.0"
};

const jsonString = JSON.stringify(vlanConfig);
console.log(jsonString);
// {"vlanId":10,"name":"Management","ipAddress":"192.168.10.1","subnetMask":"255.255.255.0"}

// Pretty print với indent
const prettyJson = JSON.stringify(vlanConfig, null, 2);
console.log(prettyJson);
/*
{
  "vlanId": 10,
  "name": "Management",
  "ipAddress": "192.168.10.1",
  "subnetMask": "255.255.255.0"
}
*/
```

### JSON.parse() - Convert JSON thành Object

```javascript
const jsonResponse = '{"hostname":"SW1","ip":"192.168.1.2","status":"up"}';

const deviceData = JSON.parse(jsonResponse);
console.log(deviceData.hostname); // "SW1"
console.log(deviceData.status);   // "up"
```

## Ví dụ thực tế: Xử lý Cisco API Response

### 1. Parse Interface Statistics

```javascript
// Giả lập response từ Cisco device
const interfaceStatsJSON = `{
  "ietf-interfaces:interfaces": {
    "interface": [
      {
        "name": "GigabitEthernet1",
        "enabled": true,
        "oper-status": "up",
        "statistics": {
          "in-octets": "1234567890",
          "out-octets": "9876543210",
          "in-errors": "0",
          "out-errors": "0"
        }
      },
      {
        "name": "GigabitEthernet2",
        "enabled": true,
        "oper-status": "down",
        "statistics": {
          "in-octets": "0",
          "out-octets": "0",
          "in-errors": "5",
          "out-errors": "2"
        }
      }
    ]
  }
}`;

// Parse JSON
const data = JSON.parse(interfaceStatsJSON);
const interfaces = data["ietf-interfaces:interfaces"].interface;

// Phân tích dữ liệu
interfaces.forEach(iface => {
    console.log(`\nInterface: ${iface.name}`);
    console.log(`  Status: ${iface["oper-status"]}`);
    console.log(`  In: ${(parseInt(iface.statistics["in-octets"]) / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Out: ${(parseInt(iface.statistics["out-octets"]) / 1024 / 1024).toFixed(2)} MB`);
    
    if (iface.statistics["in-errors"] !== "0" || iface.statistics["out-errors"] !== "0") {
        console.log(`  ⚠️  Errors detected!`);
    }
});
```

### 2. Generate Configuration Payload

```javascript
// Tạo payload cho REST API để cấu hình VLAN
function generateVLANPayload(vlanId, name, interfaces) {
    return {
        "ietf-vlans:vlan": {
            "vlan-id": vlanId,
            "name": name,
            "status": "active",
            "interfaces": interfaces.map(iface => ({
                "interface-name": iface,
                "mode": "access"
            }))
        }
    };
}

const payload = generateVLANPayload(20, "Sales", ["Gi0/1", "Gi0/2", "Gi0/3"]);
console.log(JSON.stringify(payload, null, 2));

/*
{
  "ietf-vlans:vlan": {
    "vlan-id": 20,
    "name": "Sales",
    "status": "active",
    "interfaces": [
      { "interface-name": "Gi0/1", "mode": "access" },
      { "interface-name": "Gi0/2", "mode": "access" },
      { "interface-name": "Gi0/3", "mode": "access" }
    ]
  }
}
*/
```

### 3. Network Inventory Management

```javascript
class NetworkInventory {
    constructor() {
        this.devices = [];
    }
    
    addDevice(hostname, type, ip, model) {
        const device = {
            id: this.devices.length + 1,
            hostname,
            type,
            ip,
            model,
            addedDate: new Date().toISOString(),
            status: "unknown"
        };
        
        this.devices.push(device);
        return device;
    }
    
    getDevicesByType(type) {
        return this.devices.filter(device => device.type === type);
    }
    
    updateDeviceStatus(hostname, status) {
        const device = this.devices.find(d => d.hostname === hostname);
        if (device) {
            device.status = status;
            device.lastUpdate = new Date().toISOString();
            return true;
        }
        return false;
    }
    
    exportToJSON() {
        return JSON.stringify({
            inventory: this.devices,
            totalDevices: this.devices.length,
            exportDate: new Date().toISOString()
        }, null, 2);
    }
    
    importFromJSON(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            this.devices = data.inventory;
            return true;
        } catch (error) {
            console.error("Invalid JSON format");
            return false;
        }
    }
    
    generateReport() {
        const devicesByType = {};
        this.devices.forEach(device => {
            devicesByType[device.type] = (devicesByType[device.type] || 0) + 1;
        });
        
        return {
            total: this.devices.length,
            breakdown: devicesByType,
            upDevices: this.devices.filter(d => d.status === "up").length,
            downDevices: this.devices.filter(d => d.status === "down").length
        };
    }
}

// Sử dụng
const inventory = new NetworkInventory();

inventory.addDevice("R1-Core", "router", "192.168.1.1", "Cisco ISR 4331");
inventory.addDevice("SW1-Access", "switch", "192.168.1.2", "Cisco 2960-X");
inventory.addDevice("SW2-Access", "switch", "192.168.1.3", "Cisco 2960-X");
inventory.addDevice("FW1", "firewall", "192.168.1.254", "Cisco ASA 5516");

inventory.updateDeviceStatus("R1-Core", "up");
inventory.updateDeviceStatus("SW1-Access", "up");
inventory.updateDeviceStatus("SW2-Access", "down");
inventory.updateDeviceStatus("FW1", "up");

console.log(inventory.generateReport());
/*
{
  total: 4,
  breakdown: { router: 1, switch: 2, firewall: 1 },
  upDevices: 3,
  downDevices: 1
}
*/

// Export to JSON
const jsonExport = inventory.exportToJSON();
console.log(jsonExport);
```

## Async JavaScript - Làm việc với APIs

### Promises và Async/Await

```javascript
// Giả lập API call đến network device
function pingDevice(ip) {
    return new Promise((resolve, reject) => {
        console.log(`Pinging ${ip}...`);
        
        setTimeout(() => {
            // Giả lập kết quả ping
            const success = Math.random() > 0.2;
            if (success) {
                resolve({
                    ip: ip,
                    status: "reachable",
                    latency: Math.floor(Math.random() * 50) + 1
                });
            } else {
                reject(new Error(`${ip} is unreachable`));
            }
        }, 1000);
    });
}

// Sử dụng async/await
async function checkDevices() {
    const devices = ["192.168.1.1", "192.168.1.2", "192.168.1.3"];
    
    for (const ip of devices) {
        try {
            const result = await pingDevice(ip);
            console.log(`✅ ${result.ip}: ${result.status} (${result.latency}ms)`);
        } catch (error) {
            console.log(`❌ ${error.message}`);
        }
    }
}

checkDevices();
```

## Bài tập thực hành

### Bài 1: VLAN Database Manager
Tạo class quản lý VLANs với các tính năng:
- Add/Remove VLAN
- Export/Import JSON
- Validate VLAN ID (1-4094)
- Kiểm tra trùng lặp

### Bài 2: Interface Statistics Parser
Parse output từ `show interface` và tính toán:
- Tổng traffic (in/out)
- Error rate
- Utilization percentage

### Bài 3: Configuration Diff Tool
So sánh 2 JSON config files và hiển thị sự khác biệt.

## Kết luận

Việc thành thạo Arrays, Objects và JSON là then chốt để làm việc với modern network APIs. Những kiến thức này sẽ giúp bạn:

- Xử lý dữ liệu từ REST APIs
- Tạo automation scripts hiệu quả
- Parse và analyze network data
- Build network management tools

Trong bài tiếp theo, chúng ta sẽ học về **Python Socket Programming** để xây dựng ứng dụng network thực tế!

## Tài liệu tham khảo

- JavaScript Essentials 2 - Cisco Networking Academy
- MDN: Working with JSON
- Cisco DevNet: REST API Fundamentals
- Node.js Async Programming Guide

---

*Thực hành là chìa khóa! Hãy làm các bài tập và thử nghiệm với real APIs nhé!*
