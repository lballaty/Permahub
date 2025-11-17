# Content Admin Configuration System

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/features/content-admin-configuration.md

**Description:** Specification for Content Admin configuration system allowing dynamic management of content creation rules and limits

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-17

**Last Updated:** 2025-11-17

**Status:** Planned - Not yet implemented

---

## Overview

The Content Admin Configuration System allows users with the `content_admin` role to dynamically configure rules, limits, and constraints for wiki content creation without code changes.

**Primary Use Case:** Managing description length limits per content type (guides, events, locations) to optimize card display while maintaining flexibility.

---

## Current State (As of 2025-11-17)

### Implemented
- ✅ CSS truncation for location descriptions (3 classes for different contexts)
- ✅ Front-end display optimization (home, search, map sidebar, map popups)
- ✅ Documentation of best practices in wiki-content-guide.md

### Not Yet Implemented
- ❌ Database schema for configuration storage
- ❌ Admin UI for managing settings
- ❌ Editor integration with real-time limits
- ❌ Backend validation enforcement
- ❌ Audit trail for configuration changes

---

## Database Schema

### Table: `content_type_settings`

```sql
CREATE TABLE content_type_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_type TEXT NOT NULL CHECK (content_type IN ('guide', 'event', 'location')),
  setting_key TEXT NOT NULL,
  setting_value JSONB NOT NULL,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(content_type, setting_key)
);

-- Enable RLS
ALTER TABLE content_type_settings ENABLE ROW LEVEL SECURITY;

-- Read policy: All authenticated users can read settings
CREATE POLICY "Anyone can read content settings"
  ON content_type_settings
  FOR SELECT
  TO authenticated
  USING (true);

-- Write policy: Only content_admin role can modify
CREATE POLICY "Only content admins can modify settings"
  ON content_type_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role_name = 'content_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role_name = 'content_admin'
    )
  );

-- Create index for fast lookups
CREATE INDEX idx_content_settings_type_key
  ON content_type_settings(content_type, setting_key);

-- Create audit trigger
CREATE TRIGGER audit_content_settings_changes
  AFTER INSERT OR UPDATE OR DELETE
  ON content_type_settings
  FOR EACH ROW
  EXECUTE FUNCTION audit_log_changes();
```

### Table: `user_roles` (if not exists)

```sql
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_name TEXT NOT NULL CHECK (role_name IN ('content_admin', 'editor', 'moderator')),
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role_name)
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own roles"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());
```

---

## Settings Structure

### Description Length Settings

```json
{
  "description_length": {
    "min": 150,
    "soft_max": 250,
    "hard_max": 400,
    "unit": "characters",
    "warning_message": "Descriptions over 250 characters may be truncated in card views",
    "help_text": "Optimal length for card display is 150-250 characters. Front-load key information."
  }
}
```

### Default Values by Content Type

#### Guides
```json
{
  "description_length": {
    "min": 100,
    "soft_max": null,
    "hard_max": null,
    "unit": "characters",
    "warning_message": null,
    "help_text": "Guide summaries appear in cards. Keep concise but informative."
  }
}
```
**Rationale:** Guides use full markdown content in body, summary is brief description only.

#### Events
```json
{
  "description_length": {
    "min": 200,
    "soft_max": 400,
    "hard_max": 600,
    "unit": "characters",
    "warning_message": "Consider linking to organizer website for full details beyond 400 characters",
    "help_text": "Event descriptions should be concise. Link to organizer's site for complete information, registration, and updates."
  }
}
```
**Rationale:** Events should link to external site, avoid duplicating extensive information.

#### Locations
```json
{
  "description_length": {
    "min": 150,
    "soft_max": 250,
    "hard_max": 600,
    "unit": "characters",
    "warning_message": "Descriptions over 250 characters may be truncated in card views",
    "help_text": "Optimal: 150-250 chars for card display. Front-load key features. 2-line map popups show ~40-60 chars."
  }
}
```
**Rationale:** Locations shown in multiple card contexts with truncation, optimal length ensures key info visible.

---

## Admin UI Specification

### Page: `/admin/content-settings.html`

#### Layout

```
+----------------------------------------------------------+
| Content Admin - Configuration Settings                   |
+----------------------------------------------------------+
|
| [Content Type Tabs]
| [ Guides ] [ Events ] [ Locations ]
|
| +--------------------- Guides --------------------------+
| |                                                        |
| | Description Length Settings                            |
| |                                                        |
| | Minimum Length:         [100] characters              |
| | Soft Maximum:           [  none  ]  ☐ Enable          |
| | Hard Maximum:           [  none  ]  ☐ Enable          |
| |                                                        |
| | Warning Message (when soft max exceeded):              |
| | [_______________________________________________]      |
| |                                                        |
| | Help Text (shown in editor):                           |
| | [_______________________________________________]      |
| |                                                        |
| | Preview:                                               |
| | +------------------------------------------------+    |
| | | [Card preview showing truncation at limits]    |    |
| | +------------------------------------------------+    |
| |                                                        |
| | [ Reset to Defaults ]  [ Save Changes ]               |
| +-------------------------------------------------------+
|
| +--------------------- Events --------------------------+
| | [Similar layout for Events]                           |
| +-------------------------------------------------------+
|
| +--------------------- Locations -----------------------+
| | [Similar layout for Locations]                        |
| +-------------------------------------------------------+
|
| Recent Changes:
| +-------------------------------------------------------+
| | 2025-11-17 14:32 | john@example.com | Locations      |
| |   Changed soft_max from 300 to 250                    |
| +-------------------------------------------------------+
| | 2025-11-15 09:15 | admin@example.com | Events        |
| |   Changed hard_max from 500 to 600                    |
| +-------------------------------------------------------+
|
+----------------------------------------------------------+
```

#### Features

1. **Tabbed Interface:** Switch between content types (Guides, Events, Locations)
2. **Real-time Preview:** Shows how description will appear in cards at current limits
3. **Validation:**
   - min < soft_max < hard_max (if enabled)
   - Warning if soft_max < optimal display length (250 chars)
4. **Reset to Defaults:** Restore original recommended values
5. **Audit Trail:** View history of who changed what and when
6. **Access Control:** Only visible to users with `content_admin` role

---

## Editor Integration

### Character Counter Component

```html
<div class="character-counter">
  <textarea id="description" name="description" rows="5"></textarea>
  <div class="counter-display">
    <span class="char-count" data-status="good">156</span>
    <span class="separator">/</span>
    <span class="soft-max">250</span>
    <span class="hard-max">(max: 600)</span>
  </div>
  <div class="counter-message" data-status="good">
    ✓ Optimal length for card display
  </div>
</div>
```

### Counter States

| Characters | Status | Color | Message |
|------------|--------|-------|---------|
| 0 - min | `error` | Red | ❌ Description too short (min: 150 chars) |
| min - soft_max | `good` | Green | ✓ Optimal length for card display |
| soft_max - hard_max | `warning` | Yellow | ⚠️ Descriptions over 250 chars may be truncated in card views |
| > hard_max | `error` | Red | ❌ Description too long (max: 600 chars) |

### JavaScript Implementation

```javascript
class DescriptionCounter {
  constructor(textareaId, contentType) {
    this.textarea = document.getElementById(textareaId);
    this.contentType = contentType;
    this.limits = null;

    this.loadLimits();
    this.attachListeners();
  }

  async loadLimits() {
    const { data, error } = await supabase
      .from('content_type_settings')
      .select('setting_value')
      .eq('content_type', this.contentType)
      .eq('setting_key', 'description_length')
      .single();

    if (data) {
      this.limits = data.setting_value;
      this.render();
    }
  }

  attachListeners() {
    this.textarea.addEventListener('input', () => this.updateCounter());
  }

  updateCounter() {
    const length = this.textarea.value.length;
    const status = this.getStatus(length);

    // Update display
    document.querySelector('.char-count').textContent = length;
    document.querySelector('.char-count').dataset.status = status;
    document.querySelector('.counter-message').textContent = this.getMessage(length, status);
    document.querySelector('.counter-message').dataset.status = status;
  }

  getStatus(length) {
    if (length < this.limits.min) return 'error';
    if (this.limits.hard_max && length > this.limits.hard_max) return 'error';
    if (this.limits.soft_max && length > this.limits.soft_max) return 'warning';
    return 'good';
  }

  getMessage(length, status) {
    if (length < this.limits.min) {
      return `❌ Description too short (min: ${this.limits.min} chars)`;
    }
    if (this.limits.hard_max && length > this.limits.hard_max) {
      return `❌ Description too long (max: ${this.limits.hard_max} chars)`;
    }
    if (this.limits.soft_max && length > this.limits.soft_max) {
      return `⚠️ ${this.limits.warning_message}`;
    }
    return '✓ Optimal length for card display';
  }

  validate() {
    const length = this.textarea.value.length;
    return length >= this.limits.min &&
           (!this.limits.hard_max || length <= this.limits.hard_max);
  }
}

// Usage in editor
const locationCounter = new DescriptionCounter('location-description', 'location');
```

### CSS Styling

```css
.character-counter {
  position: relative;
  margin-bottom: 1.5rem;
}

.counter-display {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  font-family: monospace;
}

.char-count {
  font-weight: bold;
  font-size: 1rem;
}

.char-count[data-status="good"] {
  color: #198754;
}

.char-count[data-status="warning"] {
  color: #ffc107;
}

.char-count[data-status="error"] {
  color: #dc3545;
}

.counter-message {
  margin-top: 0.25rem;
  font-size: 0.85rem;
  font-weight: 500;
}

.counter-message[data-status="good"] {
  color: #198754;
}

.counter-message[data-status="warning"] {
  color: #ffc107;
}

.counter-message[data-status="error"] {
  color: #dc3545;
}

.soft-max, .hard-max {
  color: #6c757d;
  font-size: 0.85rem;
}
```

---

## Backend Validation

### API Endpoint: `/api/validate-description`

```javascript
/**
 * Validate description against configured limits
 *
 * @param {string} contentType - 'guide', 'event', or 'location'
 * @param {string} description - Description text to validate
 * @returns {object} Validation result
 */
export async function POST(request) {
  const { contentType, description } = await request.json();

  // Fetch limits from database
  const { data: settings } = await supabase
    .from('content_type_settings')
    .select('setting_value')
    .eq('content_type', contentType)
    .eq('setting_key', 'description_length')
    .single();

  if (!settings) {
    return Response.json({
      valid: false,
      error: 'No limits configured for content type'
    });
  }

  const limits = settings.setting_value;
  const length = description.length;

  // Validate
  const errors = [];
  const warnings = [];

  if (length < limits.min) {
    errors.push(`Description too short (${length}/${limits.min} minimum)`);
  }

  if (limits.hard_max && length > limits.hard_max) {
    errors.push(`Description too long (${length}/${limits.hard_max} maximum)`);
  }

  if (limits.soft_max && length > limits.soft_max && length <= limits.hard_max) {
    warnings.push(limits.warning_message);
  }

  return Response.json({
    valid: errors.length === 0,
    length,
    limits,
    errors,
    warnings
  });
}
```

### Database Trigger for Content Validation

```sql
CREATE OR REPLACE FUNCTION validate_description_length()
RETURNS TRIGGER AS $$
DECLARE
  limits JSONB;
  desc_length INT;
BEGIN
  -- Get limits for this content type
  SELECT setting_value INTO limits
  FROM content_type_settings
  WHERE content_type = TG_TABLE_NAME
    AND setting_key = 'description_length';

  IF limits IS NULL THEN
    RETURN NEW; -- No limits configured, allow
  END IF;

  -- Check description length
  desc_length := LENGTH(NEW.description);

  -- Validate minimum
  IF desc_length < (limits->>'min')::INT THEN
    RAISE EXCEPTION 'Description too short: % characters (minimum: %)',
      desc_length, limits->>'min';
  END IF;

  -- Validate hard maximum
  IF (limits->>'hard_max') IS NOT NULL
     AND desc_length > (limits->>'hard_max')::INT THEN
    RAISE EXCEPTION 'Description too long: % characters (maximum: %)',
      desc_length, limits->>'hard_max';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to content tables
CREATE TRIGGER enforce_location_description_limits
  BEFORE INSERT OR UPDATE ON wiki_locations
  FOR EACH ROW
  EXECUTE FUNCTION validate_description_length();

CREATE TRIGGER enforce_event_description_limits
  BEFORE INSERT OR UPDATE ON wiki_events
  FOR EACH ROW
  EXECUTE FUNCTION validate_description_length();
```

---

## Migration Plan

### Phase 1: Database Setup (Week 1)

1. Create `content_type_settings` table
2. Create `user_roles` table (if not exists)
3. Apply RLS policies
4. Create validation trigger functions
5. Seed default values:
   ```sql
   INSERT INTO content_type_settings (content_type, setting_key, setting_value)
   VALUES
     ('guide', 'description_length', '{"min": 100, "soft_max": null, "hard_max": null, "unit": "characters", "warning_message": null, "help_text": "Guide summaries appear in cards. Keep concise but informative."}'),
     ('event', 'description_length', '{"min": 200, "soft_max": 400, "hard_max": 600, "unit": "characters", "warning_message": "Consider linking to organizer website for full details beyond 400 characters", "help_text": "Event descriptions should be concise. Link to organizer''s site for complete information."}'),
     ('location', 'description_length', '{"min": 150, "soft_max": 250, "hard_max": 600, "unit": "characters", "warning_message": "Descriptions over 250 characters may be truncated in card views", "help_text": "Optimal: 150-250 chars for card display. Front-load key features."}');
   ```

### Phase 2: Editor Integration (Week 2)

1. Create `DescriptionCounter` JavaScript class
2. Add CSS styling for character counter
3. Integrate into wiki editor (guides, events, locations)
4. Add real-time validation feedback
5. Test across all content types

### Phase 3: Admin UI (Week 2-3)

1. Create `/admin/content-settings.html` page
2. Implement tabbed interface for content types
3. Add form inputs for limit configuration
4. Build real-time preview component
5. Add audit trail view
6. Implement access control (content_admin role only)
7. Test save/update/reset functionality

### Phase 4: Backend Validation (Week 3)

1. Create validation API endpoint
2. Add database triggers for enforcement
3. Test server-side validation
4. Handle edge cases (NULL values, missing settings)

### Phase 5: Testing & Rollout (Week 4)

1. Unit tests for all components
2. Integration tests for editor + backend
3. User acceptance testing with content admins
4. Documentation updates
5. Production rollout

---

## Future Enhancements

### Additional Settings (Potential)

1. **Tag Requirements:**
   ```json
   {
     "tags": {
       "min": 5,
       "max": 15,
       "required_categories": ["climate", "technique"],
       "restricted": ["test", "demo", "placeholder"]
     }
   }
   ```

2. **Image Requirements:**
   ```json
   {
     "images": {
       "min": 0,
       "max": 10,
       "required": false,
       "max_file_size_mb": 5,
       "allowed_formats": ["jpg", "png", "webp"]
     }
   }
   ```

3. **Title Requirements:**
   ```json
   {
     "title": {
       "min": 30,
       "max": 100,
       "forbidden_words": ["click here", "amazing", "you won't believe"],
       "required_keywords": []
     }
   }
   ```

4. **Source Citation Requirements:**
   ```json
   {
     "sources": {
       "min": 5,
       "preferred_types": ["academic", "government", "organization"],
       "require_urls": true
     }
   }
   ```

### Mobile-Specific Settings

```json
{
  "mobile_display": {
    "truncate_at": 120,
    "show_preview": true,
    "enable_expansion": true
  }
}
```

---

## Security Considerations

1. **Role-Based Access Control:**
   - Only `content_admin` role can modify settings
   - Regular users can read but not modify
   - All changes audited with user ID and timestamp

2. **Validation:**
   - Client-side validation for UX (can be bypassed)
   - Server-side validation enforced via database triggers (cannot be bypassed)
   - API endpoint validation for programmatic access

3. **Audit Trail:**
   - All changes logged with old/new values
   - User attribution for accountability
   - Rollback capability if needed

4. **Input Sanitization:**
   - Warning messages and help text sanitized to prevent XSS
   - JSONB validation to prevent malformed data
   - Numeric limits validated (positive integers only)

---

## Open Questions

1. **Should soft_max be configurable per display context?**
   - E.g., different soft limits for home cards vs search results
   - Current approach: single soft_max for all contexts

2. **Should we allow temporary overrides for specific content?**
   - E.g., "This event needs longer description due to COVID protocols"
   - Requires additional override mechanism

3. **Should limits apply to existing content retroactively?**
   - What happens to existing content exceeding new limits?
   - Options: grandfather existing, flag for review, force update

4. **Should we support per-user or per-organization settings?**
   - Different organizations may have different standards
   - Adds significant complexity

---

## Related Documentation

- [Content Creation System Requirements](../content-building/processes/CONTENT_CREATION_SYSTEM_REQUIREMENTS.md) - See FR-4.2
- [Wiki Content Guide](../content-building/guides/wiki-content-guide.md) - Description writing best practices
- [SQL Seed File Requirements](../content-building/sql-requirements/SQL_SEED_FILE_REQUIREMENTS_ADDENDUM.md) - Field specifications

---

**Status:** Specification complete, implementation pending

**Next Steps:**
1. Review and approve specification
2. Create implementation tickets for Phase 1-5
3. Assign development resources
4. Begin Phase 1: Database Setup
