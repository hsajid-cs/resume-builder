export type PersonalInfo = {
  firstName: string;
  lastName: string;
  gender: "Male" | "Female" | "Other" | "Prefer not to say" | "";
  dob?: Date;
  contact1: string;
  contact2?: string;
  country: string;
  city: string;
  address: string;
  cnic?: string; // national id
  domicile?: string;
  salary?: string;
  linkedin?: string;
  summary?: string;
};

export const defaultPersonalInfo = (): PersonalInfo => ({
  firstName: "",
  lastName: "",
  gender: "",
  dob: undefined,
  contact1: "",
  contact2: "",
  country: "",
  city: "",
  address: "",
  cnic: "",
  domicile: "",
  salary: "",
  linkedin: "",
  summary: "",
});
