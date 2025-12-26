---
title: "Network Automation với Python: Từ Manual đến Automation"
date: 2023-11-15
draft: false
category: "AUTOMATION"
tags: ["python", "automation", "netmiko", "paramiko", "devnet", "scripting"]
image: "https://picsum.photos/seed/net7/600/400"
summary: "Học cách tự động hóa các tác vụ mạng với Python. Sử dụng Netmiko, Paramiko để kết nối và cấu hình hàng loạt network devices một cách hiệu quả."
---

## Giới thiệu Network Automation

### Tại sao cần Automation?

**Problems với Manual Configuration:**
- ⏱️ **Time-consuming**: Cấu hình từng device mất nhiều thời gian
- 🐛 **Error-prone**: Con người dễ sai sót
- 📊 **Not scalable**: Không thể quản lý hàng trăm devices
- 📝 **Poor documentation**: Khó track changes
- 🔄 **Inconsistent**: Cấu hình không đồng nhất

**Benefits của Automation:**
- ✅ **Speed**: Deploy changes nhanh chóng
- ✅ **Accuracy**: Giảm human errors
- ✅ **Scalability**: Quản lý nhiều devices dễ dàng
- ✅ **Consistency**: Cấu hình thống nhất
- ✅ **Documentation**: Code = documentation

### NetDevOps Stack

```
┌─────────────────────────────────┐
│   Python Scripts / Ansible      │ ← Automation Layer
├─────────────────────────────────┤
│   APIs (NETCONF, RESTCONF)      │ ← API Layer
│   SSH (Netmiko, Paramiko)       │
├─────────────────────────────────┤
│   Network Devices               │ ← Infrastructure
│   (Cisco, Juniper, Arista)      │
└─────────────────────────────────┘
```

## Python Libraries cho Network Automation

### 1. Netmiko
- SSH connections đến network devices
- Hỗ trợ nhiều vendors (Cisco, Juniper, Arista, HP, etc.)
- High-level, dễ sử dụng

### 2. Paramiko
- Low-level SSH library
- Flexible hơn nhưng phức tạp hơn
- Base library cho Netmiko

### 3. NAPALM
- Multi-vendor library
- Unified API cho các vendors khác nhau
- Hỗ trợ get/merge/replace configurations

### 4. Nornir
- Automation framework
- Multi-threading cho performance
- Plugin-based architecture

## Cài đặt Libraries

```bash
# Virtual environment (recommended)
python -m venv netauto-env
source netauto-env/bin/activate  # Linux/Mac
netauto-env\Scripts\activate     # Windows

# Install libraries
pip install netmiko paramiko napalm nornir
```

## Netmiko - SSH Automation

### Connect đến Cisco Device

```python
from netmiko import ConnectHandler

# Device information
cisco_router = {
    'device_type': 'cisco_ios',
    'host': '192.168.1.1',
    'username': 'admin',
    'password': 'cisco123',
    'secret': 'enable_pass',  # Enable password
    'port': 22,
}

# Connect
try:
    connection = ConnectHandler(**cisco_router)
    
    # Enter enable mode
    connection.enable()
    
    # Send command
    output = connection.send_command('show ip interface brief')
    print(output)
    
    # Disconnect
    connection.disconnect()
    
except Exception as e:
    print(f"Error: {e}")
```

### Configuration Mode

```python
from netmiko import ConnectHandler

cisco_router = {
    'device_type': 'cisco_ios',
    'host': '192.168.1.1',
    'username': 'admin',
    'password': 'cisco123',
}

connection = ConnectHandler(**cisco_router)
connection.enable()

# Single command
config_command = 'hostname R1-CORE'
output = connection.send_config_set(config_command)

# Multiple commands
config_commands = [
    'interface GigabitEthernet0/1',
    'description Uplink to Core Switch',
    'ip address 10.1.1.1 255.255.255.0',
    'no shutdown'
]

output = connection.send_config_set(config_commands)
print(output)

# Save configuration
save_output = connection.save_config()
print(save_output)

connection.disconnect()
```

## Ví dụ 1: Backup Configurations

```python
from netmiko import ConnectHandler
from datetime import datetime
import os

def backup_device_config(device_info, backup_dir='backups'):
    """
    Backup configuration của một device
    """
    try:
        # Create backup directory
        if not os.path.exists(backup_dir):
            os.makedirs(backup_dir)
        
        # Connect
        print(f"[*] Connecting to {device_info['host']}...")
        connection = ConnectHandler(**device_info)
        connection.enable()
        
        # Get hostname
        hostname = connection.send_command('show run | include hostname')
        hostname = hostname.split()[1] if len(hostname.split()) > 1 else device_info['host']
        
        # Get configuration
        print(f"[*] Backing up configuration for {hostname}...")
        config = connection.send_command('show running-config')
        
        # Save to file
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{backup_dir}/{hostname}_{timestamp}.cfg"
        
        with open(filename, 'w') as f:
            f.write(config)
        
        print(f"[+] Backup saved: {filename}")
        
        connection.disconnect()
        return filename
        
    except Exception as e:
        print(f"[!] Error backing up {device_info['host']}: {e}")
        return None

# Device list
devices = [
    {
        'device_type': 'cisco_ios',
        'host': '192.168.1.1',
        'username': 'admin',
        'password': 'cisco123',
        'secret': 'enable_pass'
    },
    {
        'device_type': 'cisco_ios',
        'host': '192.168.1.2',
        'username': 'admin',
        'password': 'cisco123',
        'secret': 'enable_pass'
    },
]

# Backup all devices
print("="*60)
print("Network Device Backup Script")
print("="*60 + "\n")

for device in devices:
    backup_device_config(device)
    print()
```

## Ví dụ 2: Mass Configuration Deployment

```python
from netmiko import ConnectHandler
import csv

def deploy_vlan_config(device_info, vlan_id, vlan_name, interfaces):
    """
    Deploy VLAN configuration to a switch
    """
    try:
        connection = ConnectHandler(**device_info)
        connection.enable()
        
        hostname = connection.find_prompt()[:-1]
        print(f"\n[*] Configuring {hostname}...")
        
        # Create VLAN
        vlan_commands = [
            f'vlan {vlan_id}',
            f'name {vlan_name}'
        ]
        
        output = connection.send_config_set(vlan_commands)
        print(f"[+] VLAN {vlan_id} created")
        
        # Configure interfaces
        for interface in interfaces:
            int_commands = [
                f'interface {interface}',
                'switchport mode access',
                f'switchport access vlan {vlan_id}',
                f'description {vlan_name} VLAN'
            ]
            
            output = connection.send_config_set(int_commands)
            print(f"[+] Interface {interface} configured for VLAN {vlan_id}")
        
        # Save config
        connection.save_config()
        print(f"[+] Configuration saved on {hostname}")
        
        connection.disconnect()
        return True
        
    except Exception as e:
        print(f"[!] Error: {e}")
        return False

# Example usage
switches = [
    {
        'device_type': 'cisco_ios',
        'host': '192.168.1.10',
        'username': 'admin',
        'password': 'cisco123',
    },
    {
        'device_type': 'cisco_ios',
        'host': '192.168.1.11',
        'username': 'admin',
        'password': 'cisco123',
    },
]

# Deploy VLAN 20 (Sales) to multiple switches
vlan_id = 20
vlan_name = "Sales"
interfaces = ['GigabitEthernet0/1', 'GigabitEthernet0/2', 'GigabitEthernet0/3']

print("="*60)
print("VLAN Deployment Script")
print("="*60)

for switch in switches:
    deploy_vlan_config(switch, vlan_id, vlan_name, interfaces)
```

## Ví dụ 3: Network Inventory Collection

```python
from netmiko import ConnectHandler
import json
from datetime import datetime

def collect_device_info(device_info):
    """
    Collect inventory information from device
    """
    try:
        connection = ConnectHandler(**device_info)
        connection.enable()
        
        # Collect various show commands
        inventory = {
            'timestamp': datetime.now().isoformat(),
            'host': device_info['host'],
            'version': connection.send_command('show version'),
            'interfaces': connection.send_command('show ip interface brief'),
            'routing': connection.send_command('show ip route'),
            'cdp_neighbors': connection.send_command('show cdp neighbors'),
            'running_config': connection.send_command('show running-config'),
        }
        
        connection.disconnect()
        return inventory
        
    except Exception as e:
        print(f"[!] Error collecting info from {device_info['host']}: {e}")
        return None

def parse_version_info(version_output):
    """
    Parse version information
    """
    info = {}
    
    for line in version_output.split('\n'):
        if 'Cisco IOS Software' in line:
            info['ios_version'] = line.strip()
        elif 'System image file' in line:
            info['image_file'] = line.split('"')[1]
        elif 'uptime is' in line:
            info['uptime'] = line.split('uptime is')[1].strip()
        elif line.startswith('cisco'):
            parts = line.split()
            if len(parts) >= 2:
                info['model'] = parts[1]
    
    return info

def generate_inventory_report(devices):
    """
    Generate inventory report from multiple devices
    """
    report = []
    
    print("\n" + "="*80)
    print("Network Inventory Collection")
    print("="*80 + "\n")
    
    for device in devices:
        print(f"[*] Collecting from {device['host']}...")
        
        inventory = collect_device_info(device)
        
        if inventory:
            parsed_info = parse_version_info(inventory['version'])
            
            device_report = {
                'host': device['host'],
                'model': parsed_info.get('model', 'Unknown'),
                'ios_version': parsed_info.get('ios_version', 'Unknown'),
                'uptime': parsed_info.get('uptime', 'Unknown'),
                'interfaces_summary': inventory['interfaces'].count('up'),
            }
            
            report.append(device_report)
            print(f"[+] Completed: {device['host']}")
            print(f"    Model: {device_report['model']}")
            print(f"    IOS: {device_report['ios_version']}")
    
    # Save report
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f'inventory_report_{timestamp}.json'
    
    with open(filename, 'w') as f:
        json.dump(report, f, indent=2)
    
    print(f"\n[+] Report saved: {filename}")
    
    return report

# Example usage
devices = [
    {'device_type': 'cisco_ios', 'host': '192.168.1.1', 'username': 'admin', 'password': 'cisco123'},
    {'device_type': 'cisco_ios', 'host': '192.168.1.2', 'username': 'admin', 'password': 'cisco123'},
]

report = generate_inventory_report(devices)
```

## Ví dụ 4: Configuration Compliance Checker

```python
from netmiko import ConnectHandler

def check_compliance(device_info, compliance_rules):
    """
    Check device configuration against compliance rules
    """
    try:
        connection = ConnectHandler(**device_info)
        connection.enable()
        
        hostname = connection.find_prompt()[:-1]
        print(f"\n[*] Checking compliance for {hostname}")
        print("-" * 60)
        
        config = connection.send_command('show running-config')
        
        violations = []
        passed = []
        
        for rule_name, rule_check in compliance_rules.items():
            if rule_check in config:
                passed.append(rule_name)
                print(f"[✓] {rule_name}: PASS")
            else:
                violations.append(rule_name)
                print(f"[✗] {rule_name}: FAIL")
        
        connection.disconnect()
        
        # Summary
        print("-" * 60)
        print(f"Total Checks: {len(compliance_rules)}")
        print(f"Passed: {len(passed)}")
        print(f"Failed: {len(violations)}")
        
        return {
            'hostname': hostname,
            'passed': passed,
            'violations': violations
        }
        
    except Exception as e:
        print(f"[!] Error: {e}")
        return None

# Define compliance rules
COMPLIANCE_RULES = {
    'Login Banner': 'banner login',
    'SSH Version 2': 'ip ssh version 2',
    'Password Encryption': 'service password-encryption',
    'Logging Buffered': 'logging buffered',
    'NTP Configured': 'ntp server',
    'SNMP Community': 'snmp-server community',
}

# Check devices
devices = [
    {'device_type': 'cisco_ios', 'host': '192.168.1.1', 'username': 'admin', 'password': 'cisco123'},
    {'device_type': 'cisco_ios', 'host': '192.168.1.2', 'username': 'admin', 'password': 'cisco123'},
]

print("="*60)
print("Configuration Compliance Checker")
print("="*60)

results = []
for device in devices:
    result = check_compliance(device, COMPLIANCE_RULES)
    if result:
        results.append(result)
```

## Ví dụ 5: Interface Monitoring Script

```python
from netmiko import ConnectHandler
import re
import time

def get_interface_stats(device_info, interface):
    """
    Get interface statistics
    """
    try:
        connection = ConnectHandler(**device_info)
        connection.enable()
        
        # Get interface counters
        output = connection.send_command(f'show interface {interface}')
        
        stats = {}
        
        # Parse output
        if 'line protocol is up' in output:
            stats['status'] = 'up'
        else:
            stats['status'] = 'down'
        
        # Extract statistics using regex
        patterns = {
            'input_packets': r'(\d+) packets input',
            'output_packets': r'(\d+) packets output',
            'input_errors': r'(\d+) input errors',
            'output_errors': r'(\d+) output errors',
            'input_rate': r'input rate (\d+) bits/sec',
            'output_rate': r'output rate (\d+) bits/sec',
        }
        
        for key, pattern in patterns.items():
            match = re.search(pattern, output)
            if match:
                stats[key] = int(match.group(1))
        
        connection.disconnect()
        return stats
        
    except Exception as e:
        print(f"[!] Error: {e}")
        return None

def monitor_interface(device_info, interface, interval=60, threshold_errors=100):
    """
    Monitor interface and alert on errors
    """
    print(f"[*] Monitoring {device_info['host']} - {interface}")
    print(f"[*] Interval: {interval} seconds")
    print(f"[*] Error threshold: {threshold_errors}")
    print("-" * 60)
    
    try:
        while True:
            stats = get_interface_stats(device_info, interface)
            
            if stats:
                timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
                
                print(f"\n[{timestamp}] {interface}")
                print(f"  Status: {stats.get('status', 'unknown')}")
                print(f"  Input Rate: {stats.get('input_rate', 0)} bps")
                print(f"  Output Rate: {stats.get('output_rate', 0)} bps")
                print(f"  Input Errors: {stats.get('input_errors', 0)}")
                print(f"  Output Errors: {stats.get('output_errors', 0)}")
                
                # Check thresholds
                total_errors = stats.get('input_errors', 0) + stats.get('output_errors', 0)
                
                if total_errors > threshold_errors:
                    print(f"\n⚠️  ALERT: High error count ({total_errors}) on {interface}!")
                
                if stats['status'] == 'down':
                    print(f"\n⚠️  ALERT: {interface} is DOWN!")
            
            time.sleep(interval)
            
    except KeyboardInterrupt:
        print("\n[!] Monitoring stopped")

# Example usage
device = {
    'device_type': 'cisco_ios',
    'host': '192.168.1.1',
    'username': 'admin',
    'password': 'cisco123',
}

# Monitor GigabitEthernet0/0 every 30 seconds
monitor_interface(device, 'GigabitEthernet0/0', interval=30, threshold_errors=50)
```

## Using CSV Files for Device Inventory

```python
import csv
from netmiko import ConnectHandler

def load_devices_from_csv(filename):
    """
    Load device information from CSV file
    """
    devices = []
    
    with open(filename, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            device = {
                'device_type': row['device_type'],
                'host': row['host'],
                'username': row['username'],
                'password': row['password'],
                'secret': row.get('secret', ''),
            }
            devices.append(device)
    
    return devices

def execute_command_on_devices(devices, command):
    """
    Execute command on multiple devices
    """
    results = []
    
    for device in devices:
        try:
            print(f"\n[*] Connecting to {device['host']}...")
            connection = ConnectHandler(**device)
            connection.enable()
            
            output = connection.send_command(command)
            
            results.append({
                'host': device['host'],
                'success': True,
                'output': output
            })
            
            print(f"[+] Command executed successfully")
            
            connection.disconnect()
            
        except Exception as e:
            print(f"[!] Error: {e}")
            results.append({
                'host': device['host'],
                'success': False,
                'error': str(e)
            })
    
    return results

# CSV file format (devices.csv):
# device_type,host,username,password,secret
# cisco_ios,192.168.1.1,admin,cisco123,enable_pass
# cisco_ios,192.168.1.2,admin,cisco123,enable_pass

devices = load_devices_from_csv('devices.csv')
results = execute_command_on_devices(devices, 'show ip interface brief')

# Print results
for result in results:
    print(f"\n{'='*60}")
    print(f"Device: {result['host']}")
    if result['success']:
        print(result['output'])
    else:
        print(f"Error: {result['error']}")
```

## Best Practices

### 1. Error Handling

```python
from netmiko import ConnectHandler
from netmiko.ssh_exception import NetmikoTimeoutException, NetmikoAuthenticationException

def safe_connect(device_info):
    try:
        connection = ConnectHandler(**device_info)
        return connection
    except NetmikoTimeoutException:
        print(f"[!] Timeout connecting to {device_info['host']}")
    except NetmikoAuthenticationException:
        print(f"[!] Authentication failed for {device_info['host']}")
    except Exception as e:
        print(f"[!] Unexpected error: {e}")
    
    return None
```

### 2. Credential Management

Không nên hard-code credentials!

```python
import os
import getpass

# From environment variables
USERNAME = os.getenv('NET_USERNAME')
PASSWORD = os.getenv('NET_PASSWORD')

# Or prompt user
if not USERNAME:
    USERNAME = input("Username: ")
if not PASSWORD:
    PASSWORD = getpass.getpass("Password: ")
```

### 3. Logging

```python
import logging

logging.basicConfig(
    filename='network_automation.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

logger.info(f"Connected to {device['host']}")
logger.error(f"Failed to connect: {error}")
```

### 4. Configuration Validation

```python
def validate_config_before_deploy(config_lines):
    """
    Validate configuration before deployment
    """
    dangerous_commands = [
        'no ip routing',
        'reload',
        'write erase',
    ]
    
    for line in config_lines:
        for dangerous in dangerous_commands:
            if dangerous in line.lower():
                print(f"[!] WARNING: Dangerous command detected: {line}")
                confirm = input("Continue? (yes/no): ")
                if confirm.lower() != 'yes':
                    return False
    
    return True
```

## Kết luận

Network Automation với Python giúp bạn:

- **Tiết kiệm thời gian** trong operations
- **Giảm errors** từ manual tasks
- **Scale** infrastructure dễ dàng
- **Improve consistency** trong cấu hình
- **Enhance career** prospects (DevNet skills)

Trong bài tiếp theo, chúng ta sẽ học về **REST APIs và RESTCONF** - cách hiện đại để tương tác với network devices!

## Tài liệu tham khảo

- Netmiko Documentation
- Python Network Programming
- Cisco DevNet Learning Labs
- Network Programmability and Automation (O'Reilly)

---

*Automate everything! Work smarter, not harder!*
