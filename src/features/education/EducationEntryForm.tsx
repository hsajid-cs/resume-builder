import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EducationEntry } from "./types";
// NEW: combobox + select bits
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
// NEW: grading radios
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export type EducationEntryFormProps = {
  initial?: Partial<EducationEntry>;
  onCancel: () => void;
  onSave: (entry: Omit<EducationEntry, "id">) => void;
};

// Datasets (replace/extend with your full lists)
const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Pakistan",
  "Canada",
  "Germany",
  "India",
  "Australia",
  "France",
  "United Arab Emirates",
  "Saudi Arabia",
];

const COUNTRY_CITIES: Record<string, string[]> = {
  "United States": ["New York", "San Francisco", "Seattle", "Austin", "Boston"],
  "United Kingdom": ["London", "Manchester", "Birmingham", "Leeds", "Edinburgh"],
  Pakistan: ["Islamabad", "Lahore", "Karachi", "Peshawar", "Quetta"],
  Canada: ["Toronto", "Vancouver", "Montreal", "Ottawa", "Calgary"],
  Germany: ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne"],
  India: ["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai"],
  Australia: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
  France: ["Paris", "Lyon", "Marseille", "Toulouse", "Nice"],
  "United Arab Emirates": ["Dubai", "Abu Dhabi", "Sharjah", "Ajman"],
  "Saudi Arabia": ["Riyadh", "Jeddah", "Dammam", "Khobar"],
};

const UNIVERSITIES = [
  "Massachusetts Institute of Technology",
  "Stanford University",
  "Harvard University",
  "University of Oxford",
  "University of Cambridge",
  "ETH Zurich",
  "National University of Sciences & Technology (NUST)",
  "University of Toronto",
  "Technical University of Munich",
  "Indian Institute of Technology Bombay",
];

// Helpers
const thisYear = new Date().getFullYear();
const YEARS: number[] = Array.from({ length: thisYear + 5 - 1900 + 1 }, (_, i) => 1900 + i);

// Try to parse existing "period" and "location" into structured values when editing
function parseYears(period?: string): { startYear?: number; endYear?: number } {
  if (!period) return {};
  const matches = period.match(/\b(19\d{2}|20\d{2}|21\d{2})\b/g);
  if (!matches) return {};
  const nums = matches.map(Number).filter((n) => n >= 1900 && n <= thisYear + 5);
  return {
    startYear: nums[0],
    endYear: nums.length > 1 ? nums[nums.length - 1] : undefined,
  };
}
function parseLocation(loc?: string): { city?: string; country?: string } {
  if (!loc) return {};
  const parts = loc.split(",").map((s) => s.trim()).filter(Boolean);
  if (parts.length === 0) return {};
  if (parts.length === 1) return { city: parts[0] };
  return { city: parts[0], country: parts[parts.length - 1] };
}

function SearchableCombobox({
  value,
  onChange,
  placeholder,
  items,
  emptyLabel = "No results found",
  onCreate,
  enableCreate = true,
}: {
  value?: string;
  onChange: (val: string | undefined) => void;
  placeholder: string;
  items: string[];
  emptyLabel?: string;
  onCreate?: (val: string) => void;
  enableCreate?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const allItems = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    items.forEach((it) => {
      const key = it.trim();
      if (!key) return;
      const low = key.toLowerCase();
      if (!seen.has(low)) {
        seen.add(low);
        out.push(key);
      }
    });
    return out;
  }, [items]);

  const canCreate =
    enableCreate && query.trim().length > 0 && !allItems.some((it) => it.toLowerCase() === query.trim().toLowerCase());

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {value && value.length > 0 ? value : <span className="text-muted-foreground">{placeholder}</span>}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-70" />
        </Button>
      </PopoverTrigger>
  <PopoverContent className="p-0 w-[--radix-popover-trigger-width] max-h-[60vh] overflow-auto">
        <Command shouldFilter>
          <CommandInput placeholder="Search..." onValueChange={setQuery} />
          <CommandList>
            <CommandEmpty>
              {canCreate ? (
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    const newVal = query.trim();
        onCreate?.(newVal);
        onChange(newVal);
                    setOpen(false);
                  }}
                >
                  Create "{query.trim()}"
                </Button>
              ) : (
                emptyLabel
              )}
            </CommandEmpty>
            <CommandGroup>
              {allItems.map((it) => (
                <CommandItem
                  key={it}
                  value={it}
                  onSelect={(val) => {
                    onChange(val);
                    setOpen(false);
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === it ? "opacity-100" : "opacity-0")} />
                  {it}
                </CommandItem>
              ))}
              {canCreate && (
                <CommandItem
                  key={`__create__${query}`}
                  value={query}
                  onSelect={() => {
                    const newVal = query.trim();
        onCreate?.(newVal);
        onChange(newVal);
                    setOpen(false);
                  }}
                >
                  + Add "{query.trim()}"
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function YearSelect({
  value,
  onChange,
  placeholder,
  disabled,
}: {
  value?: number;
  onChange: (val: number | undefined) => void;
  placeholder: string;
  disabled?: boolean;
}) {
  const label = value ? String(value) : placeholder;
  return (
    <Select value={value ? String(value) : undefined} onValueChange={(v) => onChange(v ? Number(v) : undefined)}>
      <SelectTrigger disabled={disabled}>
        <SelectValue placeholder={placeholder}>{label}</SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-72">
        {YEARS.map((y) => (
          <SelectItem key={y} value={String(y)}>
            {y}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export const EducationEntryForm = ({ initial, onCancel, onSave }: EducationEntryFormProps) => {
  const [institution, setInstitution] = useState(initial?.institution || "");
  const [title, setTitle] = useState(initial?.title || "");

  // Structured fields replacing old free-text "period" and "location"
  const parsedYears = useMemo(() => parseYears(initial?.period), [initial?.period]);
  const parsedLoc = useMemo(() => parseLocation(initial?.location), [initial?.location]);

  const [startYear, setStartYear] = useState<number | undefined>(parsedYears.startYear);
  const [endYear, setEndYear] = useState<number | undefined>(parsedYears.endYear);
  const [country, setCountry] = useState<string | undefined>(parsedLoc.country);
  const [city, setCity] = useState<string | undefined>(parsedLoc.city);

  // Session-scoped datasets with persistence
  const [universitiesData, setUniversitiesData] = useState<string[]>(() => {
    const key = "rb.edu.universities";
    try {
      const raw = sessionStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch {}
    return UNIVERSITIES;
  });
  const [countriesData, setCountriesData] = useState<string[]>(() => {
    const key = "rb.edu.countries";
    try {
      const raw = sessionStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch {}
    return COUNTRIES;
  });
  const [citiesData, setCitiesData] = useState<Record<string, string[]>>(() => {
    const key = "rb.edu.cities";
    try {
      const raw = sessionStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch {}
    return COUNTRY_CITIES;
  });

  const persistSession = () => {
    try {
      sessionStorage.setItem("rb.edu.universities", JSON.stringify(universitiesData));
      sessionStorage.setItem("rb.edu.countries", JSON.stringify(countriesData));
      sessionStorage.setItem("rb.edu.cities", JSON.stringify(citiesData));
    } catch {}
  };

  // NEW: currently studying
  const [currentlyStudying, setCurrentlyStudying] = useState<boolean>(() => {
    const p = initial?.period || "";
    return /present|current/i.test(p);
  });

  useMemo(() => {
    if (currentlyStudying) {
      // clear end year when toggled on
      setEndYear(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentlyStudying]);

  const [details, setDetails] = useState(initial?.details || "");

  const cities = useMemo(() => {
    if (country && citiesData[country]) return citiesData[country];
    return [];
  }, [country, citiesData]);

  // Compose strings to keep saved shape backward-compatible
  const periodString = useMemo(() => {
    if (!startYear && !endYear && !currentlyStudying) return "";
    if (startYear && currentlyStudying) return `${startYear} – Present`;
    if (!startYear && currentlyStudying) return `– Present`;
    if (startYear && endYear) return `${startYear} – ${endYear}`;
    if (startYear) return `${startYear} –`;
    return `– ${endYear}`;
  }, [startYear, endYear, currentlyStudying]);

  const locationString = useMemo(() => {
    if (city && country) return `${city}, ${country}`;
    if (city) return city;
    if (country) return country;
    return "";
  }, [city, country]);

  // NEW: grading type + values (keeps styling and dynamic visibility)
  type GradingType = "gpa" | "marks" | "percentage";
  const [gradingType, setGradingType] = useState<GradingType>(
    ((initial as any)?.gradingType as GradingType) || "gpa"
  );
  const [gpa, setGpa] = useState<number | "">((initial as any)?.gpa ?? "");
  const [gpaOutOf, setGpaOutOf] = useState<number | "">((initial as any)?.gpaOutOf ?? 4);
  const [marksObtained, setMarksObtained] = useState<number | "">((initial as any)?.marksObtained ?? "");
  const [totalMarks, setTotalMarks] = useState<number | "">((initial as any)?.totalMarks ?? "");
  const [percentage, setPercentage] = useState<number | "">((initial as any)?.percentage ?? "");

  const parseNum = (v: string) => (v === "" ? "" : Number(v));

  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <CardTitle>{initial?.institution ? "Edit Entry" : "Add New Entry"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Institution Name: searchable dropdown */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="institution">Institution</Label>
            <SearchableCombobox
              value={institution}
              onChange={(v) => setInstitution(v || "")}
              placeholder="Select institution"
              items={universitiesData}
              onCreate={(val) => {
                setUniversitiesData((prev) => {
                  const exists = prev.some((p) => p.toLowerCase() === val.toLowerCase());
                  const next = exists ? prev : [val, ...prev];
                  try { sessionStorage.setItem("rb.edu.universities", JSON.stringify(next)); } catch {}
                  return next;
                });
              }}
              emptyLabel="No institutions found"
            />
          </div>

          {/* Degree/Title (unchanged) */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Degree/Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ph.D. in Artificial Intelligence"
            />
          </div>

          {/* Country: searchable dropdown */}
          <div className="flex flex-col gap-2">
            <Label>Country</Label>
            <SearchableCombobox
              value={country}
              onChange={(v) => {
                setCountry(v);
                setCity(undefined); // reset city when country changes
              }}
              placeholder="Select country"
              items={countriesData}
              onCreate={(val) => {
                setCountriesData((prev) => {
                  const exists = prev.some((p) => p.toLowerCase() === val.toLowerCase());
                  const next = exists ? prev : [val, ...prev];
                  try { sessionStorage.setItem("rb.edu.countries", JSON.stringify(next)); } catch {}
                  return next;
                });
                setCitiesData((prev) => {
                  if (prev[val]) return prev;
                  const next = { ...prev, [val]: [] };
                  try { sessionStorage.setItem("rb.edu.cities", JSON.stringify(next)); } catch {}
                  return next;
                });
              }}
              emptyLabel="No countries found"
            />
          </div>

          {/* City: searchable dropdown, filtered by selected country */}
          <div className="flex flex-col gap-2">
            <Label>City</Label>
            <SearchableCombobox
              value={city}
              onChange={(v) => setCity(v)}
              placeholder={country ? "Select city" : "Select country first"}
              items={cities}
              enableCreate={Boolean(country)}
              onCreate={(val) => {
                if (!country) return;
                setCitiesData((prev) => {
                  const list = prev[country!] ?? [];
                  const exists = list.some((p) => p.toLowerCase() === val.toLowerCase());
                  const next = { ...prev, [country!]: exists ? list : [val, ...list] };
                  try { sessionStorage.setItem("rb.edu.cities", JSON.stringify(next)); } catch {}
                  return next;
                });
              }}
              emptyLabel={country ? "No cities found" : "Select a country first"}
            />
          </div>

          {/* Years + Currently studying (responsive inline row) */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-center">
              {/* Start Year */}
              <div className="flex flex-col gap-2">
                <Label>Start Year</Label>
                <YearSelect value={startYear} onChange={setStartYear} placeholder="Select year" />
              </div>

              {/* End Year */}
              <div className="flex flex-col gap-2">
                <Label>End Year</Label>
                <YearSelect
                  value={currentlyStudying ? undefined : endYear}
                  onChange={setEndYear}
                  placeholder={currentlyStudying ? "Present" : "Select year"}
                  disabled={currentlyStudying}
                />
              </div>

              {/* Checkbox inline to the right */}
              <div className="flex items-center gap-2 md:justify-end md:self-center">
                <Checkbox
                  id="currently-studying"
                  checked={currentlyStudying}
                  onCheckedChange={(v) => setCurrentlyStudying(Boolean(v))}
                />
                <Label htmlFor="currently-studying" className="m-0 cursor-pointer">
                  Currently studying here
                </Label>
              </div>
            </div>
          </div>

          {/* Grading Type + dynamic fields */}
          <div className="md:col-span-2">
            <div className="flex flex-col gap-3">
              <Label>Grading</Label>
              <RadioGroup
                value={gradingType}
                onValueChange={(v) => setGradingType(v as GradingType)}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="grading-gpa" value="gpa" />
                  <Label htmlFor="grading-gpa" className="cursor-pointer">
                    GPA
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="grading-marks" value="marks" />
                  <Label htmlFor="grading-marks" className="cursor-pointer">
                    Marks
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="grading-percentage" value="percentage" />
                  <Label htmlFor="grading-percentage" className="cursor-pointer">
                    Percentage
                  </Label>
                </div>
              </RadioGroup>

              {gradingType === "gpa" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="gpa">GPA</Label>
                    <Input
                      id="gpa"
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min="0"
                      value={gpa}
                      onChange={(e) => setGpa(parseNum(e.target.value))}
                      placeholder="3.75"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="gpaOutOf">Out of</Label>
                    <Input
                      id="gpaOutOf"
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min="0"
                      value={gpaOutOf}
                      onChange={(e) => setGpaOutOf(parseNum(e.target.value))}
                      placeholder="4.00"
                    />
                  </div>
                </div>
              )}

              {gradingType === "marks" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="marksObtained">Marks Obtained</Label>
                    <Input
                      id="marksObtained"
                      type="number"
                      inputMode="numeric"
                      step="1"
                      min="0"
                      value={marksObtained}
                      onChange={(e) => setMarksObtained(parseNum(e.target.value))}
                      placeholder="850"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="totalMarks">Total Marks</Label>
                    <Input
                      id="totalMarks"
                      type="number"
                      inputMode="numeric"
                      step="1"
                      min="0"
                      value={totalMarks}
                      onChange={(e) => setTotalMarks(parseNum(e.target.value))}
                      placeholder="1100"
                    />
                  </div>
                </div>
              )}

              {gradingType === "percentage" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2 md:col-span-1">
                    <Label htmlFor="percentage">Percentage</Label>
                    <div className="relative">
                      <Input
                        id="percentage"
                        type="number"
                        inputMode="decimal"
                        step="0.1"
                        min="0"
                        max="100"
                        value={percentage}
                        onChange={(e) => setPercentage(parseNum(e.target.value))}
                        placeholder="85.5"
                        className="pr-10"
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        %
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Details (unchanged) */}
          <div className="md:col-span-2 flex flex-col gap-2">
            <Label htmlFor="details">Details</Label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Thesis, honors, key achievements..."
            />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="hero"
            onClick={() => {
              const payload: any = {
                institution,
                title,
                period: periodString,
                location: locationString,
                details,
                gradingType,
              };
              if (gradingType === "gpa") {
                payload.gpa = gpa === "" ? undefined : Number(gpa);
                payload.gpaOutOf = gpaOutOf === "" ? undefined : Number(gpaOutOf);
              } else if (gradingType === "marks") {
                payload.marksObtained = marksObtained === "" ? undefined : Number(marksObtained);
                payload.totalMarks = totalMarks === "" ? undefined : Number(totalMarks);
              } else if (gradingType === "percentage") {
                payload.percentage = percentage === "" ? undefined : Number(percentage);
              }
              onSave(payload);
            }}
          >
            Save Entry
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
