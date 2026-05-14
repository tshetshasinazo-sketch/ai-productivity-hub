import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ClipboardList, Wand2, Copy } from "lucide-react";
import { toast } from "sonner";
import { summarizeMeeting } from "@/lib/ai.functions";
import { ToolShell, OutputCard } from "@/components/tool-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Markdown } from "@/components/markdown";

export const Route = createFileRoute("/summarizer")({
  head: () => ({ meta: [{ title: "Meeting Notes Summarizer — Workplace AI" }] }),
  component: SummarizerPage,
});

function SummarizerPage() {
  const fn = useServerFn(summarizeMeeting);
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (notes.trim().length < 20) { toast.error("Paste at least a paragraph of notes."); return; }
    setLoading(true); setOutput("");
    try {
      const res = await fn({ data: { notes } });
      setOutput(res.text);
    } catch (err) { toast.error(err instanceof Error ? err.message : "Failed to summarize"); }
    finally { setLoading(false); }
  }

  return (
    <ToolShell icon={ClipboardList} title="Meeting Notes Summarizer" description="Paste raw meeting notes, get a clean summary with decisions, action items and deadlines.">
      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={onSubmit} className="rounded-xl border bg-card p-5 shadow-soft space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="notes">Meeting notes / transcript</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={18} placeholder="Paste your raw notes or transcript here…" />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            <Wand2 className="mr-2 h-4 w-4" />
            {loading ? "Summarizing…" : "Summarize Notes"}
          </Button>
        </form>

        <OutputCard
          title="Structured Summary"
          isLoading={loading}
          empty="A structured summary with action items will appear here."
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
