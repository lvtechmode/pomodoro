import { minutesToDuration } from "../utils/duration";
import React from "react";

const Focus = ({ 
        focusDuration,
        setFocusDuration,
    }) => { 


return (
  <div className="col">
  <div className="input-group input-group-lg mb-2">
    <span className="input-group-text" data-testid="duration-focus">
      {/* Text to display the current focus session duration */}
      <text id="focus-label">Focus Duration:&nbsp;</text><text id="focus-duration">{minutesToDuration(focusDuration)}</text>
    </span>
    <div className="input-group-append">
      {/* Decreasing focus duration and disable during a focus or break session */}
      <button
        type="button"
        className="btn btn-secondary"
        data-testid="decrease-focus"
        onClick={() => {
          if (focusDuration > 5) setFocusDuration(focusDuration - 5);
        }}
      >
        <span className="oi oi-minus" />
      </button>
      {/* Increasing focus duration  and disable during a focus or break session */}
      <button
        type="button"
        className="btn btn-secondary"
        data-testid="increase-focus"
        onClick={() => {
          if (focusDuration < 60) setFocusDuration(focusDuration + 5);
        }}
      >
        <span className="oi oi-plus" />
      </button>
    </div>
  </div>
</div>
    )
}
export default Focus;
