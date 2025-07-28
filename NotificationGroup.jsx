// NotificationGroup.jsx
// Renders a group of notifications (by date/type) and the contained items. Memoized for perf.
// Props: groupLabel, notifications[], markRead(id, bool), actions
import React, { memo, useMemo } from "react";
import { NotificationItem } from "./NotificationItem";

// groupLabel: e.g. "2024-06-09"
function formatLabel(label) {
  // If today/yesterday, use friendly text
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (label === today) return "Today";
  if (label === yesterday) return "Yesterday";
  return label;
}

export const NotificationGroup = memo(function NotificationGroup({ groupLabel, notifications, markRead, actions }) {
  // Sort descending by date
  const sNotifications = useMemo(
    () =>
      notifications.slice().sort((a, b) => new Date(b.date) - new Date(a.date)),
    [notifications]
  );
  return (
    <div style={{ marginBottom: 24, padding: "12px 8px", background: "#f8f8fb", borderRadius: 6 }}>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>
        {formatLabel(groupLabel)}
      </div>
      {sNotifications.map((n) => (
        <NotificationItem
          key={n.id}
          notification={n}
          markRead={markRead}
          loading={actions[n.id]?.loading}
          error={actions[n.id]?.error}
        />
      ))}
    </div>
  );
});
