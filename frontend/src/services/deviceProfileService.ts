/**
 * Device Profile Service
 * Manages device-level authorization for user profiles.
 * Ensures private profiles (like Anam Ansari) are hidden from global users
 * unless this specific device has signed into that profile or authorized it.
 */

const STORAGE_KEY = 'job_tracker_authorized_device_profiles';

export function isProfileAuthorizedOnDevice(profileIdOrEmail?: string): boolean {
  if (!profileIdOrEmail) return false;
  const lower = profileIdOrEmail.toLowerCase().trim();

  // 1. Praveen Kashyap is the primary global profile — always visible to everyone
  if (lower === 'user_praveen' || lower === '2pkashyap2001@gmail.com') {
    return true;
  }

  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return false;
  }

  // 2. Check if this profile is currently active on this device
  const activeUserId = localStorage.getItem('job_tracker_active_user_id')?.toLowerCase();
  if (activeUserId && (activeUserId === lower || (lower === 'user_anam' && activeUserId === 'user_anam'))) {
    authorizeProfileOnDevice(lower);
    return true;
  }

  // 3. Check if specific device has enabled this profile via URL query parameter (e.g. ?profile=anam or ?user=anam)
  try {
    const params = new URLSearchParams(window.location.search);
    const queryVal = (params.get('profile') || params.get('user') || params.get('device_profile') || params.get('unlock_profile'))?.toLowerCase();
    if (queryVal && (queryVal === 'anam' || queryVal === 'anamansari' || queryVal === 'user_anam' || queryVal === lower)) {
      authorizeProfileOnDevice('user_anam');
      authorizeProfileOnDevice('anamansari.0406@gmail.com');
      return true;
    }
  } catch {}

  // 4. Check device localStorage for previously signed in / authorized profiles
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const list: string[] = JSON.parse(stored);
      if (Array.isArray(list) && list.some(item => item.toLowerCase() === lower)) {
        return true;
      }
    }
  } catch {}

  return false;
}

export function authorizeProfileOnDevice(profileIdOrEmail: string): void {
  if (typeof localStorage === 'undefined' || !profileIdOrEmail) return;
  try {
    const lower = profileIdOrEmail.toLowerCase().trim();
    const stored = localStorage.getItem(STORAGE_KEY);
    const list: string[] = stored ? JSON.parse(stored) : ['user_praveen', '2pkashyap2001@gmail.com'];
    if (!list.some(item => item.toLowerCase() === lower)) {
      list.push(lower);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }
  } catch {}
}

export function removeProfileAuthorizationFromDevice(profileIdOrEmail: string): void {
  if (typeof localStorage === 'undefined' || !profileIdOrEmail) return;
  try {
    const lower = profileIdOrEmail.toLowerCase().trim();
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const list: string[] = JSON.parse(stored);
      const filtered = list.filter(item => item.toLowerCase() !== lower);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }
  } catch {}
}
