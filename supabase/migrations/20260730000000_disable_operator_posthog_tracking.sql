-- Self-host: disable operator signup/onboard tracking to Helicone PostHog.
-- Keeps LLM observability tables untouched.

UPDATE public.system_config
SET value = 'false'
WHERE key = 'enable_tracking';

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'track_user_signup_to_posthog'
  ) THEN
    CREATE OR REPLACE FUNCTION public.track_user_signup_to_posthog()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public
    AS $fn$
    BEGIN
      RETURN NEW;
    END;
    $fn$;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'track_organization_onboarding'
  ) THEN
    CREATE OR REPLACE FUNCTION public.track_organization_onboarding()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $fn$
    BEGIN
      RETURN NEW;
    END;
    $fn$;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'track_organization_events'
  ) THEN
    CREATE OR REPLACE FUNCTION public.track_organization_events()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $fn$
    BEGIN
      RETURN NEW;
    END;
    $fn$;
  END IF;
END $$;
