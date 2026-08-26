import { Stack } from "expo-router";
import { EnviosProvider } from "../context/enviosContext";

export default function RootLayout() {
  return (
    <EnviosProvider>
      <Stack />
    </EnviosProvider>
  );
}
