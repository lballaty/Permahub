#!/bin/bash
#
# File: .githooks/safe-commit.sh
# Description: Safe commit wrapper that prevents --no-verify abuse
# Author: Libor Ballaty <libor@arionetworks.com>
# Created: 2025-11-16
#

# Check if --no-verify flag is present
if [[ "$*" == *"--no-verify"* ]] || [[ "$*" == *"-n"* ]]; then
    echo "❌ Error: --no-verify is not allowed through this wrapper"
    echo "   If you truly need to bypass hooks, you must do it manually"
    echo "   and document the reason in FixRecord.md"
    exit 1
fi

# Execute git commit normally (hooks will run)
git commit "$@"
