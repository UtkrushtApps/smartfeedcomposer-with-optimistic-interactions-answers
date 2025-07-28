// NotificationsCenter.jsx
// Main entry-point for the notifications center module.
// Contains the NotificationsCenter composed of local reducer state, custom hooks, memoized grouping and pagination, and error boundaries.

import React, { useReducer, useMemo, useCallback, useRef } from "react";
import { useSimulatedNotificationStream } from "./useSimulatedNotificationStream";
import { NotificationGroup } from "./NotificationGroup";
import { reducer, initialState } from "./notificationsReducer";

// Constants for pagination
const PAGE_SIZE = 5;

export function NotificationsCenter() {
  // Local state via useReducer for notifications, loading/error actions, etc.
  const [state, dispatch] = useReducer(reducer, initialState);
  const { notifications, actions } = state;

  // Listen for simulated real-time notifications
  useSimulatedNotificationStream({
    onNotify: (notif) => dispatch({ type: "ADD_NOTIFICATION", notification: notif })
  });

  // Group notifications by date (string yyyy-mm-dd). Memoized for perf.
  const grouped = useMemo(() => {
    // { groupLabel: Notification[] }
    const groups = {};
    notifications.forEach((notif) => {
      // Group by notification.date (ISO date string, trunc with slice)
      const groupLabel = notif.date.slice(0, 10); // e.g. "2024-06-09"
      if (!groups[groupLabel]) groups[groupLabel] = [];
      groups[groupLabel].push(notif);
    });
    // Sort groups by date, latest first
    const sortedGroupLabels = Object.keys(groups).sort((a, b) => b.localeCompare(a));
    return sortedGroupLabels.map((label) => ({ label, notifications: groups[label] }));
  }, [notifications]);

  // Pagination logic, memoized to avoid re-renders unless groups/page changes.
  const [page, setPage] = React.useState(0);
  const numPages = useMemo(() => Math.ceil(grouped.length / PAGE_SIZE), [grouped.length]);
  const pagedGroups = useMemo(
    () => grouped.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    [grouped, page]
  );
  const onPageChange = useCallback(
    (dir) => setPage((p) => Math.max(0, Math.min(numPages - 1, p + dir))),
    [numPages]
  );

  // Handlers for marking read/unread, with optimistic UI and rollback
  const markRead = useCallback((id, read) => {
    dispatch({ type: "MARK_READ_START", id });
    // Simulate network request with random success/fail
    setTimeout(() => {
      if (Math.random() < 0.8) {
        // 80% chance success
        dispatch({ type: "MARK_READ_SUCCESS", id, read });
      } else {
        dispatch({ type: "MARK_READ_FAILURE", id, prevRead: !read });
      }
    }, 700);
  }, []);

  return (
    <div style={{ border: "1px solid #ccc", borderRadius: 8, width: 480, margin: "2rem auto", padding: 16 }}>
      <h2 style={{margin:"0 0 1em 0"}}>Notifications</h2>

      {pagedGroups.length === 0 && (
        <div>No notifications.</div>
      )}

      {/* Render groups per page, each in ErrorBoundary */}
      {pagedGroups.map((group) => (
        <ErrorBoundary key={group.label}>
          <NotificationGroup
            groupLabel={group.label}
            notifications={group.notifications}
            markRead={markRead}
            actions={actions}
          />
        </ErrorBoundary>
      ))}

      {/* Pagination controls */}
      {numPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 16, gap: 8 }}>
          <button
            disabled={page === 0}
            onClick={() => onPageChange(-1)}
          >
            Previous
          </button>
          <span>Page {page + 1} / {numPages}</span>
          <button
            disabled={page === numPages - 1}
            onClick={() => onPageChange(1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Per-group error boundary (class comp, not functional, for compatibility)
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(err) {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    // Could log to error service
  }
  render() {
    if (this.state.hasError) {
      return <div style={{ color: "red", padding: 16 }}>Failed to load this group of notifications.</div>;
    }
    return this.props.children;
  }
}

/*
Folder structure:
- NotificationsCenter.jsx         <-- root, holds useReducer, renders NotificationGroup & per-group ErrorBoundary
- useSimulatedNotificationStream.js  <-- custom hook, simulates receiving notifications via setTimeout
- notificationsReducer.js         <-- reducer & initialState, pure state logic for notifications/actions
- NotificationGroup.jsx           <-- memoized group UI, renders NotificationItem for each notif
- NotificationItem.jsx            <-- memoized, shows notification with read/unread state, mark button, loading/spinner
*/
