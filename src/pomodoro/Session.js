import React from "react";
import { minutesToDuration } from "../utils/duration";

const Session = ({
  session,
  breakDuration,
  focusDuration,
  isTimerRunning,
  formatTime,
}) => {
  if (session === null) {
    return null;
  }

  // Session Label
  function staticSess() {
    if (session !== undefined && session !== null) {
      if (session.label === "Focusing") {
        return `Focusing for ${minutesToDuration(focusDuration)} minutes`;
      } else if (session.label === "On Break") {
        return `On Break for ${minutesToDuration(breakDuration)} minutes`;
      } else if (!isTimerRunning) {
        return `${session.label}`;
      }
    } else {
      return null;
    }
  }

  return (
    <div className="row mb-2">
      <div className="col">
        {/* Message below includes current session (Focusing or On Break) total duration */}
        <h2 data-testid="session-title">{staticSess()}</h2>
        {/* Message below correctly formats the time remaining in the current session */}
        <p className="lead" data-testid="session-sub-title">
          {session && formatTime(session.timeRemaining)} remaining
        </p>
        <h2 style={{ display: `${isTimerRunning ? "none" : "block"}` }}>
          PAUSE
        </h2>
      </div>
    </div>
  );
};

export default Session;
