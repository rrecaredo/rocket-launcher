import { ComponentMeta, Story } from "@storybook/react";
import { ThemeProvider } from "styled-components";
import { theme } from "@common";
import { Tooltip, TooltipProps } from "./Tooltip";

export default {
  title: "Primitives/Tooltip",
  component: Tooltip,
} as ComponentMeta<typeof Tooltip>;

const Template: Story<TooltipProps> = (props) => (
  <ThemeProvider theme={theme}>
    <Tooltip {...props}>
      <span>Hover me!</span>
    </Tooltip>
  </ThemeProvider>
);

export const TooltipBasic = Template.bind({});

TooltipBasic.storyName = "Tooltip";

TooltipBasic.args = {
  text: "This is a tooltip",
  offset: 10,
  variant: "primary",
  state: "auto",
};

/*
Placement currently disabled as there is a bug with the Arrow positioning when
placement is equal to top.
*/
TooltipBasic.argTypes = {
  placement: {
    table: {
      disable: true,
    },
  },
};
