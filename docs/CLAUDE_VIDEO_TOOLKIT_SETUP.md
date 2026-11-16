# Claude Code Video Toolkit integration

This repository contains **two independent video workflows**:

- `video-studio/` — the original Remotion 4 React/TypeScript application, its 13 installed Agent Skills, and the heart-circulation composition being reviewed separately.
- `integrations/claude-code-video-toolkit/` — a Git **submodule**, pointing to the upstream Digital Samba toolkit. It is **not** a copy of its source and does not automatically enable Claude Code.

Upstream: https://github.com/digitalsamba/claude-code-video-toolkit
License: MIT (upstream files retain their own copyright and license).
Pinned upstream commit at integration: `9a3e865a9ef656afac21850dd0c4ce30d0163c48`.

## First-time setup in GitHub Codespaces

From the **repository root**:

```bash
git fetch origin
git switch feat/add-claude-video-toolkit
git submodule update --init --recursive
git submodule status
```

The submodule path should become populated. To work with its Claude Code commands:

```bash
cd integrations/claude-code-video-toolkit
node --version   # Upstream currently requires Node 22 or later
claude --version # Claude Code CLI must be separately installed and authenticated
uv --version     # Optional for Python/AI tools
```

Review `README.md`, `CLAUDE.md`, `.claude/skills/`, and the commands before granting AI agents permission to run shell commands. The upstream describes its quick start as:

```bash
# Only if the uv package manager has been installed:
uv sync
# Only if the Claude Code CLI has been installed and authenticated:
claude
```

In the **Claude Code session** (not the Bash shell), use `/setup` to configure optional providers and `/video` to start a toolkit project.

Some functionality requires a paid Claude plan, API credits, cloud GPU services, or third-party accounts. Do not paste secrets into chat or commit `.env`, cloud keys, generated credentials, or private voice samples. Review model and asset licences before publication.

## Keep the existing Remotion work intact

The toolkit is deliberately isolated, with its own `.claude` skills and templates. It does **not** replace or automatically load into `video-studio/.agents/skills`. Use the existing `video-studio` Remotion project for the heart animation; use the toolkit for optional narration, generated clips, music and other supporting assets.

To use an output inside Remotion:
1. Produce and license-check the media using the toolkit.
2. Copy *approved* audio/images/video into `video-studio/public/`.
3. Reference media in Remotion using `staticFile()`.
4. Preview, run `npm run lint`, and create a pull request for accepted changes.

## Updates and reproducibility

To populate the submodule in a new clone:

```bash
git clone --recurse-submodules https://github.com/rameshgascngl-create/Zoology-Remotion-Studio.git
```

To update the pinned toolkit commit intentionally, work on a **new branch** and review the upstream changes first:

```bash
git submodule update --remote integrations/claude-code-video-toolkit
git diff --submodule
git add integrations/claude-code-video-toolkit
git commit -m "Update Claude Code video toolkit pin"
```

Never overwrite the original `video-studio` folder or bulk-copy the toolkit's `.claude` settings into your repository root.

## No MP4 included yet

Adding the toolkit installs its *source reference*. It does not itself create an animation, render a video, register accounts, or connect external services.
