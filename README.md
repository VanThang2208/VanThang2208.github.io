# 🌐 Đào Văn Thắng - Personal Blog & Portfolio

[![Hugo](https://img.shields.io/badge/Hugo-0.152.2-blue.svg)](https://gohugo.io/)
[![GitHub Pages](https://img.shields.io/badge/Deployed%20on-GitHub%20Pages-success)](https://VanThang2208.github.io)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> Blog cá nhân chia sẻ kiến thức về **Network Engineering** và **Programming**

## 👨‍💻 Giới thiệu

Xin chào! Mình là **Đào Văn Thắng**, sinh viên ngành **Công nghệ Phần mềm** tại **HUTECH**. Blog này là nơi mình chia sẻ kiến thức và kinh nghiệm học tập về:

- 🌐 **Networking**: OSI Model, TCP/IP, Routing (OSPF), Subnetting, VLANs
- 💻 **Programming**: JavaScript, Python, Network Automation
- 🔧 **DevOps**: REST APIs, RESTCONF, Network Management
- 🧪 **Labs**: Cisco Packet Tracer, Hands-on Practice

## 📚 Nội dung Blog

### 9 Bài viết chuyên sâu:

1. **[Networking Basics: OSI & TCP/IP](/posts/01-networking-basics-osi-tcpip/)**
   - Tầng OSI 7 layers chi tiết
   - TCP/IP model và so sánh
   - Encapsulation process

2. **[JavaScript Essentials 1](/posts/02-javascript-essentials-1/)**
   - JavaScript cho Network Engineers
   - Biến, functions, control structures
   - JSON và network data

3. **[JavaScript Essentials 2: Objects & JSON](/posts/03-javascript-essentials-2-objects-json/)**
   - Arrays methods (map, filter, reduce)
   - Objects và nested data
   - API response parsing

4. **[Python Socket Programming](/posts/04-python-socket-programming/)**
   - TCP/UDP socket programming
   - Chat server, Port scanner
   - Network applications thực tế

5. **[Subnetting & VLSM](/posts/05-subnetting-vlsm/)**
   - Công thức subnetting
   - VLSM design thực tế
   - Python subnet calculator

6. **[OSPF Routing Protocol](/posts/06-ospf-routing-protocol/)**
   - OSPF configuration trên Cisco
   - Multi-area design
   - DR/BDR election và troubleshooting

7. **[Network Automation với Python](/posts/07-network-automation-python/)**
   - Netmiko, Paramiko libraries
   - Backup configurations tự động
   - Mass deployment scripts

8. **[REST APIs & RESTCONF](/posts/08-rest-apis-restconf/)**
   - REST fundamentals
   - Cisco DNA Center API
   - Python requests library

9. **[Cisco Packet Tracer Labs](/posts/09-cisco-packet-tracer-labs/)**
   - 8+ hands-on labs thực hành
   - VLAN, Routing, OSPF, NAT
   - Troubleshooting scenarios

## 🛠️ Công nghệ sử dụng

- **Static Site Generator**: [Hugo](https://gohugo.io/) v0.152.2 Extended
- **Theme**: Custom "netcode" theme
- **Styling**: Tailwind CSS (CDN)
- **Font**: Inter (Google Fonts)
- **Hosting**: GitHub Pages
- **CI/CD**: GitHub Actions (auto-deploy)
- **Version Control**: Git

## 🚀 Local Development

### Prerequisites

- Hugo Extended v0.152.2 hoặc mới hơn ([Download](https://github.com/gohugoio/hugo/releases))
- Git

### Chạy local

```bash
# Clone repository
git clone https://github.com/VanThang2208/VanThang2208.github.io.git
cd VanThang2208.github.io

# Chạy Hugo development server
cd hugo-blog
hugo server -D

# Truy cập: http://localhost:1313/
```

### Build for production

```bash
cd hugo-blog

# Build static site
hugo --cleanDestinationDir

# Files được generate trong public/
# Copy sang root để deploy lên GitHub Pages
Copy-Item -Path "public\*" -Destination ".." -Recurse -Force
```

## 📁 Cấu trúc Project

```
VanThang2208.github.io/
├── hugo-blog/              # Hugo source files
│   ├── content/
│   │   └── posts/         # Blog posts (9 markdown files)
│   ├── themes/
│   │   └── netcode/       # Custom theme
│   │       ├── layouts/   # HTML templates
│   │       │   ├── _default/
│   │       │   │   ├── baseof.html
│   │       │   │   ├── list.html
│   │       │   │   └── single.html
│   │       │   ├── partials/
│   │       │   │   ├── header.html
│   │       │   │   └── footer.html
│   │       │   └── index.html
│   │       └── static/
│   ├── static/
│   │   └── images/        # Static assets
│   └── hugo.toml          # Hugo configuration
├── index.html             # Built homepage (from hugo-blog/public/)
├── posts/                 # Built blog posts (9 posts)
│   ├── 01-networking-basics-osi-tcpip/
│   ├── 02-javascript-essentials-1/
│   ├── 03-javascript-essentials-2-objects-json/
│   ├── 04-python-socket-programming/
│   ├── 05-subnetting-vlsm/
│   ├── 06-ospf-routing-protocol/
│   ├── 07-network-automation-python/
│   ├── 08-rest-apis-restconf/
│   └── 09-cisco-packet-tracer-labs/
├── categories/            # Category pages
├── tags/                  # Tag pages
├── images/                # Static images
├── .github/
│   └── workflows/
│       └── hugo.yml       # GitHub Actions workflow
├── .gitignore
└── README.md
```

## 📝 Viết bài mới

```bash
cd hugo-blog

# Tạo bài viết mới
hugo new content/posts/ten-bai-viet.md

# Edit file trong content/posts/ten-bai-viet.md
# Chạy server để xem preview
hugo server -D
```

### Frontmatter template

```yaml
---
title: "Tiêu đề bài viết"
date: 2024-01-01
draft: false
category: "CƠ BẢN"  # hoặc NÂNG CAO, LẬP TRÌNH, AUTOMATION, THỰC HÀNH
tags: ["networking", "programming", "cisco"]
image: "https://picsum.photos/seed/random/600/400"
summary: "Mô tả ngắn gọn về bài viết"
---
```

## 🌟 Features

✨ **Responsive Design** - Hoạt động tốt trên mọi thiết bị  
📱 **Mobile-friendly** - Navigation với hamburger menu  
🎨 **Modern UI** - Tailwind CSS styling  
⚡ **Fast Loading** - Static site generation với Hugo  
🔍 **SEO Optimized** - Meta tags, sitemap, RSS feed  
📊 **Categories & Tags** - Phân loại bài viết rõ ràng  
⏱️ **Reading Time** - Ước tính thời gian đọc  
🗂️ **Breadcrumbs** - Navigation dễ dàng  
💬 **Code Highlighting** - Syntax highlighting cho code blocks  
📄 **Pagination** - Tự động phân trang cho blog posts

## Cách sử dụng

1. Clone repository này
2. Mở file `index.html` trong trình duyệt
3. Hoặc deploy lên GitHub Pages

## 🚀 Deploy lên GitHub Pages

### Automatic Deployment với GitHub Actions (Recommended)

GitHub Actions tự động build và deploy khi push code:

```bash
# Commit changes
git add .
git commit -m "Update blog content"

# Push to main branch
git push origin main

# GitHub Actions sẽ tự động:
# 1. Build Hugo site
# 2. Deploy to GitHub Pages
# Sau 1-2 phút, site sẽ update tại https://VanThang2208.github.io
```

### Manual Deployment

```bash
# Build Hugo site
cd hugo-blog
hugo --cleanDestinationDir

# Copy to root
Copy-Item -Path "public\*" -Destination ".." -Recurse -Force

# Commit và push
git add .
git commit -m "Manual deploy"
git push origin main
```

### GitHub Pages Settings

1. Vào repository Settings > Pages
2. Source: Deploy from a branch
3. Branch: `main` / folder: `/root`
4. Save
5. Website: `https://VanThang2208.github.io`

## 🎓 Chứng chỉ

- **Networking Basics** - Cisco Networking Academy
- **JavaScript Essentials 1** - Cisco Networking Academy  
- **JavaScript Essentials 2** - Cisco Networking Academy
- **Python Essentials** - Cisco Networking Academy

## 📧 Liên hệ

- **Email**: daovanthang.dev@gmail.com
- **GitHub**: [@VanThang2208](https://github.com/VanThang2208)
- **LinkedIn**: [Đào Văn Thắng](https://linkedin.com/in/vanthang)
- **Location**: TP. Hồ Chí Minh, Việt Nam

## 📊 Statistics

- **9 Blog Posts** - 2000+ words mỗi bài
- **8+ Lab Exercises** - Hands-on practice
- **100+ Code Examples** - Real-world scenarios
- **3 Categories**: Cơ bản, Nâng cao, Automation
- **30+ Tags**: Networking, Programming, DevOps

## 🤝 Contributing

Nếu bạn tìm thấy lỗi hoặc muốn đóng góp:

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add some AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Mở Pull Request

## 📄 License

Nội dung blog được phân phối dưới [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/).

Code được phân phối dưới [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Hugo](https://gohugo.io/) - Amazing static site generator
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Cisco Networking Academy](https://www.netacad.com/) - Learning resources
- [GitHub Pages](https://pages.github.com/) - Free hosting
- [Netmiko](https://github.com/ktbyers/netmiko) - Network automation library
- HUTECH - Môi trường học tập tuyệt vời

## 📈 Roadmap

- [ ] Thêm search functionality
- [ ] Dark mode toggle
- [ ] Comments section (Disqus/utterances)
- [ ] Newsletter subscription
- [ ] More lab examples với GNS3
- [ ] Video tutorials
- [ ] English version

---

**⭐ Nếu thấy blog hữu ích, hãy star repo này nhé!**

**📚 Happy Learning! Keep Coding & Keep Networking!**

Made with ❤️ by Đào Văn Thắng - HUTECH Student 