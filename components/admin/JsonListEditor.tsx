"use client";

import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

function inputClassName(): string {
  return "w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring";
}

interface JsonListEditorProps {
  label: string;
  value: unknown[];
  onChange: (next: unknown[]) => void;
  /** For object items: which keys to edit, in order. */
  fields?: { key: string; label: string; textarea?: boolean }[];
  placeholder?: string;
}

/**
 * Edits a JSON array field. With `fields` provided, renders one row of inputs
 * per object item; otherwise treats the array as a list of strings edited in
 * a single textarea (one per line).
 */
export default function JsonListEditor({
  label,
  value,
  onChange,
  fields,
  placeholder,
}: JsonListEditorProps) {
  if (fields) {
    const rows = (value ?? []) as Record<string, string>[];
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium">{label}</label>
          <button
            type="button"
            onClick={() => onChange([...rows, Object.fromEntries(fields.map((f) => [f.key, ""]))])}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border border-input hover:bg-muted"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
        {rows.length === 0 && (
          <p className="text-xs text-muted-foreground">None yet — optional.</p>
        )}
        {rows.map((row, index) => (
          <div key={index} className="border border-border rounded-md p-3 space-y-2 bg-background">
            {fields.map((field) =>
              field.textarea ? (
                <textarea
                  key={field.key}
                  value={row[field.key] ?? ""}
                  onChange={(e) =>
                    onChange(rows.map((r, i) => (i === index ? { ...r, [field.key]: e.target.value } : r)))
                  }
                  placeholder={field.label}
                  rows={2}
                  className={inputClassName()}
                />
              ) : (
                <input
                  key={field.key}
                  value={row[field.key] ?? ""}
                  onChange={(e) =>
                    onChange(rows.map((r, i) => (i === index ? { ...r, [field.key]: e.target.value } : r)))
                  }
                  placeholder={field.label}
                  className={inputClassName()}
                />
              ),
            )}
            <button
              type="button"
              onClick={() => onChange(rows.filter((_, i) => i !== index))}
              className="text-xs text-destructive hover:underline inline-flex items-center gap-1"
            >
              <Trash2 className="h-3.5 w-3.5" /> Remove
            </button>
          </div>
        ))}
      </div>
    );
  }

  const lines = ((value ?? []) as string[]).join("\n");
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <textarea
        value={lines}
        onChange={(e) =>
          onChange(
            e.target.value
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean),
          )
        }
        placeholder={placeholder ?? "One item per line"}
        rows={4}
        className={cn(inputClassName(), "font-mono")}
      />
      <p className="text-xs text-muted-foreground mt-1">One item per line.</p>
    </div>
  );
}
