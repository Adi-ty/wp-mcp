# WordPress MCP Server

[![npm version](https://badge.fury.io/js/@adi.lib%2Fwp-mcp.svg)](https://badge.fury.io/js/@adi.lib%2Fwp-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A MCP server that connects WordPress sites to AI agents. Enable Claude Desktop, Cursor, VS Code, and other MCP-compatible AI clients to manage your WordPress content through natural language commands.

## ✨ Features

- 🔗 **Direct WordPress Integration** - Connect to any WordPress site via REST API
- 🛠 **Comprehensive Content Management** - Create, read, update, and delete posts, pages, taxonomies, users and media
- 🔒 **Secure Authentication** - Uses WordPress Application Passwords

## 🎥 Demo

[Demo Video on GitHub](https://github.com/user-attachments/assets/83780664-7924-49bd-8862-075d2f84d312)

## 🚀 Installation

```bash
npm install @adi.lib/wp-mcp
```

### Requirements

- Node.js v18 or higher
- WordPress site with REST API enabled
- WordPress Application Password

## 🔧 Configuration

### Environment Variables

| Variable          | Description          | Example               |
| ----------------- | -------------------- | --------------------- |
| `WP_BASE_URL`     | WordPress site URL   | `https://mysite.com`  |
| `WP_USERNAME`     | WordPress username   | `admin`               |
| `WP_APP_PASSWORD` | Application password | `abc1 def2 ghi3 jkl4` |

### Setup WordPress Application Password

1. Go to your WordPress Admin Dashboard
2. Navigate to **Users → Your Profile**
3. Scroll down to **Application Passwords**
4. Enter a name for your application (e.g., "MCP Server")
5. Click **Add New Application Password**
6. Copy the generated password and use it as `WP_APP_PASSWORD`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your improvements
4. Test thoroughly with a WordPress site
5. Submit a pull request

## 📝 License

[MIT License](LICENSE)

---
