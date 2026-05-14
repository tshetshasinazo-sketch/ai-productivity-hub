import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { CalendarClock, Wand2, Copy } from "lucide-react";
import { toast } from "sonner";
import { planTasks } from "@/lib/ai.functions";
import { ToolShell, OutputCard } from "@/components/tool-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Markdown } from "@/components/markdown";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/planner")({
  head: () => ({ meta: [{ title: "AI Task Planner — Workplace AI" }] }),
  component: PlannerPage,
});

function PlannerPage() {
  const fn = useServerFn(planTasks);
  const [horizon, setHorizon] = useState<"day" | "week">("day");
  const [hours, setHours] = useState(6);
  const [tasks, setTasks] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (tasks.trim().length < 5) { toast.error("Add at least one task."); return; }
    setLoading(true); setOutput("");
    try {
      const res = await fn({ data: { horizon, tasks, hoursPerDay: hours } });
      setOutput(res.text);
    } catch (err) { toast.error(err instanceof Error ? err.message : "Failed to plan"); }
    finally { setLoading(false); }
  }

  return (
    <ToolShell icon={CalendarClock} title="AI Task Planner" description="Drop in your task list and get a prioritized, time-blocked schedule.">
      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={onSubmit} className="rounded-xl border bg-card p-5 shadow-soft space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Plan for</Label>
              <Select value={horizon} onValueChange={(v) => setHorizon(v as "day" | "week")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Today</SelectItem>
                  <SelectItem value="week">This week</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hours">Focus hours / day</Label>
              <Input id="hours" type="number" min={1} max={16} value={hours} onChange={(e) => setHours(Number(e.target.value) || 6)} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tasks">Tasks & goals</Label>
            <Textarea id="tasks" value={tasks} onChange={(e) => setTasks(e.target.value)} rows={14} placeholder={`One per line, e.g.\nFinish Q3 report draft (due Friday)\nReview 3 PRs\nPrep for client demo\nGym 2x`} />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            <Wand2 className="mr-2 h-4 w-4" />
            {loading ? "Planning…" : "Generate Plan"}
          </Button>
        </form>

        <OutputCard
          title="Your Schedule"
          isLoading={loading}
          empty="Your prioritized schedule will appear here."
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
