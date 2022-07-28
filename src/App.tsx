import { ThemeProvider } from "styled-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { theme } from "@common/theme";
import { RocketLauncher } from "./components/rocket-launcher";

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <RocketLauncher />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
