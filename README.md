# Congeo.gr

Το blog Congeo.gr (2011–2015), αναδημιουργημένο από το Wayback Machine και τα παλιά RSS feeds, σε [Eleventy](https://www.11ty.dev/) με φιλοξενία στο Netlify.

## Γράψιμο άρθρων
Πήγαινε στο **congeo.gr/admin**, συνδέσου με το GitHub και πάτα «Νέο Άρθρο». Με το Publish το άρθρο ανεβαίνει σε περίπου ένα λεπτό.

## Πού είναι τι
- `src/posts/` — τα άρθρα (ένα αρχείο ανά άρθρο)
- `src/uploads/` — οι εικόνες
- `src/_data/site.json` — τίτλος, μενού κατηγοριών, links στο sidebar, Disqus
- `src/_includes/` — η εμφάνιση (θέμα του 2014)
- `src/_redirects` — οι παλιές διευθύνσεις του WordPress
- `MISSING_IMAGES.md` — εικόνες που χάθηκαν

## Σχόλια
Βάλε το shortname του Disqus στο `disqusShortname` μέσα στο `src/_data/site.json`.

## Τοπικά (προαιρετικό)
`npm install` και μετά `npm start` → http://localhost:8080
