# "Website by TheClientPilot" badge

Drop this into the footer of every site you build for a client. For a web agency
this is the best backlink source there is: relevant, permanent, and it grows by
itself as your client list grows. Twenty sites, twenty real links — plus the
clients' own visitors clicking through to you.

**Ask the client first.** Most agree, many will not notice, but a credit link
placed without permission is a fast way to lose a client and a link at once.

---

## Anchor text: read this before changing the wording

Keep the link text **branded** — "TheClientPilot", not "best AI agency in India".

The temptation is to stuff the keyword you want to rank for into every client
footer. Don't. A keyword-rich link repeated in the footer of dozens of unrelated
sites is a textbook link-scheme footprint, and it is one of the patterns Google
names explicitly. A plain branded credit is a normal, expected part of how agencies
work, and it is treated as such.

The safe pattern, used below:

- Link text: `TheClientPilot` — brand only
- Surrounding text: `Website by` — plain, human, not a keyword
- No `nofollow`: this is a genuine editorial credit, not a paid placement

---

## Plain HTML

Works anywhere — static sites, WordPress themes, PHP, anything.

```html
<p class="tcp-credit">
  Website by
  <a href="https://www.theclientpilot.store" target="_blank" rel="noopener">
    TheClientPilot
  </a>
</p>
```

Optional styling — keep it quiet and out of the way:

```css
.tcp-credit {
  font-size: 0.8125rem;
  opacity: 0.7;
}
.tcp-credit a {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.tcp-credit a:hover {
  opacity: 0.8;
}
```

---

## React / Next.js

```tsx
export function ClientPilotCredit() {
  return (
    <p className="text-[13px] opacity-70">
      Website by{" "}
      <a
        href="https://www.theclientpilot.store"
        target="_blank"
        rel="noopener"
        className="underline underline-offset-2 transition-opacity hover:opacity-80"
      >
        TheClientPilot
      </a>
    </p>
  );
}
```

---

## WordPress

Add to the active theme's `footer.php`, just before `wp_footer()`:

```php
<p class="tcp-credit">
  Website by
  <a href="https://www.theclientpilot.store" target="_blank" rel="noopener">
    TheClientPilot
  </a>
</p>
```

Better, if the theme supports it: put the same HTML in a footer widget via
**Appearance → Widgets**, so a theme update cannot wipe it.

---

## Tracking which clients still link to you

Links disappear — sites get redesigned, themes get updated, clients switch hosts.
Check every few months:

- **Google Search Console → Links → External links** — the authoritative list, free.
- Or search `site:clientdomain.com theclientpilot` to check one site.

Keep a list of client sites and when you last confirmed the link was live.
