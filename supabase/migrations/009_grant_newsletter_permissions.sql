-- Grant EXECUTE permission on newsletter subscription functions to anonymous and authenticated users
-- This allows anyone to subscribe to the newsletter without being logged in

-- Grant EXECUTE on subscribe_to_newsletter function
GRANT EXECUTE ON FUNCTION public.subscribe_to_newsletter(TEXT, TEXT, TEXT, TEXT[]) TO anon;
GRANT EXECUTE ON FUNCTION public.subscribe_to_newsletter(TEXT, TEXT, TEXT, TEXT[]) TO authenticated;

-- Grant EXECUTE on unsubscribe_from_newsletter function
GRANT EXECUTE ON FUNCTION public.unsubscribe_from_newsletter(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.unsubscribe_from_newsletter(TEXT) TO authenticated;
