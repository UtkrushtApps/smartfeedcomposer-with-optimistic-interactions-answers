// NotificationItem.jsx
// Renders a single notification, shows mark as read/unread button, loading/error display. Memoized.
import React, { memo } from "react";

export const NotificationItem = memo(function NotificationItem({ notification, markRead, loading, error }) {
  // notification: {id, type, message, date, read}, markRead(id, bool)
  const { id, type, message, date, read } = notification;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 0",
        borderBottom: "1px solid #eee"
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: read ? 400 : 700, color: read ? "#444" : "#002c47" }}>
          {message}
        </div>
        <div style={{ fontSize: 12, color: "#666" }}>{new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        {error && <div style={{ color: "#b00", fontSize: 12 }}>{error}</div>}
      </div>
      <div style={{ minWidth: 120, textAlign: 'right' }}>
        <button
          disabled={!!loading}
          style={{ padding: "4px 10px", background: read ? "#e5e5e5" : "#2357cf", color: read ? "#444" : "white", border: "none", borderRadius: 4}}
          onClick={() => markRead(id, !read)}
        >
          {loading ? (
            <span style={{ fontSize: 13 }}>
              <span className="spinner" style={{ marginRight: 4 }}>⏳</span>
              Updating...
            </span>
          ) : (
            read ? "Mark as Unread" : "Mark as Read"
          )}
        </button>
      </div>
    </div>
  );
});
