# 🤝 Contributing to NetCode Blog

Cảm ơn bạn đã quan tâm đến việc đóng góp cho blog! Mọi đóng góp đều được hoan nghênh.

## 📋 Các cách đóng góp

### 1. Report Bugs

Nếu tìm thấy lỗi:

1. Check [Issues](https://github.com/VanThang2208/VanThang2208.github.io/issues) xem đã có ai report chưa
2. Nếu chưa, [create new issue](https://github.com/VanThang2208/VanThang2208.github.io/issues/new)
3. Include:
   - Mô tả lỗi rõ ràng
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (nếu có)
   - Browser/OS info

### 2. Suggest Features

Có ý tưởng mới?

1. [Create issue](https://github.com/VanThang2208/VanThang2208.github.io/issues/new) với label `enhancement`
2. Mô tả chi tiết feature
3. Giải thích tại sao nó hữu ích
4. Đề xuất implementation (nếu có)

### 3. Fix Bugs / Add Features

#### Step 1: Fork Repository

```bash
# Click "Fork" button trên GitHub
# Clone fork về máy
git clone https://github.com/YOUR_USERNAME/VanThang2208.github.io.git
cd VanThang2208.github.io
```

#### Step 2: Create Branch

```bash
# Create feature branch
git checkout -b feature/amazing-feature

# Or bugfix branch
git checkout -b fix/issue-123
```

#### Step 3: Make Changes

**For content changes:**
```bash
cd hugo-blog

# Edit/add files trong content/posts/
# hoặc themes/netcode/

# Test local
hugo server -D
# Preview: http://localhost:1313
```

**Coding standards:**
- Markdown files: Use proper formatting
- HTML: Semantic HTML5
- CSS: Follow existing Tailwind patterns
- JavaScript: ES6+ syntax, comments for complex logic
- Python: PEP 8 style

#### Step 4: Test

```bash
# Build to check for errors
cd hugo-blog
hugo --cleanDestinationDir

# Check output
ls -la public/
```

#### Step 5: Commit

```bash
# Stage changes
git add .

# Commit with meaningful message
git commit -m "feat: add search functionality"

# Or for bug fix
git commit -m "fix: correct OSPF configuration example"
```

**Commit message format:**
```
<type>: <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

#### Step 6: Push

```bash
git push origin feature/amazing-feature
```

#### Step 7: Pull Request

1. Truy cập fork trên GitHub
2. Click "Compare & pull request"
3. Fill in PR template:
   - **Title**: Clear, descriptive
   - **Description**: 
     - What changes were made
     - Why they were needed
     - Any related issues
   - **Screenshots**: For UI changes
4. Submit PR

### 4. Write Blog Posts

Muốn contribute bài viết?

#### Template

```markdown
---
title: "Tiêu đề Bài Viết"
date: 2024-12-26
draft: false
category: "CƠ BẢN"  # hoặc NÂNG CAO, LẬP TRÌNH, AUTOMATION, THỰC HÀNH
tags: ["networking", "cisco", "python"]
image: "https://picsum.photos/seed/keyword/600/400"
summary: "Mô tả ngắn gọn 1-2 câu về nội dung"
---

## Giới thiệu

Giới thiệu tổng quan...

## Nội dung chính

### Phần 1

Chi tiết...

### Phần 2

Chi tiết...

## Code Examples

\`\`\`python
# Code với comments rõ ràng
def example():
    pass
\`\`\`

## Kết luận

Tổng kết...

## Tài liệu tham khảo

- Link 1
- Link 2
```

#### Guidelines

- **Length**: 1500-2500 words
- **Structure**: Clear headings, subheadings
- **Code**: Include practical examples
- **Images**: Use relevant images/diagrams
- **Language**: Vietnamese, technical terms in English
- **Accuracy**: Double-check technical info
- **References**: Cite sources

## 🎨 Style Guide

### Markdown

```markdown
# H1 for title (1 per post)
## H2 for major sections
### H3 for subsections

- Use bullet points
- For lists

1. Numbered lists
2. For steps

**Bold** for emphasis
*Italic* for terms
`code` for inline code

> Blockquotes for important notes
```

### Code Blocks

```markdown
\`\`\`python
# Always include language
# Add comments
def function():
    pass
\`\`\`
```

### Links

```markdown
[descriptive text](url)
[Internal link](/posts/post-name/)
```

### Images

```markdown
![Alt text](image-url)
# Or use Picsum for placeholder
![Network Diagram](https://picsum.photos/seed/keyword/600/400)
```

## 📝 Review Process

1. **Automated checks**: GitHub Actions runs on every PR
2. **Manual review**: Maintainer reviews code/content
3. **Feedback**: Requested changes (if needed)
4. **Merge**: Once approved

Timeline: Usually 2-7 days

## 🐛 Bug Priority

- **Critical**: Site down, data loss → Immediate
- **High**: Major feature broken → 1-3 days
- **Medium**: Minor issues → 1 week
- **Low**: Cosmetic issues → When available

## 💡 Feature Priority

- **Security**: Highest priority
- **Performance**: High priority
- **User experience**: Medium priority
- **Nice-to-have**: Low priority

## 📧 Questions?

- **Issues**: Technical questions
- **Discussions**: General discussions
- **Email**: daovanthang.dev@gmail.com

## 🎯 Good First Issues

Look for issues labeled `good first issue` - these are perfect for beginners!

## 🙏 Recognition

All contributors will be:
- Listed in README.md
- Mentioned in release notes
- Credited in relevant blog posts

## ⚖️ Code of Conduct

Be respectful, inclusive, and constructive. We're here to learn together!

---

**Thank you for contributing! 🎉**

Every contribution, no matter how small, makes a difference!
