import type { ReactNode } from "react";

// Matches [label](url) links or **bold** text; whichever alternative
// matched is told apart by which capture group came back non-empty.
const INLINE_PATTERN =
  /\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)|\*\*([^*]+)\*\*/g;

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  INLINE_PATTERN.lastIndex = 0;

  while ((match = INLINE_PATTERN.exec(text))) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const [, label, href, bold] = match;
    if (bold !== undefined) {
      parts.push(
        <strong key={`${keyPrefix}-b-${i++}`} className="text-foreground">
          {bold}
        </strong>,
      );
    } else {
      const external = href.startsWith("http");
      parts.push(
        <a
          key={`${keyPrefix}-link-${i++}`}
          href={href}
          className="text-gold hover:underline"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {label}
        </a>,
      );
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}

/**
 * Minimal markdown-like renderer for admin-edited legal pages: "## " starts a
 * section heading, consecutive "- " lines become a bullet list, a single
 * newline inside a block becomes a line break, and [text](url) becomes a
 * link. Anything else is a plain paragraph.
 */
export function LegalContent({ content }: { content: string }) {
  const blocks = content.split(/\n\n+/).filter((block) => block.trim() !== "");

  return (
    <div className="prose prose-invert mt-10 max-w-none space-y-5 text-sm text-muted-foreground">
      {blocks.map((block, i) => {
        const key = `block-${i}`;

        if (block.startsWith("## ")) {
          return (
            <h2 key={key} className="font-display text-xl text-foreground">
              {renderInline(block.slice(3).trim(), key)}
            </h2>
          );
        }

        const lines = block.split("\n").filter((line) => line.trim() !== "");
        const isList =
          lines.length > 0 && lines.every((line) => line.trim().startsWith("- "));

        if (isList) {
          return (
            <ul key={key} className="list-disc space-y-1.5 pl-5">
              {lines.map((line, j) => (
                <li key={j}>{renderInline(line.trim().slice(2), `${key}-${j}`)}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={key}>
            {lines.map((line, j) => (
              <span key={j}>
                {renderInline(line, `${key}-${j}`)}
                {j < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}
