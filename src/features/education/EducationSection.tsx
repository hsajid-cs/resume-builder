
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EducationEntry } from "./types";
import { EducationEntryForm } from "./EducationEntryForm";
import { useToast } from "@/hooks/use-toast";

const defaultEntries: EducationEntry[] = [
  {
    id: "ed-1",
    institution: "Stanford University",
    title: "B.S. in Computer Science",
    period: "2016 – 2020",
    location: "Stanford, CA",
    details: "Specialization in Artificial Intelligence. Graduated with honors.",
  },
];

export const EducationSection = () => {
  const [entries, setEntries] = useState<EducationEntry[]>(defaultEntries);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  

  const startAdd = () => {
    setEditingId(null);
    setShowForm(true);
  };

  const startEdit = (id: string) => {
    setEditingId(id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    toast({ title: "Deleted", description: "Education entry removed." });
  };

  const handleSave = (entry: Omit<EducationEntry, "id">) => {
    if (editingId) {
      setEntries((prev) => prev.map((e) => (e.id === editingId ? { ...e, ...entry } : e)));
      toast({ title: "Updated", description: "Education entry updated." });
    } else {
      setEntries((prev) => [{ id: `ed-${Date.now()}`, ...entry }, ...prev]);
      toast({ title: "Added", description: "Education entry added." });
    }
    setShowForm(false);
    setEditingId(null);
  };

  return (
    <Card className="shadow-elegant">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle>Education</CardTitle>
        <Button variant="hero" onClick={startAdd}>Add Entry</Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {showForm && editingId === null && (
          <EducationEntryForm
            key="new"
            initial={undefined}
            onCancel={() => {
              setShowForm(false);
              setEditingId(null);
            }}
            onSave={handleSave}
          />
        )}


        <div className="space-y-3">
          {entries.map((e) =>
            showForm && editingId === e.id ? (
              <EducationEntryForm
                key={e.id}
                initial={e}
                onCancel={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                onSave={handleSave}
              />
            ) : (
              <Card key={e.id} className="border bg-card">
                <CardContent className="flex flex-col gap-2 p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-sm font-semibold">{e.title}, {e.institution}</div>
                    <div className="text-xs text-muted-foreground">{e.period} | {e.location}</div>
                    <div className="text-sm text-muted-foreground">{e.details}</div>
                  </div>
                  <div className="mt-3 flex gap-2 md:mt-0">
                    <Button variant="outline" onClick={() => startEdit(e.id)}>Edit</Button>
                    <Button variant="destructive" onClick={() => handleDelete(e.id)}>Delete</Button>
                  </div>
                </CardContent>
              </Card>
            )
          )}

          {entries.length === 0 && (
            <p className="text-sm text-muted-foreground">No entries yet. Click "Add Entry" to get started.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
