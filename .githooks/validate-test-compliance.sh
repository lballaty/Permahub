#!/bin/bash

##
# File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/.githooks/validate-test-compliance.sh
#
# Description: Pre-commit hook that validates adherence to testing strategy
# This hook checks for common violations and prevents commits that break testing rules
#
# Author: Libor Ballaty <libor@arionetworks.com>
# Created: 2025-11-22
##

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;36m'
NC='\033[0m' # No Color

# Counters
VIOLATIONS=0
WARNINGS=0

# Get list of staged files
STAGED_FILES=$(git diff --cached --name-only)
STAGED_TESTS=$(git diff --cached --name-only | grep -E '\.spec\.js$' || true)
STAGED_CODE=$(git diff --cached --name-only | grep -vE '\.(spec|test)\.js$|FixRecord\.md$' || true)

echo -e "${BLUE}🧪 Running Test Strategy Compliance Checks...${NC}\n"

# ============================================================================
# CHECK 1: Verify all tests run before committing
# ============================================================================
if [ -n "$STAGED_TESTS" ]; then
  echo -e "${BLUE}[CHECK 1]${NC} Verifying tests are functional..."

  for test_file in $STAGED_TESTS; do
    if [ -f "$test_file" ]; then
      echo -e "  Checking: $test_file"

      # Run just this test to verify it works
      if ! npx playwright test "$test_file" --reporter=list 2>/dev/null; then
        echo -e "  ${RED}❌ Test failed: $test_file${NC}"
        echo -e "     ${YELLOW}Run tests manually before committing:${NC}"
        echo -e "     npx playwright test $test_file"
        ((VIOLATIONS++))
      else
        echo -e "  ${GREEN}✓${NC} Tests pass"
      fi
    fi
  done

  echo ""
fi

# ============================================================================
# CHECK 2: Verify no hardcoded credentials in tests
# ============================================================================
echo -e "${BLUE}[CHECK 2]${NC} Scanning for hardcoded credentials..."

CRED_PATTERNS=(
  "password.*=.*['\"]"
  "secret.*=.*['\"]"
  "api.*key.*=.*['\"]"
  "token.*=.*['\"]"
)

FOUND_CREDS=0
for test_file in $STAGED_TESTS; do
  if [ -f "$test_file" ]; then
    # Check for common credential patterns
    if grep -E "password\s*=\s*['\"][^'\"]*['\"]|secret\s*=\s*['\"][^'\"]*['\"]|apiKey\s*=\s*['\"][^'\"]*['\"]|token\s*=\s*['\"][^'\"]*['\"]" "$test_file" | grep -v "process.env" > /dev/null; then
      echo -e "  ${RED}❌ Possible hardcoded credential in: $test_file${NC}"
      ((VIOLATIONS++))
      ((FOUND_CREDS++))
    fi
  fi
done

if [ $FOUND_CREDS -eq 0 ]; then
  echo -e "  ${GREEN}✓${NC} No hardcoded credentials found"
fi
echo ""

# ============================================================================
# CHECK 3: Verify test isolation (no global state modifications)
# ============================================================================
echo -e "${BLUE}[CHECK 3]${NC} Checking test isolation..."

ISOLATION_ISSUES=0
for test_file in $STAGED_TESTS; do
  if [ -f "$test_file" ]; then
    # Check for window/global state modifications (flaky test indicator)
    if grep -E "window\.[a-zA-Z_]|global\.[a-zA-Z_]|\.lastResult|\.testData" "$test_file" | grep -v "afterEach\|beforeEach" > /dev/null; then
      echo -e "  ${YELLOW}⚠${NC} Possible shared state in: $test_file"
      ((WARNINGS++))
      ((ISOLATION_ISSUES++))
    fi
  fi
done

if [ $ISOLATION_ISSUES -eq 0 ]; then
  echo -e "  ${GREEN}✓${NC} Test isolation looks good"
fi
echo ""

# ============================================================================
# CHECK 4: Verify tests have proper cleanup
# ============================================================================
echo -e "${BLUE}[CHECK 4]${NC} Verifying test cleanup hooks..."

CLEANUP_ISSUES=0
for test_file in $STAGED_TESTS; do
  if [ -f "$test_file" ]; then
    # Check if test file has any database operations but no afterEach cleanup
    if grep -E "create|insert|delete|update" "$test_file" > /dev/null 2>&1; then
      if ! grep -E "afterEach|afterAll" "$test_file" > /dev/null 2>&1; then
        echo -e "  ${YELLOW}⚠${NC} Possible missing cleanup in: $test_file${NC}"
        echo -e "     Add afterEach() hook to clean up test data"
        ((WARNINGS++))
        ((CLEANUP_ISSUES++))
      fi
    fi
  fi
done

if [ $CLEANUP_ISSUES -eq 0 ]; then
  echo -e "  ${GREEN}✓${NC} Cleanup hooks verified"
fi
echo ""

# ============================================================================
# CHECK 5: Verify FixRecord.md is updated when code changes
# ============================================================================
echo -e "${BLUE}[CHECK 5]${NC} Checking FixRecord.md is updated..."

# Only check if code files are being committed (not tests or docs)
if [ -n "$(git diff --cached --name-only | grep -vE '\.spec\.js$|\.test\.js$|FixRecord\.md$|docs/' || true)" ]; then
  if ! git diff --cached --name-only | grep -q "FixRecord.md"; then
    echo -e "  ${YELLOW}⚠${NC} Code changes without FixRecord.md update${NC}"
    echo -e "     Update FixRecord.md to document your changes"
    ((WARNINGS++))
  else
    echo -e "  ${GREEN}✓${NC} FixRecord.md is updated"
  fi
else
  echo -e "  ${GREEN}✓${NC} Only tests/docs changed (FixRecord optional)"
fi
echo ""

# ============================================================================
# CHECK 6: Verify test file headers and documentation
# ============================================================================
echo -e "${BLUE}[CHECK 6]${NC} Checking test documentation..."

DOC_ISSUES=0
for test_file in $STAGED_TESTS; do
  if [ -f "$test_file" ]; then
    # Check for file header comment
    if ! head -20 "$test_file" | grep -E "File:|Description:|Purpose:" > /dev/null; then
      echo -e "  ${YELLOW}⚠${NC} Missing header comment in: $test_file${NC}"
      echo -e "     Add file header with File, Description, Purpose"
      ((WARNINGS++))
      ((DOC_ISSUES++))
    fi
  fi
done

if [ $DOC_ISSUES -eq 0 ]; then
  echo -e "  ${GREEN}✓${NC} Test documentation verified"
fi
echo ""

# ============================================================================
# CHECK 7: Verify proper tag usage
# ============================================================================
echo -e "${BLUE}[CHECK 7]${NC} Verifying test tags..."

TAG_ISSUES=0
for test_file in $STAGED_TESTS; do
  if [ -f "$test_file" ]; then
    # Check if test has appropriate tags
    if ! grep -E "@unit|@integration|@e2e" "$test_file" > /dev/null; then
      echo -e "  ${YELLOW}⚠${NC} Missing tags in: $test_file${NC}"
      echo -e "     Add tags like @unit, @integration, or @e2e"
      ((WARNINGS++))
      ((TAG_ISSUES++))
    fi
  fi
done

if [ $TAG_ISSUES -eq 0 ]; then
  echo -e "  ${GREEN}✓${NC} Test tags verified"
fi
echo ""

# ============================================================================
# SUMMARY
# ============================================================================
echo -e "${BLUE}═══════════════════════════════════════════${NC}"

if [ $VIOLATIONS -gt 0 ]; then
  echo -e "${RED}❌ COMMIT BLOCKED: $VIOLATIONS critical violation(s)${NC}"
  echo ""
  echo -e "Fix the issues above and try again."
  echo ""
  echo -e "Resources:"
  echo -e "  📖 Review: ${BLUE}docs/testing/AGENT_TESTING_RULES.md${NC}"
  echo -e "  🏗️ Architecture: ${BLUE}docs/testing/TESTING_ARCHITECTURE.md${NC}"
  echo -e "  📋 Requirements: ${BLUE}docs/testing/TESTING_REQUIREMENTS.md${NC}"
  echo ""

  read -p "$(echo -e ${YELLOW}Override and commit anyway? (y/N):${NC} )" -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Commit aborted.${NC}"
    exit 1
  else
    echo -e "${YELLOW}⚠️  Committing with violations. Document in FixRecord.md.${NC}"
  fi
elif [ $WARNINGS -gt 0 ]; then
  echo -e "${YELLOW}⚠️  $WARNINGS warning(s) found${NC}"
  echo ""
  echo "These should be addressed but won't block the commit."
  echo ""

  read -p "$(echo -e ${YELLOW}Continue with commit? (Y/n):${NC} )" -n 1 -r
  echo
  if [[ $REPLY =~ ^[Nn]$ ]]; then
    echo -e "${RED}Commit aborted.${NC}"
    exit 1
  fi
else
  echo -e "${GREEN}✅ All checks passed!${NC}"
  echo ""
  echo -e "Ready to commit. Make sure:"
  echo -e "  • Tests pass locally"
  echo -e "  • FixRecord.md documents the change"
  echo -e "  • Commit message is clear"
fi

echo -e "${BLUE}═══════════════════════════════════════════${NC}\n"

exit 0
