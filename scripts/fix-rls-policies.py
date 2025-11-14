#!/usr/bin/env python3
"""
File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/scripts/fix-rls-policies.py
Description: Add DROP POLICY IF EXISTS before each CREATE POLICY statement
Author: Libor Ballaty <libor@arionetworks.com>
Created: 2025-11-14
"""

import re

input_file = "supabase/migrations/004_row_level_security_policies.sql"
output_file = "supabase/migrations/004_row_level_security_policies_fixed.sql"

with open(input_file, 'r') as f:
    lines = f.readlines()

output_lines = []
i = 0

while i < len(lines):
    line = lines[i]

    # Check if this is a CREATE POLICY line
    if line.strip().startswith('CREATE POLICY'):
        # Extract policy name
        policy_match = re.search(r'CREATE POLICY "([^"]+)"', line)
        if policy_match:
            policy_name = policy_match.group(1)

            # Look ahead for the ON clause (usually on the next line)
            table_name = None
            for j in range(i, min(i + 5, len(lines))):
                table_match = re.search(r'ON (public\.\w+)', lines[j])
                if table_match:
                    table_name = table_match.group(1)
                    break

            if table_name:
                # Add DROP POLICY IF EXISTS statement
                output_lines.append(f'DROP POLICY IF EXISTS "{policy_name}" ON {table_name};\n')

        # Add the original CREATE POLICY line
        output_lines.append(line)
    else:
        # Keep all other lines as-is
        output_lines.append(line)

    i += 1

# Write the fixed file
with open(output_file, 'w') as f:
    f.writelines(output_lines)

print(f"✓ Fixed file written to: {output_file}")
print(f"  Added DROP POLICY IF EXISTS statements before CREATE POLICY")
print(f"  Total lines: {len(output_lines)}")
