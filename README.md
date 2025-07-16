# 🚀 End-to-End Encrypted Chat Application

A modern, real-time chat app built with **React**, **Firebase**, and the **Web Crypto API**. Enjoy secure, anonymous, and serverless messaging—your privacy, guaranteed.

---

## ✨ Features

- 🔒 **End-to-End Encryption** (RSA-OAEP 2048-bit + Hybrid Crypto)
- ⚡ **Real-Time Messaging** via Firebase Realtime Database
- 🕵️ **Anonymous Usage** – No login or signup required
- ☁️ **Serverless Architecture** – No backend server needed
- 🗝️ **Private Keys Stay Local** – Never leave your device
- 🧹 **Automatic Session Cleanup** when users leave
- 🛡️ **Visual Encryption Indicators** for peace of mind
- 📱 **Responsive Design** – Works on all devices
- 👥 **Group Chat Support** (multi-user, multi-key encryption)
- 🖼️ **Image & File Sharing** (securely encrypted)
- 🧑‍💻 **Developer Friendly** – Easy to set up, extend, and deploy

---

## ☕ Buy Me a Coffee

If you like this project, consider supporting me:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-yellow?logo=buy-me-a-coffee&style=for-the-badge)](https://www.buymeacoffee.com/arya182)

---

## 📸 Screenshots

> _Add screenshots or a GIF here to showcase the UI and encryption indicators!_

---

## 🛠️ Getting Started

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Realtime Database**
4. Set database rules (for development only):
   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```
5. Go to Project Settings → General → Your apps
6. Add a web app and copy the configuration
7. Replace the config in `src/firebase/config.ts`

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Application

```bash
npm run dev
```

---

## 🏗️ Architecture

### Database Structure

```
/chats/
  {sessionId}/
    publicKeys/
      {userId}: "<base64PublicKey>"
    messages/
      {messageId}:
        from: "userIdA"
        to: "userIdB" | "group"
        encrypted: "base64EncryptedText"
        encryptedKeys: { userId: "base64SymKey" } // for group
        timestamp: 1234567890
```

### Security Model

- **RSA-OAEP 2048-bit keys** generated client-side
- **Hybrid encryption** for group messages (AES-GCM + RSA-OAEP)
- **Private keys** stored in memory only
- **Public keys** exchanged via Firebase
- **Messages** encrypted with each recipient's public key
- **No sensitive data** stored in Firebase

### Message Flow

1. **Session Creation:** Generate RSA key pair, save public key to Firebase
2. **Join Session:** Exchange public keys through Firebase
3. **Send Message:** Encrypt with each recipient's public key (hybrid for group)
4. **Receive Message:** Decrypt with your private key
5. **Session End:** Automatic cleanup when users leave

---

## 🔒 Security Features

- Private keys never leave the browser
- End-to-end encryption with RSA-OAEP & AES-GCM
- No message history after session ends
- Anonymous usage, no authentication
- Automatic session cleanup on disconnect
- [Optional] Rate limiting & abuse protection (recommended for production)

---

## 🚀 Deployment

1. Build the project:
   ```bash
   npm run build
   ```
2. Deploy to Firebase Hosting:
   ```bash
   firebase deploy
   ```

---

## 📱 Usage

1. **Create Session:** Generate a new session and share the code
2. **Join Session:** Enter the session code to join
3. **Chat:** Messages are automatically encrypted and decrypted
4. **Share Files/Images:** Securely send images and files
5. **Leave:** Session data is automatically cleaned up

---

## 🛡️ Security Notes

- This is a demo application for educational purposes
- For production, use stricter database rules and add abuse protection
- Consider code audits and penetration testing for sensitive deployments

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to submit a pull request or open an issue.

---

## 📄 License

MIT License – see [LICENSE](./LICENSE) for details.

---

## 🙏 Acknowledgements

- [React](https://react.dev/)
- [Firebase](https://firebase.google.com/)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [Tailwind CSS](https://tailwindcss.com/) (for UI)
