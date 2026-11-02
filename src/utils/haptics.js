// Tactile Haptic Vibration Feedback for iOS/Android mobile devices

class HapticManager {
  constructor() {
    this.enabled = true;
  }

  // Light click (tap, flip, select)
  light() {
    if (!this.enabled || typeof navigator === 'undefined' || !navigator.vibrate) return;
    try {
      navigator.vibrate(15);
    } catch (_) {}
  }

  // Medium feedback (selection, card snap)
  medium() {
    if (!this.enabled || typeof navigator === 'undefined' || !navigator.vibrate) return;
    try {
      navigator.vibrate(25);
    } catch (_) {}
  }

  // Success pattern (correct answer, match, complete)
  success() {
    if (!this.enabled || typeof navigator === 'undefined' || !navigator.vibrate) return;
    try {
      navigator.vibrate([15, 40, 25]);
    } catch (_) {}
  }

  // Error pattern (wrong answer, mismatch)
  error() {
    if (!this.enabled || typeof navigator === 'undefined' || !navigator.vibrate) return;
    try {
      navigator.vibrate([40, 30, 40]);
    } catch (_) {}
  }

  // Fanfare / Level Up
  celebrate() {
    if (!this.enabled || typeof navigator === 'undefined' || !navigator.vibrate) return;
    try {
      navigator.vibrate([25, 40, 25, 40, 80]);
    } catch (_) {}
  }
}

export const haptics = new HapticManager();
