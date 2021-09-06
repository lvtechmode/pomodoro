import React, { useState } from "react";
import classNames from "../utils/class-names";
import useInterval from "../utils/useInterval";
import { minutesToDuration } from "../utils/duration";
import Focus from "./Focus";
import Break from "./Break.js";

// These functions are defined outside of the component to insure they do not have access to state
// and are, therefore more likely to be pure.

/**
 * Update the session state with new state after each tick of the interval.
 * @param prevState
 *  the previous session state
 * @returns
 *  new session state with timing information updated.
 */
function nextTick(prevState) {
  const timeRemaining = Math.max(0, prevState.timeRemaining - 1);
  return {
    ...prevState,
    timeRemaining,
  };
}

const formatTime = (time) => {
  let minutes = Math.floor(time/60);
  let seconds = time % 60;

return (
  (minutes < 10 ? "0" + minutes : minutes) + ":" + 
  (seconds < 10 ? "0" + seconds : seconds)
  );
};

/**
 * Higher order function that returns a function to update the session state with the next session type upon timeout.
 * @param focusDuration
 *    the current focus duration
 * @param breakDuration
 *    the current break duration
 * @returns
 *  function to update the session state.
 */
function nextSession(focusDuration, breakDuration) {
  /**
   * State function to transition the current session type to the next session. e.g. On Break -> Focusing or Focusing -> On Break
   */
  return (currentSession) => {
    if (currentSession.label === "Focusing") {
      return {
        label: "On Break",
        timeRemaining: breakDuration * 60,
      };
    }
    return {
      label: "Focusing",
      timeRemaining: focusDuration * 60,
    };
  };
}

function Pomodoro() {
  // Timer starts out paused
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  // The current session - null where there is no session running
  const [session, setSession] = useState(null);
  const [elapsed, setElapsed] = useState(0);

  // Allows the user to adjust the focus and break duration.
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);


  // Progress bar variables
  const [aria, setAria] = useState(0);
  const [breakRemaining, setBreakRemaining] = useState(0);

  /**
   * Custom hook that invokes the callback function every second
   *
   * NOTE: You will not need to make changes to the callback function
   */

  // Progress bar logic
  useInterval(() => {

      setBreakRemaining(breakRemaining + 1);
      if (session.timeRemaining === 0) {
        new Audio("https://bigsoundbank.com/UPLOAD/mp3/1482.mp3").play();
        setSession(nextSession(focusDuration, breakDuration));
      }
      setSession(nextTick);
      const leftover = session.timeRemaining;
      if (session.label === "Focusing") {
        setAria((100 * (focusDuration * 60 - leftover)) / (focusDuration * 60));
      } else {
        setAria((100 * (breakDuration * 60 - leftover)) / (breakDuration * 60));
      }
    },
    isTimerRunning ? 1000 : null
  );

  useInterval(() => {
    if (session && session.timeRemaining) {
      return setElapsed(elapsed + 1);
    }
  }, 1000);

  /**
   * Called whenever the play/pause button is clicked.
   */

  function playPause() {
    setIsTimerRunning((prevState) => {
      const nextState = !prevState;
      if (nextState) {
        setSession((prevStateSession) => {
          // If the timer is starting and the previous session is null,
          // start a focusing session.
          if (prevStateSession === null) {
            return {
              label: "Focusing",
              timeRemaining: focusDuration * 60,
            };
          }
          return prevStateSession;
        });
      }
      return nextState;
    });
  }


  // Session Label
  function staticSess() {
    if(session?.label === "Focusing") {
      return `Focusing for ${minutesToDuration(focusDuration)} minutes`
    } else if (session?.label === "On Break"){
      return `On Break for ${minutesToDuration(breakDuration)} minutes`
    } else {
      return; 
    } 
  };

 
  return (
    <div className="pomodoro">
      <div className="row">
        <Focus 
          focusDuration={focusDuration}
          setFocusDuration={setFocusDuration}
          />
        <Break
          breakDuration={breakDuration}
          setBreakDuration={setBreakDuration}
         />
         </div>
      
    <div className="row">
      <div className="col">
        <div
          className="btn-group btn-group-lg mb-2"
          role="group"
          aria-label="Timer controls"
        >
          <button
            type="button"
            className="btn btn-primary"
            data-testid="play-pause"
            title="Start or pause timer"
            onClick={playPause}
          >
            <span
              className={classNames({
                oi: true,
                "oi-media-play": !isTimerRunning,
                "oi-media-pause": isTimerRunning,
              })}
              />
            </button>
            {/* Stopping the current focus or break session. and disable the stop button when there is no active session */}
            {/* Disable the stop button when there is no active session */}
            <button
              type="button"
              className="btn btn-secondary"
              data-testid="stop"
              title="Stop the session"
              disabled={!isTimerRunning}
              onClick={() => {
                setSession(null);
                setIsTimerRunning(false);
                setElapsed(0);
              }}
            >
              <span className="oi oi-media-stop" />
            </button>
          </div>
        </div>
      </div>
      <div>
        {/* Shows only when there is an active focus or break - i.e. the session is running or is paused */}
        {session && (
          <div className="row mb-2">
            <div className="col">
              {/* Message below includes current session (Focusing or On Break) total duration */}
              <h2 data-testid="session-title">
                {staticSess()}
              </h2>
              {/* Message below correctly formats the time remaining in the current session */}
              <p className="lead" data-testid="session-sub-title">
                {session && formatTime(session.timeRemaining)} remaining
              </p>
              <h2 style={{display: `${isTimerRunning ? "none" : "block" }`}}>PAUSED</h2>
            </div> 
          </div>
        )}
          <div className="row mb-2">
            <div className="col">
              <div className="progress" style={{ height: "20px" }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow={aria} // Increase of aria-valuenow as elapsed time increases
                  style={{ width: `${aria}%` }} // Increase width % as elapsed time increases
                />
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}

export default Pomodoro;
