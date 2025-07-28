// notificationsReducer.js
// Holds reducer, action types, and initial state for local notifications management

export const initialState = {
  notifications: [],
  actions: {}  // { [notifId]: { loading: bool, error: string|null } }
};

export function reducer(state, action) {
  switch (action.type) {
    case "ADD_NOTIFICATION": {
      // De-duplicate by id (if reloaded)
      if (state.notifications.some((n) => n.id === action.notification.id)) {
        return state;
      }
      return {
        ...state,
        notifications: [action.notification, ...state.notifications]
      };
    }
    case "MARK_READ_START": {
      // Optimistic update: update read status immediately
      const notifIdx = state.notifications.findIndex((n) => n.id === action.id);
      if (notifIdx === -1) return state;
      const notif = state.notifications[notifIdx];
      const newNotif = { ...notif, read: !notif.read };
      const newNotifications = [...state.notifications];
      newNotifications[notifIdx] = newNotif;
      return {
        ...state,
        notifications: newNotifications,
        actions: {
          ...state.actions,
          [action.id]: { loading: true, error: null }
        }
      };
    }
    case "MARK_READ_SUCCESS": {
      // Complete optimistic update
      return {
        ...state,
        // notifications already updated
        actions: {
          ...state.actions,
          [action.id]: { loading: false, error: null }
        }
      };
    }
    case "MARK_READ_FAILURE": {
      // Rollback optimistic update
      const notifIdx = state.notifications.findIndex((n) => n.id === action.id);
      if (notifIdx === -1) return state;
      const notif = state.notifications[notifIdx];
      const newNotif = { ...notif, read: action.prevRead };
      const newNotifications = [...state.notifications];
      newNotifications[notifIdx] = newNotif;
      return {
        ...state,
        notifications: newNotifications,
        actions: {
          ...state.actions,
          [action.id]: { loading: false, error: "Failed to update. Please try again." }
        }
      };
    }
    default:
      return state;
  }
}
