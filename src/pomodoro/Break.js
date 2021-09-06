import React from "react";
import { minutesToDuration } from "../utils/duration";

const Break = ({ 
  breakDuration,
  setBreakDuration,
}) => {

  return(
<div className="col">
          <div className="float-right">
            <div className="input-group input-group-lg mb-2">
              <span className="input-group-text" data-testid="duration-break">
                {/* Text to display the current break session duration */}
                <text id="break-label">Break Duration:&nbsp;</text><text id="break-duration">{minutesToDuration(breakDuration)}</text>
              </span>
              <div className="input-group-append">
                {/* Decreasing break duration and disable during a focus or break session*/}
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-testid="decrease-break"
                  onClick={() => {
                    if (breakDuration > 1) {
                      setBreakDuration(breakDuration - 1);
                    }
                  }}
                >
                  <span className="oi oi-minus" />
                </button>
                {/* Increasing break duration and disable during a focus or break session*/}
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-testid="increase-break"
                  onClick={() => {
                    if (breakDuration < 15) {
                      setBreakDuration(breakDuration + 1);
                    }
                  }}
                >
                  <span className="oi oi-plus" />
                </button>
              </div>
            </div>
          </div>
        </div>
  )
}
  
export default Break;
      