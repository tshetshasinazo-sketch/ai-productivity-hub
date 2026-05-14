import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider, DEFAULT_MODEL } from "./ai-gateway";

function getModel() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  return createLovableAiGatewayProvider(key)(DEFAULT_MODEL);
}

async function run(system: string, prompt: string) {
  const { text } = await generateText({ model: getModel(), system, prompt });
  return { text };
}

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      tone: z.enum(["formal", "friendly", "persuasive", "concise", "apologetic"]),
      recipient: z.string().max(200).optional(),
      subject: z.string().max(300).optional(),
      context: z.string().min(5).max(4000),
    }).parse,
  )
  .handler(async ({ data }) => {
    const system = `You are an expert workplace communications writer. Write a polished, professional email in a ${data.tone} tone. Output ONLY the email itself in this exact structure:
Subject: <subject line>

<greeting>

<body — clear, well-paragraphed>

<sign-off>
[Your Name]

Do not include explanations or markdown fences. Keep it concise and action-oriented.`;
    const prompt = `Recipient: ${data.recipient || "(unspecified)"}
Suggested subject: ${data.subject || "(infer one)"}
Context / what to convey:
${data.context}`;
    return run(system, prompt);
  });

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator(z.object({ notes: z.string().min(20).max(20000) }).parse)
  .handler(async ({ data }) => {
    const system = `You are an expert meeting analyst. Summarize the provided meeting notes. Respond in clean Markdown using EXACTLY these sections:

## Summary
A 3-5 sentence high-level overview.

## Key Decisions
- bullet points

## Action Items
- [Owner] — Action — (Deadline if mentioned, else "TBD")

## Deadlines
- Date — what's due

## Open Questions
- bullet points

If a section has no items, write "_None identified_" beneath it.`;
    return run(system, data.notes);
  });

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      horizon: z.enum(["day", "week"]),
      tasks: z.string().min(5).max(5000),
      hoursPerDay: z.number().min(1).max(16).default(8),
    }).parse,
  )
  .handler(async ({ data }) => {
    const system = `You are a productivity coach who builds realistic ${data.horizon === "day" ? "daily" : "weekly"} schedules. Apply Eisenhower-style prioritization (Urgent/Important).

Output in Markdown with:

## Prioritized Tasks
A table with columns: Priority (P1-P4) | Task | Why this priority | Est. time

## Schedule
${data.horizon === "day" ? "Time-blocked schedule for one workday" : "Day-by-day plan Monday → Friday"}, assuming about ${data.hoursPerDay}h of focus time per day. Include short breaks. Use a table.

## Tips
2-3 short, specific tips for this workload.

Be realistic — don't overcommit. Group similar work. Front-load deep work.`;
    return run(system, `Tasks / goals to plan:\n${data.tasks}`);
  });

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      topic: z.string().min(3).max(500),
      audience: z.string().max(200).optional(),
    }).parse,
  )
  .handler(async ({ data }) => {
    const system = `You are an AI research assistant. Produce a structured briefing in Markdown:

## Overview
2-3 sentences defining the topic.

## Key Concepts
- 5-7 bullets

## Current State & Trends
Short paragraph + bullets.

## Insights
- 3-5 non-obvious insights

## Recommendations
- 3-5 actionable recommendations${data.audience ? ` for: ${data.audience}` : ""}

## Suggested Next Steps
- 3 follow-up questions to research

Be accurate. If something is uncertain or evolving, say so. Do NOT fabricate citations.`;
    return run(system, `Topic: ${data.topic}${data.audience ? `\nAudience: ${data.audience}` : ""}`);
  });

export const chatReply = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      messages: z
        .array(
          z.object({
            role: z.enum(["user", "assistant"]),
            content: z.string().min(1).max(8000),
          }),
        )
        .min(1)
        .max(50),
    }).parse,
  )
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: getModel(),
      system:
        "You are an AI Workplace Assistant. Be concise, practical, and professional. Use Markdown when helpful (lists, code blocks, tables). When asked to draft something, output it directly. Acknowledge uncertainty rather than guessing.",
      messages: data.messages,
    });
    return { text };
  });
