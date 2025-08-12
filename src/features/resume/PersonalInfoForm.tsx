import { useMemo } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PersonalInfo } from "./types";

export type PersonalInfoFormProps = {
  value: PersonalInfo;
  onChange: (update: Partial<PersonalInfo>) => void;
  onReset: () => void;
  onSave: () => void;
};

export const PersonalInfoForm = ({ value, onChange, onReset, onSave }: PersonalInfoFormProps) => {
  const genders = useMemo(() => ["Male", "Female", "Other", "Prefer not to say"], []);

  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" value={value.firstName} onChange={(e) => onChange({ firstName: e.target.value })} placeholder="Liam" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" value={value.lastName} onChange={(e) => onChange({ lastName: e.target.value })} placeholder="Jones" />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Gender</Label>
            <Select value={value.gender} onValueChange={(v) => onChange({ gender: v as PersonalInfo["gender"] })}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {genders.map((g) => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Date of Birth</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-between">
                  {value.dob ? format(value.dob, "dd/MM/yyyy") : <span className="text-muted-foreground">DD/MM/YYYY</span>}
                  <CalendarIcon className="ml-2 h-4 w-4 opacity-70" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={value.dob}
                  onSelect={(d) => onChange({ dob: d })}
                  captionLayout="dropdown-buttons"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="contact1">Contact 1</Label>
            <Input id="contact1" value={value.contact1} onChange={(e) => onChange({ contact1: e.target.value })} placeholder="+14152096798" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="contact2">Contact 2</Label>
            <Input id="contact2" value={value.contact2} onChange={(e) => onChange({ contact2: e.target.value })} placeholder="+14152096798" />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Country</Label>
            <Select value={value.country} onValueChange={(v) => onChange({ country: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pakistan">Pakistan</SelectItem>
                <SelectItem value="United States">United States</SelectItem>
                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                <SelectItem value="Canada">Canada</SelectItem>
                <SelectItem value="Germany">Germany</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" value={value.city} onChange={(e) => onChange({ city: e.target.value })} placeholder="Islamabad" />
          </div>

          <div className="md:col-span-2 flex flex-col gap-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" value={value.address} onChange={(e) => onChange({ address: e.target.value })} placeholder="300 Post St, San Francisco, CA" />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="cnic">National ID</Label>
            <Input id="cnic" value={value.cnic} onChange={(e) => onChange({ cnic: e.target.value })} placeholder="12345-1234567-1" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="domicile">Domicile</Label>
            <Input id="domicile" value={value.domicile} onChange={(e) => onChange({ domicile: e.target.value })} placeholder="Islamabad" />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Current Salary</Label>
            <Select value={value.salary} onValueChange={(v) => onChange({ salary: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10000">10000</SelectItem>
                <SelectItem value="20000">20000</SelectItem>
                <SelectItem value="30000">30000</SelectItem>
                <SelectItem value=">30000">More</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2 flex flex-col gap-2">
            <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
            <Input id="linkedin" value={value.linkedin} onChange={(e) => onChange({ linkedin: e.target.value })} placeholder="linkedin.com/in/yourname" />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Button variant="outline" onClick={onReset}>Reset Changes</Button>
          <Button variant="hero" onClick={onSave}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};
