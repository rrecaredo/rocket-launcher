import { ComponentMeta, Story } from "@storybook/react";
import { ThemeProvider } from "styled-components";
import { theme } from "@common/theme";
import { Spinner, SpinnerProps } from "./Spinner";

export default {
  title: "Primitives/Spinner",
  component: Spinner,
} as ComponentMeta<typeof Spinner>;

const Template: Story<SpinnerProps> = (props) => (
  <ThemeProvider theme={theme}>
    <Spinner {...props} />
  </ThemeProvider>
);

export const SpinnerBasic = Template.bind({});

SpinnerBasic.storyName = "Spinner";

SpinnerBasic.args = {
  color: "red",
  size: "md",
};
