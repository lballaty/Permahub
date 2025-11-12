-- ============================================================================
-- Bootstrap: Execute SQL RPC Function
-- File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/database/migrations/00_bootstrap_execute_sql.sql
-- Description: Creates RPC function for executing SQL statements programmatically
-- Author: Libor Ballaty <libor@arionetworks.com>
-- Created: 2025-11-12
-- ============================================================================
-- CRITICAL: Run this FIRST before attempting to run other migrations
-- This function is required for programmatic migration execution
-- ============================================================================

-- Drop existing function if it exists (safe)
DROP FUNCTION IF EXISTS public.execute_sql(query TEXT);

-- Create the execute_sql function
CREATE OR REPLACE FUNCTION public.execute_sql(query TEXT)
RETURNS TABLE(result TEXT) AS $$
DECLARE
    result_text TEXT;
BEGIN
    -- Execute the query
    EXECUTE query;

    -- Return success message
    result_text := 'Query executed successfully';
    RETURN QUERY SELECT result_text;

EXCEPTION WHEN OTHERS THEN
    -- Return error message
    result_text := 'Error: ' || SQLERRM;
    RETURN QUERY SELECT result_text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users and service role
GRANT EXECUTE ON FUNCTION public.execute_sql(TEXT) TO authenticated, service_role;

-- Allow RPC calls
COMMENT ON FUNCTION public.execute_sql(TEXT) IS 'Executes arbitrary SQL statements for migrations and administration';

-- ============================================================================
-- Verification: After creating this function, you should be able to call:
-- SELECT public.execute_sql('SELECT NOW()');
-- ============================================================================
