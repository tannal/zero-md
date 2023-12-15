var ke = Object.defineProperty;
var me = (a, e, t) => e in a ? ke(a, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : a[e] = t;
var k = (a, e, t) => (me(a, typeof e != "symbol" ? e + "" : e, t), t), xe = (a, e, t) => {
  if (!e.has(a))
    throw TypeError("Cannot " + t);
};
var H = (a, e, t) => {
  if (e.has(a))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(a) : e.set(a, t);
};
var L = (a, e, t) => (xe(a, e, "access private method"), t);
function D() {
  return {
    async: !1,
    breaks: !1,
    extensions: null,
    gfm: !0,
    hooks: null,
    pedantic: !1,
    renderer: null,
    silent: !1,
    tokenizer: null,
    walkTokens: null
  };
}
let z = D();
function re(a) {
  z = a;
}
const oe = /[&<>"']/, be = new RegExp(oe.source, "g"), le = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, we = new RegExp(le.source, "g"), ye = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}, ee = (a) => ye[a];
function m(a, e) {
  if (e) {
    if (oe.test(a))
      return a.replace(be, ee);
  } else if (le.test(a))
    return a.replace(we, ee);
  return a;
}
const $e = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;
function Te(a) {
  return a.replace($e, (e, t) => (t = t.toLowerCase(), t === "colon" ? ":" : t.charAt(0) === "#" ? t.charAt(1) === "x" ? String.fromCharCode(parseInt(t.substring(2), 16)) : String.fromCharCode(+t.substring(1)) : ""));
}
const ze = /(^|[^\[])\^/g;
function g(a, e) {
  let t = typeof a == "string" ? a : a.source;
  e = e || "";
  const n = {
    replace: (i, r) => {
      let s = typeof r == "string" ? r : r.source;
      return s = s.replace(ze, "$1"), t = t.replace(i, s), n;
    },
    getRegex: () => new RegExp(t, e)
  };
  return n;
}
function te(a) {
  try {
    a = encodeURI(a).replace(/%25/g, "%");
  } catch {
    return null;
  }
  return a;
}
const A = { exec: () => null };
function ne(a, e) {
  const t = a.replace(/\|/g, (r, s, o) => {
    let l = !1, u = s;
    for (; --u >= 0 && o[u] === "\\"; )
      l = !l;
    return l ? "|" : " |";
  }), n = t.split(/ \|/);
  let i = 0;
  if (n[0].trim() || n.shift(), n.length > 0 && !n[n.length - 1].trim() && n.pop(), e)
    if (n.length > e)
      n.splice(e);
    else
      for (; n.length < e; )
        n.push("");
  for (; i < n.length; i++)
    n[i] = n[i].trim().replace(/\\\|/g, "|");
  return n;
}
function v(a, e, t) {
  const n = a.length;
  if (n === 0)
    return "";
  let i = 0;
  for (; i < n; ) {
    const r = a.charAt(n - i - 1);
    if (r === e && !t)
      i++;
    else if (r !== e && t)
      i++;
    else
      break;
  }
  return a.slice(0, n - i);
}
function Re(a, e) {
  if (a.indexOf(e[1]) === -1)
    return -1;
  let t = 0;
  for (let n = 0; n < a.length; n++)
    if (a[n] === "\\")
      n++;
    else if (a[n] === e[0])
      t++;
    else if (a[n] === e[1] && (t--, t < 0))
      return n;
  return -1;
}
function se(a, e, t, n) {
  const i = e.href, r = e.title ? m(e.title) : null, s = a[1].replace(/\\([\[\]])/g, "$1");
  if (a[0].charAt(0) !== "!") {
    n.state.inLink = !0;
    const o = {
      type: "link",
      raw: t,
      href: i,
      title: r,
      text: s,
      tokens: n.inlineTokens(s)
    };
    return n.state.inLink = !1, o;
  }
  return {
    type: "image",
    raw: t,
    href: i,
    title: r,
    text: m(s)
  };
}
function Ae(a, e) {
  const t = a.match(/^(\s+)(?:```)/);
  if (t === null)
    return e;
  const n = t[1];
  return e.split(`
`).map((i) => {
    const r = i.match(/^\s+/);
    if (r === null)
      return i;
    const [s] = r;
    return s.length >= n.length ? i.slice(n.length) : i;
  }).join(`
`);
}
class P {
  // set by the lexer
  constructor(e) {
    k(this, "options");
    k(this, "rules");
    // set by the lexer
    k(this, "lexer");
    this.options = e || z;
  }
  space(e) {
    const t = this.rules.block.newline.exec(e);
    if (t && t[0].length > 0)
      return {
        type: "space",
        raw: t[0]
      };
  }
  code(e) {
    const t = this.rules.block.code.exec(e);
    if (t) {
      const n = t[0].replace(/^ {1,4}/gm, "");
      return {
        type: "code",
        raw: t[0],
        codeBlockStyle: "indented",
        text: this.options.pedantic ? n : v(n, `
`)
      };
    }
  }
  fences(e) {
    const t = this.rules.block.fences.exec(e);
    if (t) {
      const n = t[0], i = Ae(n, t[3] || "");
      return {
        type: "code",
        raw: n,
        lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2],
        text: i
      };
    }
  }
  heading(e) {
    const t = this.rules.block.heading.exec(e);
    if (t) {
      let n = t[2].trim();
      if (/#$/.test(n)) {
        const i = v(n, "#");
        (this.options.pedantic || !i || / $/.test(i)) && (n = i.trim());
      }
      return {
        type: "heading",
        raw: t[0],
        depth: t[1].length,
        text: n,
        tokens: this.lexer.inline(n)
      };
    }
  }
  hr(e) {
    const t = this.rules.block.hr.exec(e);
    if (t)
      return {
        type: "hr",
        raw: t[0]
      };
  }
  blockquote(e) {
    const t = this.rules.block.blockquote.exec(e);
    if (t) {
      const n = v(t[0].replace(/^ *>[ \t]?/gm, ""), `
`), i = this.lexer.state.top;
      this.lexer.state.top = !0;
      const r = this.lexer.blockTokens(n);
      return this.lexer.state.top = i, {
        type: "blockquote",
        raw: t[0],
        tokens: r,
        text: n
      };
    }
  }
  list(e) {
    let t = this.rules.block.list.exec(e);
    if (t) {
      let n = t[1].trim();
      const i = n.length > 1, r = {
        type: "list",
        raw: "",
        ordered: i,
        start: i ? +n.slice(0, -1) : "",
        loose: !1,
        items: []
      };
      n = i ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = i ? n : "[*+-]");
      const s = new RegExp(`^( {0,3}${n})((?:[	 ][^\\n]*)?(?:\\n|$))`);
      let o = "", l = "", u = !1;
      for (; e; ) {
        let c = !1;
        if (!(t = s.exec(e)) || this.rules.block.hr.test(e))
          break;
        o = t[0], e = e.substring(o.length);
        let p = t[2].split(`
`, 1)[0].replace(/^\t+/, (j) => " ".repeat(3 * j.length)), h = e.split(`
`, 1)[0], f = 0;
        this.options.pedantic ? (f = 2, l = p.trimStart()) : (f = t[2].search(/[^ ]/), f = f > 4 ? 1 : f, l = p.slice(f), f += t[1].length);
        let y = !1;
        if (!p && /^ *$/.test(h) && (o += h + `
`, e = e.substring(h.length + 1), c = !0), !c) {
          const j = new RegExp(`^ {0,${Math.min(3, f - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), V = new RegExp(`^ {0,${Math.min(3, f - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), W = new RegExp(`^ {0,${Math.min(3, f - 1)}}(?:\`\`\`|~~~)`), Y = new RegExp(`^ {0,${Math.min(3, f - 1)}}#`);
          for (; e; ) {
            const U = e.split(`
`, 1)[0];
            if (h = U, this.options.pedantic && (h = h.replace(/^ {1,4}(?=( {4})*[^ ])/g, "  ")), W.test(h) || Y.test(h) || j.test(h) || V.test(e))
              break;
            if (h.search(/[^ ]/) >= f || !h.trim())
              l += `
` + h.slice(f);
            else {
              if (y || p.search(/[^ ]/) >= 4 || W.test(p) || Y.test(p) || V.test(p))
                break;
              l += `
` + h;
            }
            !y && !h.trim() && (y = !0), o += U + `
`, e = e.substring(U.length + 1), p = h.slice(f);
          }
        }
        r.loose || (u ? r.loose = !0 : /\n *\n *$/.test(o) && (u = !0));
        let x = null, $;
        this.options.gfm && (x = /^\[[ xX]\] /.exec(l), x && ($ = x[0] !== "[ ] ", l = l.replace(/^\[[ xX]\] +/, ""))), r.items.push({
          type: "list_item",
          raw: o,
          task: !!x,
          checked: $,
          loose: !1,
          text: l,
          tokens: []
        }), r.raw += o;
      }
      r.items[r.items.length - 1].raw = o.trimEnd(), r.items[r.items.length - 1].text = l.trimEnd(), r.raw = r.raw.trimEnd();
      for (let c = 0; c < r.items.length; c++)
        if (this.lexer.state.top = !1, r.items[c].tokens = this.lexer.blockTokens(r.items[c].text, []), !r.loose) {
          const p = r.items[c].tokens.filter((f) => f.type === "space"), h = p.length > 0 && p.some((f) => /\n.*\n/.test(f.raw));
          r.loose = h;
        }
      if (r.loose)
        for (let c = 0; c < r.items.length; c++)
          r.items[c].loose = !0;
      return r;
    }
  }
  html(e) {
    const t = this.rules.block.html.exec(e);
    if (t)
      return {
        type: "html",
        block: !0,
        raw: t[0],
        pre: t[1] === "pre" || t[1] === "script" || t[1] === "style",
        text: t[0]
      };
  }
  def(e) {
    const t = this.rules.block.def.exec(e);
    if (t) {
      const n = t[1].toLowerCase().replace(/\s+/g, " "), i = t[2] ? t[2].replace(/^<(.*)>$/, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", r = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t[3];
      return {
        type: "def",
        tag: n,
        raw: t[0],
        href: i,
        title: r
      };
    }
  }
  table(e) {
    const t = this.rules.block.table.exec(e);
    if (!t || !/[:|]/.test(t[2]))
      return;
    const n = ne(t[1]), i = t[2].replace(/^\||\| *$/g, "").split("|"), r = t[3] && t[3].trim() ? t[3].replace(/\n[ \t]*$/, "").split(`
`) : [], s = {
      type: "table",
      raw: t[0],
      header: [],
      align: [],
      rows: []
    };
    if (n.length === i.length) {
      for (const o of i)
        /^ *-+: *$/.test(o) ? s.align.push("right") : /^ *:-+: *$/.test(o) ? s.align.push("center") : /^ *:-+ *$/.test(o) ? s.align.push("left") : s.align.push(null);
      for (const o of n)
        s.header.push({
          text: o,
          tokens: this.lexer.inline(o)
        });
      for (const o of r)
        s.rows.push(ne(o, s.header.length).map((l) => ({
          text: l,
          tokens: this.lexer.inline(l)
        })));
      return s;
    }
  }
  lheading(e) {
    const t = this.rules.block.lheading.exec(e);
    if (t)
      return {
        type: "heading",
        raw: t[0],
        depth: t[2].charAt(0) === "=" ? 1 : 2,
        text: t[1],
        tokens: this.lexer.inline(t[1])
      };
  }
  paragraph(e) {
    const t = this.rules.block.paragraph.exec(e);
    if (t) {
      const n = t[1].charAt(t[1].length - 1) === `
` ? t[1].slice(0, -1) : t[1];
      return {
        type: "paragraph",
        raw: t[0],
        text: n,
        tokens: this.lexer.inline(n)
      };
    }
  }
  text(e) {
    const t = this.rules.block.text.exec(e);
    if (t)
      return {
        type: "text",
        raw: t[0],
        text: t[0],
        tokens: this.lexer.inline(t[0])
      };
  }
  escape(e) {
    const t = this.rules.inline.escape.exec(e);
    if (t)
      return {
        type: "escape",
        raw: t[0],
        text: m(t[1])
      };
  }
  tag(e) {
    const t = this.rules.inline.tag.exec(e);
    if (t)
      return !this.lexer.state.inLink && /^<a /i.test(t[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && /^<\/a>/i.test(t[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(t[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(t[0]) && (this.lexer.state.inRawBlock = !1), {
        type: "html",
        raw: t[0],
        inLink: this.lexer.state.inLink,
        inRawBlock: this.lexer.state.inRawBlock,
        block: !1,
        text: t[0]
      };
  }
  link(e) {
    const t = this.rules.inline.link.exec(e);
    if (t) {
      const n = t[2].trim();
      if (!this.options.pedantic && /^</.test(n)) {
        if (!/>$/.test(n))
          return;
        const s = v(n.slice(0, -1), "\\");
        if ((n.length - s.length) % 2 === 0)
          return;
      } else {
        const s = Re(t[2], "()");
        if (s > -1) {
          const l = (t[0].indexOf("!") === 0 ? 5 : 4) + t[1].length + s;
          t[2] = t[2].substring(0, s), t[0] = t[0].substring(0, l).trim(), t[3] = "";
        }
      }
      let i = t[2], r = "";
      if (this.options.pedantic) {
        const s = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(i);
        s && (i = s[1], r = s[3]);
      } else
        r = t[3] ? t[3].slice(1, -1) : "";
      return i = i.trim(), /^</.test(i) && (this.options.pedantic && !/>$/.test(n) ? i = i.slice(1) : i = i.slice(1, -1)), se(t, {
        href: i && i.replace(this.rules.inline.anyPunctuation, "$1"),
        title: r && r.replace(this.rules.inline.anyPunctuation, "$1")
      }, t[0], this.lexer);
    }
  }
  reflink(e, t) {
    let n;
    if ((n = this.rules.inline.reflink.exec(e)) || (n = this.rules.inline.nolink.exec(e))) {
      const i = (n[2] || n[1]).replace(/\s+/g, " "), r = t[i.toLowerCase()];
      if (!r) {
        const s = n[0].charAt(0);
        return {
          type: "text",
          raw: s,
          text: s
        };
      }
      return se(n, r, n[0], this.lexer);
    }
  }
  emStrong(e, t, n = "") {
    let i = this.rules.inline.emStrongLDelim.exec(e);
    if (!i || i[3] && n.match(/[\p{L}\p{N}]/u))
      return;
    if (!(i[1] || i[2] || "") || !n || this.rules.inline.punctuation.exec(n)) {
      const s = [...i[0]].length - 1;
      let o, l, u = s, c = 0;
      const p = i[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (p.lastIndex = 0, t = t.slice(-1 * e.length + s); (i = p.exec(t)) != null; ) {
        if (o = i[1] || i[2] || i[3] || i[4] || i[5] || i[6], !o)
          continue;
        if (l = [...o].length, i[3] || i[4]) {
          u += l;
          continue;
        } else if ((i[5] || i[6]) && s % 3 && !((s + l) % 3)) {
          c += l;
          continue;
        }
        if (u -= l, u > 0)
          continue;
        l = Math.min(l, l + u + c);
        const h = [...i[0]][0].length, f = e.slice(0, s + i.index + h + l);
        if (Math.min(s, l) % 2) {
          const x = f.slice(1, -1);
          return {
            type: "em",
            raw: f,
            text: x,
            tokens: this.lexer.inlineTokens(x)
          };
        }
        const y = f.slice(2, -2);
        return {
          type: "strong",
          raw: f,
          text: y,
          tokens: this.lexer.inlineTokens(y)
        };
      }
    }
  }
  codespan(e) {
    const t = this.rules.inline.code.exec(e);
    if (t) {
      let n = t[2].replace(/\n/g, " ");
      const i = /[^ ]/.test(n), r = /^ /.test(n) && / $/.test(n);
      return i && r && (n = n.substring(1, n.length - 1)), n = m(n, !0), {
        type: "codespan",
        raw: t[0],
        text: n
      };
    }
  }
  br(e) {
    const t = this.rules.inline.br.exec(e);
    if (t)
      return {
        type: "br",
        raw: t[0]
      };
  }
  del(e) {
    const t = this.rules.inline.del.exec(e);
    if (t)
      return {
        type: "del",
        raw: t[0],
        text: t[2],
        tokens: this.lexer.inlineTokens(t[2])
      };
  }
  autolink(e) {
    const t = this.rules.inline.autolink.exec(e);
    if (t) {
      let n, i;
      return t[2] === "@" ? (n = m(t[1]), i = "mailto:" + n) : (n = m(t[1]), i = n), {
        type: "link",
        raw: t[0],
        text: n,
        href: i,
        tokens: [
          {
            type: "text",
            raw: n,
            text: n
          }
        ]
      };
    }
  }
  url(e) {
    var n;
    let t;
    if (t = this.rules.inline.url.exec(e)) {
      let i, r;
      if (t[2] === "@")
        i = m(t[0]), r = "mailto:" + i;
      else {
        let s;
        do
          s = t[0], t[0] = ((n = this.rules.inline._backpedal.exec(t[0])) == null ? void 0 : n[0]) ?? "";
        while (s !== t[0]);
        i = m(t[0]), t[1] === "www." ? r = "http://" + t[0] : r = t[0];
      }
      return {
        type: "link",
        raw: t[0],
        text: i,
        href: r,
        tokens: [
          {
            type: "text",
            raw: i,
            text: i
          }
        ]
      };
    }
  }
  inlineText(e) {
    const t = this.rules.inline.text.exec(e);
    if (t) {
      let n;
      return this.lexer.state.inRawBlock ? n = t[0] : n = m(t[0]), {
        type: "text",
        raw: t[0],
        text: n
      };
    }
  }
}
const Se = /^(?: *(?:\n|$))+/, _e = /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/, Ie = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, I = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Ee = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, ae = /(?:[*+-]|\d{1,9}[.)])/, ce = g(/^(?!bull )((?:.|\n(?!\s*?\n|bull ))+?)\n {0,3}(=+|-+) *(?:\n+|$)/).replace(/bull/g, ae).getRegex(), Q = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, Le = /^[^\n]+/, F = /(?!\s*\])(?:\\.|[^\[\]\\])+/, ve = g(/^ {0,3}\[(label)\]: *(?:\n *)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/).replace("label", F).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Ce = g(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, ae).getRegex(), M = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", K = /<!--(?!-?>)[\s\S]*?(?:-->|$)/, Pe = g("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))", "i").replace("comment", K).replace("tag", M).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), he = g(Q).replace("hr", I).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", M).getRegex(), qe = g(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", he).getRegex(), J = {
  blockquote: qe,
  code: _e,
  def: ve,
  fences: Ie,
  heading: Ee,
  hr: I,
  html: Pe,
  lheading: ce,
  list: Ce,
  newline: Se,
  paragraph: he,
  table: A,
  text: Le
}, ie = g("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", I).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", " {4}[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", M).getRegex(), Ze = {
  ...J,
  table: ie,
  paragraph: g(Q).replace("hr", I).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", ie).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", M).getRegex()
}, Be = {
  ...J,
  html: g(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", K).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: A,
  // fences not supported
  lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  paragraph: g(Q).replace("hr", I).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", ce).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, ue = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Me = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, pe = /^( {2,}|\\)\n(?!\s*$)/, je = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, E = "\\p{P}$+<=>`^|~", Ue = g(/^((?![*_])[\spunctuation])/, "u").replace(/punctuation/g, E).getRegex(), He = /\[[^[\]]*?\]\([^\(\)]*?\)|`[^`]*?`|<[^<>]*?>/g, Ne = g(/^(?:\*+(?:((?!\*)[punct])|[^\s*]))|^_+(?:((?!_)[punct])|([^\s_]))/, "u").replace(/punct/g, E).getRegex(), Oe = g("^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)[punct](\\*+)(?=[\\s]|$)|[^punct\\s](\\*+)(?!\\*)(?=[punct\\s]|$)|(?!\\*)[punct\\s](\\*+)(?=[^punct\\s])|[\\s](\\*+)(?!\\*)(?=[punct])|(?!\\*)[punct](\\*+)(?!\\*)(?=[punct])|[^punct\\s](\\*+)(?=[^punct\\s])", "gu").replace(/punct/g, E).getRegex(), De = g("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)[punct](_+)(?=[\\s]|$)|[^punct\\s](_+)(?!_)(?=[punct\\s]|$)|(?!_)[punct\\s](_+)(?=[^punct\\s])|[\\s](_+)(?!_)(?=[punct])|(?!_)[punct](_+)(?!_)(?=[punct])", "gu").replace(/punct/g, E).getRegex(), Qe = g(/\\([punct])/, "gu").replace(/punct/g, E).getRegex(), Fe = g(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Ke = g(K).replace("(?:-->|$)", "-->").getRegex(), Je = g("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", Ke).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), q = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, Xe = g(/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/).replace("label", q).replace("href", /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), de = g(/^!?\[(label)\]\[(ref)\]/).replace("label", q).replace("ref", F).getRegex(), fe = g(/^!?\[(ref)\](?:\[\])?/).replace("ref", F).getRegex(), Ge = g("reflink|nolink(?!\\()", "g").replace("reflink", de).replace("nolink", fe).getRegex(), X = {
  _backpedal: A,
  // only used for GFM url
  anyPunctuation: Qe,
  autolink: Fe,
  blockSkip: He,
  br: pe,
  code: Me,
  del: A,
  emStrongLDelim: Ne,
  emStrongRDelimAst: Oe,
  emStrongRDelimUnd: De,
  escape: ue,
  link: Xe,
  nolink: fe,
  punctuation: Ue,
  reflink: de,
  reflinkSearch: Ge,
  tag: Je,
  text: je,
  url: A
}, Ve = {
  ...X,
  link: g(/^!?\[(label)\]\((.*?)\)/).replace("label", q).getRegex(),
  reflink: g(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", q).getRegex()
}, N = {
  ...X,
  escape: g(ue).replace("])", "~|])").getRegex(),
  url: g(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
  _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
}, We = {
  ...N,
  br: g(pe).replace("{2,}", "*").getRegex(),
  text: g(N.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, C = {
  normal: J,
  gfm: Ze,
  pedantic: Be
}, R = {
  normal: X,
  gfm: N,
  breaks: We,
  pedantic: Ve
};
class b {
  constructor(e) {
    k(this, "tokens");
    k(this, "options");
    k(this, "state");
    k(this, "tokenizer");
    k(this, "inlineQueue");
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || z, this.options.tokenizer = this.options.tokenizer || new P(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
      inLink: !1,
      inRawBlock: !1,
      top: !0
    };
    const t = {
      block: C.normal,
      inline: R.normal
    };
    this.options.pedantic ? (t.block = C.pedantic, t.inline = R.pedantic) : this.options.gfm && (t.block = C.gfm, this.options.breaks ? t.inline = R.breaks : t.inline = R.gfm), this.tokenizer.rules = t;
  }
  /**
   * Expose Rules
   */
  static get rules() {
    return {
      block: C,
      inline: R
    };
  }
  /**
   * Static Lex Method
   */
  static lex(e, t) {
    return new b(t).lex(e);
  }
  /**
   * Static Lex Inline Method
   */
  static lexInline(e, t) {
    return new b(t).inlineTokens(e);
  }
  /**
   * Preprocessing
   */
  lex(e) {
    e = e.replace(/\r\n|\r/g, `
`), this.blockTokens(e, this.tokens);
    let t;
    for (; t = this.inlineQueue.shift(); )
      this.inlineTokens(t.src, t.tokens);
    return this.tokens;
  }
  blockTokens(e, t = []) {
    this.options.pedantic ? e = e.replace(/\t/g, "    ").replace(/^ +$/gm, "") : e = e.replace(/^( *)(\t+)/gm, (o, l, u) => l + "    ".repeat(u.length));
    let n, i, r, s;
    for (; e; )
      if (!(this.options.extensions && this.options.extensions.block && this.options.extensions.block.some((o) => (n = o.call({ lexer: this }, e, t)) ? (e = e.substring(n.raw.length), t.push(n), !0) : !1))) {
        if (n = this.tokenizer.space(e)) {
          e = e.substring(n.raw.length), n.raw.length === 1 && t.length > 0 ? t[t.length - 1].raw += `
` : t.push(n);
          continue;
        }
        if (n = this.tokenizer.code(e)) {
          e = e.substring(n.raw.length), i = t[t.length - 1], i && (i.type === "paragraph" || i.type === "text") ? (i.raw += `
` + n.raw, i.text += `
` + n.text, this.inlineQueue[this.inlineQueue.length - 1].src = i.text) : t.push(n);
          continue;
        }
        if (n = this.tokenizer.fences(e)) {
          e = e.substring(n.raw.length), t.push(n);
          continue;
        }
        if (n = this.tokenizer.heading(e)) {
          e = e.substring(n.raw.length), t.push(n);
          continue;
        }
        if (n = this.tokenizer.hr(e)) {
          e = e.substring(n.raw.length), t.push(n);
          continue;
        }
        if (n = this.tokenizer.blockquote(e)) {
          e = e.substring(n.raw.length), t.push(n);
          continue;
        }
        if (n = this.tokenizer.list(e)) {
          e = e.substring(n.raw.length), t.push(n);
          continue;
        }
        if (n = this.tokenizer.html(e)) {
          e = e.substring(n.raw.length), t.push(n);
          continue;
        }
        if (n = this.tokenizer.def(e)) {
          e = e.substring(n.raw.length), i = t[t.length - 1], i && (i.type === "paragraph" || i.type === "text") ? (i.raw += `
` + n.raw, i.text += `
` + n.raw, this.inlineQueue[this.inlineQueue.length - 1].src = i.text) : this.tokens.links[n.tag] || (this.tokens.links[n.tag] = {
            href: n.href,
            title: n.title
          });
          continue;
        }
        if (n = this.tokenizer.table(e)) {
          e = e.substring(n.raw.length), t.push(n);
          continue;
        }
        if (n = this.tokenizer.lheading(e)) {
          e = e.substring(n.raw.length), t.push(n);
          continue;
        }
        if (r = e, this.options.extensions && this.options.extensions.startBlock) {
          let o = 1 / 0;
          const l = e.slice(1);
          let u;
          this.options.extensions.startBlock.forEach((c) => {
            u = c.call({ lexer: this }, l), typeof u == "number" && u >= 0 && (o = Math.min(o, u));
          }), o < 1 / 0 && o >= 0 && (r = e.substring(0, o + 1));
        }
        if (this.state.top && (n = this.tokenizer.paragraph(r))) {
          i = t[t.length - 1], s && i.type === "paragraph" ? (i.raw += `
` + n.raw, i.text += `
` + n.text, this.inlineQueue.pop(), this.inlineQueue[this.inlineQueue.length - 1].src = i.text) : t.push(n), s = r.length !== e.length, e = e.substring(n.raw.length);
          continue;
        }
        if (n = this.tokenizer.text(e)) {
          e = e.substring(n.raw.length), i = t[t.length - 1], i && i.type === "text" ? (i.raw += `
` + n.raw, i.text += `
` + n.text, this.inlineQueue.pop(), this.inlineQueue[this.inlineQueue.length - 1].src = i.text) : t.push(n);
          continue;
        }
        if (e) {
          const o = "Infinite loop on byte: " + e.charCodeAt(0);
          if (this.options.silent) {
            console.error(o);
            break;
          } else
            throw new Error(o);
        }
      }
    return this.state.top = !0, t;
  }
  inline(e, t = []) {
    return this.inlineQueue.push({ src: e, tokens: t }), t;
  }
  /**
   * Lexing/Compiling
   */
  inlineTokens(e, t = []) {
    let n, i, r, s = e, o, l, u;
    if (this.tokens.links) {
      const c = Object.keys(this.tokens.links);
      if (c.length > 0)
        for (; (o = this.tokenizer.rules.inline.reflinkSearch.exec(s)) != null; )
          c.includes(o[0].slice(o[0].lastIndexOf("[") + 1, -1)) && (s = s.slice(0, o.index) + "[" + "a".repeat(o[0].length - 2) + "]" + s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (o = this.tokenizer.rules.inline.blockSkip.exec(s)) != null; )
      s = s.slice(0, o.index) + "[" + "a".repeat(o[0].length - 2) + "]" + s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    for (; (o = this.tokenizer.rules.inline.anyPunctuation.exec(s)) != null; )
      s = s.slice(0, o.index) + "++" + s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    for (; e; )
      if (l || (u = ""), l = !1, !(this.options.extensions && this.options.extensions.inline && this.options.extensions.inline.some((c) => (n = c.call({ lexer: this }, e, t)) ? (e = e.substring(n.raw.length), t.push(n), !0) : !1))) {
        if (n = this.tokenizer.escape(e)) {
          e = e.substring(n.raw.length), t.push(n);
          continue;
        }
        if (n = this.tokenizer.tag(e)) {
          e = e.substring(n.raw.length), i = t[t.length - 1], i && n.type === "text" && i.type === "text" ? (i.raw += n.raw, i.text += n.text) : t.push(n);
          continue;
        }
        if (n = this.tokenizer.link(e)) {
          e = e.substring(n.raw.length), t.push(n);
          continue;
        }
        if (n = this.tokenizer.reflink(e, this.tokens.links)) {
          e = e.substring(n.raw.length), i = t[t.length - 1], i && n.type === "text" && i.type === "text" ? (i.raw += n.raw, i.text += n.text) : t.push(n);
          continue;
        }
        if (n = this.tokenizer.emStrong(e, s, u)) {
          e = e.substring(n.raw.length), t.push(n);
          continue;
        }
        if (n = this.tokenizer.codespan(e)) {
          e = e.substring(n.raw.length), t.push(n);
          continue;
        }
        if (n = this.tokenizer.br(e)) {
          e = e.substring(n.raw.length), t.push(n);
          continue;
        }
        if (n = this.tokenizer.del(e)) {
          e = e.substring(n.raw.length), t.push(n);
          continue;
        }
        if (n = this.tokenizer.autolink(e)) {
          e = e.substring(n.raw.length), t.push(n);
          continue;
        }
        if (!this.state.inLink && (n = this.tokenizer.url(e))) {
          e = e.substring(n.raw.length), t.push(n);
          continue;
        }
        if (r = e, this.options.extensions && this.options.extensions.startInline) {
          let c = 1 / 0;
          const p = e.slice(1);
          let h;
          this.options.extensions.startInline.forEach((f) => {
            h = f.call({ lexer: this }, p), typeof h == "number" && h >= 0 && (c = Math.min(c, h));
          }), c < 1 / 0 && c >= 0 && (r = e.substring(0, c + 1));
        }
        if (n = this.tokenizer.inlineText(r)) {
          e = e.substring(n.raw.length), n.raw.slice(-1) !== "_" && (u = n.raw.slice(-1)), l = !0, i = t[t.length - 1], i && i.type === "text" ? (i.raw += n.raw, i.text += n.text) : t.push(n);
          continue;
        }
        if (e) {
          const c = "Infinite loop on byte: " + e.charCodeAt(0);
          if (this.options.silent) {
            console.error(c);
            break;
          } else
            throw new Error(c);
        }
      }
    return t;
  }
}
class Z {
  constructor(e) {
    k(this, "options");
    this.options = e || z;
  }
  code(e, t, n) {
    var r;
    const i = (r = (t || "").match(/^\S*/)) == null ? void 0 : r[0];
    return e = e.replace(/\n$/, "") + `
`, i ? '<pre><code class="language-' + m(i) + '">' + (n ? e : m(e, !0)) + `</code></pre>
` : "<pre><code>" + (n ? e : m(e, !0)) + `</code></pre>
`;
  }
  blockquote(e) {
    return `<blockquote>
${e}</blockquote>
`;
  }
  html(e, t) {
    return e;
  }
  heading(e, t, n) {
    return `<h${t}>${e}</h${t}>
`;
  }
  hr() {
    return `<hr>
`;
  }
  list(e, t, n) {
    const i = t ? "ol" : "ul", r = t && n !== 1 ? ' start="' + n + '"' : "";
    return "<" + i + r + `>
` + e + "</" + i + `>
`;
  }
  listitem(e, t, n) {
    return `<li>${e}</li>
`;
  }
  checkbox(e) {
    return "<input " + (e ? 'checked="" ' : "") + 'disabled="" type="checkbox">';
  }
  paragraph(e) {
    return `<p>${e}</p>
`;
  }
  table(e, t) {
    return t && (t = `<tbody>${t}</tbody>`), `<table>
<thead>
` + e + `</thead>
` + t + `</table>
`;
  }
  tablerow(e) {
    return `<tr>
${e}</tr>
`;
  }
  tablecell(e, t) {
    const n = t.header ? "th" : "td";
    return (t.align ? `<${n} align="${t.align}">` : `<${n}>`) + e + `</${n}>
`;
  }
  /**
   * span level renderer
   */
  strong(e) {
    return `<strong>${e}</strong>`;
  }
  em(e) {
    return `<em>${e}</em>`;
  }
  codespan(e) {
    return `<code>${e}</code>`;
  }
  br() {
    return "<br>";
  }
  del(e) {
    return `<del>${e}</del>`;
  }
  link(e, t, n) {
    const i = te(e);
    if (i === null)
      return n;
    e = i;
    let r = '<a href="' + e + '"';
    return t && (r += ' title="' + t + '"'), r += ">" + n + "</a>", r;
  }
  image(e, t, n) {
    const i = te(e);
    if (i === null)
      return n;
    e = i;
    let r = `<img src="${e}" alt="${n}"`;
    return t && (r += ` title="${t}"`), r += ">", r;
  }
  text(e) {
    return e;
  }
}
class G {
  // no need for block level renderers
  strong(e) {
    return e;
  }
  em(e) {
    return e;
  }
  codespan(e) {
    return e;
  }
  del(e) {
    return e;
  }
  html(e) {
    return e;
  }
  text(e) {
    return e;
  }
  link(e, t, n) {
    return "" + n;
  }
  image(e, t, n) {
    return "" + n;
  }
  br() {
    return "";
  }
}
class w {
  constructor(e) {
    k(this, "options");
    k(this, "renderer");
    k(this, "textRenderer");
    this.options = e || z, this.options.renderer = this.options.renderer || new Z(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.textRenderer = new G();
  }
  /**
   * Static Parse Method
   */
  static parse(e, t) {
    return new w(t).parse(e);
  }
  /**
   * Static Parse Inline Method
   */
  static parseInline(e, t) {
    return new w(t).parseInline(e);
  }
  /**
   * Parse Loop
   */
  parse(e, t = !0) {
    let n = "";
    for (let i = 0; i < e.length; i++) {
      const r = e[i];
      if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[r.type]) {
        const s = r, o = this.options.extensions.renderers[s.type].call({ parser: this }, s);
        if (o !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(s.type)) {
          n += o || "";
          continue;
        }
      }
      switch (r.type) {
        case "space":
          continue;
        case "hr": {
          n += this.renderer.hr();
          continue;
        }
        case "heading": {
          const s = r;
          n += this.renderer.heading(this.parseInline(s.tokens), s.depth, Te(this.parseInline(s.tokens, this.textRenderer)));
          continue;
        }
        case "code": {
          const s = r;
          n += this.renderer.code(s.text, s.lang, !!s.escaped);
          continue;
        }
        case "table": {
          const s = r;
          let o = "", l = "";
          for (let c = 0; c < s.header.length; c++)
            l += this.renderer.tablecell(this.parseInline(s.header[c].tokens), { header: !0, align: s.align[c] });
          o += this.renderer.tablerow(l);
          let u = "";
          for (let c = 0; c < s.rows.length; c++) {
            const p = s.rows[c];
            l = "";
            for (let h = 0; h < p.length; h++)
              l += this.renderer.tablecell(this.parseInline(p[h].tokens), { header: !1, align: s.align[h] });
            u += this.renderer.tablerow(l);
          }
          n += this.renderer.table(o, u);
          continue;
        }
        case "blockquote": {
          const s = r, o = this.parse(s.tokens);
          n += this.renderer.blockquote(o);
          continue;
        }
        case "list": {
          const s = r, o = s.ordered, l = s.start, u = s.loose;
          let c = "";
          for (let p = 0; p < s.items.length; p++) {
            const h = s.items[p], f = h.checked, y = h.task;
            let x = "";
            if (h.task) {
              const $ = this.renderer.checkbox(!!f);
              u ? h.tokens.length > 0 && h.tokens[0].type === "paragraph" ? (h.tokens[0].text = $ + " " + h.tokens[0].text, h.tokens[0].tokens && h.tokens[0].tokens.length > 0 && h.tokens[0].tokens[0].type === "text" && (h.tokens[0].tokens[0].text = $ + " " + h.tokens[0].tokens[0].text)) : h.tokens.unshift({
                type: "text",
                text: $ + " "
              }) : x += $ + " ";
            }
            x += this.parse(h.tokens, u), c += this.renderer.listitem(x, y, !!f);
          }
          n += this.renderer.list(c, o, l);
          continue;
        }
        case "html": {
          const s = r;
          n += this.renderer.html(s.text, s.block);
          continue;
        }
        case "paragraph": {
          const s = r;
          n += this.renderer.paragraph(this.parseInline(s.tokens));
          continue;
        }
        case "text": {
          let s = r, o = s.tokens ? this.parseInline(s.tokens) : s.text;
          for (; i + 1 < e.length && e[i + 1].type === "text"; )
            s = e[++i], o += `
` + (s.tokens ? this.parseInline(s.tokens) : s.text);
          n += t ? this.renderer.paragraph(o) : o;
          continue;
        }
        default: {
          const s = 'Token with "' + r.type + '" type was not found.';
          if (this.options.silent)
            return console.error(s), "";
          throw new Error(s);
        }
      }
    }
    return n;
  }
  /**
   * Parse Inline Tokens
   */
  parseInline(e, t) {
    t = t || this.renderer;
    let n = "";
    for (let i = 0; i < e.length; i++) {
      const r = e[i];
      if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[r.type]) {
        const s = this.options.extensions.renderers[r.type].call({ parser: this }, r);
        if (s !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(r.type)) {
          n += s || "";
          continue;
        }
      }
      switch (r.type) {
        case "escape": {
          const s = r;
          n += t.text(s.text);
          break;
        }
        case "html": {
          const s = r;
          n += t.html(s.text);
          break;
        }
        case "link": {
          const s = r;
          n += t.link(s.href, s.title, this.parseInline(s.tokens, t));
          break;
        }
        case "image": {
          const s = r;
          n += t.image(s.href, s.title, s.text);
          break;
        }
        case "strong": {
          const s = r;
          n += t.strong(this.parseInline(s.tokens, t));
          break;
        }
        case "em": {
          const s = r;
          n += t.em(this.parseInline(s.tokens, t));
          break;
        }
        case "codespan": {
          const s = r;
          n += t.codespan(s.text);
          break;
        }
        case "br": {
          n += t.br();
          break;
        }
        case "del": {
          const s = r;
          n += t.del(this.parseInline(s.tokens, t));
          break;
        }
        case "text": {
          const s = r;
          n += t.text(s.text);
          break;
        }
        default: {
          const s = 'Token with "' + r.type + '" type was not found.';
          if (this.options.silent)
            return console.error(s), "";
          throw new Error(s);
        }
      }
    }
    return n;
  }
}
class S {
  constructor(e) {
    k(this, "options");
    this.options = e || z;
  }
  /**
   * Process markdown before marked
   */
  preprocess(e) {
    return e;
  }
  /**
   * Process HTML after marked is finished
   */
  postprocess(e) {
    return e;
  }
  /**
   * Process all tokens before walk tokens
   */
  processAllTokens(e) {
    return e;
  }
}
k(S, "passThroughHooks", /* @__PURE__ */ new Set([
  "preprocess",
  "postprocess",
  "processAllTokens"
]));
var _, O, B, ge;
class Ye {
  constructor(...e) {
    H(this, _);
    H(this, B);
    k(this, "defaults", D());
    k(this, "options", this.setOptions);
    k(this, "parse", L(this, _, O).call(this, b.lex, w.parse));
    k(this, "parseInline", L(this, _, O).call(this, b.lexInline, w.parseInline));
    k(this, "Parser", w);
    k(this, "Renderer", Z);
    k(this, "TextRenderer", G);
    k(this, "Lexer", b);
    k(this, "Tokenizer", P);
    k(this, "Hooks", S);
    this.use(...e);
  }
  /**
   * Run callback for every token
   */
  walkTokens(e, t) {
    var i, r;
    let n = [];
    for (const s of e)
      switch (n = n.concat(t.call(this, s)), s.type) {
        case "table": {
          const o = s;
          for (const l of o.header)
            n = n.concat(this.walkTokens(l.tokens, t));
          for (const l of o.rows)
            for (const u of l)
              n = n.concat(this.walkTokens(u.tokens, t));
          break;
        }
        case "list": {
          const o = s;
          n = n.concat(this.walkTokens(o.items, t));
          break;
        }
        default: {
          const o = s;
          (r = (i = this.defaults.extensions) == null ? void 0 : i.childTokens) != null && r[o.type] ? this.defaults.extensions.childTokens[o.type].forEach((l) => {
            n = n.concat(this.walkTokens(o[l], t));
          }) : o.tokens && (n = n.concat(this.walkTokens(o.tokens, t)));
        }
      }
    return n;
  }
  use(...e) {
    const t = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return e.forEach((n) => {
      const i = { ...n };
      if (i.async = this.defaults.async || i.async || !1, n.extensions && (n.extensions.forEach((r) => {
        if (!r.name)
          throw new Error("extension name required");
        if ("renderer" in r) {
          const s = t.renderers[r.name];
          s ? t.renderers[r.name] = function(...o) {
            let l = r.renderer.apply(this, o);
            return l === !1 && (l = s.apply(this, o)), l;
          } : t.renderers[r.name] = r.renderer;
        }
        if ("tokenizer" in r) {
          if (!r.level || r.level !== "block" && r.level !== "inline")
            throw new Error("extension level must be 'block' or 'inline'");
          const s = t[r.level];
          s ? s.unshift(r.tokenizer) : t[r.level] = [r.tokenizer], r.start && (r.level === "block" ? t.startBlock ? t.startBlock.push(r.start) : t.startBlock = [r.start] : r.level === "inline" && (t.startInline ? t.startInline.push(r.start) : t.startInline = [r.start]));
        }
        "childTokens" in r && r.childTokens && (t.childTokens[r.name] = r.childTokens);
      }), i.extensions = t), n.renderer) {
        const r = this.defaults.renderer || new Z(this.defaults);
        for (const s in n.renderer) {
          if (!(s in r))
            throw new Error(`renderer '${s}' does not exist`);
          if (s === "options")
            continue;
          const o = s, l = n.renderer[o], u = r[o];
          r[o] = (...c) => {
            let p = l.apply(r, c);
            return p === !1 && (p = u.apply(r, c)), p || "";
          };
        }
        i.renderer = r;
      }
      if (n.tokenizer) {
        const r = this.defaults.tokenizer || new P(this.defaults);
        for (const s in n.tokenizer) {
          if (!(s in r))
            throw new Error(`tokenizer '${s}' does not exist`);
          if (["options", "rules", "lexer"].includes(s))
            continue;
          const o = s, l = n.tokenizer[o], u = r[o];
          r[o] = (...c) => {
            let p = l.apply(r, c);
            return p === !1 && (p = u.apply(r, c)), p;
          };
        }
        i.tokenizer = r;
      }
      if (n.hooks) {
        const r = this.defaults.hooks || new S();
        for (const s in n.hooks) {
          if (!(s in r))
            throw new Error(`hook '${s}' does not exist`);
          if (s === "options")
            continue;
          const o = s, l = n.hooks[o], u = r[o];
          S.passThroughHooks.has(s) ? r[o] = (c) => {
            if (this.defaults.async)
              return Promise.resolve(l.call(r, c)).then((h) => u.call(r, h));
            const p = l.call(r, c);
            return u.call(r, p);
          } : r[o] = (...c) => {
            let p = l.apply(r, c);
            return p === !1 && (p = u.apply(r, c)), p;
          };
        }
        i.hooks = r;
      }
      if (n.walkTokens) {
        const r = this.defaults.walkTokens, s = n.walkTokens;
        i.walkTokens = function(o) {
          let l = [];
          return l.push(s.call(this, o)), r && (l = l.concat(r.call(this, o))), l;
        };
      }
      this.defaults = { ...this.defaults, ...i };
    }), this;
  }
  setOptions(e) {
    return this.defaults = { ...this.defaults, ...e }, this;
  }
  lexer(e, t) {
    return b.lex(e, t ?? this.defaults);
  }
  parser(e, t) {
    return w.parse(e, t ?? this.defaults);
  }
}
_ = new WeakSet(), O = function(e, t) {
  return (n, i) => {
    const r = { ...i }, s = { ...this.defaults, ...r };
    this.defaults.async === !0 && r.async === !1 && (s.silent || console.warn("marked(): The async option was set to true by an extension. The async: false option sent to parse will be ignored."), s.async = !0);
    const o = L(this, B, ge).call(this, !!s.silent, !!s.async);
    if (typeof n > "u" || n === null)
      return o(new Error("marked(): input parameter is undefined or null"));
    if (typeof n != "string")
      return o(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(n) + ", string expected"));
    if (s.hooks && (s.hooks.options = s), s.async)
      return Promise.resolve(s.hooks ? s.hooks.preprocess(n) : n).then((l) => e(l, s)).then((l) => s.hooks ? s.hooks.processAllTokens(l) : l).then((l) => s.walkTokens ? Promise.all(this.walkTokens(l, s.walkTokens)).then(() => l) : l).then((l) => t(l, s)).then((l) => s.hooks ? s.hooks.postprocess(l) : l).catch(o);
    try {
      s.hooks && (n = s.hooks.preprocess(n));
      let l = e(n, s);
      s.hooks && (l = s.hooks.processAllTokens(l)), s.walkTokens && this.walkTokens(l, s.walkTokens);
      let u = t(l, s);
      return s.hooks && (u = s.hooks.postprocess(u)), u;
    } catch (l) {
      return o(l);
    }
  };
}, B = new WeakSet(), ge = function(e, t) {
  return (n) => {
    if (n.message += `
Please report this to https://github.com/markedjs/marked.`, e) {
      const i = "<p>An error occurred:</p><pre>" + m(n.message + "", !0) + "</pre>";
      return t ? Promise.resolve(i) : i;
    }
    if (t)
      return Promise.reject(n);
    throw n;
  };
};
const T = new Ye();
function d(a, e) {
  return T.parse(a, e);
}
d.options = d.setOptions = function(a) {
  return T.setOptions(a), d.defaults = T.defaults, re(d.defaults), d;
};
d.getDefaults = D;
d.defaults = z;
d.use = function(...a) {
  return T.use(...a), d.defaults = T.defaults, re(d.defaults), d;
};
d.walkTokens = function(a, e) {
  return T.walkTokens(a, e);
};
d.parseInline = T.parseInline;
d.Parser = w;
d.parser = w.parse;
d.Renderer = Z;
d.TextRenderer = G;
d.Lexer = b;
d.lexer = b.lex;
d.Tokenizer = P;
d.Hooks = S;
d.parse = d;
d.options;
d.setOptions;
d.use;
d.walkTokens;
d.parseInline;
w.parse;
b.lex;
class et extends HTMLElement {
  get src() {
    return this.getAttribute("src");
  }
  set src(e) {
    this.reflect("src", e);
  }
  get manualRender() {
    return this.hasAttribute("manual-render");
  }
  set manualRender(e) {
    this.reflect("manual-render", e);
  }
  reflect(e, t) {
    t === !1 ? this.removeAttribute(e) : this.setAttribute(e, t === !0 ? "" : t);
  }
  static get observedAttributes() {
    return ["src"];
  }
  attributeChangedCallback(e, t, n) {
    e === "src" && this.connected && !this.manualRender && n !== t && this.render();
  }
  constructor(e) {
    super(), this.version = "$VERSION", this.base = window.baseUrl, this.config = {
      markedUrl: "https://cdn.jsdelivr.net/gh/markedjs/marked/marked.min.js",
      prismUrl: [
        ["https://cdn.jsdelivr.net/gh/PrismJS/prism@1/prism.min.js", "data-manual"],
        "https://cdn.jsdelivr.net/gh/PrismJS/prism@1/plugins/autoloader/prism-autoloader.min.js"
      ],
      cssUrls: [
        "https://cdn.jsdelivr.net/gh/sindresorhus/github-markdown-css@4/github-markdown.min.css",
        "https://cdn.jsdelivr.net/gh/PrismJS/prism@1/themes/prism.min.css"
      ],
      hostCss: ":host{display:block;position:relative;contain:content;}:host([hidden]){display:none;}",
      ...e,
      ...window.ZeroMdConfig
    }, this.root = this.hasAttribute("no-shadow") ? this : this.attachShadow({ mode: "open" }), this.root.prepend(
      ...this.makeNodes('<div class="markdown-styles"></div><div class="markdown-body"></div>')
    ), this.constructor.ready || (this.constructor.ready = Promise.all([
      !!d || this.loadScript(this.config.markedUrl),
      !!window.Prism || this.loadScript(this.config.prismUrl)
    ])), this.clicked = this.clicked.bind(this), this.manualRender || this.render().then(() => setTimeout(() => this.goto(location.hash), 250)), this.observer = new MutationObserver(() => {
      this.observeChanges(), this.manualRender || this.render();
    }), this.observer.observe(this, { childList: !0 }), this.observeChanges();
  }
  /**
   * Start observing changes, if not already so, in `template` and `script`.
   */
  observeChanges() {
    this.querySelectorAll('template,script[type="text/markdown"]').forEach((e) => {
      this.observer.observe(e.content || e, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        characterData: !0
      });
    });
  }
  connectedCallback() {
    this.connected = !0, this.fire("zero-md-connected", {}, { bubbles: !1, composed: !1 }), this.waitForReady().then(() => {
      this.fire("zero-md-ready");
    }), this.shadowRoot && this.shadowRoot.addEventListener("click", this.clicked);
  }
  disconnectedCallback() {
    this.connected = !1, this.shadowRoot && this.shadowRoot.removeEventListener("click", this.clicked);
  }
  waitForReady() {
    const e = this.connected || new Promise((t) => {
      this.addEventListener("zero-md-connected", function n() {
        this.removeEventListener("zero-md-connected", n), t();
      });
    });
    return Promise.all([this.constructor.ready, e]);
  }
  fire(e, t = {}, n = { bubbles: !0, composed: !0 }) {
    t.msg && console.warn(t.msg), this.dispatchEvent(
      new CustomEvent(e, {
        detail: { node: this, ...t },
        ...n
      })
    );
  }
  tick() {
    return new Promise((e) => requestAnimationFrame(e));
  }
  // Coerce anything into an array
  arrify(e) {
    return e ? Array.isArray(e) ? e : [e] : [];
  }
  // Promisify an element's onload callback
  onload(e) {
    return new Promise((t, n) => {
      e.onload = t, e.onerror = (i) => n(i.path ? i.path[0] : i.composedPath()[0]);
    });
  }
  // Load a url or load (in order) an array of urls via <script> tags
  loadScript(e) {
    return Promise.all(
      this.arrify(e).map((t) => {
        const [n, ...i] = this.arrify(t), r = document.createElement("script");
        return r.src = n, r.async = !1, i.forEach((s) => r.setAttribute(s, "")), this.onload(document.head.appendChild(r));
      })
    );
  }
  // Scroll to selected element
  goto(e) {
    let t;
    try {
      t = this.root.querySelector(e);
    } catch {
    }
    t && t.scrollIntoView();
  }
  // Hijack same-doc anchor hash links
  clicked(e) {
    if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey || e.defaultPrevented)
      return;
    const t = e.target.closest("a");
    t && t.hash && t.host === location.host && t.pathname === location.pathname && this.goto(t.hash);
  }
  dedent(e) {
    e = e.replace(/^\n/, "");
    const t = e.match(/^\s+/);
    return t ? e.replace(new RegExp(`^${t[0]}`, "gm"), "") : e;
  }
  getBaseUrl(e) {
    return e;
  }
  // Runs Prism highlight async; falls back to sync if Web Workers throw
  highlight(e) {
    return new Promise((t) => {
      e.querySelectorAll('pre>code:not([class*="language-"])').forEach((i) => {
        const r = i.innerText.match(/^\s*</) ? "markup" : i.innerText.match(/^\s*(\$|#)/) ? "bash" : "js";
        i.classList.add(`language-${r}`);
      });
      try {
        window.Prism.highlightAllUnder(e, !0, t());
      } catch {
        window.Prism.highlightAllUnder(e), t();
      }
    });
  }
  /**
   * Converts HTML string into HTMLCollection of nodes
   * @param {string} html
   * @returns {HTMLCollection}
   */
  makeNodes(e) {
    const t = document.createElement("template");
    return t.innerHTML = e, t.content.children;
  }
  /**
   * Constructs the styles dom and returns HTML string
   * @returns {string} `markdown-styles` string
   */
  buildStyles() {
    const e = (i) => {
      const r = this.querySelector(i);
      return r ? r.innerHTML || " " : "";
    }, t = this.arrify(this.config.cssUrls);
    return `<style>${this.config.hostCss}</style>${e('template[data-merge="prepend"]')}${e("template:not([data-merge])") || t.reduce((i, r) => `${i}<link rel="stylesheet" href="${r}">`, "")}${e('template[data-merge="append"]')}`;
  }
  /**
   * Constructs the markdown body nodes and returns HTML string
   * @param {*} opts Markedjs options
   * @returns {Promise<string>} `markdown-body` string
   */
  async buildMd(e = {}) {
    const t = async () => {
      this.base = window.baseUrl;
      let i = new URL(this.src, this.base).href;
      console.log(i, 1);
      const r = await fetch(i);
      if (r.ok) {
        const s = await r.text();
        return console.log(window), d.parse(s, {
          ...e
        });
      } else
        return this.fire("zero-md-error", {
          msg: `[zero-md] HTTP error ${r.status} while fetching src`,
          status: r.status,
          src: i
        }), "";
    }, n = () => {
      const i = this.querySelector('script[type="text/markdown"]');
      if (!i)
        return "";
      const r = i.hasAttribute("data-dedent") ? this.dedent(i.text) : i.text;
      return d.parse(r, e);
    };
    return await t() || n();
  }
  /**
   * Returns 32-bit DJB2a hash in base36
   * @param {string} str
   * @returns {string}
   */
  getHash(e) {
    let t = 5381;
    for (let n = 0; n < e.length; n++)
      t = (t << 5) + t ^ e.charCodeAt(n);
    return (t >>> 0).toString(36);
  }
  /**
   * Insert or replace styles node in root from a HTML string. If there are external stylesheet
   * links, wait for them to load.
   * @param {string} html styles string
   * @returns {Promise<boolean|undefined>} returns true if stamped
   */
  async stampStyles(e) {
    const t = this.getHash(e), n = this.root.querySelector(".markdown-styles");
    if (n.getAttribute("data-hash") !== t) {
      n.setAttribute("data-hash", t);
      const i = this.makeNodes(e), r = [...i].filter(
        (s) => s.tagName === "LINK" && s.getAttribute("rel") === "stylesheet"
      );
      return n.innerHTML = "", n.append(...i), await Promise.all(r.map((s) => this.onload(s))).catch((s) => {
        this.fire("zero-md-error", {
          msg: "[zero-md] An external stylesheet failed to load",
          status: void 0,
          src: s.href
        });
      }), !0;
    }
  }
  /**
   * Insert or replace HTML body string into DOM
   * @param {string} html markdown-body string
   * @param {string[]} [classes] list of classes to apply to `.markdown-body` wrapper
   * @returns {Promise<boolean|undefined>} returns true if stamped
   */
  async stampBody(e, t) {
    const n = this.arrify(t), i = this.getHash(e + JSON.stringify(n)), r = this.root.querySelector(".markdown-body");
    if (r.getAttribute("data-hash") !== i) {
      r.setAttribute("data-hash", i), n.unshift("markdown-body"), r.setAttribute("class", n.join(" "));
      const s = this.makeNodes(e);
      return r.innerHTML = "", r.append(...s), await this.highlight(r), !0;
    }
  }
  async render(e = {}) {
    await this.waitForReady();
    const t = this.buildMd(e), n = await this.stampStyles(this.buildStyles());
    await this.tick();
    const i = await this.stampBody(await t, e.classes);
    this.fire("zero-md-rendered", { node: this, stamped: { styles: n, body: i } });
  }
}
customElements.define("zero-md", et);
export {
  et as ZeroMd
};
