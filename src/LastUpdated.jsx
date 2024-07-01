import React from "react";

export function LastUpdated({ lastUpdated }) {
  const lastUpdatedDateString = new Intl.DateTimeFormat(navigator.language, {
    day: "numeric",
    year: "numeric",
    month: "long",
    hour: "numeric",
    minute: "numeric",
  }).format(lastUpdated);

  return (
    <div title="Last updated" id="last-updated">
      Last updated: {lastUpdatedDateString}
    </div>
  );
}
