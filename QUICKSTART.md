# ⚡ Quick Start Guide

Hướng dẫn nhanh để deploy blog lên GitHub Pages trong 5 phút!

## 🚀 Deploy trong 3 bước

### Bước 1: Push lên GitHub

```bash
# Mở terminal tại thư mục project
cd d:\VanThang2208.github.io

# Initialize git (nếu chưa có)
git init
git branch -M main

# Add remote (thay YOUR_USERNAME)
git remote add origin https://github.com/VanThang2208/VanThang2208.github.io.git

# Commit tất cả
git add .
git commit -m "Initial commit: Hugo blog với 9 bài viết"

# Push
git push -u origin main
```

### Bước 2: Enable GitHub Pages

1. Truy cập: `https://github.com/VanThang2208/VanThang2208.github.io`
2. Click **Settings** → **Pages**
3. Source: **GitHub Actions**
4. Đợi workflow chạy (1-2 phút)

### Bước 3: Xem Website

🌐 Truy cập: **https://VanThang2208.github.io**

---

## 📝 Update Blog

### Thêm bài viết mới

```bash
cd hugo-blog

# Tạo bài mới
hugo new content/posts/bai-viet-moi.md

# Edit file: hugo-blog/content/posts/bai-viet-moi.md
# (Dùng VS Code hoặc editor khác)

# Preview local
hugo server -D
# Mở: http://localhost:1313

# Nếu OK, commit và push
git add .
git commit -m "Add: bài viết mới về XXX"
git push origin main

# Đợi 1-2 phút → Website tự động update!
```

### Edit bài cũ

```bash
# Edit file trong hugo-blog/content/posts/

# Test
cd hugo-blog
hugo server -D

# Push
git add .
git commit -m "Update: sửa lỗi trong bài OSPF"
git push origin main
```

### Thay đổi theme/design

```bash
# Edit files trong hugo-blog/themes/netcode/

# Test
cd hugo-blog
hugo server -D

# Push
git add .
git commit -m "Style: update header design"
git push origin main
```

---

## 🔧 Local Development

### Install Hugo

**Windows:**
```bash
# Download từ: https://github.com/gohugoio/hugo/releases
# Tìm: hugo_extended_0.152.2_windows-amd64.zip
# Extract và add to PATH
```

**Mac:**
```bash
brew install hugo
```

**Linux:**
```bash
sudo snap install hugo
```

### Run local server

```bash
cd hugo-blog
hugo server -D

# Mở browser: http://localhost:1313
# Auto-reload khi save files
```

---

## 📂 File Structure

```
VanThang2208.github.io/
├── hugo-blog/              ← Edit đây!
│   ├── content/posts/     ← Blog posts
│   ├── themes/netcode/    ← Theme files
│   ├── static/images/     ← Images
│   └── hugo.toml          ← Config
│
├── index.html             ← Built files (auto-generated)
├── posts/                 ← Built posts
├── .github/workflows/     ← Auto-deploy config
└── README.md              ← Documentation
```

**⚠️ Chỉ edit files trong `hugo-blog/`!**

Files ngoài root được auto-generate, không edit trực tiếp.

---

## ✅ Checklist

Trước khi push lên GitHub:

- [ ] Test local: `hugo server -D`
- [ ] Check spelling/grammar
- [ ] Code examples work
- [ ] Images load correctly
- [ ] Links work
- [ ] Build success: `hugo --cleanDestinationDir`

---

## 🆘 Help

### Website không hiển thị?

1. Check GitHub Actions: Repository → Actions tab
2. Nếu có ❌ đỏ → Click để xem lỗi
3. Fix lỗi → Commit → Push lại

### CSS không load?

```bash
# Rebuild
cd hugo-blog
hugo --cleanDestinationDir
git add .
git commit -m "Fix: rebuild CSS"
git push origin main
```

### Port 1313 đã được dùng?

```bash
# Kill process
# Windows:
netstat -ano | findstr :1313
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:1313 | xargs kill
```

---

## 📚 More Info

- **Full Guide**: [DEPLOY.md](DEPLOY.md)
- **Contributing**: [CONTRIBUTING.md](CONTRIBUTING.md)
- **Hugo Docs**: [gohugo.io/documentation](https://gohugo.io/documentation/)

---

**🎉 That's it! Happy blogging!**

Made with ❤️ by Đào Văn Thắng
