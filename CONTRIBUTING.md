# Contributing to Yoot

Thanks for your interest in contributing! This guide will help you get started quickly and smoothly.

&nbsp;

> 💡**New to open source?**
>
> Check out [https://github.com/firstcontributions/first-contributions](https://github.com/firstcontributions/first-contributions) for a quick intro.

&nbsp;

## 🗣️ Communication First

- **Found a bug?** <br>
  Please [search existing issues](https://github.com/theisel/yoot/issues) first. If no one's reported it, [open a new issue](https://github.com/theisel/yoot/issues) with clear steps to reproduce.
- **Have an idea or improvement?** <br/>
  [Open an issue](https://github.com/theisel/yoot/issues) to discuss it before starting work. This keeps everyone aligned and avoids wasted effort.

&nbsp;

## 🛠️ Development Setup

### Prerequisites

- Node ≥ 22
- PNPM ≥ 10.11.0

---

### 1. Fork & Clone

```shell
git clone https://github.com/YOUR_USERNAME/yoot.git
cd yoot
```

### 2. Choose a setup method:

#### 🐳 Dev Container (Recommended for VS Code):

This project includes a full Dev Container setup. It installs dependencies for you automatically.

To use it:

- Open the cloned project in VS Code.
- If the **Dev Containers** extension is installed, you’ll be prompted to **Reopen in Container**.
- Alternatively, run one of the following from the Command Palette (`F1`):
  - `Dev Containers: Reopen in Container` (if already cloned).
  - `Dev Containers: Clone Repository in Named Container Volume` (if cloning via SSH/HTTPS).

&nbsp;

> 💡 **New to Dev Containers?**
>
> Learn more: [Dev Container Docs](https://code.visualstudio.com/docs/devcontainers/tutorial)

&nbsp;

#### 💻 Local Setup

If you prefer to work locally:

```shell
# Ensure Node and PNPM are installed (see prerequisites)
pnpm install --frozen-lockfile
```

&nbsp;

## ✍️ Contribution Workflow

1. **Create a branch:**

   `git switch -c feat/your-feature-name`

2. **Make your changes**

3. **Format, lint, and test:**

   ```shell
   pnpm format                           # Format the code
   pnpm lint                             # Lint code
   pnpm test                             # Run all tests
   pnpm --filter @yoot/package-name test # Optional: Run tests for one package
   ```

4. **Add a changeset (if needed)**

   ```shell
   pnpm changeset
   ```

   > Add a changeset if your update affects users (features, fixes, docs, etc.).<br/>
   > Commit the generated `.md` file inside the `.changeset` folder.

5. **Commit your changes** <br/>
   Use [Conventional Commits](https://www.conventionalcommits.org/) if possible.

   ```shell
   feat(core): add support for X
   fix(adapter): correct bug in Y
   ```

&nbsp;

## 🚀 Submitting a Pull Request

1. Push your branch.
2. Open a PR against `main` on `theisel/yoot`.
3. Add a clear title and description, and link any related issues.
4. Make sure all CI checks pass.
5. If the PR modifies public APIs:
   - Review `.api.md` changes (generated automatically by GitHub Actions).
   - Ensure TSDoc comments are accurate — they’re used to generate docs.

&nbsp;

## ©️ Licensing

By contributing, you agree to license your work under the [ISC License](https://github.com/theisel/yoot/LICENSE).
