/**
 * Connects Discord OAuth to email login
 * add state in the future for security once its up and running
 */

export const CLIENT_ID = import.meta.env.VITE_APP_DISCORD_CLIENT_ID!;
// brings users BACK to my application
export const REDIRECT_URI = import.meta.env.VITE_APP_DISCORD_REDIRECT_URI!;
function buildDiscordAuthUrl() {
  // base auth url
  const baseURL = 'https://discord.com/api/oauth2/authorize';
  const params = new URLSearchParams({
    // needed response type for oauth flow
    response_type: 'code',
    client_id: CLIENT_ID,
    // identity + email
    scope: 'identify email',
    redirect_uri: REDIRECT_URI,
    prompt: 'consent'
  });
  window.location.href = `${baseURL}?${params.toString()}`;
}

export default buildDiscordAuthUrl;