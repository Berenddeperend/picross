var K = Object.defineProperty;
var T = Object.getOwnPropertySymbols;
var X = Object.prototype.hasOwnProperty,
  Y = Object.prototype.propertyIsEnumerable;
var $ = (e, t, n) =>
    t in e
      ? K(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
      : (e[t] = n),
  j = (e, t) => {
    for (var n in t || (t = {})) X.call(t, n) && $(e, n, t[n]);
    if (T) for (var n of T(t)) Y.call(t, n) && $(e, n, t[n]);
    return e;
  };
import {
  l as J,
  r as v,
  c as N,
  a as I,
  o as A,
  b as R,
  d as S,
  e as s,
  f as i,
  w as Q,
  g as x,
  F as w,
  h as C,
  u as g,
  n as L,
  i as G,
  j as q,
  t as O,
  k as W,
  m as Z,
  p as ee,
} from "./vendor.484b906f.js";
const te = function () {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const l of document.querySelectorAll('link[rel="modulepreload"]')) p(l);
  new MutationObserver((l) => {
    for (const a of l)
      if (a.type === "childList")
        for (const r of a.addedNodes)
          r.tagName === "LINK" && r.rel === "modulepreload" && p(r);
  }).observe(document, { childList: !0, subtree: !0 });
  function n(l) {
    const a = {};
    return (
      l.integrity && (a.integrity = l.integrity),
      l.referrerpolicy && (a.referrerPolicy = l.referrerpolicy),
      l.crossorigin === "use-credentials"
        ? (a.credentials = "include")
        : l.crossorigin === "anonymous"
        ? (a.credentials = "omit")
        : (a.credentials = "same-origin"),
      a
    );
  }
  function p(l) {
    if (l.ep) return;
    l.ep = !0;
    const a = n(l);
    fetch(l.href, a);
  }
};
te();
var ne = [
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", "d", "d", "d", "d", " ", " ", " "],
  [" ", " ", " ", "d", " ", " ", "d", " ", " ", " "],
  [" ", " ", " ", "d", " ", " ", "d", " ", " ", " "],
  [" ", " ", " ", "d", "d", "d", "d", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
];
const le = { transports: ["websocket"], upgrade: !1 },
  y = J("wss://berendswennenhuis.nl", j({ path: "/path/" }, le));
function V(e) {
  return e.reduce(
    (t, n, p, l) => (
      n === "d" &&
        (t.length > 0 && l[p - 1] === "d" ? t[t.length - 1]++ : t.push(1)),
      t
    ),
    []
  );
}
const h = 10,
  m = v(M(h)),
  B = v(ne),
  F = N(() => I.exports.isEqual(m.value, B.value));
v();
v();
function M(e) {
  return new Array(e).fill("").map((n) => new Array(e).fill(" "));
}
function re() {
  m.value = M(h);
}
function E(e) {
  return I.exports.clamp(e, 0, h - 1);
}
function oe(e) {
  return V(B.value[e]);
}
function se(e) {
  return V(B.value.map((t) => t[e]));
}
function D(e) {
  m.value = e;
}
function ie() {
  A(() => {
    y.on("gridUpdated", D);
  }),
    R(() => {
      y.off("gridUpdated", D);
    });
}
let c = v(null),
  d = v({});
const u = N(() => (c.value !== null ? d.value[c.value] : null)),
  ae = N(() => {
    var e;
    return (e = u == null ? void 0 : u.value) == null ? void 0 : e.position;
  });
function U(e) {
  c.value !== null &&
    (u.value.position,
    e === "left" &&
      (d.value[c.value].position[0] = E(d.value[c.value].position[0] - 1)),
    e === "right" &&
      (d.value[c.value].position[0] = E(d.value[c.value].position[0] + 1)),
    e === "up" &&
      (d.value[c.value].position[1] = E(d.value[c.value].position[1] - 1)),
    e === "down" &&
      (d.value[c.value].position[1] = E(d.value[c.value].position[1] + 1)),
    y.emit("cursorUpdated", u.value.position));
}
function H(e) {
  d.value = e;
}
function ue() {
  y.once("initPlayer", (e) => {
    c.value = e.id;
  });
}
function ce() {
  A(() => {
    y.on("playersStateUpdated", H);
  }),
    R(() => {
      y.off("playersStateUpdated", H);
    });
}
const k = v({ spacePressed: !1, intention: "build" });
function P(e) {
  if (F.value) return;
  m.value[u.value.position[1]][u.value.position[0]] === e
    ? ((k.value.intention = "clear"),
      (m.value[u.value.position[1]][u.value.position[0]] = " "))
    : ((k.value.intention = "build"),
      (m.value[u.value.position[1]][u.value.position[0]] = e)),
    y.emit("gridUpdated", m.value);
}
function de() {
  function e(t) {
    t.key === "ArrowLeft"
      ? (U("left"), k.value.spacePressed && P("d"))
      : t.key === "ArrowRight"
      ? (U("right"), k.value.spacePressed && P("d"))
      : t.key === "ArrowUp"
      ? (U("up"), k.value.spacePressed && P("d"))
      : t.key === "ArrowDown"
      ? (U("down"), k.value.spacePressed && P("d"))
      : t.key === "f"
      ? P("x")
      : t.key === " " && ((k.value.spacePressed = !0), P("d"));
  }
  A(() => {
    window.addEventListener("keydown", e),
      window.addEventListener("keyup", (t) => {
        t.key === " " && (k.value.spacePressed = !1);
      });
  }),
    R(() => {
      window.removeEventListener("keydown", e);
    });
}
const pe = S({
  setup(e) {
    function t() {
      re(), y.emit("gridUpdated", m.value), y.emit("suggestClear");
    }
    return (n, p) => (s(), i("button", { onClick: t }, "Clear"));
  },
});
const fe = { class: "optical-guide horizontal", ref: "guidehorizontal" },
  ve = { class: "optical-guide vertical", ref: "guidevertical" },
  _e = x("div", { class: "corner" }, null, -1),
  ge = { class: "legend horizontal", ref: "legendForColumns" },
  ye = { class: "legend vertical", ref: "legendForRows" },
  he = S({
    setup(e) {
      ue(), ce(), ie(), de();
      function t(r) {
        const f = r % h,
          _ = Math.floor(r / h);
        return [f, _];
      }
      function n(r) {
        var o;
        if (I.exports.isEqual(t(r), ae.value))
          return `
    box-shadow: 0px 0px 0px 2px ${(o = u.value) == null ? void 0 : o.color};
  `;
        const _ = Object.values(d.value).find((b) =>
          I.exports.isEqual(t(r), b.position)
        );
        return _ ? `box-shadow: 0px 0px 0px 2px ${_.color}` : void 0;
      }
      function p(r, f) {
        const [_, o] = t(r);
        return m.value[o][_] === f;
      }
      Q(F, (r) => {
        r &&
          (q({
            zIndex: -1,
            particleCount: 50,
            spread: 70,
            angle: 60,
            origin: { y: 0.6 },
          }),
          q({
            zIndex: -1,
            particleCount: 50,
            spread: 70,
            angle: 120,
            origin: { y: 0.6 },
          }));
      });
      function l(r) {
        var f;
        return ((f = u.value) == null ? void 0 : f.position[0]) === r;
      }
      function a(r) {
        var f;
        return ((f = u.value) == null ? void 0 : f.position[1]) === r;
      }
      return (r, f) => (
        s(),
        i(
          w,
          null,
          [
            x(
              "div",
              { class: L(["playfield-container", { cleared: g(F) }]) },
              [
                x("div", fe, null, 512),
                x("div", ve, null, 512),
                _e,
                x(
                  "div",
                  ge,
                  [
                    (s(!0),
                    i(
                      w,
                      null,
                      C(
                        g(h),
                        (_, o) => (
                          s(),
                          i(
                            "div",
                            {
                              class: L(["cell", { highlighted: l(o) }]),
                              key: o,
                            },
                            [
                              (s(!0),
                              i(
                                w,
                                null,
                                C(
                                  g(se)(o),
                                  (b, z) => (s(), i("div", { key: z }, O(b), 1))
                                ),
                                128
                              )),
                            ],
                            2
                          )
                        )
                      ),
                      128
                    )),
                  ],
                  512
                ),
                x(
                  "div",
                  ye,
                  [
                    (s(!0),
                    i(
                      w,
                      null,
                      C(
                        g(h),
                        (_, o) => (
                          s(),
                          i(
                            "div",
                            {
                              class: L(["cell", { highlighted: a(o) }]),
                              key: o,
                            },
                            [
                              (s(!0),
                              i(
                                w,
                                null,
                                C(
                                  g(oe)(o),
                                  (b, z) => (s(), i("div", { key: z }, O(b), 1))
                                ),
                                128
                              )),
                            ],
                            2
                          )
                        )
                      ),
                      128
                    )),
                  ],
                  512
                ),
                (s(!0),
                i(
                  w,
                  null,
                  C(
                    g(h) * g(h),
                    (_, o) => (
                      s(),
                      i(
                        "div",
                        {
                          class: L([
                            "cell",
                            { filled: p(o, "d"), flagged: p(o, "x") },
                          ]),
                          key: o,
                          style: W(n(o)),
                        },
                        null,
                        6
                      )
                    )
                  ),
                  128
                )),
              ],
              2
            ),
            G(pe),
          ],
          64
        )
      );
    },
  });
var me = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [p, l] of t) n[p] = l;
  return n;
};
const we = S({
  setup(e) {
    const t = v([]),
      n = v(null);
    v(""),
      A(() => {
        console.log("-> inputRef", n);
      });
    function p(l) {
      return l.id === c.value;
    }
    return (l, a) => (
      s(),
      i("header", null, [
        Z(" Now playing: (" + O(Object.values(g(d)).length) + "): ", 1),
        x("ul", null, [
          (s(!0),
          i(
            w,
            null,
            C(
              g(d),
              (r) => (
                s(),
                i(
                  "li",
                  {
                    class: L([{ "current-player": p(r) }, r.id]),
                    ref_for: !0,
                    ref_key: "playersRef",
                    ref: t,
                  },
                  O(r.name),
                  3
                )
              )
            ),
            256
          )),
        ]),
      ])
    );
  },
});
var ke = me(we, [["__scopeId", "data-v-274f97a7"]]);
const xe = S({
  setup(e) {
    return (t, n) => (s(), i(w, null, [G(ke), G(he)], 64));
  },
});
ee(xe).mount("#app");
