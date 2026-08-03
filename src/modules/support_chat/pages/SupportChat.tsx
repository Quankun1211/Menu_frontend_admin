import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Empty, Input, Spin, message as toast } from "antd";
import { CheckCircle2, Headphones, RotateCcw, Search, Send, UserPlus } from "lucide-react";
import api from "../../../services/axios";
import { useSocket } from "../../../context/SocketContext";
import { useAppStore } from "../../../store/app.store";

type Admin = { _id: string; name: string; email: string; avatar?: string };
type Message = { _id: string; senderRole: "user" | "admin"; content: string; createdAt: string };
type Status = "waiting" | "assigned" | "resolved";
type Conversation = { _id: string; customer: Admin; assignedAdmin?: Admin | null; status?: Status; messages: Message[]; lastMessage: string; lastMessageAt: string; unreadByAdmin: number };
type Filter = "waiting" | "mine" | "all";

export default function SupportChat() {
  const [items, setItems] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string>();
  const [conversation, setConversation] = useState<Conversation>();
  const [filter, setFilter] = useState<Filter>("waiting");
  const [query, setQuery] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const socket = useSocket();
  const adminId = useAppStore((state) => state.userData?.userId);

  const statusOf = (item: Conversation): Status => item.status || "waiting";
  const isMine = (item?: Conversation) => !!item?.assignedAdmin?._id && item.assignedAdmin._id === adminId;

  const loadList = useCallback(async () => {
    const response = await api.get("/support-chats/conversations");
    setItems(response.data.data || []); setLoading(false);
  }, []);
  const loadConversation = useCallback(async (id: string) => {
    const response = await api.get(`/support-chats/conversations/${id}`);
    const value = response.data.data as Conversation;
    setConversation(value);
    if (value.assignedAdmin?._id === adminId) {
      await api.patch(`/support-chats/conversations/${id}/read`);
      setItems((all) => all.map((item) => item._id === id ? { ...item, unreadByAdmin: 0 } : item));
    }
  }, [adminId]);

  useEffect(() => { loadList(); }, [loadList]);
  useEffect(() => { if (selectedId) loadConversation(selectedId); else setConversation(undefined); }, [selectedId, loadConversation]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [conversation?.messages]);
  useEffect(() => {
    if (!socket) return;
    const update = ({ conversationId }) => { loadList(); if (conversationId === selectedId) loadConversation(conversationId); };
    socket.on("support_conversation_updated", update);
    return () => socket.off("support_conversation_updated", update);
  }, [socket, selectedId, loadList, loadConversation]);

  const runAction = async (action: "claim" | "release" | "resolve") => {
    if (!selectedId || busy) return;
    setBusy(true);
    try {
      const response = await api.patch(`/support-chats/conversations/${selectedId}/${action}`);
      setConversation(response.data.data);
      await loadList();
      toast.success(action === "claim" ? "Đã nhận xử lý hội thoại" : action === "resolve" ? "Đã hoàn tất hội thoại" : "Đã đưa hội thoại về hàng chờ");
    } catch (error: any) { toast.error(error?.message || "Không thể cập nhật hội thoại"); await loadConversation(selectedId); }
    finally { setBusy(false); }
  };
  const send = async () => {
    const content = input.trim();
    if (!content || !selectedId || busy || !isMine(conversation) || statusOf(conversation!) !== "assigned") return;
    setBusy(true); setInput("");
    try {
      const response = await api.post(`/support-chats/conversations/${selectedId}/messages`, { content });
      setConversation((current) => current ? { ...current, messages: [...current.messages, response.data.data] } : current);
      loadList();
    } catch (error: any) { setInput(content); toast.error(error?.message || "Không thể gửi tin nhắn"); }
    finally { setBusy(false); }
  };

  const counts = useMemo(() => ({
    waiting: items.filter((item) => statusOf(item) === "waiting").length,
    mine: items.filter((item) => statusOf(item) === "assigned" && isMine(item)).length,
  }), [items, adminId]);
  const filtered = items.filter((item) => {
    const matchesSearch = `${item.customer.name} ${item.customer.email}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === "all" || (filter === "waiting" ? statusOf(item) === "waiting" : statusOf(item) === "assigned" && isMine(item));
    return matchesSearch && matchesFilter;
  });
  const selectedStatus = conversation ? statusOf(conversation) : "waiting";
  const mine = isMine(conversation);

  return <div className="h-full min-h-[calc(100vh-4rem)] p-4 md:p-6">
    <div className="mb-4"><h1 className="text-2xl font-bold text-slate-900">Tin nhắn khách hàng</h1><p className="text-sm text-slate-500">Nhận và xử lý từng hội thoại để tránh phản hồi trùng</p></div>
    <div className="flex h-[calc(100vh-9rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <aside className={`${selectedId ? "hidden md:flex" : "flex"} w-full md:w-80 shrink-0 flex-col border-r border-slate-200`}>
        <div className="p-3 border-b space-y-3"><Input prefix={<Search size={16}/>} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm khách hàng..."/><div className="grid grid-cols-3 gap-1 rounded-lg bg-slate-100 p-1">{(["waiting", "mine", "all"] as Filter[]).map((key) => <button key={key} onClick={() => setFilter(key)} className={`rounded-md px-2 py-1.5 text-xs font-semibold ${filter === key ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500"}`}>{key === "waiting" ? `Chờ (${counts.waiting})` : key === "mine" ? `Của tôi (${counts.mine})` : "Tất cả"}</button>)}</div></div>
        <div className="flex-1 overflow-y-auto">{loading ? <Spin className="m-8"/> : filtered.length === 0 ? <Empty className="mt-12" description="Chưa có hội thoại"/> : filtered.map((item) => {
          const status = statusOf(item); const assignedToMe = isMine(item);
          return <button key={item._id} onClick={() => setSelectedId(item._id)} className={`w-full p-4 flex gap-3 text-left border-b border-slate-100 hover:bg-slate-50 ${selectedId === item._id ? "bg-emerald-50" : ""}`}>
            <img src={item.customer.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.customer.name)}`} className="h-11 w-11 shrink-0 rounded-full object-cover"/>
            <div className="min-w-0 flex-1"><div className="flex justify-between gap-2"><p className="truncate font-semibold text-slate-800">{item.customer.name}</p>{item.unreadByAdmin > 0 && (status === "waiting" || assignedToMe) && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs text-white">{item.unreadByAdmin}</span>}</div><p className="truncate text-sm text-slate-500">{item.lastMessage}</p><p className={`mt-1 text-[10px] font-semibold ${status === "waiting" ? "text-amber-600" : status === "resolved" ? "text-slate-400" : assignedToMe ? "text-emerald-600" : "text-blue-600"}`}>{status === "waiting" ? "Đang chờ" : status === "resolved" ? "Đã hoàn tất" : assignedToMe ? "Bạn đang xử lý" : `${item.assignedAdmin?.name || "Admin khác"} đang xử lý`}</p></div>
          </button>;
        })}</div>
      </aside>
      <section className={`${selectedId ? "flex" : "hidden md:flex"} min-w-0 flex-1 flex-col`}>
        {!conversation ? <div className="m-auto text-center text-slate-400"><Headphones size={48} className="mx-auto mb-3"/><p>Chọn một hội thoại để bắt đầu</p></div> : <>
          <header className="min-h-16 px-4 py-2 flex items-center gap-3 border-b"><button className="md:hidden text-slate-500" onClick={() => setSelectedId(undefined)}>←</button><img src={conversation.customer.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(conversation.customer.name)}`} className="h-10 w-10 rounded-full"/><div className="min-w-0 flex-1"><p className="font-semibold text-slate-800">{conversation.customer.name}</p><p className="truncate text-xs text-slate-400">{conversation.customer.email}</p></div><div className="flex gap-2">{selectedStatus === "waiting" && <button disabled={busy} onClick={() => runAction("claim")} className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"><UserPlus size={15}/> Nhận xử lý</button>}{selectedStatus === "assigned" && mine && <><button disabled={busy} onClick={() => runAction("release")} className="flex items-center gap-1 rounded-lg border px-2.5 py-2 text-xs text-slate-600"><RotateCcw size={14}/> Trả lại</button><button disabled={busy} onClick={() => runAction("resolve")} className="flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-2 text-xs font-semibold text-white"><CheckCircle2 size={14}/> Hoàn tất</button></>}</div></header>
          {selectedStatus === "assigned" && !mine && <div className="border-b bg-blue-50 px-4 py-2 text-center text-xs text-blue-700">{conversation.assignedAdmin?.name || "Quản trị viên khác"} đang phụ trách. Bạn chỉ có thể xem hội thoại.</div>}
          {selectedStatus === "resolved" && <div className="border-b bg-slate-100 px-4 py-2 text-center text-xs text-slate-600">Hội thoại đã hoàn tất. Nếu khách nhắn thêm, hội thoại sẽ tự quay lại hàng chờ.</div>}
          <div className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-6 space-y-3">{conversation.messages.map((message) => <div key={message._id} className={`flex ${message.senderRole === "admin" ? "justify-end" : "justify-start"}`}><div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${message.senderRole === "admin" ? "bg-emerald-600 text-white rounded-br-sm" : "bg-white border text-slate-700 rounded-bl-sm"}`}><p className="whitespace-pre-wrap">{message.content}</p><p className={`mt-1 text-[10px] ${message.senderRole === "admin" ? "text-emerald-100" : "text-slate-400"}`}>{new Date(message.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</p></div></div>)}<div ref={bottomRef}/></div>
          {selectedStatus === "assigned" && mine ? <div className="p-3 md:p-4 border-t flex gap-2"><Input.TextArea autoSize={{ minRows: 1, maxRows: 4 }} maxLength={2000} value={input} onChange={(e) => setInput(e.target.value)} onPressEnter={(e) => { if (!e.shiftKey) { e.preventDefault(); send(); } }} placeholder="Nhập nội dung hỗ trợ..."/><button onClick={send} disabled={!input.trim() || busy} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white disabled:bg-slate-300"><Send size={18}/></button></div> : <div className="border-t p-3 text-center text-sm text-slate-500">{selectedStatus === "waiting" ? "Nhận xử lý để trả lời khách hàng" : selectedStatus === "resolved" ? "Hội thoại đã hoàn tất" : "Bạn không phải người phụ trách hội thoại này"}</div>}
        </>}
      </section>
    </div>
  </div>;
}
