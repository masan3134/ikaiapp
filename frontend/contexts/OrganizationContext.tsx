'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  primaryColor?: string;
  plan: 'FREE' | 'PRO' | 'ENTERPRISE';
  isActive: boolean;
}

interface Usage {
  analyses: { used: number; limit: number; remaining: number };
  cvs: { used: number; limit: number; remaining: number };
  users: { used: number; limit: number; remaining: number };
}

interface OrganizationContextType {
  organization: Organization | null;
  usage: Usage | null;
  loading: boolean;
  refreshOrganization: () => Promise<void>;
  refreshUsage: () => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrganization = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch('http://localhost:8102/api/v1/organizations/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setOrganization(data.data);
      }
    } catch (error) {
      // Silently handle error
    }
  };

  const fetchUsage = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch('http://localhost:8102/api/v1/organizations/me/usage', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setUsage(data.data);
      }
    } catch (error) {
      // Silently handle error
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchOrganization(), fetchUsage()]);
      setLoading(false);
    };
    init();
  }, []);

  return (
    <OrganizationContext.Provider
      value={{
        organization,
        usage,
        loading,
        refreshOrganization: fetchOrganization,
        refreshUsage: fetchUsage
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (!context) throw new Error('useOrganization must be used within OrganizationProvider');
  return context;
}
