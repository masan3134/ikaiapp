import { Candidate } from "@/lib/services/candidateService";
import { JobPosting } from "@/services/jobPostings";
import { User } from "@/lib/services/authService";

interface Benefits {
  [key: string]: string;
}

export interface Offer {
  id: string;
  candidateId: string;
  jobPostingId: string;
  createdBy: string;
  position: string;
  department: string;
  salary: number;
  currency: string;
  startDate: string;
  workType: string;
  benefits: Benefits;
  terms: string;
  status:
    | "draft"
    | "pending"
    | "approved"
    | "sent"
    | "accepted"
    | "rejected"
    | "expired";
  approvalStatus?: "pending" | "approved" | "rejected";
  sentAt?: string;
  respondedAt?: string;
  expiresAt: string;
  acceptanceToken: string;
  acceptanceUrl?: string;
  emailSent: boolean;
  emailSentAt?: string;
  viewCount: number;
  lastViewedAt?: string;
  createdAt: string;
  updatedAt: string;
  candidate?: Candidate;
  jobPosting?: JobPosting;
  creator?: User;
  approver?: User;
}
