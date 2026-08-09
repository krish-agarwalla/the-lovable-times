// lib/rate-limit.ts
import { createClient } from '@/lib/supabase/server';

/**
 * Checks how many inquiries have come from this IP in the last hour.
 * Returns true if the request should be BLOCKED.
 */
export async function isRateLimited(ip: string, maxPerHour = 5): Promise<boolean> {
  const supabase = await createClient();
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const { count, error } = await supabase
    .from('inquiries')
    .select('*', { count: 'exact', head: true })
    .eq('submitter_ip', ip)
    .gte('created_at', oneHourAgo);

  if (error) {
    // Fail open (don't block legitimate users) but log for review
    console.error('Rate limit check failed:', error.message);
    return false;
  }

  return (count ?? 0) >= maxPerHour;
}