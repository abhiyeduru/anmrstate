import React, { useEffect, useState } from "react";
import {
  listDraws,
  createDraw,
  listTickets,
  markWinner,
  exportTicketsToCSV,
  listAllTickets,
  deleteDraw
} from "../services/firestoreService";

export default function AdminPanel() {
  const [draws, setDraws] = useState([]);
  const [selected, setSelected] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [allTickets, setAllTickets] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [drawMap, setDrawMap] = useState({});
  const [creating, setCreating] = useState({ title: "", prize: "", date: "", ticketPrice: "", totalTickets: "" });
  const [loading, setLoading] = useState(true);

  // UI state
  const [activeTab, setActiveTab] = useState("overview"); // overview | draws | tickets | messages
  const [ticketSearch, setTicketSearch] = useState("");

  async function load() {
    setLoading(true);
    try {
      const d = await listDraws();
      setDraws(d || []);
      const map = {};
      (d || []).forEach(x => { map[x.id] = x.title || `Draw ${x.id}`; });
      setDrawMap(map);

      const at = await listAllTickets();
      setAllTickets(at || []);

      // dynamic import for listContacts to avoid top-level import errors if missing
      let ct = [];
      try {
        const svc = await import("../services/firestoreService");
        if (svc && typeof svc.listContacts === "function") {
          ct = await svc.listContacts();
        } else {
          console.warn("listContacts not exported from firestoreService; skipping contacts load.");
        }
      } catch (impErr) {
        console.warn("Failed to dynamically import listContacts:", impErr);
      }
      setContacts(ct || []);

      const active = (d || []).find(x => x.status === "active") || (d && d[0]) || null;
      setSelected(active);
      if (active) {
        const t = await listTickets(active.id);
        setTickets(t || []);
      } else {
        setTickets([]);
      }
    } catch (err) {
      console.error("Admin load error", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e) {
    e.preventDefault();
    const payload = {
      title: creating.title,
      prize: creating.prize,
      date: creating.date ? new Date(creating.date) : new Date(),
      ticketPrice: creating.ticketPrice ? Number(creating.ticketPrice) : 0,
      totalTickets: creating.totalTickets ? Number(creating.totalTickets) : null
    };
    await createDraw(payload);
    setCreating({ title: "", prize: "", date: "", ticketPrice: "", totalTickets: "" });
    load();
  }

  async function selectDraw(d) {
    setSelected(d);
    setActiveTab("draws");
    const t = await listTickets(d.id);
    setTickets(t || []);
  }

  function downloadCSV(list, name = "export") {
    const blob = exportTicketsToCSV(list);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleDeleteDraw(id) {
    if (!id) return;
    const ok = window.confirm("Delete this draw and all associated tickets? This cannot be undone.");
    if (!ok) return;
    try {
      await deleteDraw(id);
      if (selected?.id === id) setSelected(null);
      load();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete draw.");
    }
  }

  const filteredTickets = (activeTab === "tickets" ? allTickets : tickets).filter(t => {
    if (!ticketSearch) return true;
    const s = ticketSearch.toLowerCase();
    return (t.name || "").toLowerCase().includes(s) || (t.email || "").toLowerCase().includes(s) || (t.ticketNumber || "").toLowerCase().includes(s);
  });

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* SIDEBAR */}
          <aside className="col-span-12 md:col-span-3 bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-md flex items-center justify-center" style={{ backgroundColor: "var(--accent)" }}>
                <span className="font-bold" style={{ color: "#000" }}>ANM</span>
              </div>
              <div>
                <div className="font-bold" style={{ color: "var(--accent)" }}>Admin</div>
                <div className="text-xs text-zinc-400">Dashboard</div>
              </div>
            </div>

            <nav className="space-y-2">
              <button onClick={() => setActiveTab("overview")} className={`w-full text-left px-3 py-2 rounded ${activeTab === "overview" ? "bg-[color:var(--accent)] text-black" : "hover:bg-zinc-800"}`}>Overview</button>
              <button onClick={() => setActiveTab("draws")} className={`w-full text-left px-3 py-2 rounded ${activeTab === "draws" ? "bg-[color:var(--accent)] text-black" : "hover:bg-zinc-800"}`}>Draws</button>
              <button onClick={() => setActiveTab("tickets")} className={`w-full text-left px-3 py-2 rounded ${activeTab === "tickets" ? "bg-[color:var(--accent)] text-black" : "hover:bg-zinc-800"}`}>Tickets</button>
              <button onClick={() => setActiveTab("messages")} className={`w-full text-left px-3 py-2 rounded ${activeTab === "messages" ? "bg-[color:var(--accent)] text-black" : "hover:bg-zinc-800"}`}>Messages</button>
            </nav>

            <div className="mt-6 text-sm text-zinc-400">
              <div className="mb-2">Quick Stats</div>
              <div className="flex items-center justify-between">
                <div className="text-xs">Draws</div>
                <div className="font-semibold">{draws.length}</div>
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className="text-xs">Tickets</div>
                <div className="font-semibold">{allTickets.length}</div>
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className="text-xs">Messages</div>
                <div className="font-semibold">{contacts.length}</div>
              </div>
            </div>
          </aside>

          {/* MAIN */}
          <main className="col-span-12 md:col-span-9 space-y-6">
            {/* Overview Card */}
            {activeTab === "overview" && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold" style={{ color: "var(--accent)" }}>Overview</h2>
                    <p className="text-sm text-zinc-300">Manage draws, tickets and messages. Use the tabs to navigate.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => downloadCSV(allTickets, "all-tickets")} className="px-3 py-2 rounded border" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>Export Tickets</button>
                    <button onClick={() => downloadCSV(contacts, "contacts")} className="px-3 py-2 rounded border" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>Export Messages</button>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded border border-zinc-800 bg-black/20">
                    <div className="text-xs text-zinc-400">Total Draws</div>
                    <div className="text-xl font-bold" style={{ color: "var(--accent)" }}>{draws.length}</div>
                  </div>
                  <div className="p-4 rounded border border-zinc-800 bg-black/20">
                    <div className="text-xs text-zinc-400">Tickets Sold</div>
                    <div className="text-xl font-bold" style={{ color: "var(--accent)" }}>{allTickets.length}</div>
                  </div>
                  <div className="p-4 rounded border border-zinc-800 bg-black/20">
                    <div className="text-xs text-zinc-400">Messages</div>
                    <div className="text-xl font-bold" style={{ color: "var(--accent)" }}>{contacts.length}</div>
                  </div>
                </div>
              </div>
            )}

            {/* DRAWS */}
            {activeTab === "draws" && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold" style={{ color: "var(--accent)" }}>Manage Draws</h3>
                  <div className="text-sm text-zinc-400">Create, select or delete draws</div>
                </div>

                <div className="mt-4 grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-3">
                    {draws.map(d => (
                      <div key={d.id} className={`p-3 rounded border ${selected?.id === d.id ? "border-[color:var(--accent)] bg-black/20" : "border-zinc-800 bg-black/10"}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold" style={{ color: "var(--accent)" }}>{d.title}</div>
                            <div className="text-xs text-zinc-400">{d.prize}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => selectDraw(d)} className="px-2 py-1 rounded text-sm border" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>Select</button>
                            <button onClick={() => handleDeleteDraw(d.id)} className="px-2 py-1 rounded text-sm bg-red-600 text-white">Delete</button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {!draws.length && <div className="text-sm text-zinc-400 p-3 rounded border border-zinc-800">No draws yet</div>}
                  </div>

                  <div className="p-4 rounded border border-zinc-800 bg-black/20">
                    <div className="text-sm font-semibold" style={{ color: "var(--accent)" }}>Create Draw</div>
                    <form onSubmit={handleCreate} className="mt-3 space-y-2">
                      <input placeholder="Title" value={creating.title} onChange={e => setCreating({...creating, title: e.target.value})} className="w-full p-2 rounded bg-black/30 border border-zinc-800" />
                      <input placeholder="Prize" value={creating.prize} onChange={e => setCreating({...creating, prize: e.target.value})} className="w-full p-2 rounded bg-black/30 border border-zinc-800" />
                      <input type="datetime-local" value={creating.date} onChange={e => setCreating({...creating, date: e.target.value})} className="w-full p-2 rounded bg-black/30 border border-zinc-800" />
                      <input placeholder="Ticket Price" value={creating.ticketPrice} onChange={e => setCreating({...creating, ticketPrice: e.target.value})} className="w-full p-2 rounded bg-black/30 border border-zinc-800" />
                      <input placeholder="Total Tickets (optional)" value={creating.totalTickets} onChange={e => setCreating({...creating, totalTickets: e.target.value})} className="w-full p-2 rounded bg-black/30 border border-zinc-800" />
                      <div className="mt-2">
                        <button type="submit" className="px-3 py-2 rounded" style={{ backgroundColor: "var(--accent)", color: "#000" }}>Create</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* TICKETS */}
            {activeTab === "tickets" && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold" style={{ color: "var(--accent)" }}>Tickets</h3>
                  <div className="flex items-center gap-3">
                    <input placeholder="Search name, email, ticket" value={ticketSearch} onChange={e => setTicketSearch(e.target.value)} className="px-3 py-2 rounded bg-black/20 border border-zinc-800 text-sm" />
                    <button onClick={() => downloadCSV(filteredTickets, "filtered-tickets")} className="px-3 py-2 rounded border" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>Export</button>
                  </div>
                </div>

                <div className="mt-4 max-h-[60vh] overflow-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="p-2">Ticket</th>
                        <th className="p-2">Name</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Phone</th>
                        <th className="p-2">Draw</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Created At</th>
                        <th className="p-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTickets.map(t => (
                        <tr key={t.id} className="border-b">
                          <td className="p-2 font-mono" style={{ color: "var(--accent)" }}>{t.ticketNumber}</td>
                          <td className="p-2">{t.name}</td>
                          <td className="p-2">{t.email}</td>
                          <td className="p-2">{t.phone}</td>
                          <td className="p-2">{drawMap[t.drawId] || t.drawId}</td>
                          <td className="p-2">{t.status}</td>
                          <td className="p-2 text-xs text-zinc-400">{t.createdAt ? new Date(t.createdAt.seconds * 1000).toLocaleString() : "-"}</td>
                          <td className="p-2">
                            <button onClick={() => markWinner(t.drawId, t.id).then(load)} className="px-2 py-1 rounded text-xs bg-red-600 text-white">Mark Winner</button>
                          </td>
                        </tr>
                      ))}
                      {!filteredTickets.length && <tr><td colSpan="8" className="p-4 text-xs text-zinc-400">No tickets found</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* MESSAGES */}
            {activeTab === "messages" && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold" style={{ color: "var(--accent)" }}>Contact Messages</h3>
                  <div className="text-sm text-zinc-400">View all messages submitted via Contact form</div>
                </div>

                <div className="mt-4 max-h-[60vh] overflow-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="p-2">Name</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Message</th>
                        <th className="p-2">Received</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.map(c => (
                        <tr key={c.id} className="border-b">
                          <td className="p-2">{c.name}</td>
                          <td className="p-2">{c.email}</td>
                          <td className="p-2">{c.message}</td>
                          <td className="p-2 text-xs text-zinc-400">{c.createdAt ? new Date(c.createdAt.seconds * 1000).toLocaleString() : "-"}</td>
                        </tr>
                      ))}
                      {!contacts.length && <tr><td colSpan="4" className="p-4 text-xs text-zinc-400">No messages</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
