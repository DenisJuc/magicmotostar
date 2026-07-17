/** Inclusive through end of day, August 2, 2026 (local time). */
export const ANNOUNCEMENT_ENDS_AT = new Date(2026, 7, 2, 23, 59, 59, 999)

export function isAnnouncementActive(now: Date = new Date()): boolean {
  return now.getTime() <= ANNOUNCEMENT_ENDS_AT.getTime()
}
