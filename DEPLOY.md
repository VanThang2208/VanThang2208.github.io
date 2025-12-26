# 🚀 Hướng dẫn Deploy lên GitHub Pages

## Bước 1: Chuẩn bị Repository

### 1.1. Initialize Git (nếu chưa có)

```bash
cd d:\VanThang2208.github.io
git init
git branch -M main
```

### 1.2. Kiểm tra .gitignore

File `.gitignore` đã được tạo tự động với nội dung phù hợp.

## Bước 2: Push lên GitHub

### 2.1. Tạo Repository trên GitHub

1. Truy cập [github.com/new](https://github.com/new)
2. Repository name: **VanThang2208.github.io** (chính xác tên này)
3. Public repository
4. **KHÔNG** chọn "Add README" (đã có sẵn)
5. Click "Create repository"

### 2.2. Liên kết và Push

```bash
# Add remote
git remote add origin https://github.com/VanThang2208/VanThang2208.github.io.git

# Stage all files
git add .

# Commit
git commit -m "Initial commit: Hugo blog với 9 bài viết"

# Push
git push -u origin main
```

## Bước 3: Cấu hình GitHub Pages

### 3.1. Enable GitHub Pages

1. Truy cập repository: `https://github.com/VanThang2208/VanThang2208.github.io`
2. Click **Settings** tab
3. Trong sidebar bên trái, click **Pages**
4. Source:
   - Select **GitHub Actions** (không phải "Deploy from branch")
   - Workflow sẽ tự động chạy file `.github/workflows/hugo.yml`

### 3.2. Verify Workflow

1. Click **Actions** tab
2. Xem workflow "Deploy Hugo site to GitHub Pages" đang chạy
3. Đợi 1-2 phút cho workflow hoàn thành (màu xanh ✅)
4. Nếu có lỗi màu đỏ ❌, click vào để xem log

## Bước 4: Truy cập Website

Sau khi workflow hoàn thành, truy cập:

🌐 **https://VanThang2208.github.io**

## Workflow Tự động

### Cách hoạt động

```
Push code lên GitHub
       ↓
GitHub Actions trigger
       ↓
Build Hugo site (hugo-blog/)
       ↓
Copy public/ ra root
       ↓
Deploy to GitHub Pages
       ↓
Website live! 🎉
```

### Mỗi lần update

```bash
# Edit files trong hugo-blog/content/posts/
# Hoặc thay đổi theme trong hugo-blog/themes/netcode/

# Test local
cd hugo-blog
hugo server -D
# Kiểm tra: http://localhost:1313

# Commit và push
git add .
git commit -m "Update: thêm bài viết mới"
git push origin main

# Đợi 1-2 phút → Website tự động update!
```

## Troubleshooting

### Lỗi 404 - Page not found

**Nguyên nhân:**
- BaseURL sai
- GitHub Pages chưa enable

**Giải pháp:**
1. Kiểm tra `hugo-blog/hugo.toml`:
   ```toml
   baseURL = 'https://vanthang2208.github.io/'
   ```
2. Đảm bảo GitHub Pages Source = GitHub Actions

### Lỗi Workflow Failed

**Kiểm tra:**
1. Actions tab → Click vào workflow failed
2. Xem log để tìm lỗi
3. Common issues:
   - Hugo version không đúng
   - Theme không tìm thấy
   - Syntax error trong hugo.toml

**Giải pháp:**
- Fix lỗi trong code
- Commit và push lại
- Workflow sẽ tự động chạy lại

#### Lỗi `Get Pages site failed` / `HttpError: Not Found`

**Nguyên nhân:** GitHub Pages chưa được bật để xây dựng bằng GitHub Actions hoặc workflow không có cờ `enablement` để bật Pages tự động.

**Giải pháp:**
- Trong repository Settings → Pages, đảm bảo `Source` đang là **GitHub Actions** (nếu có thể).
- Nếu workflow vẫn lỗi, mở file `.github/workflows/hugo.yml` và thêm cho step `actions/configure-pages@v4` phần `with:\n  enablement: github-actions` (đã được cập nhật trong workflow mẫu của repo).
- Đảm bảo `permissions` trong workflow có `pages: write` và `id-token: write`.

Sau khi sửa, commit và push để kích hoạt lại workflow.

### CSS không load

**Nguyên nhân:**
- baseURL không đúng
- Missing .nojekyll file

**Giải pháp:**
1. Kiểm tra file `.nojekyll` tồn tại ở root
2. Kiểm tra baseURL trong hugo.toml
3. Clear browser cache (Ctrl + Shift + R)

### Ảnh không hiển thị

**Nguyên nhân:**
- Ảnh chưa được copy vào static/

**Giải pháp:**
```bash
# Copy ảnh vào hugo-blog/static/images/
Copy-Item -Path "images\*" -Destination "hugo-blog\static\images\" -Recurse -Force

# Rebuild và push
cd hugo-blog
hugo --cleanDestinationDir
git add .
git commit -m "Fix: thêm images"
git push origin main
```

## Manual Build (Alternative)

Nếu không dùng GitHub Actions, có thể build manual:

```bash
# 1. Build Hugo site
cd hugo-blog
hugo --cleanDestinationDir

# 2. Copy to root
Copy-Item -Path "public\*" -Destination ".." -Recurse -Force

# 3. Push
cd ..
git add .
git commit -m "Manual deploy"
git push origin main

# 4. GitHub Pages Settings
# Source: Deploy from a branch
# Branch: main / (root)
```

## Custom Domain (Optional)

Nếu có domain riêng (vd: vanthang.dev):

### 1. Tạo file CNAME

```bash
# Trong hugo-blog/static/
echo "vanthang.dev" > hugo-blog/static/CNAME
```

### 2. Cấu hình DNS

Tại domain registrar (Namecheap, GoDaddy, etc):

**A Records:**
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**CNAME Record:**
```
www.vanthang.dev → VanThang2208.github.io
```

### 3. Update hugo.toml

```toml
baseURL = 'https://vanthang.dev/'
```

### 4. GitHub Settings

1. Settings → Pages
2. Custom domain: `vanthang.dev`
3. ✅ Enforce HTTPS

Đợi 24-48 giờ để DNS propagate.

## Performance Tips

### 1. Minify Output

Đã được bật trong workflow:
```yaml
hugo --gc --minify
```

### 2. Image Optimization

Sử dụng:
- WebP format
- Compressed images
- Lazy loading

### 3. CDN

GitHub Pages đã có CDN built-in, không cần config thêm.

## Backup Strategy

### 1. Git History

```bash
# View history
git log --oneline

# Restore từ commit cũ
git checkout <commit-hash>
```

### 2. Export Content

```bash
# Backup all markdown files
Copy-Item -Path "hugo-blog\content\posts\*" -Destination "backup\posts\" -Recurse

# Backup configuration
Copy-Item -Path "hugo-blog\hugo.toml" -Destination "backup\"
```

### 3. GitHub Releases

Tạo release cho mỗi version quan trọng:

1. GitHub repository → Releases
2. Create new release
3. Tag: v1.0.0, v1.1.0, etc.
4. Title: "Blog launch với 9 bài viết"

## Monitoring

### 1. GitHub Actions

- Email notifications khi workflow fail
- Check Actions tab regularly

### 2. Analytics (Optional)

Thêm Google Analytics:

```html
<!-- hugo-blog/themes/netcode/layouts/partials/head.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

## Support

Gặp vấn đề? Check:

1. **GitHub Actions logs** - Chi tiết lỗi build
2. **Hugo documentation** - https://gohugo.io/documentation/
3. **GitHub Pages docs** - https://docs.github.com/pages
4. **Issue tracker** - Tạo issue trong repo

---

**🎉 Chúc mừng! Website của bạn đã live!**

**📝 Next steps:**
- Thêm bài viết mới
- Customize theme
- Promote trên social media
- Monitor analytics

Made with ❤️ by Đào Văn Thắng
