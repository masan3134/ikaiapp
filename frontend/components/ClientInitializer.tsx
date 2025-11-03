/**
 * Client Initializer
 *
 * MANDATORY FEATURE: Initialize error tracking on client
 * Sets up axios interceptor for automatic error logging
 *
 * Created: 2025-10-27
 */

'use client';

import { useEffect } from 'react';
import { setupAxiosErrorInterceptor } from '@/lib/utils/axiosErrorInterceptor';

export default function ClientInitializer() {
  useEffect(() => {
    // Setup error tracking (runs once on app load)
    setupAxiosErrorInterceptor();

    console.log('[IKAI] Error tracking initialized');
  }, []);

  return null; // This component renders nothing
}
