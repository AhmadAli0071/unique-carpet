# Unique Carpet & Interior — website

Static website. No build step, no server, no dependencies.
Open `index.html` in any browser, or upload the whole folder to any host.

## Structure

```
index.html                Home (hero, collections, Trusted By logo slider)
pages/                    All other pages
  products.html             All products, with category filters
  dyed.html / luxurious-plains.html / contemporary-stripes.html /
  axminster-designs.html    Dyed collection
  noble-natural.html / natural-plains.html / natural-stripes.html /
  natural-designs.html / animal-skin-texture.html    Noble Natural collection
  spiritual-mosque.html     Spiritual Mosque
  rugs.html / hand-carved.html / hand-knotted.html / dyed-rugs.html /
  natural-rugs.html / exclusive-animal-skin-texture.html    Rugs
  curtains.html            Curtains & Blinds
  wooden-flooring.html     Wooden Flooring
  hospitality.html / mosques.html / others.html / projects.html    Projects
  about-us.html / contact-us.html / why-wool.html / sustainability.html
  free-consult.html / general-care.html / warranties.html / faqs.html

css/style.css             All styling
js/art.js                 Draws the placeholder carpet artwork as SVG
js/products.js            THE PRODUCT CATALOGUE — edit this to change products
js/images.js              List of photos that exist — the site shows a photo
                          from here instead of the drawn artwork
js/main.js                Navigation, filters, quick-view, logo slider, form, animations
images/
  products/               Product photos — one per product, named <product-id>.jpg
  pages/                  Page banners, headers and panels
  partners/               Client logos for the Trusted By slider
  icons/                  SVG icons
docs/IMAGE-GUIDE.md       Photo guide (sizes, naming, shot list)
source-photos/            Original un-optimised photos (reference only — not used by the site)
sitemap.xml, robots.txt   For search engines
```

## Adding or replacing a photograph

Drop a `.jpg` into `images/products/` with the product's id as the file name
(see `js/products.js`), or into `images/pages/` for a banner, and add the path
to `js/images.js`. The photo appears over the drawn artwork automatically.
No file, no problem — the drawn artwork stays and nothing breaks.

Use photographs you own or have licensed. `source-photos/` holds the full-size
originals — resize and optimise before promoting any of them into `images/`.

## Editing products

Everything on every product card comes from `js/products.js`. Each entry:

```js
{
  id:    "shaggy-rug",          // also the photo: images/products/shaggy-rug.jpg
  name:  "Plush Shaggy Rug",
  coll:  "natural-rugs",        // which page/grid the product sits on
  sub:   "Shaggy",              // the small label on the card
  art:   "shaggy", pal: "linen",// placeholder drawing style and colours
  blurb: "Long, soft pile …",
  tags:  ["Shaggy", "Soft pile", "Bedroom"]
}
```

Add, remove or reorder entries and every page updates itself.

## Trusted By slider

Lives on `index.html`. Logos are small PNGs in `images/partners/`; the strip
scrolls automatically and pauses on hover. To add a partner, crop a logo
(~100px tall, transparent or white background), save it there and add one
`<img>` inside **both** `.logo-marquee__group` blocks in `index.html`.

## Before going live — three things to change

1. **Email address.** `info@uniquecarpetinterior.com` is a placeholder.
   Search and replace it across all HTML files.
2. **Social links.** Facebook / Instagram / LinkedIn currently point at the
   Google listing. Replace the `href` values in the header and footer.
3. **The enquiry form.** It currently opens WhatsApp with the details filled
   in, which works with no server. To email instead, replace the marked block
   in `js/main.js` (`forms()`) with a POST to your own endpoint or a service
   such as Formspree.

## Contact details used throughout

Shop No. 4, Jehlum Block, Fortress Stadium, Saddar Town, Lahore 54000
Phone / WhatsApp: 0320 1417293 · Opens 9 am
Rated 5.0 from 14 Google reviews

These appear in the top bar, footer, contact page and in the structured-data
(`application/ld+json`) block on every page, which is what puts the shop's
address, phone and rating into Google search results.
