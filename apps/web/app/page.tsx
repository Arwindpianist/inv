import { redirect } from "next/navigation";

export default function HomePage() {
  // Temporary redirect to dashboard
  redirect("/dashboard");
}

