import { Fragment, useEffect, useState } from "react";
import {
  MessageSquare,
  Trash2,
  Send,
  Eye,
  Clock,
  CheckCircle,
  Reply,
  ChevronDown,
  Mail,
  Inbox,
} from "lucide-react";

import { API_URL } from "../../services/apiConfig";

const API_BASE = `${API_URL}/admin/feedback`;

const STATUS_COLORS = {
  Pending: { bg: "#fef3c7", color: "#b45309", icon: Clock },
  Reviewed: { bg: "#dbeafe", color: "#1d4ed8", icon: Eye },
  Resolved: { bg: "#dcfce7", color: "#15803d", icon: CheckCircle },
};

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: "Bearer " + localStorage.getItem("authToken"),
});

function StatusBadge({ status }) {
  const cfg = STATUS_COLORS[status] || STATUS_COLORS.Pending;
  const Icon = cfg.icon;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "3px 10px",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: 600,
        background: cfg.bg,
        color: cfg.color,
      }}
    >
      <Icon size={12} />
      {status || "Pending"}
    </span>
  );
}

export default function AdminMessages() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [replyFor, setReplyFor] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchFeedback = async () => {
    try {
      const res = await fetch(API_BASE, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) {
        setFeedback((data.feedback || []).filter((f) => f.type !== "review"));
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFeedback(); }, []);

  const updateStatus = async (id, status) => {
    setActionLoading(true);
    try {
      await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ status }),
      });
      await fetchFeedback();
    } finally { setActionLoading(false); }
  };

  const saveReply = async (id) => {
    if (!replyText.trim()) return;
    setActionLoading(true);
    try {
      await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ adminReply: replyText }),
      });
      setReplyFor(null);
      setReplyText("");
      await fetchFeedback();
    } finally { setActionLoading(false); }
  };

  const deleteFeedback = async (id) => {
    if (!window.confirm("Delete this message? This cannot be undone.")) return;
    setActionLoading(true);
    try {
      await fetch(`${API_BASE}/${id}`, { method: "DELETE", headers: authHeaders() });
      await fetchFeedback();
    } finally { setActionLoading(false); }
  };

  const filtered =
    filter === "All" ? feedback : feedback.filter((f) => f.status === filter);

  const counts = {
    Total: feedback.length,
    Pending: feedback.filter((f) => f.status === "Pending").length,
    Reviewed: feedback.filter((f) => f.status === "Reviewed").length,
    Resolved: feedback.filter((f) => f.status === "Resolved").length,
  };

  return (
    <div>
      <div className="page-heading">
        <div>
          <h2>Contact Messages</h2>
          <p>Messages received from the Contact Us page</p>
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        {[
          { label: "Total Messages", value: counts.Total, color: "#0891b2", bg: "#ecfeff", icon: Mail },
          { label: "Pending", value: counts.Pending, color: "#b45309", bg: "#fef3c7", icon: Clock },
          { label: "Reviewed", value: counts.Reviewed, color: "#1d4ed8", bg: "#dbeafe", icon: Eye },
          { label: "Resolved", value: counts.Resolved, color: "#15803d", bg: "#dcfce7", icon: CheckCircle },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                background: s.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <s.icon size={20} color={s.color} />
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "2px" }}>{s.label}</div>
              <div style={{ fontSize: "24px", fontWeight: 700, color: s.color }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter + Table */}
      <section className="panel">
        <div style={{ display: "flex", gap: "6px", marginBottom: "16px", flexWrap: "wrap" }}>
          {["All", "Pending", "Reviewed", "Resolved"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                border: filter === tab ? "1px solid #0891b2" : "1px solid #e5e7eb",
                background: filter === tab ? "#0891b2" : "#fff",
                color: filter === tab ? "#fff" : "#374151",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              {tab} {tab !== "All" ? `(${counts[tab]})` : `(${counts.Total})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#9ca3af" }}>
            <Inbox size={36} color="#d1d5db" style={{ marginBottom: "8px" }} />
            <p style={{ margin: 0 }}>No messages found</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    textAlign: "left",
                    borderBottom: "2px solid #cffafe",
                    fontSize: "12px",
                    color: "#6b7280",
                    background: "#ecfeff",
                  }}
                >
                  <th style={{ padding: "10px" }}>Customer</th>
                  <th style={{ padding: "10px" }}>Email</th>
                  <th style={{ padding: "10px" }}>Subject</th>
                  <th style={{ padding: "10px" }}>Message</th>
                  <th style={{ padding: "10px" }}>Status</th>
                  <th style={{ padding: "10px" }}>Date</th>
                  <th style={{ padding: "10px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((f) => (
                  <Fragment key={f.id}>
                    <tr style={{ borderBottom: "1px solid #f3f4f6", verticalAlign: "top" }}>
                      <td style={{ padding: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div
                            style={{
                              width: "34px",
                              height: "34px",
                              borderRadius: "50%",
                              background: "#0891b2",
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "14px",
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            {(f.name || "?")[0].toUpperCase()}
                          </div>
                          <strong style={{ fontSize: "13px" }}>{f.name}</strong>
                        </div>
                      </td>
                      <td style={{ padding: "10px", fontSize: "13px", color: "#374151" }}>
                        {f.email || "—"}
                        {f.phone && <div style={{ fontSize: "11px", color: "#9ca3af" }}>{f.phone}</div>}
                      </td>
                      <td style={{ padding: "10px", fontSize: "13px", fontWeight: 500, color: "#374151" }}>
                        {f.subject || "—"}
                      </td>
                      <td style={{ padding: "10px", fontSize: "13px", maxWidth: "300px" }}>
                        {f.message}
                        {f.admin_reply && (
                          <div
                            style={{
                              marginTop: "6px",
                              padding: "6px 8px",
                              background: "#eff6ff",
                              borderLeft: "3px solid #3b82f6",
                              borderRadius: "4px",
                              fontSize: "12px",
                              color: "#1e40af",
                            }}
                          >
                            <strong>Admin reply:</strong> {f.admin_reply}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "10px" }}><StatusBadge status={f.status} /></td>
                      <td style={{ padding: "10px", fontSize: "12px", color: "#6b7280", whiteSpace: "nowrap" }}>
                        {f.created_at ? new Date(f.created_at).toLocaleDateString() : "—"}
                      </td>
                      <td style={{ padding: "10px", whiteSpace: "nowrap" }}>
                        <div style={{ position: "relative", display: "inline-block", marginRight: "6px" }}>
                          <select
                            value={f.status || "Pending"}
                            disabled={actionLoading}
                            onChange={(e) => updateStatus(f.id, e.target.value)}
                            style={{
                              appearance: "none",
                              padding: "5px 24px 5px 10px",
                              fontSize: "12px",
                              border: "1px solid #e5e7eb",
                              borderRadius: "6px",
                              background: "#fff",
                              cursor: "pointer",
                            }}
                          >
                            {["Pending", "Reviewed", "Resolved"].map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <ChevronDown size={12} style={{ position: "absolute", right: "7px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#6b7280" }} />
                        </div>
                        <button className="small-action" title="Reply" disabled={actionLoading} onClick={() => { setReplyFor(replyFor === f.id ? null : f.id); setReplyText(f.admin_reply || ""); }} style={{ marginRight: "6px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <Reply size={13} /> Reply
                        </button>
                        <button className="small-action" title="Delete" disabled={actionLoading} onClick={() => deleteFeedback(f.id)} style={{ color: "#dc2626" }}>
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                    {replyFor === f.id && (
                      <tr>
                        <td colSpan={7} style={{ padding: "10px", background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                          <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                            <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Type your reply..." rows={2} style={{ flex: 1, padding: "8px 10px", fontSize: "13px", border: "1px solid #d1d5db", borderRadius: "6px", resize: "vertical", fontFamily: "inherit" }} />
                            <button className="small-action" disabled={actionLoading || !replyText.trim()} onClick={() => saveReply(f.id)} style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "#3b82f6", color: "#fff" }}>
                              <Send size={13} /> Save
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
