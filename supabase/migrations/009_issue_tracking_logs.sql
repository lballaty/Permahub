-- ================================================
-- Add log support to issue tracking
-- ================================================
-- Adds fields for error logs and log file attachments

-- Add new columns for log support
ALTER TABLE wiki_issues
ADD COLUMN IF NOT EXISTS error_logs TEXT,
ADD COLUMN IF NOT EXISTS log_file_name TEXT,
ADD COLUMN IF NOT EXISTS log_file_content TEXT;

-- Add comment about the fields
COMMENT ON COLUMN wiki_issues.error_logs IS 'Console error logs or debug output pasted by user';
COMMENT ON COLUMN wiki_issues.log_file_name IS 'Name of uploaded log file';
COMMENT ON COLUMN wiki_issues.log_file_content IS 'Content of uploaded log file (for .log, .txt, .json files)';