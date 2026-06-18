# Clone Website

Use this skill to reverse engineer a live website into a Next.js App Router implementation.

## Workflow

1. Fetch website HTML.
2. Extract layout structure.
3. Identify reusable components.
4. Convert the structure into React components.
5. Apply Tailwind classes that match the source styling.
6. Save assets locally under `public/images/` or other appropriate public folders.

## Output

- Place route entry files in `src/app/`.
- Place reusable UI sections in `src/components/`.
- Place downloaded assets in `public/images/`.
- Prefer shadcn/ui primitives when they fit the source structure.
- Preserve the source content and visual hierarchy before making stylistic changes.
