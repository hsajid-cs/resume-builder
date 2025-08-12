import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EducationEntry } from "./types";

export type EducationEntryFormProps = {
  initial?: Partial<EducationEntry>;
  onCancel: () => void;
  onSave: (entry: Omit<EducationEntry, "id">) => void;
};

export const EducationEntryForm = ({ initial, onCancel, onSave }: EducationEntryFormProps) => {
  const [institution, setInstitution] = useState(initial?.institution || "");
  const [title, setTitle] = useState(initial?.title || "");
  const [period, setPeriod] = useState(initial?.period || "");
  const [location, setLocation] = useState(initial?.location || "");
  const [details, setDetails] = useState(initial?.details || "");

  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <CardTitle>{initial?.institution ? "Edit Entry" : "Add New Entry"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="institution">Institution</Label>
            <Input id="institution" value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="Stanford University" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Degree/Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ph.D. in Artificial Intelligence" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="period">Period</Label>
            <Input id="period" value={period} onChange={(e) => setPeriod(e.target.value)} placeholder="September 2019 – May 2023" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Stanford, CA" />
          </div>
          <div className="md:col-span-2 flex flex-col gap-2">
            <Label htmlFor="details">Details</Label>
            <Textarea id="details" value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Thesis, honors, key achievements..." />
          </div>
        </div>
        <div className="mt-6 flex items-center gap-3">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button variant="hero" onClick={() => onSave({ institution, title, period, location, details })}>Save Entry</Button>
        </div>
      </CardContent>
    </Card>
  );
};
