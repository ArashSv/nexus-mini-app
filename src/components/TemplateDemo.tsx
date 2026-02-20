import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, User as UserIcon, MessageSquare, Plus, Trash2, Database, Shield, Layout, RefreshCw } from 'lucide-react';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { User, Chat, ChatMessage } from '@shared/types';
import { toast } from 'sonner';
export const HAS_TEMPLATE_DEMO = true;
export function TemplateDemo() {
  const [users, setUsers] = useState<User[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newUserName, setNewUserName] = useState('');
  const [newChatTitle, setNewChatTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectChat = useCallback(async (chat: Chat) => {
    setSelectedChat(chat);
    try {
      const msgs = await api<ChatMessage[]>(`/api/demo/chats/${chat.id}/messages`);
      setMessages(msgs);
    } catch (e) {
      setMessages([]);
    }
  }, []);
  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [uRes, cRes] = await Promise.all([
        api<{ items: User[] }>('/api/demo/users'),
        api<{ items: Chat[] }>('/api/demo/chats'),
      ]);
      setUsers(uRes.items);
      setChats(cRes.items);
      if (uRes.items.length > 0 && !selectedUser) setSelectedUser(uRes.items[0]);
      if (cRes.items.length > 0 && !selectedChat) selectChat(cRes.items[0]);
    } catch (e) {
      toast.error('Failed to load demo data');
    } finally {
      setLoading(false);
    }
  }, [selectedUser, selectedChat, selectChat]);
  useEffect(() => {
    loadAll();
  }, [loadAll]);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  const createUser = async () => {
    if (!newUserName.trim()) return;
    try {
      const u = await api<User>('/api/demo/users', {
        method: 'POST',
        body: JSON.stringify({ name: newUserName.trim() }),
      });
      setUsers(prev => [...prev, u]);
      setNewUserName('');
      toast.success('User created');
    } catch (e) {
      toast.error('Failed to create user');
    }
  };
  const createChat = async () => {
    if (!newChatTitle.trim()) return;
    try {
      const c = await api<Chat>('/api/demo/chats', {
        method: 'POST',
        body: JSON.stringify({ title: newChatTitle.trim() }),
      });
      setChats(prev => [...prev, c]);
      setNewChatTitle('');
      toast.success('Chat created');
    } catch (e) {
      toast.error('Failed to create chat');
    }
  };
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !selectedChat) return;
    try {
      const msg = await api<ChatMessage>(`/api/demo/chats/${selectedChat.id}/messages`, {
        method: 'POST',
        body: JSON.stringify({ userId: selectedUser.id, text: newMessage.trim() }),
      });
      setMessages(prev => [...prev, msg]);
      setNewMessage('');
    } catch (e) {
      toast.error('Failed to send message');
    }
  };
  const deleteUser = async (id: string) => {
    try {
      await api(`/api/demo/users/${id}`, { method: 'DELETE' });
      setUsers(prev => prev.filter((u) => u.id !== id));
      if (selectedUser?.id === id) setSelectedUser(null);
      toast.info('User deleted');
    } catch (e) {
      toast.error('Delete failed');
    }
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-4">
      {/* Sidebar - Management */}
      <div className="md:col-span-4 space-y-6">
        <Card className="glass-dark border-white/10 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-400" />
              Entities (Durable Objects)
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs">
              Each user/chat is a unique DO instance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-slate-500">Create New User</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Username"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="bg-white/5 border-white/10 h-8 text-xs"
                />
                <Button size="icon" className="h-8 w-8 shrink-0" onClick={createUser}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-slate-500">Active Users</label>
              <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                {users.map((u) => (
                  <div
                    key={u.id}
                    className={`flex items-center justify-between p-2 rounded-md text-xs cursor-pointer transition-colors ${
                      selectedUser?.id === u.id ? 'bg-blue-600/30 border border-blue-500/50' : 'bg-white/5 border border-transparent'
                    }`}
                    onClick={() => setSelectedUser(u)}
                  >
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-3 h-3 text-blue-400" />
                      <span className="font-medium truncate max-w-[100px]">{u.displayName || u.name}</span>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); deleteUser(u.id); }} className="text-slate-500 hover:text-red-400">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-dark border-white/10 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" />
              Storage Indices
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs">
              Efficiently list entities via Index DO
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-slate-500">Create Chat Board</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Board name"
                  value={newChatTitle}
                  onChange={(e) => setNewChatTitle(e.target.value)}
                  className="bg-white/5 border-white/10 h-8 text-xs"
                />
                <Button size="icon" variant="secondary" className="h-8 w-8 shrink-0" onClick={createChat}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-1">
              {chats.map((c) => (
                <div
                  key={c.id}
                  className={`flex items-center gap-2 p-2 rounded-md text-xs cursor-pointer ${
                    selectedChat?.id === c.id ? 'bg-purple-600/30 border border-purple-500/50' : 'bg-white/5 border border-transparent'
                  }`}
                  onClick={() => selectChat(c)}
                >
                  <MessageSquare className="w-3 h-3 text-purple-400" />
                  <span className="font-medium truncate">{c.title}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Main - Chat View */}
      <div className="md:col-span-8 flex flex-col h-[600px]">
        <Card className="flex-1 glass-dark border-white/10 text-white flex flex-col overflow-hidden">
          <CardHeader className="border-b border-white/10 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{selectedChat?.title || 'Select a Board'}</CardTitle>
                <CardDescription className="text-slate-400 text-xs">
                  Storage key: {selectedChat ? `chat:${selectedChat.id}` : 'none'}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-400 border-blue-500/20">
                  <UserIcon className="w-2 h-2 mr-1" />
                  {selectedUser?.displayName || selectedUser?.name || 'Guest'}
                </Badge>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={loadAll} disabled={loading}>
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2 opacity-50">
                <Layout className="w-12 h-12" />
                <p className="text-sm font-medium">No messages yet</p>
              </div>
            ) : (
              messages.map((m) => {
                const author = users.find((u) => u.id === m.userId);
                const isMe = selectedUser?.id === m.userId;
                return (
                  <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {isMe ? 'You' : (author?.displayName || author?.name || 'Unknown')}
                      </span>
                      <span className="text-[8px] text-slate-600">{new Date(m.ts).toLocaleTimeString()}</span>
                    </div>
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                        isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white/10 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
          <CardFooter className="p-4 border-t border-white/10">
            <form
              className="w-full flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
            >
              <Input
                placeholder={selectedUser ? "Type a message..." : "Select a user first"}
                disabled={!selectedUser || !selectedChat}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="bg-white/5 border-white/10"
              />
              <Button type="submit" disabled={!selectedUser || !selectedChat || !newMessage.trim()} className="shrink-0 bg-blue-600 hover:bg-blue-500">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}