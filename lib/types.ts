export type Profile = {
  name: string;
  role: string;
  location: string;
  headline: string;
  intro: string;
  bio: string[];
  photo: string;
  email: string;
  phone: string; // local format, e.g. 08053801610
  socials: { x?: string; linkedin?: string; github?: string; instagram?: string };
  available: boolean;
  stats: { value: string; label: string }[];
  skills: string[];
  certifications: { title: string; issuer: string; year?: string }[];
  education: { degree: string; school: string; year: string };
};

export type Project = {
  id: string;
  title: string;
  category: string;
  summary: string;
  features: string[];
  stack: string[];
  url: string;
  images: string[]; // first image is the cover
};

export type Design = {
  id: string;
  title: string;
  client: string;
  category: string;
  image: string;
};

export type Photo = {
  id: string;
  title: string;
  image: string;
};

export type Service = {
  title: string;
  text: string;
  items: string[];
};

export type SiteContent = {
  profile: Profile;
  projects: Project[];
  designs: Design[];
  photos: Photo[];
  services: Service[];
};

export type EditableSection = "profile" | "projects" | "designs" | "photos" | "services";
export const EDITABLE_SECTIONS: EditableSection[] = ["profile", "projects", "designs", "photos", "services"];

export type Message = {
  _id?: string;
  name: string;
  email: string;
  type?: string;
  message: string;
  createdAt: string;
  read: boolean;
};
