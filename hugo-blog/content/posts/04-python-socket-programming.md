---
title: "Python Socket Programming: Xây dựng Network Applications"
date: 2023-10-25
draft: false
category: "LẬP TRÌNH"
tags: ["python", "socket", "networking", "tcp", "udp", "programming"]
image: "/images/post-04-python-socket-programming.png"
summary: "Học lập trình socket với Python để xây dựng các ứng dụng mạng thực tế: chat server, file transfer, port scanner và network monitoring tools."
---

## Giới thiệu Socket Programming

Socket là cơ chế cho phép các chương trình giao tiếp qua mạng. Hiểu socket programming giúp bạn:

- Xây dựng client-server applications
- Tạo network monitoring tools
- Phát triển automation scripts
- Hiểu sâu về TCP/IP stack

## Socket là gì?

Socket là **endpoint** của một kết nối mạng hai chiều. Mỗi socket được định danh bởi:
- **IP Address**: Địa chỉ của host
- **Port Number**: Số hiệu của ứng dụng (0-65535)
- **Protocol**: TCP hoặc UDP

```
Application Layer
       ↕
Socket Interface (API)
       ↕
Transport Layer (TCP/UDP)
       ↕
Network Layer (IP)
```

## Cài đặt và Import

Python có sẵn thư viện `socket`, không cần cài đặt thêm:

```python
import socket
import threading
import time
from datetime import datetime
```

## TCP Socket Programming

### TCP Server cơ bản

```python
import socket

def create_tcp_server(host='127.0.0.1', port=5000):
    """
    Tạo TCP server đơn giản
    """
    # Tạo socket object
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    
    # Cho phép reuse address (tránh lỗi "Address already in use")
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    
    # Bind socket đến address và port
    server_socket.bind((host, port))
    
    # Lắng nghe connections (max 5 pending connections)
    server_socket.listen(5)
    
    print(f"[*] Server listening on {host}:{port}")
    
    try:
        while True:
            # Accept connection
            client_socket, client_address = server_socket.accept()
            print(f"[+] Connection from {client_address[0]}:{client_address[1]}")
            
            # Nhận data
            data = client_socket.recv(1024).decode('utf-8')
            print(f"[*] Received: {data}")
            
            # Gửi response
            response = f"Server received: {data}"
            client_socket.send(response.encode('utf-8'))
            
            # Đóng connection
            client_socket.close()
            
    except KeyboardInterrupt:
        print("\n[!] Server shutting down...")
    finally:
        server_socket.close()

# Chạy server
if __name__ == "__main__":
    create_tcp_server()
```

### TCP Client cơ bản

```python
import socket

def create_tcp_client(host='127.0.0.1', port=5000, message="Hello Server!"):
    """
    Tạo TCP client và gửi message
    """
    # Tạo socket
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    
    try:
        # Kết nối đến server
        client_socket.connect((host, port))
        print(f"[+] Connected to {host}:{port}")
        
        # Gửi data
        client_socket.send(message.encode('utf-8'))
        print(f"[*] Sent: {message}")
        
        # Nhận response
        response = client_socket.recv(1024).decode('utf-8')
        print(f"[*] Received: {response}")
        
    except ConnectionRefusedError:
        print(f"[!] Could not connect to {host}:{port}")
    except Exception as e:
        print(f"[!] Error: {e}")
    finally:
        client_socket.close()

# Test client
if __name__ == "__main__":
    create_tcp_client(message="Test message from client")
```

## Multi-threaded TCP Server

Server có thể xử lý nhiều clients cùng lúc bằng threading:

```python
import socket
import threading

class TCPServer:
    def __init__(self, host='0.0.0.0', port=5000):
        self.host = host
        self.port = port
        self.server_socket = None
        self.clients = []
        
    def handle_client(self, client_socket, address):
        """
        Xử lý mỗi client trong thread riêng
        """
        print(f"[+] New connection: {address[0]}:{address[1]}")
        
        try:
            while True:
                # Nhận data
                data = client_socket.recv(1024)
                
                if not data:
                    break
                
                message = data.decode('utf-8')
                print(f"[{address[0]}:{address[1]}] {message}")
                
                # Echo back
                response = f"Echo: {message}"
                client_socket.send(response.encode('utf-8'))
                
        except Exception as e:
            print(f"[!] Error handling client {address}: {e}")
        finally:
            client_socket.close()
            print(f"[-] Connection closed: {address[0]}:{address[1]}")
    
    def start(self):
        """
        Khởi động server
        """
        # Tạo socket
        self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        
        # Bind và listen
        self.server_socket.bind((self.host, self.port))
        self.server_socket.listen(10)
        
        print(f"[*] Multi-threaded server started on {self.host}:{self.port}")
        print(f"[*] Waiting for connections...")
        
        try:
            while True:
                client_socket, address = self.server_socket.accept()
                
                # Tạo thread mới cho mỗi client
                client_thread = threading.Thread(
                    target=self.handle_client,
                    args=(client_socket, address)
                )
                client_thread.daemon = True
                client_thread.start()
                
                self.clients.append(client_thread)
                
        except KeyboardInterrupt:
            print("\n[!] Server shutting down...")
        finally:
            self.server_socket.close()

# Sử dụng
if __name__ == "__main__":
    server = TCPServer(host='0.0.0.0', port=5000)
    server.start()
```

## UDP Socket Programming

UDP là connectionless protocol - không cần thiết lập kết nối.

### UDP Server

```python
import socket

def create_udp_server(host='0.0.0.0', port=5001):
    """
    Tạo UDP server
    """
    # Tạo UDP socket
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    server_socket.bind((host, port))
    
    print(f"[*] UDP Server listening on {host}:{port}")
    
    try:
        while True:
            # Nhận data (không cần accept)
            data, client_address = server_socket.recvfrom(1024)
            
            message = data.decode('utf-8')
            print(f"[{client_address[0]}:{client_address[1]}] {message}")
            
            # Gửi response
            response = f"UDP Echo: {message}"
            server_socket.sendto(response.encode('utf-8'), client_address)
            
    except KeyboardInterrupt:
        print("\n[!] Server shutting down...")
    finally:
        server_socket.close()

if __name__ == "__main__":
    create_udp_server()
```

### UDP Client

```python
import socket

def create_udp_client(host='127.0.0.1', port=5001, message="Hello UDP!"):
    """
    Tạo UDP client
    """
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    
    try:
        # Gửi data (không cần connect)
        client_socket.sendto(message.encode('utf-8'), (host, port))
        print(f"[*] Sent to {host}:{port}: {message}")
        
        # Nhận response (với timeout)
        client_socket.settimeout(5.0)
        data, server = client_socket.recvfrom(1024)
        print(f"[*] Received: {data.decode('utf-8')}")
        
    except socket.timeout:
        print("[!] Request timed out")
    except Exception as e:
        print(f"[!] Error: {e}")
    finally:
        client_socket.close()

if __name__ == "__main__":
    create_udp_client(message="Test UDP message")
```

## Ví dụ thực tế 1: Simple Chat Server

```python
import socket
import threading

class ChatServer:
    def __init__(self, host='0.0.0.0', port=6000):
        self.host = host
        self.port = port
        self.server_socket = None
        self.clients = {}  # {socket: username}
        
    def broadcast(self, message, sender_socket=None):
        """
        Gửi message đến tất cả clients (trừ sender)
        """
        for client_socket in self.clients:
            if client_socket != sender_socket:
                try:
                    client_socket.send(message.encode('utf-8'))
                except:
                    # Remove dead client
                    self.remove_client(client_socket)
    
    def remove_client(self, client_socket):
        """
        Xóa client khỏi danh sách
        """
        if client_socket in self.clients:
            username = self.clients[client_socket]
            del self.clients[client_socket]
            client_socket.close()
            print(f"[-] {username} disconnected")
            self.broadcast(f"[SERVER] {username} left the chat")
    
    def handle_client(self, client_socket, address):
        """
        Xử lý messages từ client
        """
        try:
            # Nhận username
            client_socket.send("Enter your username: ".encode('utf-8'))
            username = client_socket.recv(1024).decode('utf-8').strip()
            
            if not username:
                username = f"User_{address[1]}"
            
            # Thêm vào danh sách
            self.clients[client_socket] = username
            
            # Thông báo join
            join_msg = f"[SERVER] {username} joined the chat!"
            print(f"[+] {username} ({address[0]}:{address[1]}) joined")
            self.broadcast(join_msg)
            client_socket.send("[SERVER] Welcome to the chat!\n".encode('utf-8'))
            
            # Nhận messages
            while True:
                data = client_socket.recv(1024)
                
                if not data:
                    break
                
                message = data.decode('utf-8').strip()
                
                if message.lower() == '/quit':
                    break
                
                if message.lower() == '/users':
                    users_list = ', '.join(self.clients.values())
                    client_socket.send(f"[SERVER] Online users: {users_list}\n".encode('utf-8'))
                    continue
                
                # Broadcast message
                broadcast_msg = f"[{username}] {message}"
                print(broadcast_msg)
                self.broadcast(broadcast_msg, client_socket)
                
        except Exception as e:
            print(f"[!] Error: {e}")
        finally:
            self.remove_client(client_socket)
    
    def start(self):
        """
        Khởi động chat server
        """
        self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.server_socket.bind((self.host, self.port))
        self.server_socket.listen(10)
        
        print(f"[*] Chat Server started on {self.host}:{self.port}")
        print("[*] Waiting for connections...")
        
        try:
            while True:
                client_socket, address = self.server_socket.accept()
                
                thread = threading.Thread(
                    target=self.handle_client,
                    args=(client_socket, address)
                )
                thread.daemon = True
                thread.start()
                
        except KeyboardInterrupt:
            print("\n[!] Shutting down...")
        finally:
            self.server_socket.close()

if __name__ == "__main__":
    server = ChatServer()
    server.start()
```

### Chat Client

```python
import socket
import threading
import sys

class ChatClient:
    def __init__(self, host='127.0.0.1', port=6000):
        self.host = host
        self.port = port
        self.client_socket = None
        
    def receive_messages(self):
        """
        Nhận messages từ server trong thread riêng
        """
        while True:
            try:
                message = self.client_socket.recv(1024).decode('utf-8')
                if message:
                    print(f"\r{message}")
                    print("You: ", end='', flush=True)
                else:
                    break
            except:
                break
    
    def start(self):
        """
        Kết nối và bắt đầu chat
        """
        try:
            self.client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.client_socket.connect((self.host, self.port))
            
            print(f"[+] Connected to {self.host}:{self.port}")
            
            # Thread nhận messages
            receive_thread = threading.Thread(target=self.receive_messages)
            receive_thread.daemon = True
            receive_thread.start()
            
            # Gửi messages
            while True:
                message = input("You: ")
                
                if message.lower() == '/quit':
                    self.client_socket.send(message.encode('utf-8'))
                    break
                
                self.client_socket.send(message.encode('utf-8'))
                
        except ConnectionRefusedError:
            print(f"[!] Could not connect to {self.host}:{self.port}")
        except KeyboardInterrupt:
            print("\n[!] Disconnecting...")
        finally:
            if self.client_socket:
                self.client_socket.close()

if __name__ == "__main__":
    client = ChatClient()
    client.start()
```

## Ví dụ thực tế 2: Port Scanner

```python
import socket
from datetime import datetime

class PortScanner:
    def __init__(self, target):
        self.target = target
        self.open_ports = []
        
    def scan_port(self, port):
        """
        Kiểm tra một port
        """
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(1)  # Timeout 1 giây
            
            result = sock.connect_ex((self.target, port))
            
            if result == 0:
                try:
                    service = socket.getservbyport(port)
                except:
                    service = "unknown"
                
                self.open_ports.append((port, service))
                print(f"[+] Port {port:<6} OPEN    {service}")
                
            sock.close()
            
        except socket.gaierror:
            print(f"[!] Hostname could not be resolved")
            return
        except socket.error:
            print(f"[!] Could not connect to server")
            return
    
    def scan_range(self, start_port=1, end_port=1024):
        """
        Scan một range ports
        """
        print(f"\n[*] Starting port scan on {self.target}")
        print(f"[*] Scanning ports {start_port}-{end_port}")
        print(f"[*] Scan started at {datetime.now()}\n")
        print("-" * 50)
        
        for port in range(start_port, end_port + 1):
            self.scan_port(port)
        
        print("-" * 50)
        print(f"\n[*] Scan completed at {datetime.now()}")
        print(f"[*] Found {len(self.open_ports)} open ports")
    
    def scan_common_ports(self):
        """
        Scan các ports thông dụng
        """
        common_ports = [
            20, 21,    # FTP
            22,        # SSH
            23,        # Telnet
            25,        # SMTP
            53,        # DNS
            80, 443,   # HTTP/HTTPS
            110,       # POP3
            143,       # IMAP
            3306,      # MySQL
            3389,      # RDP
            5432,      # PostgreSQL
            8080, 8443 # Alt HTTP
        ]
        
        print(f"\n[*] Scanning common ports on {self.target}\n")
        print("-" * 50)
        
        for port in common_ports:
            self.scan_port(port)
        
        print("-" * 50)
        print(f"\n[*] Found {len(self.open_ports)} open ports")

# Sử dụng
if __name__ == "__main__":
    scanner = PortScanner("127.0.0.1")
    
    # Scan common ports
    scanner.scan_common_ports()
    
    # Hoặc scan range
    # scanner.scan_range(1, 100)
```

## Ví dụ thực tế 3: Network Device Connector

```python
import socket
import time

class TelnetClient:
    """
    Simple Telnet client để kết nối network devices
    """
    def __init__(self, host, port=23, timeout=5):
        self.host = host
        self.port = port
        self.timeout = timeout
        self.socket = None
        
    def connect(self):
        """
        Kết nối đến device
        """
        try:
            self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.socket.settimeout(self.timeout)
            self.socket.connect((self.host, self.port))
            
            print(f"[+] Connected to {self.host}:{self.port}")
            return True
            
        except socket.timeout:
            print(f"[!] Connection timeout")
            return False
        except ConnectionRefusedError:
            print(f"[!] Connection refused")
            return False
        except Exception as e:
            print(f"[!] Error: {e}")
            return False
    
    def send_command(self, command):
        """
        Gửi command và nhận output
        """
        if not self.socket:
            print("[!] Not connected")
            return None
        
        try:
            # Gửi command
            self.socket.send((command + '\n').encode('utf-8'))
            time.sleep(0.5)
            
            # Nhận output
            output = ""
            while True:
                try:
                    data = self.socket.recv(4096).decode('utf-8')
                    if not data:
                        break
                    output += data
                except socket.timeout:
                    break
            
            return output
            
        except Exception as e:
            print(f"[!] Error sending command: {e}")
            return None
    
    def close(self):
        """
        Đóng connection
        """
        if self.socket:
            self.socket.close()
            print(f"[-] Disconnected from {self.host}")

# Ví dụ sử dụng với Cisco device
def cisco_backup_config(host, username, password):
    """
    Backup config từ Cisco device
    """
    client = TelnetClient(host)
    
    if not client.connect():
        return None
    
    # Đợi prompt
    time.sleep(2)
    
    # Login
    client.send_command(username)
    time.sleep(1)
    client.send_command(password)
    time.sleep(1)
    
    # Enable mode
    client.send_command("enable")
    time.sleep(1)
    client.send_command(password)
    time.sleep(1)
    
    # Get config
    config = client.send_command("show running-config")
    
    client.close()
    
    return config

# Test
if __name__ == "__main__":
    # Ví dụ đơn giản
    client = TelnetClient("192.168.1.1")
    if client.connect():
        output = client.send_command("show version")
        print(output)
        client.close()
```

## Socket Options và Best Practices

### Các Socket Options quan trọng

```python
import socket

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# Reuse address (tránh lỗi "Address already in use")
sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

# Set timeout
sock.settimeout(10.0)  # 10 giây

# Set buffer size
sock.setsockopt(socket.SOL_SOCKET, socket.SO_RCVBUF, 8192)
sock.setsockopt(socket.SOL_SOCKET, socket.SO_SNDBUF, 8192)

# TCP keepalive
sock.setsockopt(socket.SOL_SOCKET, socket.SO_KEEPALIVE, 1)
```

### Error Handling

```python
import socket

def safe_socket_operation(host, port):
    sock = None
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(5)
        sock.connect((host, port))
        # ... operations ...
        
    except socket.timeout:
        print("Connection timeout")
    except socket.gaierror:
        print("Hostname resolution failed")
    except ConnectionRefusedError:
        print("Connection refused")
    except OSError as e:
        print(f"OS Error: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")
    finally:
        if sock:
            sock.close()
```

## Bài tập thực hành

### Bài 1: HTTP Server
Xây dựng simple HTTP server trả về HTML pages.

### Bài 2: File Transfer
Tạo ứng dụng transfer files qua mạng (TCP).

### Bài 3: Network Monitor
Tool giám sát bandwidth sử dụng và số connections.

### Bài 4: DHCP Discover
Gửi DHCP Discover message và parse response.

## Kết luận

Socket programming là kỹ năng quan trọng cho network engineers và developers. Bạn có thể:

- Xây dựng automation tools
- Tạo monitoring applications
- Hiểu sâu về network protocols
- Debug network issues hiệu quả

Trong bài tiếp theo, chúng ta sẽ học về **Subnetting và VLSM** - kiến thức nền tảng về IP addressing!

## Tài liệu tham khảo

- Python Socket Programming HOWTO
- Beej's Guide to Network Programming
- Python Network Programming Cookbook
- TCP/IP Illustrated by Richard Stevens

---

*Hãy code và test trên môi trường lab an toàn nhé!*
