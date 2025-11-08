// app/designs/page.tsx
import DesignGallery from "@/components/DesignGallery";

// For demo we hard-code the user id. In production read from session.
export default async function Page() {
  return <DesignGallery userId="uuid-user" />;
}