import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import conversationService from "../services/conversationService";
import messageService from "../services/messageService";
import socketService from "../services/socketService";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";

export default function Messages() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!loading && user) {
      fetchConversations();

      // Connect to socket
      socketService.connect(user._id);

      // Listen for real-time messages
      socketService.onNewMessage(handleNewMessage);
      socketService.onMessageSent(handleMessageSent);
      socketService.onUserTyping(handleUserTyping);
    }

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, [user, loading, location]);

  const fetchConversations = async () => {
    try {
      setLoadingConversations(true);
      const res = await conversationService.getUserConversations();
      console.log("Fetched conversations:", res.data.conversations);
      setConversations(res.data.conversations);
      
      if (res.data.conversations.length === 0) {
        console.log("No conversations found. User might not have accepted applications yet.");
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    } finally {
      setLoadingConversations(false);
    }
  };

  // Socket event handlers
  const handleNewMessage = (data) => {
    console.log('New message received:', data);

    // If message is for current conversation, add it to messages
    if (selectedConversation && data.conversationId === selectedConversation._id) {
      setMessages(prev => [...prev, data.message]);
      // Mark as read
      messageService.markMessagesAsRead(data.conversationId);
    }

    // Update conversations list to show new message
    fetchConversations();
  };

  const handleMessageSent = (data) => {
    console.log('Message sent confirmation:', data);
    // Message was sent successfully, already handled by form submission
  };

  const handleUserTyping = (data) => {
    if (selectedConversation && data.userId !== user._id) {
      setOtherUserTyping(data.isTyping);
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async (conversationId) => {
    try {
      setLoadingMessages(true);
      const res = await messageService.getMessages(conversationId);
      setMessages(res.data.messages);

      // Mark messages as read
      await messageService.markMessagesAsRead(conversationId);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSelectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    await fetchMessages(conversation._id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setSendingMessage(true);

      // Send via API
      const response = await messageService.sendMessage(selectedConversation._id, newMessage.trim());

      // Add message to local state immediately for better UX
      const newMsg = {
        _id: response.data.data._id,
        content: newMessage.trim(),
        sender_id: { _id: user._id, name: user.name },
        createdAt: new Date(),
        status: "sent"
      };
      setMessages(prev => [...prev, newMsg]);

      // Send via socket for real-time delivery
      const receiverId = user.role === "ngo"
        ? selectedConversation.volunteer_id._id
        : selectedConversation.ngo_id._id;

      socketService.sendMessage({
        conversationId: selectedConversation._id,
        content: newMessage.trim(),
        senderId: user._id,
        receiverId: receiverId
      });

      setNewMessage("");

      // Refresh conversations to update last message
      await fetchConversations();
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);

    // Handle typing indicator
    if (!isTyping && e.target.value.trim()) {
      setIsTyping(true);
      socketService.sendTyping({
        conversationId: selectedConversation?._id,
        userId: user._id,
        isTyping: true
      });
    } else if (isTyping && !e.target.value.trim()) {
      setIsTyping(false);
      socketService.sendTyping({
        conversationId: selectedConversation?._id,
        userId: user._id,
        isTyping: false
      });
    }
  };

  // Clear typing indicator when conversation changes
  useEffect(() => {
    setOtherUserTyping(false);
    setIsTyping(false);
  }, [selectedConversation]);

  if (loading) return (<><Navbar /><div className="dashboard-wrapper"><p>Loading...</p></div></>);
  if (!user) return (<><Navbar /><div className="dashboard-wrapper"><p>Please login first</p></div></>);

  return (
    <>
      <Navbar />
      <div className="dashboard-wrapper">
        <div className="dashboard-header">
          <div><h1>Messages</h1><p className="breadcrumb">SkillBridge / Messages</p></div>
        </div>

        <div className="messages-container">
          {/* Conversations List */}
          <div className="conversations-sidebar">
            <div className="conversations-header">
              <h3>Conversations ({conversations.length})</h3>
              <button className="btn-refresh" onClick={fetchConversations} title="Refresh conversations">
                🔄
              </button>
            </div>

            {loadingConversations ? (
              <p>Loading conversations...</p>
            ) : conversations.length === 0 ? (
              <div className="empty-state">
                <p>No conversations yet.</p>
                <p>Accepted applications will appear here for messaging.</p>
              </div>
            ) : (
              <div className="conversations-list">
                {conversations.map((conv) => {
                  const otherUser = user.role === "ngo" ? conv.volunteer_id : conv.ngo_id;
                  const isSelected = selectedConversation?._id === conv._id;

                  return (
                    <div
                      key={conv._id}
                      className={`conversation-item ${isSelected ? "active" : ""}`}
                      onClick={() => handleSelectConversation(conv)}
                    >
                      <div className="conversation-avatar">
                        {otherUser?.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div className="conversation-info">
                        <div className="conversation-name">
                          {otherUser?.name || "Unknown User"}
                          {user.role === "ngo" && otherUser?.organization_name && (
                            <span className="org-name"> ({otherUser.organization_name})</span>
                          )}
                        </div>
                        <div className="conversation-opportunity">
                          {conv.opportunity_id?.title}
                        </div>
                        {conv.last_message?.content && (
                          <div className="conversation-last-message">
                            {conv.last_message.sender_id?._id === user._id ? "You: " : ""}
                            {conv.last_message.content.length > 30
                              ? conv.last_message.content.substring(0, 30) + "..."
                              : conv.last_message.content}
                          </div>
                        )}
                      </div>
                      {conv.last_message?.timestamp && (
                        <div className="conversation-time">
                          {formatTime(conv.last_message.timestamp)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Messages Area */}
          <div className="messages-area">
            {selectedConversation ? (
              <>
                <div className="messages-header">
                  <div className="chat-info">
                    <h3>
                      {user.role === "ngo"
                        ? selectedConversation.volunteer_id?.name
                        : selectedConversation.ngo_id?.name}
                      {user.role === "ngo" && selectedConversation.ngo_id?.organization_name && (
                        <span> ({selectedConversation.ngo_id.organization_name})</span>
                      )}
                    </h3>
                    <p>{selectedConversation.opportunity_id?.title}</p>
                  </div>
                </div>

                <div className="messages-list">
                  {loadingMessages ? (
                    <p>Loading messages...</p>
                  ) : messages.length === 0 ? (
                    <div className="empty-messages">
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    <>
                      {messages.map((msg) => {
                        const isOwnMessage = msg.sender_id._id === user._id;
                        return (
                          <div
                            key={msg._id}
                            className={`message ${isOwnMessage ? "own" : "other"}`}
                          >
                            <div className="message-content">
                              <p>{msg.content}</p>
                              <span className="message-time">
                                {formatTime(msg.createdAt)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </>
                  )}

                  {/* Typing indicator */}
                  {otherUserTyping && (
                    <div className="typing-indicator">
                      <div className="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <span className="typing-text">Typing...</span>
                    </div>
                  )}
                </div>

                <form className="message-form" onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    disabled={sendingMessage}
                    required
                  />
                  <button
                    type="submit"
                    disabled={sendingMessage || !newMessage.trim()}
                    className="btn-send"
                  >
                    {sendingMessage ? "Sending..." : "Send"}
                  </button>
                </form>
              </>
            ) : (
              <div className="no-conversation">
                <div className="empty-state">
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}