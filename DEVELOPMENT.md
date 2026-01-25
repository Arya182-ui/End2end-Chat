# 🛠️ End2End Chat - Development Guide

<div align="center">

![Development](https://img.shields.io/badge/Development-Setup_Guide-purple?style=for-the-badge&logo=code&logoColor=white)
![React](https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)

</div>

---

## 🚀 **Quick Start**

### **Prerequisites**
```bash
# Required Software
Node.js >= 18.0.0
npm >= 8.0.0 or yarn >= 1.22.0
Git >= 2.30.0

# Recommended Tools
VS Code with extensions:
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Prettier - Code formatter
- ESLint
- Tailwind CSS IntelliSense
```

### **Installation**
```bash
# Clone the repository
git clone https://github.com/Arya182-ui/End2end-Chat.git
cd End2end-Chat

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..

# Set up environment variables
cp .env.example .env
```

### **Environment Configuration**
```bash
# Frontend (.env)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_WEBSOCKET_URL=ws://localhost:3001

# Backend (server/.env)
PORT=3001
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_CLOUD_TRANSLATION_API_KEY=your_translation_key
NODE_ENV=development
```

---

## 🏗️ **Project Architecture**

### **Frontend Structure**
```
src/
├── 🚀 main.tsx                 # App entry point
├── 📱 App.tsx                  # Main application component
├── 🎨 index.css                # Global styles
├── 🔧 vite-env.d.ts            # Vite TypeScript definitions
├── 
├── components/                 # React components
│   ├── 💬 ChatInterface.tsx    # Main chat functionality
│   ├── 💭 MessageBubble.tsx    # Message display
│   ├── ⚙️ SessionSetup.tsx     # Session management
│   ├── 🌐 TranslationPanel.tsx # Translation features
│   ├── 🤖 AIAssistant.tsx      # AI integration
│   ├── 🎨 Layout.tsx           # App layout
│   ├── 📄 header.tsx           # Navigation header
│   ├── 🦶 footer.tsx           # App footer
│   ├── 🔄 LoadingSpinner.tsx   # Loading states
│   ├── ⬆️ BackToTop.tsx        # Scroll helper
│   ├── 🍪 CookieConsent.tsx    # Privacy compliance
│   ├── 💰 DonationButton.tsx   # Support feature
│   └── 📊 AdSense.tsx          # Ad integration
│
├── pages/                      # Application pages
│   ├── 👥 AboutUs.tsx          # About page
│   ├── 📄 Abstract.tsx         # Project overview
│   ├── ✨ Features.tsx         # Features showcase
│   ├── 🔒 Privacy.tsx          # Privacy policy
│   ├── 🛡️ Security.tsx         # Security details
│   ├── ⚖️ Terms.tsx            # Terms of service
│   └── 🔀 RedirectToPrivy.tsx  # Navigation helper
│
├── services/                   # External services
│   ├── 🔥 firebase.service.ts  # Firebase integration
│   ├── 🤖 gemini.ts            # Google AI service
│   ├── 🔌 websocket.ts         # WebSocket service
│   └── 🔌 websocket-new.ts     # Updated WebSocket
│
├── crypto/                     # Encryption services
│   ├── 🔐 encryption.ts        # Core encryption
│   └── 🔐 groupEncryption.ts   # Group chat crypto
│
├── config/                     # Configuration files
│   └── 🔥 firebase.config.ts   # Firebase config
│
├── hooks/                      # Custom React hooks
│   └── (custom hooks)
│
└── utils/                      # Utility functions
    ├── 📝 logger.ts            # Logging utility
    ├── 🌐 seo.ts               # SEO helpers
    └── 🔐 tokenEncryption.ts   # Token handling
```

### **Backend Structure**
```
server/
├── 📦 package.json            # Dependencies
├── 🚀 server.js               # Main server file
├── 📋 README.md               # Server documentation
├── 🚂 railway.json            # Railway deployment config
│
└── services/                  # Backend services
    ├── 🔥 firebaseAdmin.js     # Firebase Admin SDK
    ├── 🛡️ moderation.js        # Content moderation
    └── 🌐 translation.js       # Translation service
```

---

## ⚙️ **Development Commands**

### **Frontend Development**
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

### **Backend Development**
```bash
# Start backend server
cd server
npm start

# Start with nodemon (auto-restart)
npm run dev

# Run tests
npm test

# Check dependencies
npm audit
```

### **Full Stack Development**
```bash
# Terminal 1: Start frontend
npm run dev

# Terminal 2: Start backend
cd server && npm start

# Both services will run concurrently:
# Frontend: http://localhost:5173
# Backend: http://localhost:3001
```

---

## 🔧 **Development Tools**

### **VS Code Configuration**
```json
// .vscode/settings.json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}

// .vscode/extensions.json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### **Git Configuration**
```bash
# Git hooks setup
npm install --save-dev husky
npx husky install

# Pre-commit hook
npx husky add .husky/pre-commit "npm run lint"

# Commit message hook
npx husky add .husky/commit-msg "npx commitlint --edit $1"
```

### **Package Scripts**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

---

## 🔐 **Security Development**

### **Secure Coding Practices**
```typescript
// Input Validation Example
const validateMessage = (message: string): boolean => {
  // Length validation
  if (message.length > 1000) {
    throw new Error('Message too long');
  }
  
  // XSS prevention
  const sanitized = DOMPurify.sanitize(message);
  if (sanitized !== message) {
    throw new Error('Invalid characters detected');
  }
  
  // Additional validations...
  return true;
};

// Secure key generation
const generateSecureKey = async (): Promise<CryptoKey> => {
  if (!window.crypto || !window.crypto.subtle) {
    throw new Error('Web Crypto API not available');
  }
  
  return await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256
    },
    false, // not extractable for security
    ["encrypt", "decrypt"]
  );
};
```

### **Environment Security**
```bash
# Development environment security
# Never commit .env files
echo ".env" >> .gitignore
echo "server/.env" >> .gitignore

# Use environment validation
npm install --save-dev dotenv-safe

# Validate required environment variables
REQUIRED_ENV_VARS="VITE_FIREBASE_API_KEY,VITE_GEMINI_API_KEY"
```

---

## 🧪 **Testing Strategy**

### **Testing Setup**
```bash
# Install testing dependencies
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
npm install --save-dev jsdom @vitest/ui @vitest/coverage-c8
```

### **Test Configuration**
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'c8',
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts'
      ]
    }
  }
});
```

### **Example Tests**
```typescript
// src/test/ChatInterface.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatInterface } from '../components/ChatInterface';

describe('ChatInterface', () => {
  test('renders chat interface', () => {
    render(
      <ChatInterface 
        sessionId="test-session"
        userId="test-user"
        onLeave={() => {}}
      />
    );
    
    expect(screen.getByText('End-to-End Encrypted')).toBeInTheDocument();
  });
  
  test('sends message when enter is pressed', () => {
    const mockSendMessage = jest.fn();
    render(
      <ChatInterface 
        sessionId="test-session"
        userId="test-user"
        onLeave={() => {}}
      />
    );
    
    const input = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });
    
    // Verify message sending logic
  });
});
```

---

## 📊 **Performance Optimization**

### **Bundle Analysis**
```bash
# Analyze bundle size
npm install --save-dev rollup-plugin-visualizer
npm run build
# Check generated stats.html

# Code splitting example
const LazyComponent = React.lazy(() => import('./components/HeavyComponent'));

// Use Suspense for loading states
<Suspense fallback={<LoadingSpinner />}>
  <LazyComponent />
</Suspense>
```

### **Performance Monitoring**
```typescript
// Performance measurement
const performanceObserver = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(`${entry.name}: ${entry.duration}ms`);
  }
});

performanceObserver.observe({ entryTypes: ['measure', 'navigation'] });

// Measure custom operations
performance.mark('encryption-start');
await encryptMessage(message);
performance.mark('encryption-end');
performance.measure('encryption-duration', 'encryption-start', 'encryption-end');
```

---

## 🔄 **State Management**

### **React Context Setup**
```typescript
// contexts/AppContext.tsx
interface AppContextType {
  user: User | null;
  session: Session | null;
  encryption: EncryptionState;
  updateUser: (user: User) => void;
  updateSession: (session: Session) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [encryption, setEncryption] = useState<EncryptionState>(initialEncryptionState);
  
  const updateUser = useCallback((newUser: User) => {
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  }, []);
  
  return (
    <AppContext.Provider value={{ user, session, encryption, updateUser, updateSession }}>
      {children}
    </AppContext.Provider>
  );
};
```

### **Custom Hooks**
```typescript
// hooks/useWebSocket.ts
export const useWebSocket = (url: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const ws = new WebSocket(url);
    
    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);
    ws.onerror = (error) => setError('WebSocket error');
    
    setSocket(ws);
    
    return () => {
      ws.close();
    };
  }, [url]);
  
  const sendMessage = useCallback((message: any) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(message));
    }
  }, [socket, isConnected]);
  
  return { socket, isConnected, error, sendMessage };
};
```

---

## 🚀 **Deployment**

### **Production Build**
```bash
# Build frontend
npm run build

# Build backend
cd server
npm install --production
cd ..

# Test production build locally
npm run preview
```

### **Environment Variables (Production)**
```bash
# Vercel Environment Variables
VITE_FIREBASE_API_KEY=production_key
VITE_FIREBASE_PROJECT_ID=production_project
VITE_GEMINI_API_KEY=production_gemini_key
VITE_WEBSOCKET_URL=wss://your-backend.railway.app

# Railway Environment Variables (Backend)
PORT=3001
NODE_ENV=production
FIREBASE_PROJECT_ID=production_project
GEMINI_API_KEY=production_gemini_key
```

### **Deployment Commands**
```bash
# Deploy to Vercel (Frontend)
npx vercel --prod

# Deploy to Railway (Backend)
# Push to GitHub, Railway auto-deploys

# Manual deployment check
curl -f https://your-app.vercel.app/health || exit 1
```

---

## 🐛 **Debugging**

### **Development Debugging**
```typescript
// Debug logger utility
const logger = {
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🐛 [DEBUG] ${message}`, data);
    }
  },
  error: (message: string, error?: any) => {
    console.error(`❌ [ERROR] ${message}`, error);
  },
  warn: (message: string, data?: any) => {
    console.warn(`⚠️ [WARN] ${message}`, data);
  }
};

// WebSocket debugging
const debugWebSocket = (ws: WebSocket) => {
  ws.addEventListener('open', () => logger.debug('WebSocket connected'));
  ws.addEventListener('close', () => logger.debug('WebSocket disconnected'));
  ws.addEventListener('error', (error) => logger.error('WebSocket error', error));
  ws.addEventListener('message', (event) => logger.debug('WebSocket message received', event.data));
};
```

### **Browser DevTools**
```typescript
// Add to window for debugging
if (process.env.NODE_ENV === 'development') {
  (window as any).debugApp = {
    encryption: cryptoService,
    websocket: wsService,
    firebase: firebaseService,
    clearStorage: () => {
      localStorage.clear();
      sessionStorage.clear();
    }
  };
}
```

---

## 📚 **Documentation Standards**

### **Code Documentation**
```typescript
/**
 * Encrypts a message using AES-256-GCM encryption
 * 
 * @param message - The plaintext message to encrypt
 * @param key - The AES encryption key
 * @returns Promise resolving to encrypted data and IV
 * 
 * @example
 * ```typescript
 * const key = await generateAESKey();
 * const encrypted = await encryptMessage("Hello World", key);
 * console.log(encrypted.data); // Base64 encrypted data
 * ```
 * 
 * @throws {Error} If encryption fails or key is invalid
 */
async function encryptMessage(
  message: string, 
  key: CryptoKey
): Promise<{data: string, iv: string}> {
  // Implementation...
}
```

### **Component Documentation**
```typescript
interface ChatInterfaceProps {
  /** Unique identifier for the chat session */
  sessionId: string;
  /** Current user's unique identifier */
  userId: string;
  /** Optional display name for the user */
  userName?: string;
  /** Whether the user created this session */
  isCreator?: boolean;
  /** Callback fired when user leaves the session */
  onLeave: () => void;
}

/**
 * Main chat interface component providing end-to-end encrypted messaging
 * 
 * Features:
 * - Real-time messaging via WebSocket
 * - End-to-end encryption (RSA + AES)
 * - File sharing with encryption
 * - Screenshot protection
 * - AI-powered smart replies
 * 
 * @component
 * @example
 * ```tsx
 * <ChatInterface
 *   sessionId="session-123"
 *   userId="user-456"
 *   userName="Alice"
 *   isCreator={true}
 *   onLeave={() => navigateToHome()}
 * />
 * ```
 */
export const ChatInterface: React.FC<ChatInterfaceProps> = ({ ... }) => {
  // Component implementation...
};
```

---

## 🤝 **Contributing Guidelines**

### **Code Style**
```typescript
// Use TypeScript strict mode
// Prefer const over let
// Use descriptive variable names
// Add JSDoc comments for public functions
// Use async/await over Promises

// Good
const encryptedMessage = await encryptWithAES(plaintext, secretKey);

// Avoid
let msg = encryptWithAES(plaintext, secretKey).then(result => result);
```

### **Commit Standards**
```bash
# Conventional Commits format
<type>(<scope>): <subject>

# Types: feat, fix, docs, style, refactor, test, chore
# Examples:
git commit -m "feat(crypto): add AES-256 encryption support"
git commit -m "fix(websocket): handle connection timeouts"
git commit -m "docs(api): update WebSocket documentation"
git commit -m "test(chat): add message encryption tests"
```

### **Pull Request Process**
```bash
# 1. Create feature branch
git checkout -b feat/new-feature

# 2. Make changes and commit
git add .
git commit -m "feat: add new feature"

# 3. Push to origin
git push origin feat/new-feature

# 4. Create PR with description:
# - What changed
# - Why it changed
# - How to test
# - Screenshots (if UI changes)

# 5. Address review feedback
# 6. Merge after approval
```

---

<div align="center">

## 🏆 **Development Best Practices**

| Practice | Implementation | Status |
|----------|----------------|---------|
| 🔐 Security First | Encryption by default | ✅ Active |
| 📝 Type Safety | Strict TypeScript | ✅ Active |
| 🧪 Test Coverage | Unit + Integration tests | ✅ Active |
| 📊 Performance | Code splitting + lazy loading | ✅ Active |
| 🎨 Code Quality | ESLint + Prettier | ✅ Active |
| 📚 Documentation | Comprehensive docs | ✅ Active |
| 🔄 CI/CD | Automated deployment | ✅ Active |
| 🛡️ Error Handling | Graceful error recovery | ✅ Active |

</div>

---

## 📞 **Developer Support**

### **Getting Help**
- **💬 Discord:** Join our developer community
- **📧 Email:** dev-support@end2endchat.com
- **🐛 Issues:** GitHub Issues for bugs
- **💡 Features:** GitHub Discussions for feature requests
- **📖 Docs:** Comprehensive documentation
- **🎥 Videos:** Development tutorials (coming soon)

### **Resources**
- **🔧 API Documentation:** Complete API reference
- **🧪 Testing Guide:** Testing best practices
- **🚀 Deployment Guide:** Production deployment
- **🔐 Security Guide:** Security implementation
- **📊 Performance Guide:** Optimization techniques

---

<div align="center">

**🛠️ Happy Coding!**

[![GitHub](https://img.shields.io/badge/⭐_Star_on-GitHub-black?style=for-the-badge&logo=github)](https://github.com/Arya182-ui/End2end-Chat)
[![Docs](https://img.shields.io/badge/📚_Read-Documentation-blue?style=for-the-badge&logo=gitbook)](https://github.com/Arya182-ui/End2end-Chat)
[![Discord](https://img.shields.io/badge/💬_Join-Community-purple?style=for-the-badge&logo=discord)](https://discord.gg/end2endchat)

</div>