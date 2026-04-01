import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import conversationService from "../services/conversationService";
import messageService from "../services/messageService";
import socketService from "../services/socketService";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Paperclip, RefreshCw, SendHorizontal, X } from "lucide-react";
import { toast } from "sonner";

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
  const [participantDetailsOpen, setParticipantDetailsOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [attachment, setAttachment] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const getOtherUser = (conversation) => (user.role === "ngo" ? conversation?.volunteer_id : conversation?.ngo_id);

  const resolveSenderId = (message) => {
    if (!message?.sender_id) return null;
    return typeof message.sender_id === "object" ? message.sender_id._id : message.sender_id;
  };

  useEffect(() => {
    if (!loading && user) {
      fetchConversations();

      // Listen for real-time messages
      socketService.onNewMessage(handleNewMessage);
      socketService.onMessageSent(handleMessageSent);
      socketService.onUserTyping(handleUserTyping);

      return () => {
        socketService.off("receive_message", handleNewMessage);
        socketService.off("messageSent", handleMessageSent);
        socketService.off("userTyping", handleUserTyping);
      };
    }
  }, [user, loading, location]);

  useEffect(() => {
    const conversationId = location.state?.conversationId;
    if (!conversationId || conversations.length === 0) return;

    const openConversationById = async () => {
      const existingConversation = conversations.find((conversation) => conversation._id === conversationId);

      if (existingConversation) {
        await handleSelectConversation(existingConversation);
        return;
      }

      try {
        setLoadingMessages(true);
        const res = await conversationService.getConversation(conversationId);
        setSelectedConversation(res.data.conversation);
        setMessages(res.data.messages || []);
        await messageService.markMessagesAsRead(conversationId);
      } catch (error) {
        console.error("Failed to open conversation from browse page:", error);
      } finally {
        setLoadingMessages(false);
      }
    };

    openConversationById();
  }, [location.state, conversations]);

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
    if ((!newMessage.trim() && !attachment) || !selectedConversation) return;

    try {
      setSendingMessage(true);
      const messageText = newMessage.trim();

      // Send via API
      const response = await messageService.sendMessage(selectedConversation._id, messageText, attachment);
      const savedMessage = response?.data?.data;

      // Add message to local state immediately for better UX
      const newMsg = {
        _id: savedMessage?._id || `local-${Date.now()}`,
        content: messageText,
        sender_id: { _id: user._id, name: user.name },
        message_type: savedMessage?.message_type || (attachment ? "file" : "text"),
        attachment_name: savedMessage?.attachment_name || attachment?.name || "",
        attachment_type: savedMessage?.attachment_type || attachment?.type || "",
        attachment_data_url: savedMessage?.attachment_data_url || attachment?.dataUrl || "",
        createdAt: savedMessage?.createdAt || new Date(),
        status: savedMessage?.status || "sent"
      };
      setMessages(prev => [...prev, newMsg]);

      // Send via socket for real-time delivery
      const receiverId = user.role === "ngo"
        ? selectedConversation.volunteer_id._id
        : selectedConversation.ngo_id._id;

      try {
        socketService.sendMessage({
          conversationId: selectedConversation._id,
          content: messageText || (attachment ? `Attachment: ${attachment.name}` : ""),
          senderId: user._id,
          receiverId: receiverId
        });
      } catch (socketError) {
        console.error("Socket emit failed:", socketError);
      }

      setNewMessage("");
      setAttachment(null);

      // Refresh conversations to update last message
      await fetchConversations();
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error(error?.response?.data?.message || "Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  const handlePickAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleAttachmentChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Attachment must be under 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAttachment({
        name: file.name,
        type: file.type,
        dataUrl: reader.result,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleOpenParticipantDetails = () => {
    const otherUser = getOtherUser(selectedConversation);
    if (!otherUser) return;
    setSelectedParticipant(otherUser);
    setParticipantDetailsOpen(true);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDayLabel = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const isSameDay = (firstDate, secondDate) => {
    const first = new Date(firstDate);
    const second = new Date(secondDate);
    return (
      first.getFullYear() === second.getFullYear() &&
      first.getMonth() === second.getMonth() &&
      first.getDate() === second.getDate()
    );
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

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
          <p className="text-slate-600">Loading messages...</p>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
          <p className="text-slate-600">Please login first.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto flex h-[calc(100vh-84px)] max-w-7xl flex-col overflow-hidden px-4 py-6 md:px-6 md:py-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mb-4 shrink-0">
          <h1 className="text-3xl font-bold text-slate-900">Messages</h1>
          <p className="mt-1 text-slate-600">Connect with volunteers and NGOs in real time.</p>
        </motion.div>

        <section className="grid min-h-0 flex-1 gap-4 lg:grid-cols-12">
          <aside className="flex min-h-0 flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Conversations ({conversations.length})</h3>
              <Button size="icon" variant="ghost" onClick={fetchConversations} title="Refresh conversations">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            {loadingConversations ? (
              <p className="text-sm text-slate-500">Loading conversations...</p>
            ) : conversations.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">
                No conversations yet. Accepted applications will appear here.
              </div>
            ) : (
              <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
                {conversations.map((conv) => {
                  const otherUser = getOtherUser(conv);
                  const isSelected = selectedConversation?._id === conv._id;

                  return (
                    <div
                      key={conv._id}
                      className={`cursor-pointer rounded-xl border p-3 transition ${
                        isSelected
                          ? "border-orange-300 bg-orange-50"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                      }`}
                      onClick={() => handleSelectConversation(conv)}
                    >
                      <div className="flex gap-3">
                        <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-700">
                          {otherUser?.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-semibold text-slate-900">
                            {otherUser?.name || "Unknown User"}
                            {user.role === "ngo" && otherUser?.organization_name && (
                              <span className="font-normal text-slate-500"> ({otherUser.organization_name})</span>
                            )}
                          </div>
                          <p className="truncate text-xs text-slate-500">{conv.opportunity_id?.title}</p>
                          {conv.last_message?.content && (
                            <p className="truncate text-xs text-slate-600">
                              {resolveSenderId(conv.last_message) === user._id ? "You: " : ""}
                              {conv.last_message.content}
                            </p>
                          )}
                        </div>
                        {conv.last_message?.timestamp && (
                          <div className="shrink-0 text-[11px] text-slate-400">{formatTime(conv.last_message.timestamp)}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </aside>

          <section className="flex min-h-0 flex-col rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-8">
            {selectedConversation ? (
              <>
                <div className="shrink-0 border-b border-slate-200 px-5 py-4">
                  <button className="text-left" onClick={handleOpenParticipantDetails}>
                    <h3 className="text-lg font-semibold text-slate-900 hover:text-orange-700">
                      {user.role === "ngo"
                        ? `${selectedConversation.volunteer_id?.name || "Volunteer"} (Volunteer)`
                        : `${selectedConversation.ngo_id?.organization_name || selectedConversation.ngo_id?.name || "NGO"} (NGO)`}
                    </h3>
                  </button>
                  <p className="text-sm text-slate-600">Opportunity: {selectedConversation.opportunity_id?.title || "Not specified"}</p>
                </div>

                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-slate-50 px-5 py-4">
                  {loadingMessages ? (
                    <p className="text-sm text-slate-500">Loading messages...</p>
                  ) : messages.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm text-slate-600">
                      No messages yet. Start the conversation.
                    </div>
                  ) : (
                    <>
                      {messages.map((msg, index) => {
                        const isOwnMessage = resolveSenderId(msg) === user._id;
                        const previousMessage = messages[index - 1];
                        const showDaySeparator =
                          !previousMessage || !isSameDay(previousMessage.createdAt, msg.createdAt);
                        return (
                          <div key={msg._id} className="space-y-2">
                            {showDaySeparator && (
                              <div className="flex justify-center py-2">
                                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-500 shadow-sm">
                                  {formatDayLabel(msg.createdAt)}
                                </span>
                              </div>
                            )}
                            <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                              <div
                                className={`max-w-[80%] rounded-2xl px-4 py-2 shadow-sm ${
                                  isOwnMessage
                                    ? "bg-slate-900 text-white"
                                    : "border border-slate-200 bg-white text-slate-900"
                                }`}
                              >
                                <p className="text-sm leading-relaxed">{msg.content}</p>
                                {msg.attachment_data_url && (
                                  <a
                                    href={msg.attachment_data_url}
                                    download={msg.attachment_name || "attachment"}
                                    className={`mt-2 block text-xs underline ${isOwnMessage ? "text-slate-200" : "text-orange-700"}`}
                                  >
                                    Attachment: {msg.attachment_name || "Download"}
                                  </a>
                                )}
                                <span className={`mt-1 block text-[11px] ${isOwnMessage ? "text-slate-300" : "text-slate-500"}`}>
                                  {formatTime(msg.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </>
                  )}

                  {otherUserTyping && (
                    <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs text-slate-500 shadow-sm">
                      <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-orange-500" /> Typing...
                    </div>
                  )}
                </div>

                <form className="shrink-0 flex gap-2 border-t border-slate-200 p-4" onSubmit={handleSendMessage}>
                  <input ref={fileInputRef} type="file" className="hidden" onChange={handleAttachmentChange} />
                  <Button type="button" size="icon" variant="secondary" onClick={handlePickAttachment} title="Add attachment">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    value={newMessage}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    disabled={sendingMessage}
                  />
                  <Button type="submit" disabled={sendingMessage || (!newMessage.trim() && !attachment)}>
                    <SendHorizontal className="h-4 w-4" />
                    {sendingMessage ? "Sending..." : "Send"}
                  </Button>
                </form>
                {attachment && (
                  <div className="mx-4 mb-4 mt-2 shrink-0 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
                    <span className="truncate">Attached: {attachment.name}</span>
                    <button type="button" className="rounded p-1 hover:bg-slate-200" onClick={() => setAttachment(null)}>
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center p-6">
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-600">
                  Select a conversation to start messaging.
                </div>
              </div>
            )}
          </section>
        </section>
      </main>

      <Dialog open={participantDetailsOpen} onOpenChange={setParticipantDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {user.role === "ngo"
                ? `${selectedParticipant?.name || "Volunteer"} (Volunteer)`
                : `${selectedParticipant?.organization_name || selectedParticipant?.name || "NGO"} (NGO)`}
            </DialogTitle>
            <DialogDescription>Participant details</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium text-slate-900">Email</p>
              <p className="text-slate-600">{selectedParticipant?.email || "Not provided"}</p>
            </div>
            <div>
              <p className="font-medium text-slate-900">Location</p>
              <p className="text-slate-600">{selectedParticipant?.location || "Not provided"}</p>
            </div>
            {user.role === "volunteer" && (
              <>
                <div>
                  <p className="font-medium text-slate-900">Organization Description</p>
                  <p className="text-slate-600">{selectedParticipant?.organization_description || "Not provided"}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Website</p>
                  {selectedParticipant?.website_url ? (
                    <a href={selectedParticipant.website_url} target="_blank" rel="noreferrer" className="text-orange-700 hover:text-orange-800 hover:underline">
                      {selectedParticipant.website_url}
                    </a>
                  ) : (
                    <p className="text-slate-600">Not provided</p>
                  )}
                </div>
              </>
            )}
            {user.role === "ngo" && (
              <>
                <div>
                  <p className="font-medium text-slate-900">Bio</p>
                  <p className="text-slate-600">{selectedParticipant?.bio || "Not provided"}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Skills</p>
                  <p className="text-slate-600">{selectedParticipant?.skills?.length ? selectedParticipant.skills.join(", ") : "Not provided"}</p>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}