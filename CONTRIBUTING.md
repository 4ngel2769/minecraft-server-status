# Contributing to Minecraft Server Status

Thank you for considering contributing to Minecraft Server Status! We welcome contributions from the community.

## Getting Started

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/4ngel2769/minecraft-server-status.git
   cd minecraft-server-status
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env.local
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## Making Changes

1. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow the existing code style
   - Test your changes thoroughly

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```
   
   Use conventional commit format:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `style:` for formatting changes
   - `refactor:` for code refactoring
   - `test:` for adding tests

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Describe your changes clearly
   - Link any related issues

## Code Guidelines

- Use TypeScript for type safety
- Follow the existing code structure
- Add comments for complex logic
- Run `npm run lint` before committing
- Ensure `npm run build` completes successfully

## Reporting Issues

Found a bug or have a feature request?

1. Check if the issue already exists
2. Create a new issue with a clear description
3. Include steps to reproduce (for bugs)
4. Add screenshots if helpful

## Questions?

Feel free to open an issue for questions or join discussions!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make Minecraft Server Status better ⚡
