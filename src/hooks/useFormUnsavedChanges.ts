import { useEffect } from 'react';

/**
 * Prevents the user from accidentally closing or refreshing the tab
 * if a form is dirty (has unsaved changes).
 */
export function useFormUnsavedChanges(isDirty: boolean) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        // Standard for most modern browsers to trigger the confirmation dialog
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);
}
