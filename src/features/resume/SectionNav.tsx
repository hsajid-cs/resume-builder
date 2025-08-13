import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, GripVertical, Plus } from "lucide-react";
import { GraduationCap, Briefcase, FolderGit2, Sparkles, Award, BookOpen, Heart } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export type SectionNavProps = {
  sections: { id: string; label: string; visible: boolean }[];
  active: string;
  onSelect: (sectionId: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onToggleVisibility: (sectionId: string, visible: boolean) => void;
  onAddSection: (section: { id: string; label: string }) => void;
};

const LOCKED_IDS = new Set(["Personal Information", "Summary"]);

const ALL_SECTION_OPTIONS: { id: string; label: string }[] = [
  { id: "Education", label: "Education" },
  { id: "Experience", label: "Experience" },
  { id: "Projects", label: "Projects" },
  { id: "Skills", label: "Skills" },
  { id: "Awards & Recognition", label: "Awards & Recognition" },
  { id: "Publications", label: "Publications" },
  { id: "Volunteering", label: "Volunteering" },
];

const SECTION_META: Record<string, { icon: React.ComponentType<{ className?: string }>; desc: string }> = {
  Education: { icon: GraduationCap, desc: "Schools, degrees, dates, and achievements." },
  Experience: { icon: Briefcase, desc: "Work history, roles, responsibilities, and impact." },
  Projects: { icon: FolderGit2, desc: "Personal and professional projects, tech, outcomes." },
  Skills: { icon: Sparkles, desc: "Technical and soft skills you want to highlight." },
  "Awards & Recognition": { icon: Award, desc: "Honors, awards, and notable recognitions." },
  Publications: { icon: BookOpen, desc: "Articles, papers, and other publications." },
  Volunteering: { icon: Heart, desc: "Community service and volunteer work." },
};

export const SectionNav = ({ sections, active, onSelect, onReorder, onToggleVisibility, onAddSection }: SectionNavProps) => {

const SECTION_META: Record<string, { icon: React.ComponentType<{ className?: string }>; desc: string }> = {
  Education: { icon: GraduationCap, desc: "Schools, degrees, dates, and achievements." },
  Experience: { icon: Briefcase, desc: "Work history, roles, responsibilities, and impact." },
  Projects: { icon: FolderGit2, desc: "Personal and professional projects, tech, outcomes." },
  Skills: { icon: Sparkles, desc: "Technical and soft skills you want to highlight." },
  "Awards & Recognition": { icon: Award, desc: "Honors, awards, and notable recognitions." },
  Publications: { icon: BookOpen, desc: "Articles, papers, and other publications." },
  Volunteering: { icon: Heart, desc: "Community service and volunteer work." },
};
  // Sensors: mouse/pointer, touch (long-press), and keyboard
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active: a, over } = event;
      if (!over || a.id === over.id) return;
      // Only movable items participate in DnD, so indices are safe to compute on full list
      const fromIndex = sections.findIndex((s) => s.id === a.id);
      const toIndex = sections.findIndex((s) => s.id === over.id);
      if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
        onReorder(fromIndex, toIndex);
      }
    },
    [sections, onReorder]
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

  // Only include movable items in SortableContext to keep locked positions fixed.
  const movableIds = useMemo(() => sections.filter((s) => !LOCKED_IDS.has(s.id)).map((s) => s.id), [sections]);

  const [openAdd, setOpenAdd] = useState(false);
  const existingIds = useMemo(() => new Set(sections.map((s) => s.id)), [sections]);
  const available = useMemo(
    () => ALL_SECTION_OPTIONS.filter((opt) => !existingIds.has(opt.id)),
    [existingIds]
  );

  return (
    <Card className="sticky top-4 h-fit">
      <CardHeader>
        <CardTitle className="text-base">Sections</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <nav
              ref={scrollRef}
              onScroll={updateFades}
              className="space-y-1 max-h-[60vh] overflow-auto pr-1"
              aria-label="Resume sections"
            >
              <SortableContext items={movableIds} strategy={verticalListSortingStrategy}>
                {sections.map((s) => (
                  <SortableRow
                    key={s.id}
                    section={s}
                    isActive={s.id === active}
                    onSelect={onSelect}
                    onToggleVisibility={onToggleVisibility}
                    draggable={!LOCKED_IDS.has(s.id)}
                    showEye={s.id !== "Personal Information"}
                  />
                ))}
              </SortableContext>
            </nav>
          </DndContext>

          <div className={`pointer-events-none absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-background to-transparent transition-opacity ${showTopFade ? "opacity-100" : "opacity-0"}`} />
          <div className={`pointer-events-none absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-background to-transparent transition-opacity ${showBottomFade ? "opacity-100" : "opacity-0"}`} />
        </div>

        <Button variant="outline" className="mt-4 w-full" onClick={() => setOpenAdd(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Section
        </Button>

        <Dialog open={openAdd} onOpenChange={setOpenAdd}>
          <DialogContent className="w-[96vw] max-w-none p-0 sm:max-w-lg sm:p-6">
            <DialogHeader>
              <DialogTitle>Add a section</DialogTitle>
            </DialogHeader>
            {/* Mobile: vertical list with trailing plus, scrollable */}
            <div className="block sm:hidden max-h-[70vh] overflow-auto p-2">
              {available.length === 0 ? (
                <p className="px-2 py-3 text-sm text-muted-foreground">No more sections to add.</p>
              ) : (
                <ul className="divide-y">
                  {available.map((opt) => (
                    <li key={opt.id} className="flex items-center justify-between py-3 px-2">
                      <span className="text-sm">{opt.label}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Add ${opt.label}`}
                        onClick={() => {
                          onAddSection({ id: opt.id, label: opt.label });
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Desktop: card-style grid of available options */}
            <div className="hidden sm:block">
              <div className="p-4 pt-0">
                {available.length === 0 ? (
                  <p className="text-sm text-muted-foreground">All sections are already added.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {available.map((opt) => {
                      const meta = SECTION_META[opt.id] ?? { icon: Sparkles, desc: "Add this section to your resume." };
                      const Icon = meta.icon;
                      return (
                        <Card key={opt.id} className="overflow-hidden">
                          <CardHeader className="pb-3">
                            <div className="flex items-start gap-3">
                              <div className="mt-1 rounded-md bg-muted p-2"><Icon className="h-5 w-5" /></div>
                              <div>
                                <CardTitle className="text-base">{opt.label}</CardTitle>
                                <CardDescription className="mt-1">{meta.desc}</CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardFooter>
                            <Button
                              className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
                              onClick={() => {
                                onAddSection({ id: opt.id, label: opt.label });
                                setOpenAdd(false);
                              }}
                            >
                              <Plus className="mr-2 h-4 w-4" /> Add Section
                            </Button>
                          </CardFooter>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

function SortableRow({
  section: s,
  isActive,
  onSelect,
  onToggleVisibility,
  draggable = true,
  showEye = true,
}: {
  section: { id: string; label: string; visible: boolean };
  isActive: boolean;
  onSelect: (id: string) => void;
  onToggleVisibility: (id: string, visible: boolean) => void;
  draggable?: boolean;
  showEye?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: s.id, disabled: !draggable });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(s.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(s.id);
        }
      }}
      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors cursor-pointer ${
        isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"
      }`}
    >
      {draggable ? (
        <span
          className="mr-1 shrink-0 text-muted-foreground cursor-grab touch-none"
          title="Drag to reorder"
          aria-label={`Drag handle for ${s.label}`}
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="h-4 w-4" />
        </span>
      ) : (
        <span className="mr-1 shrink-0 text-muted-foreground" aria-hidden>
          <GripVertical className="h-4 w-4 opacity-0" />
        </span>
      )}

      <div className="flex-1 text-left select-none">{s.label}</div>

      {showEye && (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility(s.id, !s.visible);
          }}
          aria-label={`${s.visible ? "Hide" : "Show"} ${s.label} in preview`}
          title={`${s.visible ? "Hide" : "Show"} ${s.label}`}
        >
          {s.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </Button>
      )}
    </div>
  );
}
