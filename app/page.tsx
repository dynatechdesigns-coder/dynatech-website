import { getContent } from "@/lib/content";
import HomePage from "./components/HomePage";

// Re-check MongoDB for new content at most once a minute.
// Saving in /admin also refreshes the page straight away.
export const revalidate = 60;

export default async function Page() {
  const content = await getContent();
  return <HomePage content={content} />;
}
