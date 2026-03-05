import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ projectId: string }>;
}

export default async function ComplianceAIPage({ params }: PageProps) {
  const { projectId } = await params;
  redirect(`/project/${projectId}/ai`);
}
