// useSimulatedNotificationStream.js
// Custom hook to simulate live notifications via setTimeout, provides onNotify callback.
import { useEffect, useRef } from "react";

// Simulate notification ID generation
let nextId = 1;

const types = ["comment", "like", "follow", "mention"]; // example notification types
const messages = {
  comment: "Someone commented on your post.",
  like: "Someone liked your photo.",
  follow: "You have a new follower!",
  mention: "You were mentioned in a post."
};

function getRandomNotification() {
  const type = types[Math.floor(Math.random() * types.length)];
  // Simulate a date within today or yesterday for grouping
  const date = new Date(Date.now() - 86400000 * Math.floor(Math.random() * 2));
  return {
    id: `notif_${nextId++}`,
    type,
    message: messages[type],
    date: date.toISOString(),
    read: false
  };
}

export function useSimulatedNotificationStream({ onNotify }) {
  // Use ref to always have latest callback
  const cbRef = useRef(onNotify);
  cbRef.current = onNotify;

  useEffect(() => {
    let stopped = false;
    function scheduleNext() {
      if (stopped) return;
      // Push a new notification every 1.5-4 seconds
      const interval = 1500 + Math.random() * 2500;
      setTimeout(() => {
        if (!stopped && cbRef.current) {
          cbRef.current(getRandomNotification());
        }
        scheduleNext();
      }, interval);
    }
    scheduleNext();
    return () => {
      stopped = true;
    };
  }, []);
}