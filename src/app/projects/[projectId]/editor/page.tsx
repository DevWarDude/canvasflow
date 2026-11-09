import { EditorShell } from "@/features/editor/components/editor-shell";

interface EditorPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function EditorPage({ params }: EditorPageProps) {
  const { projectId } = await params;

  return <EditorShell projectId={projectId} />;
}
