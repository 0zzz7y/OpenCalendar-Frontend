import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";
import { Router } from "./components/router/Router";
import { theme } from "./components/theme/theme";

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Router />
    </MantineProvider>
  );
}
