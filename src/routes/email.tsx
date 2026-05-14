import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Mail, Copy, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { generateEmail } from "@/lib/ai.functions";
import { ToolShell, OutputCard } from "@/components/tool-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/email")({
  head: () => ({ meta: [{ title: "Smart Email Generator — Workplace AI" }] }),
  component: EmailPage,
});

type Tone = "formal" | "friendly" | "persuasive" | "concise" | "apologetic";

function EmailPage() {
  const fn = useServerFn(generateEmail);
  const [tone, setTone] = useState<Tone>("formal");
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [context, setContext] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (context.trim().length < 5) { toast.error("Please describe what the email should say."); return; }
    setLoading(true); setOutput("");
    try {
      const res = await fn({ data: { tone, recipient: recipient || undefined, subject: subject || undefined, context } });
      setOutput(res.text);
    } catch (err) { toast.error(err instanceof Error ? err.message : "Failed to generate email"); }
    finally { setLoading(false); }
  }

  return (
    <ToolShell icon={Mail} title="Smart Email Generator" description="Describe the situation and pick a tone — get a polished, ready-to-send email.">
      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={onSubmit} className="rounded-xl border bg-card p-5 shadow-soft space-y-4">
          <div className="grid gap-2">
            <Label>Tone</Label>
            <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="persuasive">Persuasive</SelectItem>
                <SelectItem value="concise">Concise</SelectItem>
                <SelectItem value="apologetic">Apologetic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="recipient">Recipient (optional)</Label>
            <Input id="recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="e.g. Sarah, Head of Marketing" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="subject">Subject hint (optional)</Label>
            <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Q3 campaign timeline" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="context">What should the email say?</Label>
            <Textarea id="context" value={context} onChange={(e) => setContext(e.target.value)} rows={8} placeholder="Briefly describe the situation, key points, and the action you need from the recipient." />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            <Wand2 className="mr-2 h-4 w-4" />
            {loading ? "Drafting…" : "Generate Email"}
          </Button>
        </form>

        <OutputCard
          title="Drafted Email"
          isLoading={loading}
          empty="Your generated email will appear here. You can edit it before sending."
          actions={output && (
            <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied"); }}>
              <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy
            </Button>
          )}
        >
          {output && (
            <Textarea value={output} onChange={(e) => setOutput(e.target.value)} rows={18} className="font-mono text-sm" />
          )}
        </OutputCard>
      </div>
    </ToolShell>
  );
}
