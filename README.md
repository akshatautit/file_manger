# 📁 Node.js File Manager

A simple web-based file management application built using **pure Node.js core modules** — no frameworks like Express were used. This project was built to understand how a web server actually works under the hood: routing, handling requests/responses, reading and writing files, and serving HTML — all manually.

---

## 🚀 Live Demo (Local)

```bash
node server.js
```

Then open: `http://localhost:3000`

---

## 🎯 Project Overview

This is a basic **CRUD (Create, Read, Delete)** file manager where a user can:

- Create a new text file with custom content, directly from the browser
- View the content of any existing file
- Delete a file
- See a live list of all files currently stored on the server

All files are physically created, read, and deleted from a real folder (`files/`) on the server's disk — this is not a simulation or in-memory mock data.

---

## 🛠️ Tech Stack

| Technology           | Purpose                                  |
| -------------------- | ---------------------------------------- |
| Node.js              | JavaScript runtime                       |
| `http` (core module) | Creating the web server, no Express      |
| `fs` (core module)   | Reading, writing, and deleting files     |
| `path` (core module) | Building safe, OS-independent file paths |
| HTML                 | Frontend structure (forms, file list)    |

> **Note:** This project intentionally avoids Express and other frameworks to build a solid understanding of how routing, middleware-like behavior, and request handling work at a fundamental level before relying on abstractions.

---

## 📂 Project Structure

```
file-manager/
├── server.js              # Main server file — all routing logic lives here
├── package.json           # Project metadata and ES module config
├── files/                 # Auto-created folder — stores all user-created files
├── src/
│   ├── fileManager.js     # Core file operations (create, read, delete, list)
│   ├── eventLogger.js     # Logs every file action with a timestamp
│   ├── systemInfo.js      # Displays system info (OS, CPU, memory) using the "os" module
│   └── urlParser.js       # Demonstrates parsing a URL into its components
└── index.js                # A small script to test file operations directly (no browser needed)
```

---

## ⚙️ How It Works

### Routing (manual, no Express)

Every incoming request is matched manually by checking `req.url` and `req.method`:

| Route                       | Method | Purpose                                                                 |
| --------------------------- | ------ | ----------------------------------------------------------------------- |
| `/`                         | GET    | Shows the home page with the create-file form and the current file list |
| `/create`                   | POST   | Reads form data and creates a new file on disk                          |
| `/view?name=filename.txt`   | GET    | Reads and displays the content of a specific file                       |
| `/delete?name=filename.txt` | GET    | Deletes the specified file from disk                                    |

### Reading form data

Since there's no Express (`req.body` isn't available automatically), incoming POST data is collected manually:

```javascript
req.on("data", (chunk) => {
  body += chunk;
});
req.on("end", () => {
  const data = new URLSearchParams(body);
  const filename = data.get("filename");
});
```

### File operations

All file handling goes through Node's built-in `fs` module:

- `fs.writeFileSync()` → create a file
- `fs.readFileSync()` → read a file's content
- `fs.unlinkSync()` → delete a file
- `fs.readdirSync()` → list all files in the folder

### Auto-creating the storage folder

Before any operation, the app checks whether the `files/` folder exists — if not, it creates it automatically, so the project works on any machine without manual setup:

```javascript
if (!fs.existsSync(FOLDER)) {
  fs.mkdirSync(FOLDER);
}
```

### Using the `os` module (`systemInfo.js`)

This module demonstrates Node's built-in **`os`** module, which gives information about the machine the server is running on — useful for logging, diagnostics, or system-health checks in real backend applications.

```javascript
import os from "os";

export function getSystemInfo() {
  console.log("Platform:", os.platform()); // e.g. 'win32', 'linux', 'darwin'
  console.log("CPU Cores:", os.cpus().length); // number of CPU cores
  console.log("Total Memory (GB):", (os.totalmem() / 1024 ** 3).toFixed(2));
  console.log("Free Memory (GB):", (os.freemem() / 1024 ** 3).toFixed(2));
  console.log("Home Directory:", os.homedir());
}
```

| Method          | What it returns                                        |
| --------------- | ------------------------------------------------------ |
| `os.platform()` | Operating system (`win32`, `linux`, `darwin`)          |
| `os.cpus()`     | Array of CPU core details — `.length` gives core count |
| `os.totalmem()` | Total system RAM (in bytes)                            |
| `os.freemem()`  | Currently free RAM (in bytes)                          |
| `os.homedir()`  | Path to the current user's home directory              |

**Why this matters:** in real backend systems, this kind of info is used for monitoring dashboards, health-check endpoints, and deciding server capacity — this project uses it just to print system stats when the app starts.

### Using the `url` module (`urlParser.js`)

This module demonstrates Node's built-in **`URL`** class, which breaks a full URL string into its individual parts — without needing any external library.

```javascript
export function parseURL(urlString) {
  const parsed = new URL(urlString);

  const queryParams = {};
  parsed.searchParams.forEach((value, key) => {
    queryParams[key] = value;
  });

  console.log("Protocol:", parsed.protocol); // e.g. 'https:'
  console.log("Host:", parsed.host); // e.g. 'paypoint.com'
  console.log("Pathname:", parsed.pathname); // e.g. '/search'
  console.log("Query Params:", queryParams); // e.g. { name: 'akshata', city: 'mumbai' }
}
```

**Example:**

```javascript
parseURL("https://paypoint.com/search?name=akshata&city=mumbai");
```

**Output:**

```
Protocol: https:
Host: paypoint.com
Pathname: /search
Query Params: { name: 'akshata', city: 'mumbai' }
```

**Where this concept is actually used in the app:** the server itself uses this same `URL` class to read query parameters from incoming requests — for example, extracting the filename from a request like `/view?name=notes.txt`:

```javascript
const filename = new URL(req.url, "http://localhost").searchParams.get("name");
```

**Why this matters:** understanding manual URL parsing makes it much easier to understand what frameworks like Express are doing automatically when you use `req.query` or `req.params`.

---

## ▶️ Getting Started

### Prerequisites

- Node.js installed (v18 or higher recommended)

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/akshatautit/file_manger.git

# Move into the project folder
cd file_manger

# Run the server
node server.js
```

Then open your browser at:

```
http://localhost:3000
```

---

## 🧪 Testing the Core Logic (Optional)

There's also an `index.js` file that tests the file operations directly in the terminal (without needing the browser):

```bash
node index.js
```

This will create a file, read it, log the action, then delete it — useful for understanding the core logic in isolation.

---

## 📚 What I Learned Building This

- How an HTTP server works internally — before relying on frameworks like Express
- Manual routing based on URL and HTTP method
- Reading and parsing raw POST request bodies
- File system operations (`fs` module) — sync methods and their trade-offs
- Basic security consideration: escaping user content before rendering it in HTML (to avoid broken/unsafe output)
- Project organization using separate modules (`fileManager.js`, `eventLogger.js`, etc.) instead of one large file

---

## 🔮 Future Improvements

- [ ] Convert `fs` sync methods to async (`fs/promises`) for better performance
- [ ] Add input validation (prevent empty/duplicate filenames, invalid characters)
- [ ] Add a file "edit" feature (currently only create/view/delete)
- [ ] Add search/filter for the file list
- [ ] Rebuild using Express to compare the developer experience with the vanilla version
- [ ] Add basic styling (CSS) for a cleaner UI

---

## 👩‍💻 Author

**Akshata Utekar**
React Native Developer | Exploring Backend Development with Node.js

- GitHub: [@akshatautit](https://github.com/akshatautit)
- LinkedIn: [akshata-utekar](https://linkedin.com/in/akshata-utekar899039249)
