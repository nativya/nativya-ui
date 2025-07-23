import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useGoogleLogin() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLogin = async () => {
    if (status === "loading") return; // Optionally block while loading
    if (session) {
      router.push("/home");
      return;
    }
    try {
      await signIn("google", { callbackUrl: "/home" });
    } catch (error) {
      console.error("Login failed", error);
    }
  };
  return handleLogin;
}
