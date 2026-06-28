export function useNotification() {
  const requestPermission = async () => {
    console.log("Notification support:", "Notification" in window);
    console.log("Current permission:", Notification.permission);
    if ("Notification" in window) {
      const result = await Notification.requestPermission();
      console.log("Permission result:", result);
    }
  };

  const scheduleNotification = (task, eventDateTime) => {
    const eventTime = new Date(eventDateTime).getTime();
    const notifyTime = eventTime - 30 * 60 * 1000;
    const now = Date.now();
    const delay = notifyTime - now;

    console.log("Task:", task);
    console.log("Event time:", new Date(eventTime).toLocaleString());
    console.log("Notify at:", new Date(notifyTime).toLocaleString());
    console.log("Delay in ms:", delay);
    console.log("Delay in minutes:", Math.round(delay / 60000));

    if (delay > 0) {
      console.log("Notification scheduled successfully");
      setTimeout(() => {
        console.log("Firing notification now");
        new Notification("Vocalendar Reminder", {
          body: `Upcoming: ${task} in 30 minutes`,
          icon: "/favicon.ico"
        });
      }, delay);
    } else {
      console.log("Notification NOT scheduled — event is in the past or less than 30 mins away");
    }
  };

  return { requestPermission, scheduleNotification };
}