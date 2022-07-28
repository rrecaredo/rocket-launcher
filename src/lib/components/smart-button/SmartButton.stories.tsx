import { ComponentMeta, Story } from "@storybook/react";
import { ThemeProvider } from "styled-components";
import { theme } from "@common";
import { SmartButton, SmartButtonProps } from "./SmartButton";

export default {
  title: "Components/SmartButton",
  component: SmartButton,
} as ComponentMeta<typeof SmartButton>;

const Template: Story<SmartButtonProps> = (props) => (
  <ThemeProvider theme={theme}>
    <SmartButton {...props} />
  </ThemeProvider>
);

/* -------------------------------------------------------------------------- */
/*                                  READY                                     */
/* -------------------------------------------------------------------------- */

export const Ready = Template.bind({});

Ready.args = {
  state: "ready",
  tooltip: "This is a tooltip",
  label: "Smart button",
  onClick: () => {},
};

/* -------------------------------------------------------------------------- */
/*                                  WORKING                                   */
/* -------------------------------------------------------------------------- */

export const Working = Template.bind({});

Working.args = {
  ...Ready.args,
  state: "working",
};

/* -------------------------------------------------------------------------- */
/*                                   ERROR                                    */
/* -------------------------------------------------------------------------- */

export const Error = Template.bind({});

Error.args = {
  ...Ready.args,
  state: "error",
};

/* -------------------------------------------------------------------------- */
/*                                 DISABLED                                   */
/* -------------------------------------------------------------------------- */

export const Disabled = Template.bind({});

Disabled.args = {
  ...Ready.args,
  state: "disabled",
};

Disabled.argTypes =
  Error.argTypes =
  Working.argTypes =
  Ready.argTypes =
    {
      state: {
        table: {
          disable: true,
        },
      },
    };
