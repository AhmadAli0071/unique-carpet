/* ==========================================================================
   Unique Carpet & Interior — generative SVG artwork
   Every product visual on this site is drawn with inline SVG so the whole
   website works offline, loads instantly and never shows a broken image.
   Replace any call with a real <img> when photography is available.
   ========================================================================== */
(function (global) {
  "use strict";

  /* deterministic pseudo random so a product always looks the same */
  function rng(seed) {
    var s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return function () {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }

  function hash(str) {
    var h = 0, i;
    for (i = 0; i < String(str).length; i++) {
      h = (h << 5) - h + String(str).charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h) + 7;
  }

  var W = 400, H = 300;

  function open(id) {
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid slice" ' +
      'xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" data-art="' + id + '">';
  }

  /* woven fibre overlay shared by all carpet artwork */
  function weave(id, opacity) {
    return '<defs><pattern id="wv' + id + '" width="4" height="4" patternUnits="userSpaceOnUse">' +
      '<rect width="4" height="4" fill="none"/>' +
      '<path d="M0 0h2v2H0zM2 2h2v2H2z" fill="#000" opacity="' + (opacity || 0.05) + '"/>' +
      '</pattern>' +
      '<linearGradient id="sh' + id + '" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#fff" stop-opacity=".16"/>' +
      '<stop offset=".55" stop-color="#fff" stop-opacity="0"/>' +
      '<stop offset="1" stop-color="#000" stop-opacity=".22"/>' +
      '</linearGradient></defs>';
  }

  function finish(id) {
    return '<rect width="' + W + '" height="' + H + '" fill="url(#wv' + id + ')"/>' +
      '<rect width="' + W + '" height="' + H + '" fill="url(#sh' + id + ')"/></svg>';
  }

  /* ------------------------------------------------------------------ */
  var makers = {

    /* dyed plain broadloom */
    plain: function (p, id, r) {
      var s = open(id) + weave(id, 0.06);
      s += '<rect width="' + W + '" height="' + H + '" fill="' + p[0] + '"/>';
      for (var i = 0; i < 60; i++) {
        var y = r() * H;
        s += '<rect x="0" y="' + y.toFixed(1) + '" width="' + W + '" height="' +
          (0.6 + r() * 1.6).toFixed(1) + '" fill="' + p[1] + '" opacity="' + (0.05 + r() * 0.12).toFixed(2) + '"/>';
      }
      for (var f = 0; f < 700; f++) {
        s += '<circle cx="' + (r() * W).toFixed(1) + '" cy="' + (r() * H).toFixed(1) + '" r="' +
          (0.5 + r() * 1.3).toFixed(1) + '" fill="' + (r() > 0.5 ? p[2] : p[1]) +
          '" opacity="' + (0.15 + r() * 0.4).toFixed(2) + '"/>';
      }
      s += '<rect x="0" y="0" width="' + W + '" height="' + H + '" fill="none" stroke="' + p[2] + '" stroke-width="14" opacity=".18"/>';
      return s + finish(id);
    },

    /* contemporary stripes */
    stripe: function (p, id, r) {
      var s = open(id) + weave(id, 0.05);
      s += '<rect width="' + W + '" height="' + H + '" fill="' + p[0] + '"/>';
      var x = 0;
      while (x < W) {
        var w = 6 + r() * 34;
        var c = [p[1], p[2], p[0], p[1]][Math.floor(r() * 4)];
        s += '<rect x="' + x.toFixed(1) + '" y="0" width="' + w.toFixed(1) + '" height="' + H + '" fill="' + c + '" opacity="' + (0.35 + r() * 0.6).toFixed(2) + '"/>';
        if (r() > 0.6) {
          s += '<rect x="' + (x + w).toFixed(1) + '" y="0" width="2.5" height="' + H + '" fill="' + p[3] + '" opacity=".7"/>';
        }
        x += w + 2;
      }
      return s + finish(id);
    },

    /* axminster style florals */
    axminster: function (p, id, r) {
      var s = open(id) + weave(id, 0.05);
      s += '<rect width="' + W + '" height="' + H + '" fill="' + p[0] + '"/>';
      for (var gy = 0; gy < 4; gy++) {
        for (var gx = 0; gx < 5; gx++) {
          var cx = gx * 84 + (gy % 2 ? 42 : 0), cy = gy * 80 + 30;
          var rot = Math.floor(r() * 360);
          s += '<g transform="translate(' + cx + ',' + cy + ') rotate(' + rot + ')">';
          for (var k = 0; k < 6; k++) {
            var a = (k / 6) * 360;
            s += '<ellipse cx="0" cy="-17" rx="8" ry="17" fill="' + p[1] + '" opacity=".75" transform="rotate(' + a + ')"/>';
          }
          s += '<circle r="8" fill="' + p[2] + '"/><circle r="3.4" fill="' + p[3] + '"/>';
          s += '</g>';
          s += '<path d="M' + (cx + 40) + ' ' + (cy - 34) + 'q14 18 0 36" stroke="' + p[2] + '" stroke-width="2" fill="none" opacity=".45"/>';
        }
      }
      s += '<rect x="9" y="9" width="' + (W - 18) + '" height="' + (H - 18) + '" fill="none" stroke="' + p[3] + '" stroke-width="7" opacity=".55"/>';
      return s + finish(id);
    },

    /* persian medallion rug */
    medallion: function (p, id, r) {
      var s = open(id) + weave(id, 0.06);
      s += '<rect width="' + W + '" height="' + H + '" fill="' + p[0] + '"/>';
      /* field diaper */
      for (var i = 0; i < 90; i++) {
        var x = r() * W, y = r() * H;
        s += '<path d="M' + x.toFixed(0) + ' ' + y.toFixed(0) + 'l5 6-5 6-5-6z" fill="' + p[1] + '" opacity=".28"/>';
      }
      /* borders */
      s += '<rect x="8" y="8" width="' + (W - 16) + '" height="' + (H - 16) + '" fill="none" stroke="' + p[2] + '" stroke-width="16"/>';
      s += '<rect x="8" y="8" width="' + (W - 16) + '" height="' + (H - 16) + '" fill="none" stroke="' + p[3] + '" stroke-width="2"/>';
      s += '<rect x="26" y="26" width="' + (W - 52) + '" height="' + (H - 52) + '" fill="none" stroke="' + p[3] + '" stroke-width="1.6" opacity=".8"/>';
      /* medallion */
      s += '<g transform="translate(200,150)">';
      s += '<path d="M0 -76 L34 -34 L76 0 L34 34 L0 76 L-34 34 L-76 0 L-34 -34 Z" fill="' + p[2] + '" opacity=".92"/>';
      s += '<path d="M0 -58 L26 -26 L58 0 L26 26 L0 58 L-26 26 L-58 0 L-26 -26 Z" fill="' + p[1] + '" opacity=".9"/>';
      s += '<path d="M0 -34 L16 -16 L34 0 L16 16 L0 34 L-16 16 L-34 0 L-16 -16 Z" fill="' + p[3] + '" opacity=".95"/>';
      s += '<circle r="9" fill="' + p[0] + '"/>';
      s += '</g>';
      /* corner spandrels */
      [
        'translate(0,0)',
        'translate(' + W + ',0) rotate(90)',
        'translate(' + W + ',' + H + ') rotate(180)',
        'translate(0,' + H + ') rotate(270)'
      ].forEach(function (t) {
        s += '<g transform="' + t + '"><path d="M30 30 q60 4 74 62 q-46 -20 -74 -62z" fill="' + p[2] + '" opacity=".5"/></g>';
      });
      return s + finish(id);
    },

    /* mosque / prayer rows */
    mosque: function (p, id, r) {
      var s = open(id) + weave(id, 0.05);
      s += '<rect width="' + W + '" height="' + H + '" fill="' + p[0] + '"/>';
      var cols = 4, rows = 2, cw = W / cols, ch = H / rows;
      for (var y = 0; y < rows; y++) {
        for (var x = 0; x < cols; x++) {
          var ox = x * cw, oy = y * ch;
          s += '<rect x="' + (ox + 4) + '" y="' + (oy + 4) + '" width="' + (cw - 8) + '" height="' + (ch - 8) + '" fill="' + p[1] + '" opacity=".55"/>';
          /* mehrab arch */
          s += '<path d="M' + (ox + 18) + ' ' + (oy + ch - 14) +
            ' L' + (ox + 18) + ' ' + (oy + 60) +
            ' Q' + (ox + cw / 2) + ' ' + (oy + 8) + ' ' + (ox + cw - 18) + ' ' + (oy + 60) +
            ' L' + (ox + cw - 18) + ' ' + (oy + ch - 14) + ' Z" fill="' + p[2] + '" opacity=".9"/>';
          s += '<path d="M' + (ox + 26) + ' ' + (oy + ch - 20) +
            ' L' + (ox + 26) + ' ' + (oy + 62) +
            ' Q' + (ox + cw / 2) + ' ' + (oy + 20) + ' ' + (ox + cw - 26) + ' ' + (oy + 62) +
            ' L' + (ox + cw - 26) + ' ' + (oy + ch - 20) + ' Z" fill="none" stroke="' + p[3] + '" stroke-width="1.6" opacity=".85"/>';
          s += '<circle cx="' + (ox + cw / 2) + '" cy="' + (oy + 52) + '" r="5" fill="' + p[3] + '" opacity=".9"/>';
        }
      }
      return s + finish(id);
    },

    /* berber / natural loop */
    natural: function (p, id, r) {
      var s = open(id) + weave(id, 0.04);
      s += '<rect width="' + W + '" height="' + H + '" fill="' + p[0] + '"/>';
      for (var i = 0; i < 900; i++) {
        var x = r() * W, y = r() * H;
        s += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (0.8 + r() * 1.9).toFixed(1) +
          '" fill="' + (r() > 0.55 ? p[1] : p[2]) + '" opacity="' + (0.25 + r() * 0.5).toFixed(2) + '"/>';
      }
      for (var j = 0; j < 5; j++) {
        var yy = 24 + j * 60;
        s += '<rect x="0" y="' + yy + '" width="' + W + '" height="6" fill="' + p[3] + '" opacity=".2"/>';
      }
      return s + finish(id);
    },

    /* shaggy pile */
    shaggy: function (p, id, r) {
      var s = open(id) + weave(id, 0.03);
      s += '<rect width="' + W + '" height="' + H + '" fill="' + p[0] + '"/>';
      for (var i = 0; i < 620; i++) {
        var x = r() * W, y = r() * H, len = 8 + r() * 20, ang = (r() - 0.5) * 1.4;
        s += '<path d="M' + x.toFixed(1) + ' ' + y.toFixed(1) + 'q' + (ang * 8).toFixed(1) + ' ' + (len / 2).toFixed(1) +
          ' ' + (ang * 12).toFixed(1) + ' ' + len.toFixed(1) + '" stroke="' + (r() > 0.5 ? p[1] : p[2]) +
          '" stroke-width="' + (1 + r() * 2.2).toFixed(1) + '" fill="none" stroke-linecap="round" opacity="' + (0.3 + r() * 0.55).toFixed(2) + '"/>';
      }
      return s + finish(id);
    },

    /* animal skin texture */
    hide: function (p, id, r) {
      var s = open(id) + weave(id, 0.04);
      s += '<rect width="' + W + '" height="' + H + '" fill="' + p[0] + '"/>';
      for (var i = 0; i < 34; i++) {
        var cx = r() * W, cy = r() * H, rx = 12 + r() * 26, ry = 8 + r() * 18, rot = r() * 180;
        s += '<ellipse cx="' + cx.toFixed(0) + '" cy="' + cy.toFixed(0) + '" rx="' + rx.toFixed(0) + '" ry="' + ry.toFixed(0) +
          '" transform="rotate(' + rot.toFixed(0) + ' ' + cx.toFixed(0) + ' ' + cy.toFixed(0) + ')" fill="' + p[1] + '" opacity="' + (0.55 + r() * 0.4).toFixed(2) + '"/>';
        s += '<ellipse cx="' + (cx + 4).toFixed(0) + '" cy="' + (cy + 3).toFixed(0) + '" rx="' + (rx * 0.55).toFixed(0) + '" ry="' + (ry * 0.5).toFixed(0) +
          '" transform="rotate(' + rot.toFixed(0) + ' ' + cx.toFixed(0) + ' ' + cy.toFixed(0) + ')" fill="' + p[2] + '" opacity=".7"/>';
      }
      return s + finish(id);
    },

    /* jute / basket weave */
    jute: function (p, id, r) {
      var s = open(id) + weave(id, 0.03);
      s += '<rect width="' + W + '" height="' + H + '" fill="' + p[0] + '"/>';
      var step = 20;
      for (var y = 0; y < H; y += step) {
        for (var x = 0; x < W; x += step) {
          var alt = ((x / step) + (y / step)) % 2 === 0;
          if (alt) {
            s += '<rect x="' + (x + 2) + '" y="' + (y + 4) + '" width="' + (step - 4) + '" height="' + (step - 8) + '" rx="2" fill="' + p[1] + '" opacity=".85"/>';
          } else {
            s += '<rect x="' + (x + 4) + '" y="' + (y + 2) + '" width="' + (step - 8) + '" height="' + (step - 4) + '" rx="2" fill="' + p[2] + '" opacity=".85"/>';
          }
        }
      }
      return s + finish(id);
    },

    /* wooden plank flooring */
    wood: function (p, id, r) {
      var s = open(id) + weave(id, 0.02);
      s += '<rect width="' + W + '" height="' + H + '" fill="' + p[0] + '"/>';
      var ph = 38, offset = 0;
      for (var y = 0; y < H; y += ph) {
        var x = -offset;
        while (x < W) {
          var pw = 90 + r() * 90;
          var tone = [p[0], p[1], p[2]][Math.floor(r() * 3)];
          s += '<rect x="' + x.toFixed(0) + '" y="' + y + '" width="' + pw.toFixed(0) + '" height="' + (ph - 2) + '" fill="' + tone + '"/>';
          for (var g = 0; g < 7; g++) {
            var gy = y + 4 + r() * (ph - 10);
            s += '<path d="M' + x.toFixed(0) + ' ' + gy.toFixed(1) + 'q' + (pw / 2).toFixed(0) + ' ' + ((r() - 0.5) * 5).toFixed(1) +
              ' ' + pw.toFixed(0) + ' 0" stroke="' + p[3] + '" stroke-width="' + (0.5 + r()).toFixed(1) +
              '" fill="none" opacity="' + (0.12 + r() * 0.3).toFixed(2) + '"/>';
          }
          s += '<rect x="' + x.toFixed(0) + '" y="' + y + '" width="' + pw.toFixed(0) + '" height="' + (ph - 2) + '" fill="none" stroke="#000" stroke-width="1" opacity=".14"/>';
          x += pw;
        }
        offset = (offset + 60) % 180;
      }
      return s + finish(id);
    },

    /* herringbone parquet */
    herringbone: function (p, id, r) {
      var s = open(id) + weave(id, 0.02);
      s += '<rect width="' + W + '" height="' + H + '" fill="' + p[0] + '"/>';
      var bw = 44, bh = 15, i = 0;
      for (var y = -40; y < H + 40; y += bh + 1) {
        for (var x = -40; x < W + 40; x += bw + 1) {
          var ang = (i % 2 === 0) ? 45 : -45;
          var tone = [p[0], p[1], p[2]][(i + Math.floor(x / 10)) % 3];
          s += '<g transform="translate(' + x + ',' + y + ') rotate(' + ang + ')">' +
            '<rect width="' + bw + '" height="' + bh + '" fill="' + tone + '" stroke="#000" stroke-opacity=".16"/>' +
            '<path d="M2 ' + (bh / 2) + 'h' + (bw - 4) + '" stroke="' + p[3] + '" stroke-width=".8" opacity=".28"/>' +
            '</g>';
          i++;
        }
      }
      return s + finish(id);
    },

    /* curtain folds */
    drape: function (p, id, r) {
      var s = open(id) + '<defs>';
      s += '<linearGradient id="dg' + id + '" x1="0" y1="0" x2="1" y2="0">';
      var stops = 16;
      for (var i = 0; i <= stops; i++) {
        var t = i / stops;
        var c = i % 2 === 0 ? p[1] : p[0];
        s += '<stop offset="' + (t * 100).toFixed(1) + '%" stop-color="' + c + '"/>';
      }
      s += '</linearGradient>' +
        '<linearGradient id="dv' + id + '" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#000" stop-opacity=".3"/>' +
        '<stop offset=".4" stop-color="#fff" stop-opacity=".08"/>' +
        '<stop offset="1" stop-color="#000" stop-opacity=".28"/></linearGradient></defs>';
      s += '<rect width="' + W + '" height="' + H + '" fill="' + p[2] + '"/>';
      s += '<rect width="' + W + '" height="' + H + '" fill="url(#dg' + id + ')"/>';
      for (var j = 0; j < 22; j++) {
        var x = j * (W / 22) + 4;
        s += '<path d="M' + x.toFixed(1) + ' 0 q' + ((r() - 0.5) * 16).toFixed(1) + ' ' + (H / 2) + ' 0 ' + H +
          '" stroke="#000" stroke-width="' + (1 + r() * 3).toFixed(1) + '" fill="none" opacity="' + (0.06 + r() * 0.16).toFixed(2) + '"/>';
      }
      s += '<rect width="' + W + '" height="26" fill="' + p[3] + '" opacity=".9"/>';
      for (var k = 0; k < 10; k++) {
        s += '<circle cx="' + (20 + k * 42) + '" cy="13" r="5" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="2"/>';
      }
      s += '<rect width="' + W + '" height="' + H + '" fill="url(#dv' + id + ')"/></svg>';
      return s;
    },

    /* roller / zebra blinds */
    blind: function (p, id, r) {
      var s = open(id) + weave(id, 0.03);
      s += '<rect width="' + W + '" height="' + H + '" fill="' + p[0] + '"/>';
      var band = 24;
      for (var y = 26; y < H; y += band) {
        s += '<rect x="0" y="' + y + '" width="' + W + '" height="' + (band / 2) + '" fill="' + p[1] + '" opacity=".92"/>';
        s += '<rect x="0" y="' + (y + band / 2) + '" width="' + W + '" height="' + (band / 2) + '" fill="' + p[2] + '" opacity=".55"/>';
      }
      s += '<rect width="' + W + '" height="26" fill="' + p[3] + '"/>';
      s += '<rect x="' + (W - 30) + '" y="26" width="4" height="' + (H - 26) + '" fill="' + p[3] + '" opacity=".8"/>';
      return s + finish(id);
    },

    /* geometric modern rug */
    geo: function (p, id, r) {
      var s = open(id) + weave(id, 0.05);
      s += '<rect width="' + W + '" height="' + H + '" fill="' + p[0] + '"/>';
      for (var i = 0; i < 26; i++) {
        var x = Math.floor(r() * 8) * 50, y = Math.floor(r() * 6) * 50;
        var c = [p[1], p[2], p[3]][Math.floor(r() * 3)];
        var t = r();
        if (t < 0.34) {
          s += '<rect x="' + x + '" y="' + y + '" width="50" height="50" fill="' + c + '" opacity=".85"/>';
        } else if (t < 0.67) {
          s += '<path d="M' + x + ' ' + (y + 50) + 'L' + (x + 50) + ' ' + (y + 50) + 'L' + (x + 25) + ' ' + y + 'z" fill="' + c + '" opacity=".85"/>';
        } else {
          s += '<circle cx="' + (x + 25) + '" cy="' + (y + 25) + '" r="22" fill="none" stroke="' + c + '" stroke-width="6" opacity=".85"/>';
        }
      }
      return s + finish(id);
    },

    /* damask wall / wallpaper-ish backdrop used for banners */
    damask: function (p, id, r) {
      var s = open(id) + weave(id, 0.04);
      s += '<rect width="' + W + '" height="' + H + '" fill="' + p[0] + '"/>';
      for (var gy = 0; gy < 5; gy++) {
        for (var gx = 0; gx < 6; gx++) {
          var cx = gx * 70 + (gy % 2 ? 35 : 0), cy = gy * 64 + 24;
          s += '<g transform="translate(' + cx + ',' + cy + ')" fill="' + p[1] + '" opacity=".5">' +
            '<path d="M0 -22 q16 12 0 26 q-16 -14 0 -26z"/>' +
            '<path d="M-22 0 q12 -16 26 0 q-14 16 -26 0z" opacity=".7"/>' +
            '<circle r="3.4" fill="' + p[2] + '"/></g>';
        }
      }
      return s + finish(id);
    }
  };

  /* palettes by mood */
  var PALETTES = {
    ivory:     ['#e8ddc8', '#d6c7ab', '#f2ead9', '#b3873f'],
    beige:     ['#d9c8ad', '#c2ac8c', '#eee2cd', '#8a662a'],
    sand:      ['#cbb391', '#b2966f', '#e4d4b8', '#7d5e34'],
    grey:      ['#9c9c98', '#7e7e79', '#c3c3bd', '#4a4a46'],
    charcoal:  ['#4a4744', '#35322f', '#6d6862', '#b3873f'],
    emerald:   ['#2f5d4a', '#1f4436', '#4b7d66', '#c9a44a'],
    teal:      ['#2a5b63', '#1c4249', '#4a828a', '#d0b071'],
    navy:      ['#25344f', '#182338', '#3d5273', '#c2a05a'],
    royal:     ['#2b3a72', '#1c2851', '#485a9c', '#cba martin'],
    crimson:   ['#7d2d2c', '#5d1f1f', '#a34644', '#e0c27a'],
    maroon:    ['#5c2226', '#3f1618', '#83383c', '#d8b271'],
    rust:      ['#8d4f2f', '#6b3820', '#b0704a', '#e6cfa4'],
    gold:      ['#a5822f', '#7f6320', '#c9a44a', '#f0e3c2'],
    olive:     ['#6b6a3a', '#4f4e28', '#8b8a52', '#ddd4a6'],
    rose:      ['#a8776f', '#875a54', '#c99b92', '#f0dcd2'],
    plum:      ['#5a3c56', '#412a3e', '#7c5875', '#d4b7cc'],
    walnut:    ['#7a4f2c', '#5e3a1e', '#96683d', '#3a2313'],
    oak:       ['#c0996a', '#a87f52', '#d3b189', '#6b4a26'],
    ash:       ['#c9c2b6', '#b1a99c', '#ded8ce', '#7a7268'],
    ebony:     ['#3b2f27', '#281f19', '#54443a', '#151009'],
    linen:     ['#efe6d6', '#ded1ba', '#faf5ea', '#c2a97f'],
    ink:       ['#1d1a18', '#2a2622', '#3a342e', '#b3873f']
  };
  PALETTES.royal[3] = '#cbab5e';

  /**
   * Build an SVG string.
   * @param {string} kind    one of the makers above
   * @param {string} palette key of PALETTES
   * @param {string} seed    any string — same seed = same artwork
   */
  function art(kind, palette, seed) {
    var maker = makers[kind] || makers.plain;
    var p = PALETTES[palette] || PALETTES.beige;
    var id = hash(String(kind) + String(palette) + String(seed || ''));
    return maker(p, id, rng(id));
  }

  art.kinds = Object.keys(makers);
  art.palettes = Object.keys(PALETTES);
  global.UCArt = art;
})(window);
