export type LeadStatus = 'PENDING' | 'REACHED_OUT';

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  linkedin: string;
  citizenship: string;
  visasOfInterest: string[];
  resume: File;  
  additionalInfo?: string;
  status: LeadStatus;
  createdAt: string;
  updatedAt?: string;
}

export type LeadFormData = Omit<Lead, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'resumeUrl'> & {
  resume: File;
};