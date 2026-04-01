import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.currentUserId = null;
  }

  connect(userId, token) {
    if (this.socket?.connected) {
      return;
    }

    this.currentUserId = userId;
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

    this.socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      auth: {
        token,
      },
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('Connected to socket server');
      this.isConnected = true;

      // Join user room
      this.socket.emit('join', userId);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
      this.isConnected = false;
    });

    this.socket.on('reconnect', () => {
      this.isConnected = true;
      if (this.currentUserId) {
        this.socket.emit('join', this.currentUserId);
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Send message
  sendMessage(data) {
    if (this.socket && this.isConnected) {
      this.socket.emit('send_message', data);
      this.socket.emit('sendMessage', data);
    }
  }

  // Listen for new messages
  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on('receive_message', callback);
    }
  }

  // Listen for message sent confirmation
  onMessageSent(callback) {
    if (this.socket) {
      this.socket.on('messageSent', callback);
    }
  }

  // Typing indicators
  sendTyping(data) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing', data);
    }
  }

  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on('userTyping', callback);
    }
  }

  // Listen for notifications
  onNotification(callback) {
    if (this.socket) {
      this.socket.on('new_notification', callback);
    }
  }

  // Remove listeners
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

const socketService = new SocketService();
export default socketService;