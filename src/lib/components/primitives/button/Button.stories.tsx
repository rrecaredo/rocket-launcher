import { ComponentMeta, Story } from "@storybook/react";
import { theme } from "@common/theme";
import { ThemeProvider } from "styled-components";
import { Button, ButtonProps } from "./Button";

export default {
  title: "Primitives/Button",
  component: Button,
} as ComponentMeta<typeof Button>;

const Template: Story<ButtonProps> = (props) => (
  <ThemeProvider theme={theme}>
    <Button {...props}>My fancy button</Button>
  </ThemeProvider>
);

/* -------------------------------------------------------------------------- */
/*                                   BASIC                                    */
/* -------------------------------------------------------------------------- */

export const ButtonBasic = Template.bind({});

ButtonBasic.args = {
  variant: "primary",
};

ButtonBasic.storyName = "Basic";

/* -------------------------------------------------------------------------- */
/*                              WITH DECORATOR                                */
/* -------------------------------------------------------------------------- */

export const WithDecorator = Template.bind({});

WithDecorator.args = {
  variant: "secondary",
  decorator: <span>🙂</span>,
};

WithDecorator.storyName = "With decorator";

/* -------------------------------------------------------------------------- */
/*                                 DISABLED                                   */
/* -------------------------------------------------------------------------- */

export const Disabled = Template.bind({});

Disabled.args = {
  disabled: true,
};

Disabled.storyName = "Disabled";
