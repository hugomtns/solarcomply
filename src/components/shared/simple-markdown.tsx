"use client";

/**
 * Lightweight markdown renderer for synthetic document content.
 * Handles: headings, bold, tables, unordered lists, paragraphs.
 * No external dependencies.
 */

interface SimpleMarkdownProps {
  content: string;
  className?: string;
}

export function SimpleMarkdown({ content, className }: SimpleMarkdownProps) {
  const blocks = parseBlocks(content);

  return (
    <div className={className}>
      {blocks.map((block, i) => (
        <MarkdownBlock key={i} block={block} />
      ))}
    </div>
  );
}

// ─── Block parsing ─────────────────────────────────────────────

type Block =
  | { type: "h1"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] };

function parseBlocks(md: string): Block[] {
  const lines = md.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Headings
    if (line.startsWith("### ")) {
      blocks.push({ type: "h3", text: line.slice(4).trim() });
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push({ type: "h2", text: line.slice(3).trim() });
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      blocks.push({ type: "h1", text: line.slice(2).trim() });
      i++;
      continue;
    }

    // Table (starts with |)
    if (line.trimStart().startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trimStart().startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      const parsed = parseTable(tableLines);
      if (parsed) blocks.push(parsed);
      continue;
    }

    // Unordered list
    if (/^[-*] /.test(line.trimStart())) {
      const items: string[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i].trimStart())) {
        items.push(lines[i].trimStart().replace(/^[-*] /, ""));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    // Paragraph (collect consecutive non-empty lines)
    {
      const paraLines: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim() !== "" &&
        !lines[i].startsWith("#") &&
        !lines[i].trimStart().startsWith("|") &&
        !/^[-*] /.test(lines[i].trimStart())
      ) {
        paraLines.push(lines[i]);
        i++;
      }
      if (paraLines.length > 0) {
        blocks.push({ type: "paragraph", text: paraLines.join(" ") });
      }
    }
  }

  return blocks;
}

function parseTable(lines: string[]): Block | null {
  if (lines.length < 2) return null;

  const parseCells = (line: string) =>
    line
      .split("|")
      .map((c) => c.trim())
      .filter((c) => c !== "");

  const headers = parseCells(lines[0]);

  // Skip separator line (|---|---|)
  const startRow = lines[1].includes("---") ? 2 : 1;
  const rows = lines.slice(startRow).map(parseCells);

  return { type: "table", headers, rows };
}

// ─── Inline formatting ─────────────────────────────────────────

function InlineText({ text }: { text: string }) {
  // Split on **bold** segments
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

// ─── Block renderer ────────────────────────────────────────────

function MarkdownBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "h1":
      return (
        <h1 className="text-xl font-bold text-white mt-6 mb-3 first:mt-0">
          <InlineText text={block.text} />
        </h1>
      );
    case "h2":
      return (
        <h2 className="text-lg font-semibold text-white mt-5 mb-2 border-b border-white/[0.08] pb-1">
          <InlineText text={block.text} />
        </h2>
      );
    case "h3":
      return (
        <h3 className="text-base font-semibold text-slate-200 mt-4 mb-1.5">
          <InlineText text={block.text} />
        </h3>
      );
    case "paragraph":
      return (
        <p className="text-sm text-slate-300 leading-relaxed mb-3">
          <InlineText text={block.text} />
        </p>
      );
    case "ul":
      return (
        <ul className="list-disc list-inside space-y-1 mb-3 text-sm text-slate-300">
          {block.items.map((item, i) => (
            <li key={i}>
              <InlineText text={item} />
            </li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse border border-white/[0.08] rounded">
            <thead>
              <tr className="bg-white/[0.04]">
                {block.headers.map((h, i) => (
                  <th
                    key={i}
                    className="border border-white/[0.08] px-3 py-1.5 text-left font-medium text-slate-300"
                  >
                    <InlineText text={h} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri} className="even:bg-white/[0.04]/50">
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className="border border-white/[0.08] px-3 py-1.5 text-slate-400"
                    >
                      <InlineText text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}
