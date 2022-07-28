import { useState } from "react";
import styled from "styled-components";
import CancellableRequestButton from "@components/cancellable-request-button/CancellableRequestButton";
import { LAUNCH_ROCKET_URL, STRINGS } from "./constants";

const StyledFieldset = styled.fieldset`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  padding: 20px;
  gap: 10px;
  border-color: #ccc;
  border-radius: 15px;
`;

export const RocketLauncher = () => {
  const [information, setInformation] = useState("");
  return (
    <StyledFieldset>
      <legend>Launch Wayflyer Rocket ship</legend>
      <p>
        Press this button to ignite the rocket fuel of Wayflyer Rocket ship and
        launch it to the space and beyond.
      </p>
      <div style={{ flex: "0 0 100px" }}>
        <CancellableRequestButton
          state="ready"
          onInProgress={() => {
            setInformation(
              "Ignition started... Pressing the button again will cancel the launch."
            );
          }}
          onSuccess={() => {
            setInformation(`Rocket launched succesfully, wohoo!!!`);
          }}
          onFailure={(e: Error) => {
            setInformation(`There was an error - ${e}`);
          }}
          url={LAUNCH_ROCKET_URL}
          defaultLabel={STRINGS.LaunchRocketLabel}
          workingLabel={STRINGS.LaunchingLabel}
          errorLabel={STRINGS.LaunchRocketLabel}
          defaultTooltip={STRINGS.LaunchRocketTooltip}
          workingTooltip={STRINGS.CancelLaunchTooltip}
          errorTooltip={STRINGS.IgnitionErrorTooltip}
        />
      </div>
      <div>{information}</div>
    </StyledFieldset>
  );
};
