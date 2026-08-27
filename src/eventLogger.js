// eventLogger.js — logs every action with a timestamp
// In a bigger app this could write to a log file or a monitoring service (like Sentry in your RN projects)

export function logEvent(eventType, detail) {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[LOG] ${timestamp} | ${eventType} | ${detail}`);
}