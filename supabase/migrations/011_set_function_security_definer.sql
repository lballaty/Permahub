-- Make subscribe_to_newsletter run as SECURITY DEFINER (as function owner = postgres)
-- This allows the function to bypass RLS policies and insert directly
-- This is safe because the function itself validates and sanitizes inputs

ALTER FUNCTION public.subscribe_to_newsletter(TEXT, TEXT, TEXT, TEXT[])
SECURITY DEFINER;

-- Also set search_path to prevent security issues
ALTER FUNCTION public.subscribe_to_newsletter(TEXT, TEXT, TEXT, TEXT[])
SET search_path = public;

-- Do the same for unsubscribe function
ALTER FUNCTION public.unsubscribe_from_newsletter(TEXT)
SECURITY DEFINER;

ALTER FUNCTION public.unsubscribe_from_newsletter(TEXT)
SET search_path = public;
