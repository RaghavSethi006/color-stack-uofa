<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- All chapter-editable content (links, contact, events, leads, photos, FAQs, form endpoints) lives in src/config/site.ts; empty values render designed placeholder states, so the chapter can fill it in without touching components.
- Section order/colors come from `sections` in src/config/site.ts and drive nav, scrollspy, progress bar and index labels.
