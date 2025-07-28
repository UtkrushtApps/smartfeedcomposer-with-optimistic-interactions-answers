1. **Scaffold the Folder Structure**:
   - Create the following files: `NotificationsCenter.jsx`, `NotificationGroup.jsx`, `NotificationItem.jsx`, `useSimulatedNotificationStream.js`, `notificationsReducer.js`.

2. **Implement the Simulated Notification Stream (Custom Hook)**:
   - In `useSimulatedNotificationStream.js`, export a hook that, using `setTimeout`, periodically invokes an `onNotify` callback with a randomly generated notification.

3. **Create the Reducer and State Types**:
   - In `notificationsReducer.js`, set up `initialState` and a pure `reducer` that manages the notifications list and individual notification actions (loading/error tracking).
   - Support actions: adding notifications, starting and completing a read/unread toggle with optimistic local state, and rollback on failure.

4. **Design the Notification Item Component**:
   - In `NotificationItem.jsx`, create a memoized component showing the notification message, timestamp, read/unread state, and the button for marking as read/unread.
   - Display loading spinner and errors inline.

5. **Build the Notification Group Component**:
   - In `NotificationGroup.jsx`, create a memoized component that renders a titled group (today/yesterday/date) and maps over contained notifications.
   - Sort items by latest date.

6. **Compose NotificationsCenter**:
   - In `NotificationsCenter.jsx`, use `useReducer` to manage state from `notificationsReducer`.
   - Integrate `useSimulatedNotificationStream` to inject new notifications as they come in.
   - Use `useMemo` for grouping (by date, e.g. ISO date string) and paging (PAGE_SIZE=5 groups per page; user navigates pages).
   - For each group, render within a per-group `ErrorBoundary`.
   - Implement the optimistic UI handler for marking notifications as read/unread, simulating async success/failure. Support showing errors and retry.
   - Add pagination controls and overall structure.
   - Add comments at top of each file explaining its role, and at key logic sections.

7. **Optimize Rendering and Document the Structure**:
   - Memoize all group/item components; group and paging logic uses `useMemo`.
   - Document component hierarchy and architecture within `NotificationsCenter.jsx` as comments.

8. **Test**:
   - Verify new notifications appear in a real-time stream.
   - Try paginating, grouping, marking notifications read/unread and see optimistic UI and error handling per group/item.
   - Check that UI recovers gracefully from simulated failures, loading, and group-level errors.

9. **(Optional)** Polish styles minimally for clarity.