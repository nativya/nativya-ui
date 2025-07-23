import { ContributePageClient } from "./ContributePageClient";

// --- Main Page Component (Server Component) ---
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ContributePage({ params }: PageProps) {
  const { id } = await params;

  return <ContributePageClient promptId={id} />;
}
