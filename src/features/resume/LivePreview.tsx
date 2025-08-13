import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PersonalInfo } from "./types";

export type LivePreviewProps = {
  info: PersonalInfo;
  sections: { id: string; label: string; visible: boolean }[];
  onChooseTemplate?: () => void;
};


export const LivePreview = React.forwardRef<HTMLDivElement, LivePreviewProps>(
  ({ info, sections, onChooseTemplate }, ref) => {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div ref={ref} id="resume-preview" className="relative mx-auto max-w-[420px] rounded-lg border bg-card p-6 shadow-sm">
              {/* Simple, ATS-friendly resume mockup */}
              <div className="text-center">
                <h2 className="text-2xl font-semibold">
                  {info.firstName || "Your"} {info.lastName || "Name"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {info.city || "City"}{info.country ? `, ${info.country}` : ""}
                </p>
                <p className="text-sm text-muted-foreground">{info.contact1 || "+1 000 000 0000"}</p>
                {info.linkedin && (
                  <p className="text-xs text-muted-foreground">{info.linkedin}</p>
                )}
              </div>

              <hr className="my-4" />

              {sections.filter((s) => s.visible).map((s) => {
                switch (s.id) {
                  case "Summary":
                    return (
                      <section key={s.id} aria-label="Summary" className="space-y-2 animate-fade-in">
                        <h3 className="text-sm font-medium tracking-wide">SUMMARY</h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {info.summary ||
                            "Write a concise 2–3 sentence professional summary highlighting your strengths and goals."}
                        </p>
                      </section>
                    );
                  case "Experience":
                    return (
                      <section key={s.id} aria-label="Experience" className="mt-4 space-y-2 animate-fade-in">
                        <h3 className="text-sm font-medium tracking-wide">EXPERIENCE</h3>
                        <p className="text-sm text-muted-foreground">
                          Showcase your most recent role, 2–3 bullet points with measurable impact.
                        </p>
                      </section>
                    );
                  default:
                    return null;
                }
              })}

            </div>

            <p className="mt-3 text-sm text-muted-foreground">
              This preview updates in real-time as you make changes. Choose a template to explore different layouts.
            </p>
            <Button variant="outline" className="mt-2" onClick={onChooseTemplate}>Choose Resume Template</Button>
          </CardContent>
        </Card>
      </div>
    );
  }
);

LivePreview.displayName = "LivePreview";
