import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EducationEntry } from "./types";

export const EducationPreview = ({ entries }: { entries: EducationEntry[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview: Education</CardTitle>
      </CardHeader>
      <CardContent>
        <article id="education-preview" className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold">Education</h2>
          <p className="mt-1 text-sm text-muted-foreground">A summary of your academic achievements.</p>
          <div className="mt-4 space-y-4">
            {entries.map((e) => (
              <section key={e.id} className="space-y-1">
                <h3 className="text-sm font-semibold">{e.title}, {e.institution}</h3>
                <p className="text-xs text-muted-foreground">{e.period} | {e.location}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{e.details}</p>
              </section>
            ))}
          </div>
        </article>
      </CardContent>
    </Card>
  );
};
