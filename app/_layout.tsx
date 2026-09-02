import { Stack } from "expo-router";
// import { EnviosProvider } from "../context/enviosContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <EnviosProvider> */}
      <Stack />
      {/* </EnviosProvider> */}
    </QueryClientProvider>
  );
}
