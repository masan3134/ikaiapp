/**
 * Wizard User Preferences
 * Saves last used job posting ID to localStorage
 * Helps pre-select for faster workflow
 */

const LAST_JOB_POSTING_KEY = "wizard_last_job_posting_id";
const WIZARD_PREFERENCES_KEY = "wizard_preferences";

interface WizardPreferences {
  lastJobPostingId: string | null;
  lastUsedTimestamp: number;
}

/**
 * Save last used job posting ID
 */
export function saveLastJobPosting(jobPostingId: string): void {
  try {
    const preferences: WizardPreferences = {
      lastJobPostingId: jobPostingId,
      lastUsedTimestamp: Date.now(),
    };
    localStorage.setItem(WIZARD_PREFERENCES_KEY, JSON.stringify(preferences));
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Failed to save wizard preferences:", error);
    }
  }
}

/**
 * Get last used job posting ID
 * Returns null if older than 7 days
 */
export function getLastJobPosting(): string | null {
  try {
    const stored = localStorage.getItem(WIZARD_PREFERENCES_KEY);
    if (!stored) return null;

    const preferences: WizardPreferences = JSON.parse(stored);

    // Expire after 7 days
    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - preferences.lastUsedTimestamp > SEVEN_DAYS) {
      clearWizardPreferences();
      return null;
    }

    return preferences.lastJobPostingId;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Failed to load wizard preferences:", error);
    }
    return null;
  }
}

/**
 * Clear all wizard preferences
 */
export function clearWizardPreferences(): void {
  try {
    localStorage.removeItem(WIZARD_PREFERENCES_KEY);
    localStorage.removeItem(LAST_JOB_POSTING_KEY); // Legacy key
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Failed to clear wizard preferences:", error);
    }
  }
}

/**
 * Check if a job posting ID matches the last used one
 */
export function isLastUsedJobPosting(jobPostingId: string): boolean {
  const lastId = getLastJobPosting();
  return lastId === jobPostingId;
}
