import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";
import { theme } from "./components/theme/theme";
import Router from "./components/router/Router";
import Dashboard from "./pages/dashboard/Dashboard";

export default function App() {
  return (
    <>
      <MantineProvider theme={theme}>
        <Dashboard />
      </MantineProvider>
    </>
  );
}
