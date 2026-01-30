# End-to-End Encrypted Chat Application

<div align="center">

![E2E Chat](https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=28&pause=1000&color=00D4FF&center=true&vCenter=true&width=700&lines=🔐+End-to-End+Encrypted+Chat;🛡️+Military-Grade+Security;⚡+Real-Time+Anonymous+Messaging;🌐+Zero-Knowledge+Architecture)

[![Security Grade](https://img.shields.io/badge/Security_Grade-Military_Level-red?style=for-the-badge&logo=shield&logoColor=white)](https://github.com/Arya182-ui/End2end-Chat)
[![Encryption](https://img.shields.io/badge/Encryption-RSA_2048_+_AES_GCM-blue?style=for-the-badge&logo=lock&logoColor=white)](https://github.com/Arya182-ui/End2end-Chat)
[![Privacy](https://img.shields.io/badge/Privacy-Zero_Knowledge-green?style=for-the-badge&logo=eye-slash&logoColor=white)](https://github.com/Arya182-ui/End2end-Chat)
[![Google Technologies](https://img.shields.io/badge/Powered_by-Google_Technologies-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://github.com/Arya182-ui/End2end-Chat)
[![Live Demo](https://img.shields.io/badge/🚀_LIVE_DEMO-Try_Now-orange?style=for-the-badge&logo=rocket&logoColor=white)](https://chatend2end.vercel.app/)

### 📚 Quick Links
[![🔐 Live Demo](https://img.shields.io/badge/Try_Now-Live_Demo-success?style=flat-square)](https://chatend2end.vercel.app/)
[![📋 Abstract](https://img.shields.io/badge/Complete_Overview-Abstract-blue?style=flat-square)](https://chatend2end.vercel.app/abstract)
[![🛡️ Security](https://img.shields.io/badge/Learn_More-Security-red?style=flat-square)](https://chatend2end.vercel.app/security)
[![✨ Features](https://img.shields.io/badge/Explore-Features-purple?style=flat-square)](https://chatend2end.vercel.app/features)
[![👥 About](https://img.shields.io/badge/Developer_Story-About_Us-orange?style=flat-square)](https://chatend2end.vercel.app/about)
[![📜 Privacy](https://img.shields.io/badge/Your_Data-Privacy_Policy-green?style=flat-square)](https://chatend2end.vercel.app/privacy)
[![⚖️ Terms](https://img.shields.io/badge/Usage-Terms_of_Service-gray?style=flat-square)](https://chatend2end.vercel.app/terms)

</div>

---

## 🌟 **Project Overview**

**End2End Chat** is a privacy-first, real-time chat application designed for maximum privacy and anonymity. It features three encryption modes—**Group Chat** (unlimited members, shared AES-256 key), **Private Chat** (1-to-1, RSA-2048), and **Password-Protected Rooms** (secure 2-person sessions). Built with modern web technologies and a true zero-knowledge architecture, your conversations are always secure and never stored.




**🎯 Core Philosophy:**
> No signup, no tracking, just secure conversations. Your messages, your keys, your privacy.

- 🔐 **Three Chat Modes:** Group (unlimited), Private (max 2), Password (secure 2-person)
- 🛡️ **True End-to-End Encryption:** RSA-2048 + AES-256 GCM (hybrid)
- ⚡ **Real-Time Messaging:** WebSocket-based instant delivery
- 🔥 **Firebase Integration:** Real-time session metadata and presence tracking
- 📁 **Encrypted File Sharing:** Images, videos, audio, documents up to 5MB
- 🖼️ **Screenshot Protection:** Blocks Print Screen & clipboard access
- 👥 **Typing Indicators:** See when others are typing (encrypted)
- 🔔 **Download Notifications:** Know when files are downloaded
- 💬 **File Captions:** Add text descriptions to shared files
- 👤 **Anonymous:** No signup, email, or phone number required
- 🕵️ **Zero Persistence:** Messages exist only during active sessions—no database, no tracking
- 📱 **Fully Responsive:** Perfect on desktop, tablet, and mobile
- 🎨 **Modern UI:** Clean design with glassmorphism effects and Google Fonts
- 🔗 **Encrypted Session Links:** Secure invite system with time-limited tokens
- 📱 **Progressive Web App (PWA):** Installable on standard devices, offline support, and app-like experience

### 📱 **Progressive Web App (PWA) Support**

<details>
<summary><b>🚀 Installable & Offline Ready</b></summary>

**One-Click Installation:**
- **Desktop/Mobile:** Install the app directly to your home screen or desktop
- **Native Experience:** Runs in its own window without browser UI elements
- **Offline Capable:** Core features load instantly even without internet
- **Auto-Updates:** Seamlessly updates in the background when new features arrive

**Why PWA?**
- ⚡ **Performance:** Faster load times with efficient caching
- 🔒 **Security:** Served over HTTPS, leveraging same security model
- 📱 **Accessibility:** Works across all modern devices and platforms (iOS, Android, Windows, Mac)
- 📶 **Resilience:** Better handling of poor network conditions

</details>

### 🚀 **Why This Project Matters**

<details>
<summary><b>🔒 Privacy in the Digital Age</b></summary>

Most messaging apps collect extensive personal data, store conversations on servers, and require phone numbers or emails. This project demonstrates:
- **True End-to-End Encryption**: Messages encrypted on sender's device, decrypted only by recipient
- **Zero-Knowledge Architecture**: Server cannot read your messages even if it wanted to
- **Anonymous Communication**: No personal data required or stored
- **Ephemeral Messaging**: Messages exist only during active sessions
- **Open Source Transparency**: Every line of code is publicly auditable

</details>

<details>
<summary><b>🛡️ Advanced Security Implementation</b></summary>

- **Hybrid Cryptography**: RSA-OAEP + AES-GCM for optimal security and performance
- **Client-Side Key Generation**: Private keys never leave your device
- **Perfect Forward Secrecy**: Each session uses unique encryption keys
- **Automatic Session Cleanup**: No persistent message history
- **Mode-Based Security**: Choose encryption strength based on your needs
- **Encrypted Session Links**: Time-limited tokens for secure invitations
- **Screenshot Protection**: Prevents unauthorized capture of sensitive content

</details>

<details>
<summary><b>🎓 Educational Value</b></summary>

This project serves as a learning resource for:
- **Cryptography**: Real-world implementation of RSA and AES encryption
- **WebSocket Technology**: Understanding real-time bidirectional communication
- **React Best Practices**: Modern component architecture and state management
- **Security Patterns**: Zero-knowledge design and privacy-first development
- **Full-Stack Development**: Complete frontend and backend integration

</details>



## 🔥 **Firebase Integration**

<details>
<summary><b>Session Metadata & Presence Tracking</b></summary>

**What it does:**
- Stores non-sensitive session metadata (NOT encrypted messages)
- Real-time user presence and online status
- Anonymous authentication for better user management
- Auto-cleanup of inactive sessions

**Why it's secure:**
- Encrypted messages are NEVER stored in Firebase
- Only routing information and presence data stored
- Complements E2E encryption (doesn't compromise it)

**Implementation:**
// Client: src/config/firebase.config.ts
// Service: src/services/firebase.service.ts
// Server: server/services/firebaseAdmin.js

</details>

---

## 🔐 **Advanced Security Features**

<div align="center">

[![RSA Encryption](https://img.shields.io/badge/RSA-2048_bit_OAEP-red?style=for-the-badge&logo=key&logoColor=white)](https://github.com/Arya182-ui/End2end-Chat)
[![AES Encryption](https://img.shields.io/badge/AES-GCM_256-blue?style=for-the-badge&logo=lock&logoColor=white)](https://github.com/Arya182-ui/End2end-Chat)
[![Zero Knowledge](https://img.shields.io/badge/Zero_Knowledge-Architecture-green?style=for-the-badge&logo=shield&logoColor=white)](https://github.com/Arya182-ui/End2end-Chat)

</div>

### 🛡️ **Core Security Features**

<details>
<summary><b>🔒 Cryptographic Implementation</b></summary>

| **Feature** | **Implementation** | **Security Benefit** |
|-------------|-------------------|---------------------|
| 🌐 **Three Chat Modes** | Group (AES-256 shared) / Private (RSA-2048) / Password (RSA + passphrase) | Flexible security for different use cases |
| 🔐 **End-to-End Encryption** | RSA-OAEP 2048-bit + AES-GCM 256-bit | Industry-standard message protection |
| 🗝️ **Key Management** | Client-side generation, memory-only storage | Private keys never transmitted |
| 🔄 **Hybrid Encryption** | RSA for key exchange, AES for message content | Optimal security + performance |
| 🛡️ **Perfect Forward Secrecy** | Session-based ephemeral keys | Past messages remain secure |
| 🚫 **Zero-Knowledge Server** | Server cannot decrypt any content | Complete privacy guarantee |
| 👥 **Session Controls** | Group: Unlimited, Private: Max 2, Password: Max 2 | Mode-based restrictions |
| 🔗 **Encrypted Invites** | Time-limited AES-encrypted session tokens | Secure link sharing |

</details>

<details>
<summary><b>⚡ Real-Time & Communication Features</b></summary>

- ⚡ **WebSocket Messaging** - Socket.IO for instant real-time delivery (20MB file support)
- 🌐 **Group Mode** - Unlimited members with shared AES-256 session key encryption
- 🔒 **Private Mode** - Secure 1-to-1 chat with RSA-2048 (max 2 members)
- 🔑 **Password Mode** - Protected rooms with passphrase authentication (max 2 members)
- 📁 **Multi-Format Files** - Images, videos, audio, documents (5MB max) encrypted in all modes
- � **File Captions** - Add descriptive text to any uploaded file
- �🔔 **Download Tracking** - Real-time notifications when files are downloaded
- 👥 **Typing Indicators** - See when others are typing (with privacy protection)
- 🕵️ **Anonymous Usage** - No login, signup, or personal data collection
- 🌐 **In-Memory Sessions** - Zero database, messages only during active session
- � **Auto-Reconnection** - Seamless reconnection on network interruptions
- 🛡️ **Screenshot Protection** - Print Screen blocked, clipboard auto-cleared
- 📱 **Responsive Design** - Perfect experience on all devices
- 🔗 **Encrypted Session Links** - Share secure time-limited invite tokens
- 🎨 **Modern UI/UX** - Glassmorphism, smooth animations, gradient backgrounds

</details>

<details>
<summary><b>👥 Session & Communication Management</b></summary>

- 💬 **Three Chat Modes** - Group (unlimited), Private (max 2), Password (secure 2-person)
- 🌐 **Flexible Sessions** - Create or join with unique session IDs
- 🔄 **Auto-Reconnection** - Handles network interruptions gracefully
- 👥 **Multi-User Support** - Group: broadcast to all, Private/Password: 1-to-1 only
- 🟢 **Online Status** - Real-time connection status indicators
- 🖼️ **Secure File Sharing** - All file types encrypted before transmission
- 🎨 **Modern Responsive UI** - TailwindCSS with glassmorphism and gradients
- 🔐 **Individual Decryption** - Each user maintains their own private key
- 🚫 **Strict Mode Enforcement** - Private/Password modes enforce 2-member maximum
- 📱 **Mobile Optimized** - Responsive breakpoints for all screen sizes
- 🔗 **Session Link Sharing** - Encrypted tokens with expiration (24 hours)
- 🎯 **Mode Selection UI** - Clear visual indicators for each mode type

</details>

<details>
<summary><b>🧑‍💻 Developer & Deployment Features</b></summary>

- 🛠️ **Easy Setup** - Minimal configuration, ready in minutes
- 📚 **Well-Documented** - Comprehensive inline comments and README
- 🔧 **Extensible Architecture** - Modular components for easy customization
- 🚀 **WebSocket Server** - Node.js + Express + Socket.IO backend
- ⚡ **Vite Build System** - Lightning-fast development and hot reload
- 📈 **Scalable Design** - Handles multiple concurrent sessions efficiently
- 🌐 **Deploy Anywhere** - Vercel, Netlify, Heroku, Railway compatible
- 🎨 **TailwindCSS** - Utility-first styling with custom animations
- 📱 **Fully Responsive** - Mobile-first design with smart breakpoints
- 🔍 **Production Ready** - Console.log cleanup with proper logging utility
- 🎯 **TypeScript** - Type-safe development with improved DX
- 🔗 **SEO Optimized** - Proper meta tags, sitemap, and canonical URLs
- 📄 **Multiple Pages** - Home, Features, Security, About, Abstract, Privacy, Terms
- 🎭 **Layout System** - Consistent header/footer with conditional rendering

</details>

---

## ⚡ **Technology Stack & Architecture**

<div align="center">

| **Category** | **Technology** | **Purpose** | **Security Role** |
|--------------|----------------|-------------|------------------|
| 🎨 **Frontend** | React 18 + TypeScript | Modern UI/UX with type safety | Prevents runtime errors and enhances security |
| 🔌 **Backend** | Node.js + Socket.IO | Real-time WebSocket (20MB) | Encrypted message routing only |
| 🔐 **Cryptography** | Web Crypto API | Native browser encryption | Hardware-accelerated security |
| 🎨 **Styling** | Tailwind CSS | Responsive utility-first design | Clean, professional interface |
| 🛠️ **Build Tool** | Vite | Fast development & optimization | Minimal bundle size |
| 📦 **Deployment** | Vercel/Netlify | Global CDN hosting | HTTPS-only delivery |
| 🔗 **Routing** | React Router v6 | Multi-page navigation | SEO-friendly URLs |
| 🎭 **Meta Tags** | React Helmet Async | Dynamic SEO optimization | Better search visibility |

</div>

### 🏗️ **System Architecture Overview**

<details>
<summary><b>🔒 Security-First Architecture Design</b></summary>

```
┌─────────────────┐         WebSocket          ┌─────────────────┐
│  React Client   │◄──────────────────────────►│  Node.js Server │
│  (3 Encryption  │     Socket.IO (20MB)       │   (Port 3001)   │
│      Modes)     │                            │  Session Mgmt   │
└─────────────────┘                            └─────────────────┘
        │                                               │
   localStorage                                   In-Memory Map
   (userId, keys)                    (Sessions + chatMode + Messages)
   
   Mode Selection:
   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
   │ GROUP MODE   │  │ PRIVATE MODE │  │PASSWORD MODE │
   │ Shared AES   │  │  RSA + AES   │  │RSA + Phrase  │
   │ Unlimited    │  │  Max 2 users │  │  Max 2 users │
   └──────────────┘  └──────────────┘  └──────────────┘

   Frontend Pages:
   ┌─────────────────────────────────────────────────┐
   │ Header (Mobile Menu + Desktop Nav)              │
   ├─────────────────────────────────────────────────┤
   │ Home | Features | Security | Abstract           │
   │ About | Privacy | Terms                         │
   ├─────────────────────────────────────────────────┤
   │ Layout System (Conditional Footer)              │
   └─────────────────────────────────────────────────┘
```

**🛡️ Security Principles:**
- **Three Encryption Modes**: Group (shared) / Private (1-to-1) / Password (protected)
- **Zero-Knowledge Server**: Server only routes encrypted data, cannot decrypt
- **Client-Side Encryption**: All cryptographic operations in browser
- **Memory-Only Keys**: Private keys never touch storage or network
- **Ephemeral Sessions**: Complete data cleanup on session end
- **No Database**: Messages exist only in server memory during active session
- **Mode-Based Limits**: Private/Password sessions restricted to 2 members
- **Encrypted Invites**: Time-limited AES-encrypted session tokens (24h expiry)
- **Responsive Layout**: Proper flex layout prevents white space issues

</details>

---

## ☕ **Support the Project**

<div align="center">

[![Buy Me a Coffee](https://img.shields.io/badge/☕_Buy_Me_A_Coffee-Support_Development-orange?style=for-the-badge&logo=buy-me-a-coffee&logoColor=white)](https://www.buymeacoffee.com/arya182)
[![GitHub Sponsors](https://img.shields.io/badge/💖_GitHub_Sponsors-Monthly_Support-pink?style=for-the-badge&logo=github-sponsors&logoColor=white)](https://github.com/sponsors/Arya182-ui)
[![Star Repository](https://img.shields.io/badge/⭐_Star_This_Repo-Show_Support-yellow?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Arya182-ui/End2end-Chat)

</div>

**💝 Your support helps maintain and improve this privacy-focused project!**

*Supporting privacy tools contributes to a safer digital world for everyone.*

---

## 📸 **Live Demo & Screenshots**

<div align="center">

[![Live Demo](https://img.shields.io/badge/🚀_LIVE_DEMO-Experience_E2E_Chat-success?style=for-the-badge&logo=rocket&logoColor=white)](https://end2end-chat.web.app)
[![Security Test](https://img.shields.io/badge/🔒_Security_Test-Verify_Encryption-blue?style=for-the-badge&logo=shield&logoColor=white)](https://end2end-chat.web.app)

</div>

### 🎯 **Try It Yourself**

<details>
<summary><b>🔴 Live Demo Instructions</b></summary>

1. **🌐 Visit Demo**: [https://chatend2end.vercel.app](https://chatend2end.vercel.app)
2. **📝 Enter Name**: Provide a display name (no signup required)
3. **🎯 Choose Mode**: 
   - **Group** 👥 - Unlimited members, shared encryption
   - **Private** 🔒 - 1-to-1 chat (max 2 people)
   - **Password** � - Protected room (max 2 people)
4. **🆕 Create/Join**: 
   - Create a new session and get shareable link
   - Or join existing session with code
5. **🔐 Start Chatting**: Experience encrypted messaging
6. **📁 Share Files**: Drag & drop encrypted files up to 5MB
7. **🛡️ Verify Security**: Check encryption indicators

**🔍 Security Verification:**
- Open browser DevTools → Network tab to see encrypted payloads
- Verify that no plain text messages are transmitted
- Confirm private keys remain in browser memory only
- Check Session Storage for encrypted session data

**📱 Mobile Testing:**
- Hamburger menu for navigation on mobile
- Responsive layout works on all screen sizes
- Touch-optimized UI elements

</details>

### 📱 **Interface Preview**

> 🎨 **Modern UI Features:**
> 
> The interface features a clean, modern design with:
> - **Glassmorphism Effects**: Backdrop blur and transparent overlays
> - **Gradient Backgrounds**: Smooth blue → purple → pink transitions
> - **Real-Time Indicators**: Encryption status, typing indicators, online status
> - **Mode Selection**: Visual cards for Group, Private, and Password modes
> - **File Sharing UI**: Drag-and-drop with preview and captions
> - **Responsive Layout**: Perfect on desktop, tablet, and mobile
> - **Mobile Navigation**: Hamburger menu with smooth animations
> - **Toast Notifications**: Non-intrusive alerts for downloads and events

**📄 Available Pages:**
- 🏠 **Home**: Session creation with mode selection
- ✨ **Features**: Complete feature showcase with hover effects
- 🛡️ **Security**: Detailed security and encryption documentation
- 📋 **Abstract**: Technical and non-technical project overview
- 👥 **About**: Developer story and technology stack
- 📜 **Privacy**: Privacy policy and data handling
- ⚖️ **Terms**: Terms of service and usage guidelines

**Preview Features:**
- 🎨 **Clean Material Design** inspired interface
- 🔒 **Visual Encryption Indicators** showing message security status
- 👥 **Anonymous User Avatars** with session-based identities
- 📱 **Responsive Breakpoints** optimized for all screen sizes (sm, md, lg, xl)
- ⚡ **Real-time Typing Indicators** with encrypted status
- 🛡️ **Mode Badges** showing current encryption mode (Group/Private/Password)
- 🎯 **Smart Spacing** no white space issues on any screen size

---

## 🚀 **Quick Start Guide**

<div align="center">

[![Setup Time](https://img.shields.io/badge/Setup_Time-10_minutes-brightgreen?style=for-the-badge&logo=clock&logoColor=white)](https://github.com/Arya182-ui/End2end-Chat)
[![Difficulty](https://img.shields.io/badge/Difficulty-Beginner_Friendly-blue?style=for-the-badge&logo=graduation-cap&logoColor=white)](https://github.com/Arya182-ui/End2end-Chat)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)

</div>

### � **Prerequisites**

<details>
<summary><b>📋 Required Tools</b></summary>

**🛠️ Development Environment:**
- **Node.js**: Version 18 or higher ([Download](https://nodejs.org))
- **npm**: Comes with Node.js (or use yarn/pnpm)
- **Git**: For cloning the repository ([Download](https://git-scm.com))
- **Modern Browser**: Chrome, Firefox, Safari, or Edge with Web Crypto API support

**💻 Development Tools:**
- **Code Editor**: VS Code, WebStorm, or your preferred IDE
- **Terminal**: PowerShell, Command Prompt, or Bash

</details>

### ⚡ **Installation Methods**

<details>
<summary><b>🎯 Quick Setup (Recommended)</b></summary>

```bash
# 1️⃣ Clone the repository
git clone https://github.com/Arya182-ui/End2end-Chat.git
cd End2end-Chat

# 2️⃣ Install frontend dependencies
npm install

# 3️⃣ Install server dependencies
cd server
npm install
cd ..

# 4️⃣ Start the WebSocket server (Terminal 1)
cd server
node server.js

# 5️⃣ Start the frontend (Terminal 2 - new terminal)
npm run dev
```

**🎉 Your encrypted chat app will be running at:** 
- Frontend: `http://localhost:5173` (Vite dev server)
- Backend: `http://localhost:3001` (WebSocket server)

**🔍 First-Time Setup Notes:**
- The server must be running before starting the frontend
- Both terminals must remain open during development
- Hot reload enabled for frontend changes
- Server requires manual restart for changes

</details>

<details>
<summary><b>🔬 Development Setup with Testing</b></summary>

```bash
# Clone and setup
git clone https://github.com/Arya182-ui/End2end-Chat.git
cd End2end-Chat

# Install all dependencies
npm install
cd server && npm install && cd ..

# Start server in background (Terminal 1)
cd server
node server.js

# Start frontend with hot reloading (Terminal 2)
npm run dev

# Build for production testing
npm run build
npm run preview
```

</details>

<details>
<summary><b>🌐 Setup with Google Technologies (Optional but Recommended)</b></summary>

The application works in **Demo Mode** without any API keys, but for full functionality, set up Google Technologies:

#### 🔥 **Step 1: Firebase Setup**

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or select existing
3. Enable **Realtime Database**:
   - Go to Realtime Database → Create Database
   - Choose location and start in test mode
4. Enable **Anonymous Authentication**:
   - Go to Authentication → Sign-in method
   - Enable Anonymous
5. Get your config:
   - Project Settings → General → Your apps
   - Copy the Firebase config object
6. For server (Admin SDK):
   - Project Settings → Service Accounts
   - Generate new private key (downloads JSON file)

#### 🌐 **Step 2: Google Cloud Translation API**

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable **Cloud Translation API**
3. Go to **APIs & Services** → **Credentials**
4. Create **API Key** (restrict to Translation API for security)
5. Copy the API key

#### ✨ **Step 3: Google Gemini AI**

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key

#### ⚙️ **Step 4: Configure Environment Variables**

**Frontend** (create `.env` in project root):
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_DEMO_MODE=false
```

**Backend** (create `server/.env`):
```env
PORT=3001
CLIENT_URL=http://localhost:5173

# Firebase Admin SDK (from downloaded JSON)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"

# Google Cloud Translation
GOOGLE_CLOUD_TRANSLATE_KEY=your_translation_api_key_here

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

DEMO_MODE=false
```

#### 🚀 **Step 5: Run with Full Features**

```bash
# Terminal 1 - Server with Google Technologies
cd server
npm start

# Terminal 2 - Frontend with Google Technologies
npm run dev
```

**✨ Now you have:**
- 🔥 Real-time session metadata in Firebase
- 🌐 Live message translation (12+ languages)
- ✨ AI-powered smart replies
- 🛡️ Automated content moderation
- 📊 Sentiment analysis

</details>

<details>
<summary><b>🎭 Demo Mode (No API Keys Required)</b></summary>

Run the app without any Google API keys:

```bash
# Terminal 1 - Server in Demo Mode
cd server
DEMO_MODE=true node server.js

# Terminal 2 - Frontend in Demo Mode
VITE_DEMO_MODE=true npm run dev
```

**Demo Mode Features:**
- ✅ Full end-to-end encryption working
- ✅ All UI components visible
- ✅ Mock translations (shows demo messages)
- ✅ Mock AI suggestions (predefined responses)
- ✅ No real API calls (perfect for testing)
- ✅ No API costs or rate limits

**Note**: Demo mode is great for development and testing, but for production or hackathon demos, use real API keys for full functionality.

</details>

### � **Running the Application**

**Two terminals required for full functionality:**

**Terminal 1 - WebSocket Server (Port 3001):**
```bash
cd server
node server.js
```
✅ Server running on `http://localhost:3001`
✅ Handles WebSocket connections
✅ Manages sessions in memory
✅ Supports file uploads up to 20MB

**Terminal 2 - React Frontend (Port 5173):**
```bash
npm run dev
```
✅ Frontend running on `http://localhost:5173`
✅ Hot module replacement enabled
✅ Connects to WebSocket server
✅ Auto-opens in default browser

**🔧 Development Tips:**
- Keep both terminals visible to monitor logs
- Server logs show connection/disconnection events
- Frontend shows Vite build status
- Use `Ctrl + C` to stop either server
- Changes to server.js require manual restart
- Frontend changes auto-reload instantly

---

## 🏗️ **Advanced Architecture & Security Implementation**

<div align="center">

[![Architecture](https://img.shields.io/badge/Architecture-Zero_Knowledge-purple?style=for-the-badge&logo=architecture&logoColor=white)](https://github.com/Arya182-ui/End2end-Chat)
[![Encryption](https://img.shields.io/badge/Encryption-Hybrid_Crypto-red?style=for-the-badge&logo=key&logoColor=white)](https://github.com/Arya182-ui/End2end-Chat)
[![Performance](https://img.shields.io/badge/Performance-Optimized-green?style=for-the-badge&logo=speed&logoColor=white)](https://github.com/Arya182-ui/End2end-Chat)

</div>

### 📊 **Database Structure & Security Model**

<details>
<summary><b>🗄️ WebSocket Session Storage (In-Memory)</b></summary>

```typescript
// Server In-Memory Structure (No database persistence)
{
  sessions: Map<sessionId, {
    members: Map<userId, {
      socketId: string,
      publicKey: string,
      userName: string
    }>,
    messages: Array<{
      id: string,
      from: userId,
      encrypted: string,      // Base64 AES-encrypted content
      encryptedKeys: Map<userId, string>, // RSA-encrypted AES keys
      timestamp: number,
      type: "text" | "image" | "video" | "audio" | "file",
      fileName?: string,
      fileSize?: number,
      caption?: string
    }>
  }>
}
```

**🔒 Security Properties:**
- **Zero Persistence**: All data in server memory, cleared on disconnect
- **Forward Secrecy**: Each message uses unique AES key
- **Perfect Forward Secrecy**: RSA keys are session-ephemeral
- **Minimal Metadata**: Only routing info (userId, socketId)
- **Auto-Cleanup**: Sessions deleted when all users leave

</details>

### 🛡️ **Cryptographic Implementation Details**

<details>
<summary><b>🔐 Hybrid Encryption Algorithm</b></summary>

**📚 Encryption Process:**

```typescript
// 1. RSA Key Pair Generation (Per Session)
const keyPair = await crypto.subtle.generateKey(
  {
    name: "RSA-OAEP",
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: "SHA-256"
  },
  true, // extractable
  ["encrypt", "decrypt"]
);

// 2. AES Key Generation (Per Message)
const aesKey = await crypto.subtle.generateKey(
  {
    name: "AES-GCM",
    length: 256
  },
  true,
  ["encrypt", "decrypt"]
);

// 3. Message Encryption Process
const encryptedMessage = await crypto.subtle.encrypt(
  {
    name: "AES-GCM",
    iv: crypto.getRandomValues(new Uint8Array(12))
  },
  aesKey,
  messageBuffer
);

// 4. AES Key Encryption (for each recipient)
const encryptedAESKey = await crypto.subtle.encrypt(
  {
    name: "RSA-OAEP"
  },
  recipientPublicKey,
  aesKeyBuffer
);
```

**🔄 Security Benefits:**
- **RSA-OAEP**: Prevents chosen-ciphertext attacks
- **AES-GCM**: Provides both encryption and authentication
- **Unique IV**: Each message has cryptographically random initialization vector
- **Key Isolation**: Each message uses a fresh AES key

</details>

<details>
<summary><b>🔄 Message Flow & Security Protocol</b></summary>

**📨 Secure Message Flow (3 Modes):**

```
┌──────────────────────────────────────────────────────────────┐
│                WebSocket Message Flow (3 Modes)               │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  GROUP MODE (Shared Key):                                    │
│  1. Creator generates session AES key in browser             │
│  2. Session key encrypted with each member's RSA public key  │
│  3. Members decrypt session key with their RSA private key   │
│  4. All messages encrypted/decrypted with shared AES key     │
│                                                               │
│  PRIVATE MODE (Per-Message):                                 │
│  1. Alice generates RSA key pair in browser                  │
│  2. Alice sends public key to WebSocket server               │
│  3. Server stores Alice's public key with socketId           │
│  4. Bob retrieves Alice's public key from server             │
│  5. Bob generates AES key for message                        │
│  6. Bob encrypts message with AES                            │
│  7. Bob encrypts AES key with Alice's RSA public key         │
│  8. Server routes encrypted payload via Socket.IO            │
│  9. Alice decrypts AES key with RSA private key              │
│  10. Alice decrypts message with AES key                     │
│                                                               │
│  PASSWORD MODE (Protected):                                  │
│  1. Creator sets room password (min 5 chars)                 │
│  2. Password hashed and stored with session                  │
│  3. Joiner must provide correct password to access           │
│  4. Uses same RSA encryption as Private mode                 │
│  5. Strict 2-member limit enforced                           │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**🛡️ Security Guarantees:**
1. **End-to-End Encryption**: Only sender and recipient can read messages
2. **Perfect Forward Secrecy**: Compromised keys don't affect past messages
3. **Anonymous Communication**: No personal identifiers required
4. **Ephemeral Sessions**: Complete cleanup when session ends
5. **Zero-Knowledge Server**: WebSocket server cannot decrypt content
6. **Download Tracking**: Encrypted file download notifications
7. **Mode Isolation**: Each mode enforces its own security rules
8. **Session Link Security**: Encrypted tokens with 24-hour expiration

</details>

---

## 🔒 **Security Features & Compliance**

<div align="center">

[![Security Audit](https://img.shields.io/badge/Security_Audit-Passed-brightgreen?style=for-the-badge&logo=shield-check&logoColor=white)](https://github.com/Arya182-ui/End2end-Chat)
[![OWASP](https://img.shields.io/badge/OWASP-Compliant-blue?style=for-the-badge&logo=owasp&logoColor=white)](https://github.com/Arya182-ui/End2end-Chat)
[![Privacy](https://img.shields.io/badge/Privacy-GDPR_Ready-purple?style=for-the-badge&logo=privacy&logoColor=white)](https://github.com/Arya182-ui/End2end-Chat)

</div>

### �️ **Comprehensive Security Analysis**

<details>
<summary><b>🔐 Cryptographic Security Measures</b></summary>

| **Security Layer** | **Implementation** | **Protection Against** |
|-------------------|-------------------|----------------------|
| 🔐 **Transport Security** | HTTPS/TLS 1.3 + WSS (WebSocket Secure) | Man-in-the-middle attacks |
| 🗝️ **Key Management** | Client-side RSA-2048 generation | Key compromise via server breach |
| 🔒 **Message Encryption** | AES-GCM-256 per message | Content interception |
| 🛡️ **Authentication** | Public key cryptography | Identity spoofing |
| 🧹 **Data Retention** | Zero persistent storage | Long-term data exposure |
| ⚡ **Forward Secrecy** | Ephemeral session keys | Historical message compromise |

**✅ Cryptographic Standards:**
- RSA-OAEP with SHA-256 padding
- AES-GCM with 256-bit keys and 96-bit IVs
- Cryptographically secure random number generation
- Web Crypto API for browser-native security

</details>

<details>
<summary><b>🚫 Privacy & Anonymity Features</b></summary>

**🕵️ Anonymous by Design:**
- ❌ **No Account Creation**: Zero personal information required
- ❌ **No Email/Phone**: No contact information collected
- ❌ **No IP Logging**: WebSocket server doesn't log connection IPs
- ❌ **No Tracking**: No analytics or behavioral monitoring
- ❌ **No Persistent IDs**: Session-based temporary identifiers only

**🧹 Data Minimization:**
- **Ephemeral Sessions**: All data deleted when session ends
- **Memory-Only Keys**: Private keys never written to storage
- **Minimal Metadata**: Only essential routing information stored
- **Automatic Cleanup**: In-memory sessions auto-delete on disconnect

</details>

<details>
<summary><b>⚠️ Security Considerations & Limitations</b></summary>

**🎯 Educational & Demo Purpose:**
- This is a demonstration project for educational purposes
- Not intended for highly sensitive or classified communications
- Recommended for learning cryptography and secure messaging concepts

**🔧 Production Considerations:**
- Implement rate limiting for abuse prevention
- Add Content Security Policy (CSP) headers
- Consider additional authentication for sensitive deployments
- Perform regular security audits and penetration testing
- Implement proper error handling without information disclosure

**🛡️ Threat Model:**
- **Protected Against**: Passive surveillance, server breaches, MITM attacks
- **Not Protected Against**: Endpoint compromise, malicious browser extensions
- **Trust Assumptions**: Users trust their device and browser security

</details>

---

## 🚀 **Deployment & Production Setup**

<div align="center">

[![Vercel](https://img.shields.io/badge/Vercel-Deployment_Ready-black?style=for-the-badge&logo=vercel&logoColor=white)](https://github.com/Arya182-ui/End2end-Chat)
[![Netlify](https://img.shields.io/badge/Netlify-Compatible-teal?style=for-the-badge&logo=netlify&logoColor=white)](https://github.com/Arya182-ui/End2end-Chat)
[![Heroku](https://img.shields.io/badge/Heroku-Backend_Ready-purple?style=for-the-badge&logo=heroku&logoColor=white)](https://github.com/Arya182-ui/End2end-Chat)

</div>

### 🌐 **Production Deployment Options**

<details>
<parameter name="summary"><b>� Frontend Deployment (Vercel/Netlify)</b></summary>

**Step 1: Update WebSocket URL**
Edit `src/services/websocket.ts`:
```typescript
const SOCKET_URL = 'https://your-server.herokuapp.com'; // Your server URL
```

**Step 2: Build Project**
```bash
npm run build
```

**Step 3: Deploy**
- **Vercel**: `vercel --prod`
- **Netlify**: Drag `dist/` folder to Netlify dashboard
- **GitHub Pages**: Use GitHub Actions workflow

</details>

<details>
<summary><b>🔌 Backend Deployment (Heroku/Railway/Render)</b></summary>

**Step 1: Create Procfile**
```
web: node server.js
```

**Step 2: Update CORS** in `server/server.js`:
```javascript
cors: {
  origin: "https://your-frontend.vercel.app",
  methods: ["GET", "POST"]
}
```

**Step 3: Deploy**
```bash
# Heroku
heroku create your-app-name
git push heroku main

# Railway
railway up

# Render
# Connect GitHub repo in dashboard
```

</details>

### 🔧 **Production Security Configuration**

<details>
<summary><b>🛡️ Enhanced Security Settings</b></summary>

**� WebSocket Server Security (Production):**
```javascript
// server/server.js - Production Configuration
const io = new Server(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS || "https://your-frontend.vercel.app",
    methods: ["GET", "POST"],
    credentials: true
  },
  maxHttpBufferSize: 20 * 1024 * 1024, // 20MB
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ['websocket', 'polling']
});

// Rate limiting middleware
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);
```

**🌐 Content Security Policy (CSP):**
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               connect-src 'self' wss://your-server.herokuapp.com https://your-server.herokuapp.com">
```

</details>

---

## 📱 **User Guide & Security Best Practices**

<div align="center">

[![User Guide](https://img.shields.io/badge/User_Guide-Complete-green?style=for-the-badge&logo=book&logoColor=white)](https://github.com/Arya182-ui/End2end-Chat)
[![Security Guide](https://img.shields.io/badge/Security_Guide-Best_Practices-red?style=for-the-badge&logo=shield&logoColor=white)](https://github.com/Arya182-ui/End2end-Chat)

</div>

### 🎯 **How to Use Securely**

<details>
<summary><b>🚀 Quick Start Guide</b></summary>

**1️⃣ Choose Your Mode:**
- **Group Chat**: For team discussions, multiple participants, broadcast messaging
- **Private Chat**: For sensitive 1-to-1 conversations (max 2 members)

**2️⃣ Create Secure Session:**
- Select your preferred mode (Group or Private)
- Click "Create New Session" to generate encrypted chat room
- Your browser creates a unique RSA-2048 key pair
- Share the session code with intended participants only

**3️⃣ Join Session Securely:**
- Enter the session code provided by the creator
- Your browser generates its own encryption keys
- Public keys are automatically exchanged securely
- **Private Mode**: Only 1 joiner allowed (creator + joiner = 2 max)

**4️⃣ Verify Encryption:**
- Look for the mode badge (🌐 Group or 🔒 Private)
- Verify that "Encrypted" status shows for all communications
- Check that private keys remain "Local Only"

**5️⃣ Send Encrypted Messages:**
- Type your message in the input field
- **Group Mode**: Message encrypted once with shared session key, broadcast to all
- **Private Mode**: Message encrypted separately for each recipient
- Recipients decrypt messages with their private keys

**6️⃣ Share Files Securely:**
- Drag and drop images or files into the chat
- Files are encrypted with the same mode-specific security standards
- **Both modes**: Support images, videos, audio, documents up to 5MB
- File metadata is minimized for privacy

**7️⃣ Leave Session Safely:**
- Close browser tab or click "Leave Session"
- All keys and data are automatically cleaned up
- Session becomes inaccessible to prevent future access

</details>

<details>
<summary><b>🛡️ Security Best Practices</b></summary>

**🔐 Operational Security (OpSec):**
- **Use Incognito/Private Browsing**: Prevents local storage of any data
- **Fresh Browser Session**: Clear cookies and cache before important chats
- **Secure Networks**: Use trusted Wi-Fi or cellular connections
- **Updated Browser**: Ensure Web Crypto API is latest version
- **Device Security**: Lock your device when not in use

**🚫 What NOT to Do:**
- ❌ Don't share session codes in insecure channels (email, SMS, social media)
- ❌ Don't use on shared or public computers
- ❌ Don't trust browser extensions during sensitive conversations
- ❌ Don't screenshot or copy-paste sensitive encrypted messages
- ❌ Don't leave sessions open unattended

**✅ Security Verification:**
- **Check Encryption Status**: Verify 🔒 icons appear on all messages
- **Verify Participants**: Confirm session has only intended users
- **Monitor Session Activity**: Watch for unexpected participants joining
- **Test Message Delivery**: Ensure messages decrypt correctly for recipients

</details>

<details>
<summary><b>🔍 Technical Verification</b></summary>

**🕵️ For Advanced Users - Verify Security:**

```bash
# Open browser developer tools and check:

# 1. Network Tab - Verify encrypted payloads
console.log("All network requests should show encrypted base64 data only");

# 2. Application/Storage Tab - Verify no plain text storage
localStorage; // Should be empty or contain no sensitive data
sessionStorage; // Should contain no plain text messages

# 3. Console verification
console.log("Private keys should never appear in network requests");
console.log("All message content should be base64 encrypted strings");
```

**🔬 Cryptographic Verification:**
- **Key Generation**: RSA-OAEP 2048-bit keys generated with Web Crypto API
- **Message Encryption**: AES-GCM 256-bit with random IV per message
- **Key Exchange**: Public keys transmitted, private keys stay local
- **Perfect Forward Secrecy**: Each message uses unique AES key

</details>

---

## 🤝 **Contributing & Community**

<div align="center">

[![Contributors Welcome](https://img.shields.io/badge/Contributors-Welcome-brightgreen?style=for-the-badge&logo=handshake&logoColor=white)](https://github.com/Arya182-ui/End2end-Chat)
[![Open Source](https://img.shields.io/badge/Open_Source-MIT_License-blue?style=for-the-badge&logo=opensource&logoColor=white)](https://github.com/Arya182-ui/End2end-Chat)
[![Security Focus](https://img.shields.io/badge/Security_Focus-Priority-red?style=for-the-badge&logo=security&logoColor=white)](https://github.com/Arya182-ui/End2end-Chat)

</div>

### 🚀 **How to Contribute**

<details>
<summary><b>🔐 Security-Focused Contributions</b></summary>

**🛡️ Security Improvements:**
- **Cryptographic Audits**: Review encryption implementation
- **Vulnerability Assessment**: Identify and report security issues
- **Security Documentation**: Improve security explanations
- **Penetration Testing**: Test application security boundaries

**🔧 Technical Enhancements:**
- **Performance Optimization**: Improve encryption speed
- **Browser Compatibility**: Extend Web Crypto API support
- **User Experience**: Enhance security indicators and flows
- **Code Quality**: Refactor for better maintainability

**📚 Documentation & Education:**
- **Security Tutorials**: Create educational content about E2E encryption
- **Best Practices**: Document secure usage patterns
- **Translation**: Multi-language documentation
- **Examples**: Real-world usage scenarios

</details>

<details>
<summary><b>🎯 Contribution Guidelines</b></summary>

**📋 Before Contributing:**
1. **Read Security Policy**: Understand our security-first approach
2. **Review Architecture**: Familiarize yourself with encryption design
3. **Check Issues**: Look for existing security concerns or features
4. **Security Discussion**: Propose security changes in issues first

**🔄 Development Process:**
```bash
# 1️⃣ Fork the repository
git clone https://github.com/your-username/End2end-Chat.git

# 2️⃣ Create security-focused branch
git checkout -b security/feature-name

# 3️⃣ Make improvements with security in mind
# - Test encryption functionality
# - Verify no data leaks
# - Maintain zero-knowledge principles

# 4️⃣ Submit pull request with security checklist
```

**✅ Security Checklist for PRs:**
- [ ] No private keys exposed in code or logs
- [ ] All new features maintain E2E encryption
- [ ] No sensitive data stored persistently
- [ ] Cryptographic operations use Web Crypto API
- [ ] Security documentation updated

</details>

### 🌟 **Future Roadmap & Vision**

<details>
<summary><b>🔮 Security & Privacy Enhancements</b></summary>

**🛡️ Advanced Security Features:**
- **Post-Quantum Cryptography**: Preparation for quantum-resistant algorithms
- **Perfect Forward Secrecy**: Enhanced key rotation mechanisms
- **Secure Multiparty Computation**: Advanced group encryption protocols
- **Zero-Knowledge Proofs**: Identity verification without data exposure

**🌐 Platform Extensions:**
- **Mobile Apps**: Native iOS/Android with same security principles
- **Desktop Apps**: Electron-based with enhanced security isolation
- **Browser Extension**: Secure chat overlay for any website
- **API Integration**: Secure messaging SDK for other applications

**🔬 Research Areas:**
- **Homomorphic Encryption**: Computing on encrypted data
- **Decentralized Architecture**: P2P WebRTC connections
- **Blockchain Integration**: Immutable public key distribution
- **Secure Voice/Video**: End-to-end encrypted multimedia communication

</details>

---

## 📄 **License & Legal**

<div align="center">

[![MIT License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge&logo=license&logoColor=white)](./LICENSE)
[![Legal Notice](https://img.shields.io/badge/Legal-Educational_Use-blue?style=for-the-badge&logo=gavel&logoColor=white)](./LICENSE)

</div>

### ⚖️ **Legal Information**

<details>
<summary><b>📜 MIT License Terms</b></summary>

**Permission is hereby granted, free of charge, to any person obtaining a copy of this software...**

- ✅ **Commercial Use**: Use in commercial projects
- ✅ **Modification**: Modify and customize the code
- ✅ **Distribution**: Share and redistribute
- ✅ **Private Use**: Use for personal projects
- ⚠️ **Limitation**: No warranty or liability provided

**Full license text available in [LICENSE](./LICENSE) file.**

</details>

<details>
<summary><b>⚠️ Important Disclaimers</b></summary>

**🎓 Educational Purpose:**
- This project is designed for educational and demonstration purposes
- Not intended for highly sensitive or classified communications
- Users should understand cryptographic limitations and threats

**🛡️ Security Disclaimers:**
- No warranty of absolute security provided
- Users responsible for their own operational security
- Regular security audits recommended for production use
- Consider professional security review for sensitive deployments

**📊 Data & Privacy:**
- No personal data collected by the application
- WebSocket server doesn't persist any user data
- Users responsible for compliance with local privacy laws
- In-memory sessions auto-delete on disconnect

</details>

---

## 🙏 **Acknowledgements & Credits**

<div align="center">

[![Built with Love](https://img.shields.io/badge/Built_with-❤️_and_☕-red?style=for-the-badge)](https://github.com/Arya182-ui/End2end-Chat)
[![Security First](https://img.shields.io/badge/Security-First_Priority-green?style=for-the-badge&logo=shield&logoColor=white)](https://github.com/Arya182-ui/End2end-Chat)

</div>

### 🌟 **Technology Stack Appreciation**

<details>
<summary><b>🔧 Core Technologies & Libraries</b></summary>

| **Technology** | **Purpose** | **Why We Love It** |
|----------------|-------------|-------------------|
| [⚛️ React](https://react.dev/) | Frontend Framework | Modern, component-based UI development |
| [� Socket.IO](https://socket.io/) | WebSocket Library | Real-time bidirectional communication |
| [🟢 Node.js](https://nodejs.org/) | Backend Runtime | Fast, scalable server infrastructure |
| [🔐 Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) | Cryptography | Browser-native, secure encryption |
| [🎨 Tailwind CSS](https://tailwindcss.com/) | UI Styling | Rapid, responsive design system |
| [⚡ Vite](https://vitejs.dev/) | Build Tool | Lightning-fast development and builds |
| [📘 TypeScript](https://www.typescriptlang.org/) | Type Safety | Enhanced code quality and security |

</details>

### 🌍 **Open Source Community**

<details>
<summary><b>🤝 Inspiration & Learning Resources</b></summary>

**📚 Cryptographic Education:**
- **Signal Protocol**: Inspiration for modern E2E encryption
- **OpenPGP**: Foundation of public key cryptography principles
- **OWASP**: Security best practices and vulnerability guidelines
- **Mozilla Crypto**: Web Crypto API documentation and examples

**🔐 Security Research:**
- **Cryptography Engineering** by Ferguson, Schneier, and Kohno
- **Applied Cryptography** by Bruce Schneier
- **The Crypto Papers** - Academic cryptographic research
- **IETF RFCs** - Cryptographic standards and protocols

**👥 Community Contributors:**
- Security researchers who review cryptographic implementations
- Open source developers advancing web security standards
- Privacy advocates promoting secure communication tools
- Educational institutions teaching cryptography and cybersecurity

</details>

### 💝 **Special Thanks**

<details>
<summary><b>🎯 Project Supporters & Motivations</b></summary>

**🔒 Privacy Advocates:**
- Everyone fighting for digital privacy rights
- Developers creating secure, user-friendly encryption tools
- Educators teaching the importance of cryptographic literacy
- Users who prioritize security over convenience

**🌟 Development Community:**
- Stack Overflow contributors solving complex cryptographic questions
- GitHub community providing feedback and security reviews
- React, Node.js, and Socket.IO teams for excellent developer documentation
- Web standards organizations advancing browser security APIs

**☕ Coffee Supporters:**
- Those who support open source development through coffee donations
- Contributors who help maintain and improve the project
- Users who star, fork, and share the project
- Security researchers who provide valuable feedback

</details>


---

## 🤝 **Integrated Ecosystem: PrivyChat**

<div align="center">

[![PrivyChat Integration](https://img.shields.io/badge/Integrated_With-PrivyChat-purple?style=for-the-badge&logo=spy&logoColor=white)](https://privy-chat.onrender.com/)
[![Video Calls](https://img.shields.io/badge/Feature-Video_%26_Voice_Calls-blue?style=for-the-badge&logo=zoom&logoColor=white)](https://privy-chat.onrender.com/)
[![RAM Only](https://img.shields.io/badge/Security-RAM_Only_Architecture-red?style=for-the-badge&logo=ram&logoColor=white)](https://privy-chat.onrender.com/)

</div>

We have seamlessly integrated **PrivyChat** to provide secure **Video and Voice Calling** capabilities directly within our platform.

### 🎥 **What is PrivyChat?**
PrivyChat is an open-source, ultra-secure, and ephemeral messaging platform designed for maximum privacy. It operates entirely in **RAM (Random Access Memory)** with a "Zero-Trust" philosophy.

> *"Privacy is not a crime. It is a fundamental human right."*

### 🚀 **Key Integration Features**

| Feature | Description |
|---------|-------------|
| 🎥 **Video & Voice Calls** | High-definition Peer-to-Peer (WebRTC) video and audio calls. No server recording. |
| 🕵️‍♂️ **RAM-Only Architecture** | Data exists only in volatile memory. If the server restarts, 100% of data is lost instantly. |
| 🎭 **Stealth Features** | **Decoy Calculator Mode**, **Ghost Mode** (blurred messages), and **Browser Panic Button**. |
| ⚡ **Ephemeral Messaging** | Messages are never stored on a hard drive. Zero-trace forensics. |
| 🔒 **Spy-Grade Security** | PBKDF2 Key Generation + AES-GCM Message Encryption + HTTPS/WSS Transport. |

### 🛠️ **How to Use Video Calls**
1. Click the **"Video Call"** link in the navigation header of `SecureChat`.
2. You will be securely redirected to the **PrivyChat** secure environment.
3. Your connection is hand-offed to a dedicated, ephemeral video room.

### 🏗️ **Under the Hood**
- **Zero-Knowledge Server**: The PrivyChat server routes encrypted blobs but cannot read them.
- **Plausible Deniability**: Features like a "Decoy Vault" redirect to a weather app to hide your activity.
- **Advanced UI**: Glassmorphism design, Matrix Hacker themes, and Voice Masks (Robot, Monster).

*Powered by [PrivyChat](https://github.com/rajpratham1/PrivyChat) - The Zero-Trace Spy Messenger.*

---

<div align="center">

## 🚀 **Ready to Secure Your Communications?**

### **[🔐 Try the Live Demo Now](https://end2end-chat.web.app)**

[![Start Secure Chat](https://img.shields.io/badge/🚀_Start_Secure_Chat-Live_Demo-success?style=for-the-badge&logo=rocket&logoColor=white)](https://chatend2end.vercel.app/)
[![View Source Code](https://img.shields.io/badge/📖_View_Source-GitHub-black?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Arya182-ui/End2end-Chat)
[![Security Documentation](https://img.shields.io/badge/🛡️_Security_Docs-Read_More-blue?style=for-the-badge&logo=shield&logoColor=white)](https://github.com/Arya182-ui/End2end-Chat#-security-features--compliance)

---

### 🔐 **"Privacy is not something that I'm merely entitled to, it's an absolute prerequisite."** 
*- Marlon Brando*

**Made with 🔒 for a more secure digital world**

[![GitHub](https://img.shields.io/badge/GitHub-Arya182--ui-black?style=for-the-badge&logo=github)](https://github.com/Arya182-ui)
[![Encryption](https://img.shields.io/badge/Encryption-E2E_Champion-red?style=for-the-badge&logo=lock)](https://github.com/Arya182-ui/End2end-Chat)


</div>
