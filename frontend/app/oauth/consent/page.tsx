import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ConsentPage({
  searchParams,
}: {
  searchParams: Promise<{ authorization_id?: string }>;
}) {
  const authorizationId = (await searchParams).authorization_id;

  if (!authorizationId) {
    return <div>Error: Missing authorization_id</div>;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: async () => (await cookies()).getAll(),
        setAll: async (
          cookiesToSet: {
            name: string;
            value: string;
            options: Record<string, unknown>;
          }[]
        ) => {
          const cookieStore = await cookies();
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Redirect to login, preserving authorization_id
    redirect(
      `/login?redirect=/oauth/consent?authorization_id=${authorizationId}`
    );
  }

  // Get authorization details using the authorization_id
  const { data: authDetails, error } =
    await supabase.auth.oauth.getAuthorizationDetails(authorizationId);

  if (error || !authDetails) {
    return (
      <div>Error: {error?.message || "Invalid authorization request"}</div>
    );
  }

  // If user already consented, redirect immediately
  if ("redirect_url" in authDetails) {
    redirect(authDetails.redirect_url);
  }

  return (
    <div>
      <h1>Authorize {authDetails.client.name}</h1>
      <p>This application wants to access your account.</p>

      <div>
        <p>
          <strong>Client:</strong> {authDetails.client.name}
        </p>
        <p>
          <strong>Redirect URI:</strong> {authDetails.redirect_uri}
        </p>
        {authDetails.scope && authDetails.scope.trim() && (
          <div>
            <strong>Requested permissions:</strong>
            <ul>
              {authDetails.scope.split(" ").map((scopeItem: string) => (
                <li key={scopeItem}>{scopeItem}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <form action="/api/oauth/decision" method="POST">
        <input type="hidden" name="authorization_id" value={authorizationId} />
        <button type="submit" name="decision" value="approve">
          Approve
        </button>
        <button type="submit" name="decision" value="deny">
          Deny
        </button>
      </form>
    </div>
  );
}
