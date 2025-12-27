---
title: "REST APIs & RESTCONF: Giao tiếp với Network Devices hiện đại"
date: 2023-11-22
draft: false
category: "AUTOMATION"
tags: ["rest-api", "restconf", "netconf", "api", "automation", "devnet"]
image: "/images/post-08-rest-apis-restconf.png"
summary: "Tìm hiểu về REST APIs, RESTCONF và cách sử dụng Python Requests để tương tác với modern network devices. Từ lý thuyết đến thực hành với Cisco devices."
---

## Giới thiệu REST APIs

### API là gì?

**API (Application Programming Interface)** là cách để các phần mềm giao tiếp với nhau.

```
┌──────────────┐                  ┌──────────────┐
│              │   HTTP Request   │              │
│  Your Script │ ───────────────> │ Network      │
│  (Python)    │                  │ Device API   │
│              │ <─────────────── │              │
└──────────────┘  HTTP Response   └──────────────┘
```

### REST là gì?

**REST (Representational State Transfer)** là architectural style cho APIs:

**Đặc điểm:**
- **Stateless**: Mỗi request độc lập
- **Client-Server**: Tách biệt client và server
- **Cacheable**: Responses có thể cache
- **Uniform Interface**: Consistent API structure
- **Layered System**: Có thể có proxy, load balancer

### HTTP Methods

| Method | Purpose | Example |
|--------|---------|---------|
| **GET** | Retrieve data | Get interface info |
| **POST** | Create new resource | Create new VLAN |
| **PUT** | Update/Replace resource | Update interface config |
| **PATCH** | Partially update | Change interface description |
| **DELETE** | Delete resource | Remove VLAN |

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| **200 OK** | Request successful |
| **201 Created** | Resource created |
| **204 No Content** | Successful, no data returned |
| **400 Bad Request** | Invalid request |
| **401 Unauthorized** | Authentication required |
| **403 Forbidden** | No permission |
| **404 Not Found** | Resource doesn't exist |
| **500 Internal Server Error** | Server error |

## Python Requests Library

### Cài đặt

```bash
pip install requests
```

### Basic GET Request

```python
import requests
import json

# Simple GET request
url = 'https://api.example.com/data'
response = requests.get(url)

print(f"Status Code: {response.status_code}")
print(f"Response: {response.text}")

# Parse JSON response
if response.status_code == 200:
    data = response.json()
    print(json.dumps(data, indent=2))
```

### Authentication

#### Basic Auth

```python
import requests
from requests.auth import HTTPBasicAuth

url = 'https://device.example.com/api/interface'
username = 'admin'
password = 'cisco123'

response = requests.get(
    url,
    auth=HTTPBasicAuth(username, password),
    verify=False  # Disable SSL verification (lab only!)
)
```

#### Token-based Auth

```python
import requests

url = 'https://api.example.com/data'
headers = {
    'Authorization': 'Bearer your_token_here',
    'Content-Type': 'application/json'
}

response = requests.get(url, headers=headers)
```

### POST Request

```python
import requests
import json

url = 'https://device.example.com/api/vlans'

# Data to send
payload = {
    'vlan-id': 20,
    'name': 'Sales',
    'status': 'active'
}

headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}

response = requests.post(
    url,
    data=json.dumps(payload),
    headers=headers,
    auth=('admin', 'cisco123'),
    verify=False
)

print(f"Status: {response.status_code}")
print(f"Response: {response.text}")
```

## RESTCONF Overview

### RESTCONF là gì?

**RESTCONF** là IETF standard (RFC 8040) để access configuration và operational data trên network devices sử dụng REST principles.

**Features:**
- Built on HTTP/HTTPS
- Data encoded in JSON hoặc XML
- Uses YANG data models
- Standard operations (GET, POST, PUT, PATCH, DELETE)

### RESTCONF vs NETCONF

| Feature | RESTCONF | NETCONF |
|---------|----------|---------|
| Transport | HTTP/HTTPS | SSH |
| Data Format | JSON, XML | XML only |
| Complexity | Simpler | More complex |
| Operations | REST methods | RPC-based |

### Enable RESTCONF on Cisco IOS-XE

```
Router(config)# ip http server
Router(config)# ip http secure-server
Router(config)# ip http authentication local
Router(config)# restconf
```

## Working with Cisco RESTCONF

### 1. Get All Interfaces

```python
import requests
import json
import urllib3

# Disable SSL warnings (lab only!)
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

class CiscoRESTCONF:
    def __init__(self, host, username, password):
        self.host = host
        self.base_url = f"https://{host}/restconf"
        self.auth = (username, password)
        self.headers = {
            'Accept': 'application/yang-data+json',
            'Content-Type': 'application/yang-data+json'
        }
    
    def get_interfaces(self):
        """
        Get all interfaces
        """
        url = f"{self.base_url}/data/ietf-interfaces:interfaces"
        
        try:
            response = requests.get(
                url,
                auth=self.auth,
                headers=self.headers,
                verify=False
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"Error: {response.status_code}")
                print(response.text)
                return None
                
        except Exception as e:
            print(f"Exception: {e}")
            return None
    
    def get_interface(self, interface_name):
        """
        Get specific interface
        """
        url = f"{self.base_url}/data/ietf-interfaces:interfaces/interface={interface_name}"
        
        try:
            response = requests.get(
                url,
                auth=self.auth,
                headers=self.headers,
                verify=False
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                return None
                
        except Exception as e:
            print(f"Exception: {e}")
            return None

# Usage
device = CiscoRESTCONF(
    host='192.168.1.1',
    username='admin',
    password='cisco123'
)

# Get all interfaces
print("Fetching all interfaces...")
interfaces = device.get_interfaces()

if interfaces:
    print(json.dumps(interfaces, indent=2))
    
    # Print summary
    interface_list = interfaces['ietf-interfaces:interfaces']['interface']
    print(f"\nFound {len(interface_list)} interfaces:")
    for iface in interface_list:
        print(f"  - {iface['name']}: {iface.get('description', 'No description')}")
```

### 2. Configure Interface

```python
def configure_interface(self, interface_name, description, ip_address, netmask):
    """
    Configure interface via RESTCONF
    """
    url = f"{self.base_url}/data/ietf-interfaces:interfaces/interface={interface_name}"
    
    payload = {
        "ietf-interfaces:interface": {
            "name": interface_name,
            "description": description,
            "type": "iana-if-type:ethernetCsmacd",
            "enabled": True,
            "ietf-ip:ipv4": {
                "address": [
                    {
                        "ip": ip_address,
                        "netmask": netmask
                    }
                ]
            }
        }
    }
    
    try:
        response = requests.put(
            url,
            auth=self.auth,
            headers=self.headers,
            data=json.dumps(payload),
            verify=False
        )
        
        if response.status_code in [200, 201, 204]:
            print(f"[+] Interface {interface_name} configured successfully")
            return True
        else:
            print(f"[!] Error: {response.status_code}")
            print(response.text)
            return False
            
    except Exception as e:
        print(f"[!] Exception: {e}")
        return False

# Add to CiscoRESTCONF class and use:
device.configure_interface(
    interface_name='GigabitEthernet2',
    description='Configured via RESTCONF',
    ip_address='10.1.1.1',
    netmask='255.255.255.0'
)
```

### 3. Get Routing Table

```python
def get_routing_table(self):
    """
    Get IP routing table
    """
    url = f"{self.base_url}/data/ietf-routing:routing/routing-instance=default"
    
    try:
        response = requests.get(
            url,
            auth=self.auth,
            headers=self.headers,
            verify=False
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            return None
            
    except Exception as e:
        print(f"Exception: {e}")
        return None

# Usage
routing_data = device.get_routing_table()

if routing_data:
    print("Routing Table:")
    print(json.dumps(routing_data, indent=2))
```

## Cisco DNA Center API

### Authentication

```python
import requests
import json

class DNACenterAPI:
    def __init__(self, host, username, password):
        self.host = host
        self.base_url = f"https://{host}"
        self.username = username
        self.password = password
        self.token = None
    
    def get_auth_token(self):
        """
        Get authentication token
        """
        url = f"{self.base_url}/dna/system/api/v1/auth/token"
        
        response = requests.post(
            url,
            auth=(self.username, self.password),
            headers={'Content-Type': 'application/json'},
            verify=False
        )
        
        if response.status_code == 200:
            self.token = response.json()['Token']
            print("[+] Authentication successful")
            return self.token
        else:
            print(f"[!] Authentication failed: {response.status_code}")
            return None
    
    def get_headers(self):
        """
        Return headers with auth token
        """
        return {
            'X-Auth-Token': self.token,
            'Content-Type': 'application/json'
        }
    
    def get_devices(self):
        """
        Get all network devices
        """
        if not self.token:
            self.get_auth_token()
        
        url = f"{self.base_url}/dna/intent/api/v1/network-device"
        
        response = requests.get(
            url,
            headers=self.get_headers(),
            verify=False
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            print(f"[!] Error: {response.status_code}")
            return None
    
    def get_device_detail(self, device_id):
        """
        Get detailed info for specific device
        """
        url = f"{self.base_url}/dna/intent/api/v1/network-device/{device_id}"
        
        response = requests.get(
            url,
            headers=self.get_headers(),
            verify=False
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            return None

# Usage
dnac = DNACenterAPI(
    host='sandboxdnac.cisco.com',
    username='devnetuser',
    password='Cisco123!'
)

# Get auth token
dnac.get_auth_token()

# Get all devices
print("\nFetching devices...")
devices = dnac.get_devices()

if devices:
    device_list = devices['response']
    print(f"\nFound {len(device_list)} devices:")
    
    for device in device_list:
        print(f"\n{'-'*60}")
        print(f"Hostname: {device.get('hostname', 'N/A')}")
        print(f"Type: {device.get('type', 'N/A')}")
        print(f"IP: {device.get('managementIpAddress', 'N/A')}")
        print(f"Serial: {device.get('serialNumber', 'N/A')}")
        print(f"Software: {device.get('softwareVersion', 'N/A')}")
        print(f"Status: {device.get('reachabilityStatus', 'N/A')}")
```

## Meraki Dashboard API

```python
import requests
import json

class MerakiAPI:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = 'https://api.meraki.com/api/v1'
        self.headers = {
            'X-Cisco-Meraki-API-Key': self.api_key,
            'Content-Type': 'application/json'
        }
    
    def get_organizations(self):
        """
        Get all organizations
        """
        url = f"{self.base_url}/organizations"
        
        response = requests.get(url, headers=self.headers)
        
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error: {response.status_code}")
            return None
    
    def get_networks(self, org_id):
        """
        Get networks in an organization
        """
        url = f"{self.base_url}/organizations/{org_id}/networks"
        
        response = requests.get(url, headers=self.headers)
        
        if response.status_code == 200:
            return response.json()
        else:
            return None
    
    def get_devices(self, network_id):
        """
        Get devices in a network
        """
        url = f"{self.base_url}/networks/{network_id}/devices"
        
        response = requests.get(url, headers=self.headers)
        
        if response.status_code == 200:
            return response.json()
        else:
            return None
    
    def update_device(self, serial, name=None, tags=None):
        """
        Update device configuration
        """
        url = f"{self.base_url}/devices/{serial}"
        
        payload = {}
        if name:
            payload['name'] = name
        if tags:
            payload['tags'] = tags
        
        response = requests.put(
            url,
            headers=self.headers,
            data=json.dumps(payload)
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error: {response.status_code}")
            return None

# Usage
meraki = MerakiAPI(api_key='your_api_key_here')

# Get organizations
orgs = meraki.get_organizations()

if orgs:
    print("Organizations:")
    for org in orgs:
        print(f"  - {org['name']} (ID: {org['id']})")
        
        # Get networks
        networks = meraki.get_networks(org['id'])
        if networks:
            print(f"    Networks:")
            for net in networks:
                print(f"      - {net['name']}")
```

## Error Handling và Best Practices

### 1. Comprehensive Error Handling

```python
import requests
from requests.exceptions import (
    ConnectionError,
    Timeout,
    HTTPError,
    RequestException
)

def safe_api_call(url, method='GET', **kwargs):
    """
    Safe API call with error handling
    """
    try:
        if method == 'GET':
            response = requests.get(url, timeout=10, **kwargs)
        elif method == 'POST':
            response = requests.post(url, timeout=10, **kwargs)
        elif method == 'PUT':
            response = requests.put(url, timeout=10, **kwargs)
        elif method == 'DELETE':
            response = requests.delete(url, timeout=10, **kwargs)
        
        # Raise exception for bad status codes
        response.raise_for_status()
        
        return response
        
    except ConnectionError:
        print("[!] Connection error - check network/host")
        return None
    except Timeout:
        print("[!] Request timeout")
        return None
    except HTTPError as e:
        print(f"[!] HTTP Error: {e}")
        return None
    except RequestException as e:
        print(f"[!] Request failed: {e}")
        return None
```

### 2. Rate Limiting

```python
import time
from functools import wraps

def rate_limit(calls_per_second=2):
    """
    Decorator to limit API calls
    """
    min_interval = 1.0 / calls_per_second
    last_called = [0.0]
    
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            elapsed = time.time() - last_called[0]
            wait_time = min_interval - elapsed
            
            if wait_time > 0:
                time.sleep(wait_time)
            
            result = func(*args, **kwargs)
            last_called[0] = time.time()
            
            return result
        return wrapper
    return decorator

# Usage
@rate_limit(calls_per_second=2)
def api_call(url):
    return requests.get(url)
```

### 3. Retry Logic

```python
import time

def retry_api_call(func, max_retries=3, delay=2):
    """
    Retry failed API calls
    """
    for attempt in range(max_retries):
        try:
            result = func()
            return result
        except Exception as e:
            print(f"[!] Attempt {attempt + 1} failed: {e}")
            
            if attempt < max_retries - 1:
                print(f"[*] Retrying in {delay} seconds...")
                time.sleep(delay)
                delay *= 2  # Exponential backoff
            else:
                print("[!] Max retries reached")
                return None

# Usage
def my_api_call():
    response = requests.get('https://api.example.com/data')
    response.raise_for_status()
    return response.json()

result = retry_api_call(my_api_call, max_retries=3)
```

### 4. Response Caching

```python
import json
import hashlib
import os
from datetime import datetime, timedelta

class APICache:
    def __init__(self, cache_dir='api_cache', ttl_seconds=3600):
        self.cache_dir = cache_dir
        self.ttl = timedelta(seconds=ttl_seconds)
        
        if not os.path.exists(cache_dir):
            os.makedirs(cache_dir)
    
    def get_cache_key(self, url, params=None):
        """
        Generate cache key from URL and params
        """
        key_string = url
        if params:
            key_string += str(sorted(params.items()))
        
        return hashlib.md5(key_string.encode()).hexdigest()
    
    def get(self, url, params=None):
        """
        Get cached response
        """
        key = self.get_cache_key(url, params)
        cache_file = os.path.join(self.cache_dir, f"{key}.json")
        
        if os.path.exists(cache_file):
            # Check if cache is still valid
            file_time = datetime.fromtimestamp(os.path.getmtime(cache_file))
            
            if datetime.now() - file_time < self.ttl:
                with open(cache_file, 'r') as f:
                    return json.load(f)
        
        return None
    
    def set(self, url, data, params=None):
        """
        Cache response
        """
        key = self.get_cache_key(url, params)
        cache_file = os.path.join(self.cache_dir, f"{key}.json")
        
        with open(cache_file, 'w') as f:
            json.dump(data, f)

# Usage
cache = APICache(ttl_seconds=600)  # 10 minutes

url = 'https://api.example.com/devices'

# Try cache first
cached_data = cache.get(url)

if cached_data:
    print("[*] Using cached data")
    devices = cached_data
else:
    print("[*] Fetching fresh data")
    response = requests.get(url)
    devices = response.json()
    cache.set(url, devices)
```

## Testing APIs với Postman

### Postman là gì?

**Postman** là tool phổ biến để test và develop APIs.

**Features:**
- GUI để tạo requests
- Collections để organize requests
- Environment variables
- Test automation
- API documentation

### Basic Workflow

1. **Create Collection**: Organize related requests
2. **Add Request**: GET, POST, PUT, DELETE
3. **Set Headers**: Authentication, Content-Type
4. **Add Body**: JSON payload for POST/PUT
5. **Send Request**: View response
6. **Save**: Reuse later

## Bài tập thực hành

### Bài 1: Device Inventory Tool
Tạo script Python:
- Connect to DNA Center API
- Fetch all devices
- Generate CSV report
- Include: hostname, IP, type, software version

### Bài 2: Interface Configuration Tool
Sử dụng RESTCONF:
- Get list of interfaces
- Update description for multiple interfaces
- Error handling và logging

### Bài 3: Network Monitoring Dashboard
- Fetch device status từ API
- Display trong terminal (colors)
- Auto-refresh every 30 seconds
- Alert on down devices

## Kết luận

REST APIs revolutionize network management:

- **Programmable infrastructure**
- **Automation at scale**
- **Integration** với other systems
- **Modern DevOps** workflows

Skills cần có:
- HTTP/REST fundamentals
- JSON handling
- Python requests library
- Error handling
- API documentation reading

Trong bài cuối, chúng ta sẽ thực hành **Cisco Packet Tracer Labs** - áp dụng tất cả kiến thức đã học!

## Tài liệu tham khảo

- RFC 8040 - RESTCONF Protocol
- Cisco DevNet APIs Documentation
- Python Requests Documentation
- Postman Learning Center

---

*APIs are the future of networking! Master them now!*
