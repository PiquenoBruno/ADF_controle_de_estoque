import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "../src/providers/AuthProvider";
import { QueryProvider } from "../src/providers/QueryProvider";

function LayoutRouter() {
  const { session, loading } = useAuth();

  if (loading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {session ? (
        <Stack.Screen name="(drawer)" />
      ) : (
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryProvider>
      <AuthProvider>
        <LayoutRouter />
      </AuthProvider>
    </QueryProvider>
  );
}