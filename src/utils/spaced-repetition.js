/**
 * SM-2 Spaced Repetition Algorithm
 *
 * Quality scale:
 *   0 – complete blackout, no memory at all
 *   1 – wrong answer, but upon seeing the correct one, felt familiar
 *   2 – wrong answer, but the correct one seemed easy to recall
 *   3 – correct answer with serious difficulty
 *   4 – correct answer after some hesitation
 *   5 – perfect, instant recall
 *
 * Returns a new card object with updated spaced repetition fields:
 *   easeFactor, interval, repetitions, nextReview
 */
export function calculateNextReview(card, quality) {
  // Clamp quality to 0–5
  quality = Math.max(0, Math.min(5, Math.round(quality)));

  let { easeFactor = 2.5, interval = 1, repetitions = 0 } = card;

  if (quality < 3) {
    // Failed recall → reset
    repetitions = 0;
    interval = 1;
  } else {
    // Successful recall
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  // Update ease factor using SM-2 formula
  easeFactor =
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  // Ease factor must not drop below 1.3
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  // Calculate next review date
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return {
    ...card,
    easeFactor: Math.round(easeFactor * 100) / 100, // round to 2 decimals
    interval,
    repetitions,
    nextReview: nextReview.toISOString(),
    lastReview: new Date().toISOString(),
  };
}

/**
 * Get default spaced repetition fields for a new card.
 */
export function getDefaultSRFields() {
  return {
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0,
    nextReview: null,
    lastReview: null,
  };
}

/**
 * Convert a quality label to its numeric value.
 */
export const QUALITY = {
  AGAIN: 0,
  HARD: 2,
  GOOD: 4,
  EASY: 5,
};
