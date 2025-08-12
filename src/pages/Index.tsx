
import { useRef, useState } from "react";
import { Navbar } from "@/features/resume/Navbar";
import { SectionNav } from "@/features/resume/SectionNav";
import { PersonalInfoForm } from "@/features/resume/PersonalInfoForm";
import { EducationSection } from "@/features/education/EducationSection";
import { LivePreview } from "@/features/resume/LivePreview";
import { defaultPersonalInfo, PersonalInfo } from "@/features/resume/types";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Index = () => {
  const [activeSection, setActiveSection] = useState<string>("Personal Information");
  const [info, setInfo] = useState<PersonalInfo>(defaultPersonalInfo());
  const previewRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();
  const [sections, setSections] = useState<{ id: string; label: string; visible: boolean }[]>([
    { id: "Personal Information", label: "Personal Information", visible: true },
    { id: "Summary", label: "Summary", visible: true },
    { id: "Work Experience", label: "Work Experience", visible: true },
    { id: "Education", label: "Education", visible: true },
    { id: "Skills", label: "Skills", visible: true },
    { id: "Projects", label: "Projects", visible: true },
    { id: "Awards & Recognition", label: "Awards & Recognition", visible: true },
    { id: "Publications", label: "Publications", visible: true },
    { id: "Volunteering", label: "Volunteering", visible: true },
  ]);

  const handleReorderSections = (from: number, to: number) => {
    setSections((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  const handleToggleSectionVisibility = (id: string, visible: boolean) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, visible } : s)));
  };


  const handleExport = async () => {
    try {
      const node = previewRef.current;
      if (!node) throw new Error("Preview not ready");
      const canvas = await html2canvas(node, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 80; // margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const y = 40 + (pageHeight - 80 - imgHeight) / 2; // center
      pdf.addImage(imgData, "PNG", 40, Math.max(40, y), imgWidth, imgHeight);
      pdf.save("resume.pdf");
      toast({ title: "Exported", description: "Your resume PDF has been downloaded." });
    } catch (e) {
      console.error(e);
      toast({ title: "Export failed", description: "Please try again.", variant: "destructive" as any });
    }
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "Personal Information":
        return (
          <PersonalInfoForm
            value={info}
            onChange={(u) => setInfo((prev) => ({ ...prev, ...u }))}
            onReset={() => setInfo(defaultPersonalInfo())}
            onSave={() => toast({ title: "Saved", description: "Your changes have been saved." })}
          />
        );
      case "Education":
        return <EducationSection />;
      default:
        return (
          <div className="text-center text-muted-foreground py-8">
            <p>This section is coming soon!</p>
          </div>
        );
    }
  };

  return (
    <div>
      <Navbar onExport={handleExport} />
      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-12" role="main">
        <aside className="hidden lg:col-span-3 lg:block" aria-label="Sections">
          <SectionNav
            sections={sections}
            active={activeSection}
            onSelect={setActiveSection}
            onReorder={handleReorderSections}
            onToggleVisibility={handleToggleSectionVisibility}
          />
        </aside>
        <section className="lg:col-span-6" aria-labelledby="form-heading">
          <h1 id="form-heading" className="sr-only">Resume Builder - {activeSection}</h1>
          {renderActiveSection()}
        </section>
        <aside className="lg:col-span-3" aria-label="Live Preview">
          <LivePreview info={info} sections={sections} onChooseTemplate={() => toast({ title: "Templates", description: "Template gallery coming soon." })} ref={previewRef} />
        </aside>
      </main>
    </div>
  );
};

export default Index;
