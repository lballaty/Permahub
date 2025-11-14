#!/bin/bash
#
# File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/scripts/fix-rls-policies.sh
# Description: Add DROP POLICY IF EXISTS before each CREATE POLICY statement
# Author: Libor Ballaty <libor@arionetworks.com>
# Created: 2025-11-14
#

set -e

INPUT_FILE="supabase/migrations/004_row_level_security_policies.sql"
OUTPUT_FILE="supabase/migrations/004_row_level_security_policies_fixed.sql"
TEMP_FILE=$(mktemp)

echo "Fixing RLS policies in $INPUT_FILE..."

# Read the file line by line
while IFS= read -r line; do
  # Check if this line is a CREATE POLICY statement
  if echo "$line" | grep -q "^CREATE POLICY"; then
    # Extract the policy name and table name
    policy_name=$(echo "$line" | sed -n 's/CREATE POLICY "\([^"]*\)".*/\1/p')

    # Read the next line to get the table name
    read -r next_line
    table_name=$(echo "$next_line" | sed -n 's/.*ON \([^ ]*\).*/\1/p')

    # Write the DROP statement
    echo "DROP POLICY IF EXISTS \"$policy_name\" ON $table_name;" >> "$TEMP_FILE"

    # Write the original CREATE POLICY line
    echo "$line" >> "$TEMP_FILE"

    # Write the ON table line
    echo "$next_line" >> "$TEMP_FILE"
  else
    echo "$line" >> "$TEMP_FILE"
  fi
done < "$INPUT_FILE"

# Move the temp file to the output
mv "$TEMP_FILE" "$OUTPUT_FILE"

echo "✓ Fixed file written to: $OUTPUT_FILE"
echo ""
echo "To apply the fix:"
echo "  mv $OUTPUT_FILE $INPUT_FILE"
