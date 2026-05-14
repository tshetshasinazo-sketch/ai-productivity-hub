import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { BookOpen, Wand2, Copy } from "lucide-react";
import { toast } from "sonner";
import { researchTopic } from "@/lib/ai.functions";
import { ToolShell, OutputCard } from "@/components/tool-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Markdown } from "@/components/markdown";

export const Route = createFileRoute("/research")({
  head: () => ({ meta: [{ title: "AI Research Assistant — Workplace AI" }] }),
  component: ResearchPage,
});

function ResearchPage() {
  const fn = useServerFn(researchTopic);
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (topic.trim().length < 3) { toast.error("Enter a topic."); return; }
    setLoading(true); setOutput("");
    try {
      const res = await fn({ data: { topic, audience: audience || undefined } });
      setOutput(res.text);
    } catch (err) { toast.error(err instanceof Error ? err.message : "Failed to research"); }
    finally { setLoading(false); }
  }

  return (
    <ToolShell icon={BookOpen} title="AI Research Assistant" description="Get a structured briefing on any topic — concepts, trends, insights & recommendations.">
      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={onSubmit} className="rounded-xl border bg-card p-5 shadow-soft space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="topic">Topic</Label>
            <Input id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Retrieval-augmented generation for legal teams" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="audience">Audience (optional)</Label>
            <Input id="audience" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g. Non-technical executives" />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            <Wand2 className="mr-2 h-4 w-4" />
            {loading ? "Researching…" : "Generate Briefing"}
          </Button>
          <p className="text-xs text-muted-foreground">
            AI may produce inaccuracies. Verify important facts before relying on them.
          </p>
        </form>

        <OutputCard
          title="Briefing"
          isLoading={loading}
          empty="Your research briefing will appear here."
          actions={output && (
            <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied"); }}>
              <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy
            </Button>
          )}
        >
          {output && <Markdown>{output}</Markdown>}
        </OutputCard>
      </div>
    </ToolShell>
  );
}
