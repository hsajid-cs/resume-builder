import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, GripVertical } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export type SectionNavProps = {
  sections: { id: string; label: string; visible: boolean }[];
  active: string;
  onSelect: (sectionId: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onToggleVisibility: (sectionId: string, visible: boolean) => void;
};

export const SectionNav = ({ sections, active, onSelect, onReorder, onToggleVisibility }: SectionNavProps) => {
  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData("text/plain", String(index));
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, toIndex: number) => {
      e.preventDefault();
      const fromIndex = Number(e.dataTransfer.getData("text/plain"));
      if (!Number.isNaN(fromIndex) && fromIndex !== toIndex) {
        onReorder(fromIndex, toIndex);
      }
    },
    [onReorder]
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const [showTopFade, setShowTopFade] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(false);
  const updateFades = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    setShowTopFade(scrollTop > 0);
    setShowBottomFade(scrollTop + clientHeight < scrollHeight - 1);
  }, []);
  useEffect(() => {
    updateFades();
  }, [sections, updateFades]);


  return (
    <Card className="sticky top-4 h-fit">
      <CardHeader>
        <CardTitle className="text-base">Sections</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <nav
            ref={scrollRef}
            onScroll={updateFades}
            className="space-y-1 max-h-[60vh] overflow-auto pr-1"
            aria-label="Resume sections"
          >
            {sections.map((s, index) => {
              const isActive = s.id === active;
              return (
                <div
                  key={s.id}
                  role="button"
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <span
                    className="mr-1 shrink-0 text-muted-foreground cursor-grab"
                    title="Drag to reorder"
                    aria-hidden="true"
                  >
                    <GripVertical className="h-4 w-4" />
                  </span>
                  <button
                    className="flex-1 text-left"
                    onClick={() => onSelect(s.id)}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {s.label}
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onToggleVisibility(s.id, !s.visible)}
                    aria-label={`${s.visible ? "Hide" : "Show"} ${s.label} in preview`}
                    title={`${s.visible ? "Hide" : "Show"} ${s.label}`}
                  >
                    {s.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                </div>
              );
            })}
          </nav>

          <div className={`pointer-events-none absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-background to-transparent transition-opacity ${showTopFade ? "opacity-100" : "opacity-0"}`} />
          <div className={`pointer-events-none absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-background to-transparent transition-opacity ${showBottomFade ? "opacity-100" : "opacity-0"}`} />
        </div>
        <Button variant="outline" className="mt-4 w-full">Add New Section</Button>
      </CardContent>
    </Card>
  );
};
