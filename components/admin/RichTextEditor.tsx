"use client";

import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Heading2,
  Heading3,
  Undo2,
  Redo2,
  Link2,
  Code2,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  initialContent: string;
  onChange: (html: string) => void;
}

function ToolButton({
  onClick,
  active,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "p-1.5 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
        active ? "bg-primary/90 text-white" : "text-foreground hover:bg-muted",
      )}
    >
      {children}
    </button>
  );
}

function clampUrl(raw: string): string {
  const value = raw.trim();
  return value.startsWith("http://") || value.startsWith("https://")
    ? value
    : `https://${value}`;
}

export default function RichTextEditor({ initialContent, onChange }: RichTextEditorProps) {
  const [activeState, setActiveState] = useState<Record<string, boolean>>({});
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        LinkExtension.configure({ openOnClick: false }),
      ],
      content: initialContent,
      editorProps: {
        attributes: {
          class:
            "prose min-h-[320px] px-4 py-3 text-sm focus:outline-none " +
            "[&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-4 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-3 " +
            "[&_p]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 " +
            "[&_blockquote]:border-l-4 [&_blockquote]:border-muted-foreground/30 [&_blockquote]:pl-4 [&_blockquote]:italic " +
            "[&_a]:text-primary [&_a]:underline [&_code]:bg-muted [&_code]:px-1 [&_code]:rounded [&_code]:text-sm " +
            "[&_pre]:bg-muted [&_pre]:p-3 [&_pre]:rounded-md [&_pre]:overflow-x-auto [&_img]:max-w-full [&_hr]:my-4",
        },
      },
      onUpdate: ({ editor }) => {
        onChangeRef.current(editor.getHTML());
      },
      onSelectionUpdate: ({ editor }) => {
        setActiveState({
          bold: editor.isActive("bold"),
          italic: editor.isActive("italic"),
          strike: editor.isActive("strike"),
          code: editor.isActive("code"),
          h2: editor.isActive("heading", { level: 2 }),
          h3: editor.isActive("heading", { level: 3 }),
          bullet: editor.isActive("bulletList"),
          ordered: editor.isActive("orderedList"),
          blockquote: editor.isActive("blockquote"),
          link: editor.isActive("link"),
        });
      },
    },
    [initialContent],
  );

  if (!editor) {
    return (
      <div className="border border-input rounded-md bg-background min-h-[368px] animate-pulse" />
    );
  }

  const runLink = () => {
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    const url = window.prompt("Link URL (https://...)");
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: clampUrl(url) })
        .run();
    }
  };

  return (
    <div className="border border-input rounded-md overflow-hidden bg-background">
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-border bg-muted/40">
        <ToolButton label="Bold" active={activeState.bold} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="Italic" active={activeState.italic} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="Strikethrough" active={activeState.strike} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="Inline code" active={activeState.code} onClick={() => editor.chain().focus().toggleCode().run()}>
          <Code2 className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="Link" active={activeState.link} onClick={runLink}>
          <Link2 className="h-4 w-4" />
        </ToolButton>
        <span className="w-px h-5 bg-border mx-1" />
        <ToolButton label="Heading 2" active={activeState.h2} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="Heading 3" active={activeState.h3} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 className="h-4 w-4" />
        </ToolButton>
        <span className="w-px h-5 bg-border mx-1" />
        <ToolButton label="Bullet list" active={activeState.bullet} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="Ordered list" active={activeState.ordered} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="Blockquote" active={activeState.blockquote} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus className="h-4 w-4" />
        </ToolButton>
        <span className="w-px h-5 bg-border mx-1" />
        <ToolButton label="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
          <Undo2 className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
          <Redo2 className="h-4 w-4" />
        </ToolButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}