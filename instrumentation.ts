/**
 * Next.js instrumentation file
 * This runs once when the server starts
 * https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  // Only run on server side
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Initialize admin user if configured
    const { initializeAdminUser } = await import('@/lib/init-admin');
    await initializeAdminUser();
  }
}
