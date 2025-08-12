import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/features/resume/Navbar";
import { EducationEntry } from "@/features/education/types";
import { EducationEntryForm } from "@/features/education/EducationEntryForm";
import { EducationPreview } from "@/features/education/EducationPreview";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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

const Education = () => {
  const [entries, setEntries] = useState<EducationEntry[]>(defaultEntries);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const editingInitial = useMemo(() => entries.find((e) => e.id === editingId), [entries, editingId]);

  useEffect(() => {
    // Basic SEO tags for this page
    const prevTitle = document.title;
    document.title = "Education | ResuCraft Resume Builder";

    const setMeta = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };
    setMeta(
      "description",
      "Build and preview your Education section for your resume. Add degrees, schools, and details."
    );

    // Canonical link
    const canonicalHref = `${window.location.origin}/education`;
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonicalHref);

    return () => {
      document.title = prevTitle;
    };
  }, []);

  const handleExport = async () => {
    try {
      const node = document.getElementById("education-preview");
      if (!node) throw new Error("Education preview not ready");
      const canvas = await html2canvas(node, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 80; // margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const y = 40 + (pageHeight - 80 - imgHeight) / 2; // center
      pdf.addImage(imgData, "PNG", 40, Math.max(40, y), imgWidth, imgHeight);
      pdf.save("education.pdf");
      toast({ title: "Exported", description: "Your Education PDF has been downloaded." });
    } catch (e) {
      console.error(e);
      toast({ title: "Export failed", description: "Please try again.", variant: "destructive" as any });
    }
  };

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
    <div>
      <Navbar onExport={handleExport} />
      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-12" role="main">
        <section className="lg:col-span-7" aria-labelledby="education-form-heading">
          <h1 id="education-form-heading" className="sr-only">
            Education - Resume Builder
          </h1>

          <Card className="shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle>Education</CardTitle>
              <Button variant="hero" onClick={startAdd}>Add Entry</Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {showForm && (
                <EducationEntryForm
                  key={editingId ?? "new"}
                  initial={editingInitial ?? undefined}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  onSave={handleSave}
                />
              )}

              <div className="space-y-3">
                {entries.map((e) => (
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
                ))}
                {entries.length === 0 && (
                  <p className="text-sm text-muted-foreground">No entries yet. Click "Add Entry" to get started.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        <aside className="lg:col-span-5" aria-label="Live Preview">
          <EducationPreview entries={entries} />
        </aside>
      </main>
    </div>
  );
};

export default Education;
