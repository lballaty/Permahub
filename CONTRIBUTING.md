# Contributing to Permahub

Thank you for your interest in contributing to Permahub! We welcome contributions from everyone who wants to help build a thriving global permaculture community platform.

## Code of Conduct

Be respectful, inclusive, and constructive. We're building a platform for a community that values sustainability, collaboration, and mutual support.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior vs actual behavior
- Screenshots if applicable
- Your environment (browser, OS, etc.)

### Suggesting Features

We love new ideas! Open an issue with:
- A clear description of the feature
- Why it would be valuable to the community
- How it might work (mockups/examples welcome)

### Pull Requests

1. **Fork the repository** and create your branch from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the existing code style
   - Write clear, descriptive commit messages
   - Add comments for complex logic
   - Update documentation as needed

3. **Test your changes**
   - Ensure all existing features still work
   - Test on multiple browsers if possible
   - Check mobile responsiveness

4. **Run code quality checks**
   ```bash
   npm run lint        # Check for linting errors
   npm run format      # Format code with Prettier
   ```

5. **Commit your changes**
   ```bash
   git commit -m "Add: brief description of your changes"
   ```

   Use conventional commit prefixes:
   - `Add:` for new features
   - `Fix:` for bug fixes
   - `Update:` for improvements to existing features
   - `Refactor:` for code refactoring
   - `Docs:` for documentation changes
   - `Style:` for formatting changes
   - `Test:` for adding tests

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Open a Pull Request**
   - Provide a clear description of changes
   - Reference any related issues
   - Include screenshots for UI changes

## Development Setup

See the [README.md](README.md) for detailed setup instructions.

Quick start:
```bash
npm install
cp config/.env.example .env
# Edit .env with your Supabase credentials
npm run dev
```

## Code Style

We use ESLint and Prettier to maintain code quality:

- **Indentation:** 2 spaces
- **Quotes:** Single quotes for JS
- **Semicolons:** Required
- **Line length:** Max 100 characters
- **Naming:**
  - camelCase for variables and functions
  - PascalCase for classes
  - UPPER_SNAKE_CASE for constants

## Project Structure

```
src/
├── pages/      # HTML pages - one per route
├── js/         # JavaScript modules
├── css/        # Stylesheets
└── assets/     # Images, fonts, icons
```

## Adding Translations

To add translations for a new language:

1. Edit `src/js/i18n-translations.js`
2. Add your language code to the `translations` object
3. Translate all keys (200+ entries)
4. Test language switching

See [i18n implementation guide](docs/guides/i18n-implementation.md) for details.

## Database Changes

If you need to modify the database schema:

1. Create a new migration file in `database/migrations/`
2. Use sequential numbering: `004_your_migration_name.sql`
3. Include both up and down migrations
4. Document the changes in comments
5. Test locally with Supabase

## Testing

While we don't have automated tests yet, please:

- Manually test your changes thoroughly
- Test on Chrome, Firefox, and Safari if possible
- Test on mobile devices or use browser dev tools
- Check console for errors
- Verify authentication flows if relevant

## Documentation

Update documentation when you:

- Add new features
- Change existing behavior
- Add configuration options
- Modify the database schema

Documentation files are in:
- `docs/guides/` - How-to guides
- `docs/architecture/` - Technical documentation
- `README.md` - Main documentation

## Questions?

If you have questions:
- Open an issue for discussion
- Check existing documentation in `/docs`
- Review the [architecture overview](docs/architecture/project-overview.md)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make Permahub better! 🌱
