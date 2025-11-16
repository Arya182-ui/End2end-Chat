# End2End Chat - WebSocket Server

WebSocket backend for real-time encrypted chat using Socket.IO.

## Features

- ✅ Real-time messaging via WebSockets
- ✅ Session-based chat rooms with authentication keys
- ✅ Session pre-reservation for instant joining
- ✅ Public key exchange for E2E encryption
- ✅ Automatic cleanup of inactive sessions (30 min)
- ✅ Connection state management
- ✅ CORS support for cross-origin requests
- ✅ File download notifications
- ✅ User join/leave notifications

## Installation

```bash
cd server
npm install
```

## Running the Server

### Development (with auto-reload)
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will run on port **3001** by default.

## Environment Variables

Create a `.env` file in the server directory:

```env
PORT=3001
CLIENT_URL=http://localhost:5173
```

## API Endpoints

### Health Check
```
GET /health
```
Returns server status, uptime, and number of active sessions.

### Reserve Session
```
POST /api/reserve-session
Content-Type: application/json

{
  "sessionId": "abc123",
  "authKey": "xyz789"
}
```
Pre-reserves a session so joiners can connect before creator starts.

### Session Info (Debug)
```
GET /sessions
```
Returns information about all active sessions.

## Socket Events

### Client → Server

- **join-session**: Join a chat session
  ```js
  { sessionId, userId, displayName, publicKey, isCreator, authKey }
  ```
  sessionId can be in format "sessionId:authKey" or just "sessionId"

- **save-public-key**: Update public key
  ```js
  { sessionId, userId, publicKey, displayName }
  ```

- **send-message**: Send encrypted message
  ```js
  { sessionId, from, to, encrypted, originalContent, type }
  ```

- **get-public-keys**: Request all public keys in session
  ```js
  { sessionId, userId }
  ```

- **leave-session**: Leave current session
  ```js
  { sessionId, userId }
  ```

### Server → Client

- **public-keys-updated**: Updated list of public keys
  ```js
  [{ userId, publicKey, displayName, joinedAt }]
  ```

- **messages-history**: Past messages when joining
  ```js
  [{ id, from, to, encrypted, timestamp, type, originalContent }]
  ```

- **new-message**: New incoming message
  ```js
  { id, from, to, encrypted, timestamp, type }
  ```

- **message-sent**: Confirmation of sent message
  ```js
  { id, from, to, encrypted, timestamp }
  ```

- **user-joined**: Notification when user joins
  ```js
  { userId, displayName, timestamp }
  ```

- **user-left**: Notification when user leaves
  ```js
  { userId, timestamp }
  ```

- **session-error**: Error notification (session not found, invalid key)
  ```js
  { error, message }
  ```

- **download-notification**: File download notification
  ```js
  { downloadedBy, fileName, timestamp }
  ```

## Production Deployment

### Using PM2
```bash
npm install -g pm2
pm2 start server.js --name "chat-server"
pm2 save
pm2 startup
```

### Using Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 3001
CMD ["node", "server.js"]
```

### Environment Variables for Production
```env
PORT=3001
CLIENT_URL=https://your-frontend-domain.com
NODE_ENV=production
DEBUG=false
```

Note: Set `DEBUG=true` to enable verbose logging for troubleshooting.

## Security Considerations

- ✅ Messages are end-to-end encrypted on client side
- ✅ Server only stores encrypted messages
- ✅ CORS configured for trusted origins
- ⚠️ Consider adding rate limiting for production
- ⚠️ Add authentication/authorization if needed
- ⚠️ Use Redis for session storage in production (scaling)

## Scaling

For production at scale, consider:

1. **Redis adapter** for Socket.IO (multi-server support)
2. **Load balancer** with sticky sessions
3. **Message queue** for persistent message storage
4. **Database** for message history (PostgreSQL, MongoDB)

Example with Redis:
```bash
npm install @socket.io/redis-adapter redis
```

```js
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

const pubClient = createClient({ url: 'redis://localhost:6379' });
const subClient = pubClient.duplicate();

await Promise.all([pubClient.connect(), subClient.connect()]);

io.adapter(createAdapter(pubClient, subClient));
```
