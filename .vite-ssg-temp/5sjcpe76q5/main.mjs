import { createHooks } from "hookable";
import { isRef, toValue, defineComponent, ref, onMounted, createSSRApp, mergeProps, useSSRContext, onUnmounted, resolveComponent, computed } from "vue";
import { createRouter, createMemoryHistory, useRoute } from "vue-router";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderComponent, ssrRenderStyle, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass } from "vue/server-renderer";
import { useHead } from "@vueuse/head";
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator, addDoc, collection, serverTimestamp } from "firebase/firestore";
const DupeableTags = /* @__PURE__ */ new Set(["link", "style", "script", "noscript"]);
const TagsWithInnerContent = /* @__PURE__ */ new Set(["title", "titleTemplate", "script", "style", "noscript"]);
const ValidHeadTags = /* @__PURE__ */ new Set([
  "title",
  "base",
  "htmlAttrs",
  "bodyAttrs",
  "meta",
  "link",
  "style",
  "script",
  "noscript"
]);
const UniqueTags = /* @__PURE__ */ new Set(["base", "title", "titleTemplate", "bodyAttrs", "htmlAttrs", "templateParams"]);
const TagConfigKeys = /* @__PURE__ */ new Set(["key", "tagPosition", "tagPriority", "tagDuplicateStrategy", "innerHTML", "textContent", "processTemplateParams"]);
const UsesMergeStrategy = /* @__PURE__ */ new Set(["templateParams", "htmlAttrs", "bodyAttrs"]);
const MetaTagsArrayable = /* @__PURE__ */ new Set([
  "theme-color",
  "google-site-verification",
  "og",
  "article",
  "book",
  "profile",
  "twitter",
  "author"
]);
const allowedMetaProperties = ["name", "property", "http-equiv"];
const StandardSingleMetaTags = /* @__PURE__ */ new Set([
  "viewport",
  "description",
  "keywords",
  "robots"
]);
function isMetaArrayDupeKey(v) {
  const parts = v.split(":");
  if (!parts.length)
    return false;
  return MetaTagsArrayable.has(parts[1]);
}
function dedupeKey(tag) {
  const { props, tag: name } = tag;
  if (UniqueTags.has(name))
    return name;
  if (name === "link" && props.rel === "canonical")
    return "canonical";
  if (props.charset)
    return "charset";
  if (tag.tag === "meta") {
    for (const n of allowedMetaProperties) {
      if (props[n] !== void 0) {
        const propValue = props[n];
        const isStructured = propValue && typeof propValue === "string" && propValue.includes(":");
        const isStandardSingle = propValue && StandardSingleMetaTags.has(propValue);
        const shouldAlwaysDedupe = isStructured || isStandardSingle;
        const keyPart = !shouldAlwaysDedupe && tag.key ? `:key:${tag.key}` : "";
        return `${name}:${propValue}${keyPart}`;
      }
    }
  }
  if (tag.key) {
    return `${name}:key:${tag.key}`;
  }
  if (props.id) {
    return `${name}:id:${props.id}`;
  }
  if (TagsWithInnerContent.has(name)) {
    const v = tag.textContent || tag.innerHTML;
    if (v) {
      return `${name}:content:${v}`;
    }
  }
}
function walkResolver(val, resolve, key) {
  const type = typeof val;
  if (type === "function") {
    if (!key || key !== "titleTemplate" && !(key[0] === "o" && key[1] === "n")) {
      val = val();
    }
  }
  const v = resolve ? resolve(key, val) : val;
  if (Array.isArray(v)) {
    return v.map((r) => walkResolver(r, resolve));
  }
  if (v?.constructor === Object) {
    const next = {};
    for (const k of Object.keys(v)) {
      next[k] = walkResolver(v[k], resolve, k);
    }
    return next;
  }
  return v;
}
function normalizeStyleClassProps(key, value) {
  const store = key === "style" ? /* @__PURE__ */ new Map() : /* @__PURE__ */ new Set();
  function processValue(rawValue) {
    if (rawValue == null || rawValue === void 0)
      return;
    const value2 = String(rawValue).trim();
    if (!value2)
      return;
    if (key === "style") {
      const [k, ...v] = value2.split(":").map((s) => s ? s.trim() : "");
      if (k && v.length)
        store.set(k, v.join(":"));
    } else {
      value2.split(" ").filter(Boolean).forEach((c) => store.add(c));
    }
  }
  if (typeof value === "string") {
    key === "style" ? value.split(";").forEach(processValue) : processValue(value);
  } else if (Array.isArray(value)) {
    value.forEach((item) => processValue(item));
  } else if (value && typeof value === "object") {
    Object.entries(value).forEach(([k, v]) => {
      if (v && v !== "false") {
        key === "style" ? store.set(String(k).trim(), String(v)) : processValue(k);
      }
    });
  }
  return store;
}
function normalizeProps(tag, input) {
  tag.props = tag.props || {};
  if (!input) {
    return tag;
  }
  if (tag.tag === "templateParams") {
    tag.props = input;
    return tag;
  }
  Object.entries(input).forEach(([key, value]) => {
    if (value === null) {
      tag.props[key] = null;
      return;
    }
    if (key === "class" || key === "style") {
      tag.props[key] = normalizeStyleClassProps(key, value);
      return;
    }
    if (TagConfigKeys.has(key)) {
      if (["textContent", "innerHTML"].includes(key) && typeof value === "object") {
        let type = input.type;
        if (!input.type) {
          type = "application/json";
        }
        if (!type?.endsWith("json") && type !== "speculationrules") {
          return;
        }
        input.type = type;
        tag.props.type = type;
        tag[key] = JSON.stringify(value);
      } else {
        tag[key] = value;
      }
      return;
    }
    const strValue = String(value);
    const isDataKey = key.startsWith("data-");
    const isMetaContentKey = tag.tag === "meta" && key === "content";
    if (strValue === "true" || strValue === "") {
      tag.props[key] = isDataKey || isMetaContentKey ? strValue : true;
    } else if (!value && isDataKey && strValue === "false") {
      tag.props[key] = "false";
    } else if (value !== void 0) {
      tag.props[key] = value;
    }
  });
  return tag;
}
function normalizeTag(tagName, _input) {
  const input = typeof _input === "object" && typeof _input !== "function" ? _input : { [tagName === "script" || tagName === "noscript" || tagName === "style" ? "innerHTML" : "textContent"]: _input };
  const tag = normalizeProps({ tag: tagName, props: {} }, input);
  if (tag.key && DupeableTags.has(tag.tag)) {
    tag.props["data-hid"] = tag._h = tag.key;
  }
  if (tag.tag === "script" && typeof tag.innerHTML === "object") {
    tag.innerHTML = JSON.stringify(tag.innerHTML);
    tag.props.type = tag.props.type || "application/json";
  }
  return Array.isArray(tag.props.content) ? tag.props.content.map((v) => ({ ...tag, props: { ...tag.props, content: v } })) : tag;
}
function normalizeEntryToTags(input, propResolvers) {
  if (!input) {
    return [];
  }
  if (typeof input === "function") {
    input = input();
  }
  const resolvers = (key, val) => {
    for (let i = 0; i < propResolvers.length; i++) {
      val = propResolvers[i](key, val);
    }
    return val;
  };
  input = resolvers(void 0, input);
  const tags = [];
  input = walkResolver(input, resolvers);
  Object.entries(input || {}).forEach(([key, value]) => {
    if (value === void 0)
      return;
    for (const v of Array.isArray(value) ? value : [value])
      tags.push(normalizeTag(key, v));
  });
  return tags.flat();
}
const sortTags = (a, b) => a._w === b._w ? a._p - b._p : a._w - b._w;
const TAG_WEIGHTS = {
  base: -10,
  title: 10
};
const TAG_ALIASES = {
  critical: -8,
  high: -1,
  low: 2
};
const WEIGHT_MAP = {
  meta: {
    "content-security-policy": -30,
    "charset": -20,
    "viewport": -15
  },
  link: {
    "preconnect": 20,
    "stylesheet": 60,
    "preload": 70,
    "modulepreload": 70,
    "prefetch": 90,
    "dns-prefetch": 90,
    "prerender": 90
  },
  script: {
    async: 30,
    defer: 80,
    sync: 50
  },
  style: {
    imported: 40,
    sync: 60
  }
};
const ImportStyleRe = /@import/;
const isTruthy = (val) => val === "" || val === true;
function tagWeight(head, tag) {
  if (typeof tag.tagPriority === "number")
    return tag.tagPriority;
  let weight = 100;
  const offset = TAG_ALIASES[tag.tagPriority] || 0;
  const weightMap = head.resolvedOptions.disableCapoSorting ? {
    link: {},
    script: {},
    style: {}
  } : WEIGHT_MAP;
  if (tag.tag in TAG_WEIGHTS) {
    weight = TAG_WEIGHTS[tag.tag];
  } else if (tag.tag === "meta") {
    const metaType = tag.props["http-equiv"] === "content-security-policy" ? "content-security-policy" : tag.props.charset ? "charset" : tag.props.name === "viewport" ? "viewport" : null;
    if (metaType)
      weight = WEIGHT_MAP.meta[metaType];
  } else if (tag.tag === "link" && tag.props.rel) {
    weight = weightMap.link[tag.props.rel];
  } else if (tag.tag === "script") {
    const type = String(tag.props.type);
    if (isTruthy(tag.props.async)) {
      weight = weightMap.script.async;
    } else if (tag.props.src && !isTruthy(tag.props.defer) && !isTruthy(tag.props.async) && type !== "module" && !type.endsWith("json") || tag.innerHTML && !type.endsWith("json")) {
      weight = weightMap.script.sync;
    } else if (isTruthy(tag.props.defer) && tag.props.src && !isTruthy(tag.props.async) || type === "module") {
      weight = weightMap.script.defer;
    }
  } else if (tag.tag === "style") {
    weight = tag.innerHTML && ImportStyleRe.test(tag.innerHTML) ? weightMap.style.imported : weightMap.style.sync;
  }
  return (weight || 100) + offset;
}
function registerPlugin(head, p) {
  const plugin = typeof p === "function" ? p(head) : p;
  const key = plugin.key || String(head.plugins.size + 1);
  const exists = head.plugins.get(key);
  if (!exists) {
    head.plugins.set(key, plugin);
    head.hooks.addHooks(plugin.hooks || {});
  }
}
// @__NO_SIDE_EFFECTS__
function createUnhead(resolvedOptions = {}) {
  const hooks = createHooks();
  hooks.addHooks(resolvedOptions.hooks || {});
  const ssr = !resolvedOptions.document;
  const entries = /* @__PURE__ */ new Map();
  const plugins = /* @__PURE__ */ new Map();
  const normalizeQueue = /* @__PURE__ */ new Set();
  const head = {
    _entryCount: 1,
    // 0 is reserved for internal use
    plugins,
    dirty: false,
    resolvedOptions,
    hooks,
    ssr,
    entries,
    headEntries() {
      return [...entries.values()];
    },
    use: (p) => registerPlugin(head, p),
    push(input, _options) {
      const options = { ..._options || {} };
      delete options.head;
      const _i = options._index ?? head._entryCount++;
      const inst = { _i, input, options };
      const _ = {
        _poll(rm = false) {
          head.dirty = true;
          !rm && normalizeQueue.add(_i);
          hooks.callHook("entries:updated", head);
        },
        dispose() {
          if (entries.delete(_i)) {
            head.invalidate();
          }
        },
        // a patch is the same as creating a new entry, just a nice DX
        patch(input2) {
          if (!options.mode || options.mode === "server" && ssr || options.mode === "client" && !ssr) {
            inst.input = input2;
            entries.set(_i, inst);
            _._poll();
          }
        }
      };
      _.patch(input);
      return _;
    },
    async resolveTags() {
      const ctx = {
        tagMap: /* @__PURE__ */ new Map(),
        tags: [],
        entries: [...head.entries.values()]
      };
      await hooks.callHook("entries:resolve", ctx);
      while (normalizeQueue.size) {
        const i = normalizeQueue.values().next().value;
        normalizeQueue.delete(i);
        const e = entries.get(i);
        if (e) {
          const normalizeCtx = {
            tags: normalizeEntryToTags(e.input, resolvedOptions.propResolvers || []).map((t) => Object.assign(t, e.options)),
            entry: e
          };
          await hooks.callHook("entries:normalize", normalizeCtx);
          e._tags = normalizeCtx.tags.map((t, i2) => {
            t._w = tagWeight(head, t);
            t._p = (e._i << 10) + i2;
            t._d = dedupeKey(t);
            return t;
          });
        }
      }
      let hasFlatMeta = false;
      ctx.entries.flatMap((e) => (e._tags || []).map((t) => ({ ...t, props: { ...t.props } }))).sort(sortTags).reduce((acc, next) => {
        const k = String(next._d || next._p);
        if (!acc.has(k))
          return acc.set(k, next);
        const prev = acc.get(k);
        const strategy = next?.tagDuplicateStrategy || (UsesMergeStrategy.has(next.tag) ? "merge" : null) || (next.key && next.key === prev.key ? "merge" : null);
        if (strategy === "merge") {
          const newProps = { ...prev.props };
          Object.entries(next.props).forEach(([p, v]) => (
            // @ts-expect-error untyped
            newProps[p] = p === "style" ? new Map([...prev.props.style || /* @__PURE__ */ new Map(), ...v]) : p === "class" ? /* @__PURE__ */ new Set([...prev.props.class || /* @__PURE__ */ new Set(), ...v]) : v
          ));
          acc.set(k, { ...next, props: newProps });
        } else if (next._p >> 10 === prev._p >> 10 && next.tag === "meta" && isMetaArrayDupeKey(k)) {
          acc.set(k, Object.assign([...Array.isArray(prev) ? prev : [prev], next], next));
          hasFlatMeta = true;
        } else if (next._w === prev._w ? next._p > prev._p : next?._w < prev?._w) {
          acc.set(k, next);
        }
        return acc;
      }, ctx.tagMap);
      const title = ctx.tagMap.get("title");
      const titleTemplate = ctx.tagMap.get("titleTemplate");
      head._title = title?.textContent;
      if (titleTemplate) {
        const titleTemplateFn = titleTemplate?.textContent;
        head._titleTemplate = titleTemplateFn;
        if (titleTemplateFn) {
          let newTitle = typeof titleTemplateFn === "function" ? titleTemplateFn(title?.textContent) : titleTemplateFn;
          if (typeof newTitle === "string" && !head.plugins.has("template-params")) {
            newTitle = newTitle.replace("%s", title?.textContent || "");
          }
          if (title) {
            newTitle === null ? ctx.tagMap.delete("title") : ctx.tagMap.set("title", { ...title, textContent: newTitle });
          } else {
            titleTemplate.tag = "title";
            titleTemplate.textContent = newTitle;
          }
        }
      }
      ctx.tags = Array.from(ctx.tagMap.values());
      if (hasFlatMeta) {
        ctx.tags = ctx.tags.flat().sort(sortTags);
      }
      await hooks.callHook("tags:beforeResolve", ctx);
      await hooks.callHook("tags:resolve", ctx);
      await hooks.callHook("tags:afterResolve", ctx);
      const finalTags = [];
      for (const t of ctx.tags) {
        const { innerHTML, tag, props } = t;
        if (!ValidHeadTags.has(tag)) {
          continue;
        }
        if (Object.keys(props).length === 0 && !t.innerHTML && !t.textContent) {
          continue;
        }
        if (tag === "meta" && !props.content && !props["http-equiv"] && !props.charset) {
          continue;
        }
        if (tag === "script" && innerHTML) {
          if (String(props.type).endsWith("json")) {
            const v = typeof innerHTML === "string" ? innerHTML : JSON.stringify(innerHTML);
            t.innerHTML = v.replace(/</g, "\\u003C");
          } else if (typeof innerHTML === "string") {
            t.innerHTML = innerHTML.replace(new RegExp(`</${tag}`, "g"), `<\\/${tag}`);
          }
          t._d = dedupeKey(t);
        }
        finalTags.push(t);
      }
      return finalTags;
    },
    invalidate() {
      for (const entry of entries.values()) {
        normalizeQueue.add(entry._i);
      }
      head.dirty = true;
      hooks.callHook("entries:updated", head);
    }
  };
  (resolvedOptions?.plugins || []).forEach((p) => registerPlugin(head, p));
  head.hooks.callHook("init", head);
  resolvedOptions.init?.forEach((e) => e && head.push(e));
  return head;
}
const VueResolver = (_, value) => {
  return isRef(value) ? toValue(value) : value;
};
const headSymbol = "usehead";
// @__NO_SIDE_EFFECTS__
function vueInstall(head) {
  const plugin = {
    install(app) {
      app.config.globalProperties.$unhead = head;
      app.config.globalProperties.$head = head;
      app.provide(headSymbol, head);
    }
  };
  return plugin.install;
}
// @__NO_SIDE_EFFECTS__
function createHead$1(options = {}) {
  const unhead = /* @__PURE__ */ createUnhead({
    ...options,
    // @ts-expect-error untyped
    document: false,
    propResolvers: [
      ...options.propResolvers || [],
      (k, v) => {
        if (k && k.startsWith("on") && typeof v === "function") {
          return `this.dataset.${k}fired = true`;
        }
        return v;
      }
    ],
    init: [
      options.disableDefaults ? void 0 : {
        htmlAttrs: {
          lang: "en"
        },
        meta: [
          {
            charset: "utf-8"
          },
          {
            name: "viewport",
            content: "width=device-width, initial-scale=1"
          }
        ]
      },
      ...options.init || []
    ]
  });
  unhead._ssrPayload = {};
  unhead.use({
    key: "server",
    hooks: {
      "tags:resolve": function(ctx) {
        const title = ctx.tagMap.get("title");
        const titleTemplate = ctx.tagMap.get("titleTemplate");
        let payload = {
          title: title?.mode === "server" ? unhead._title : void 0,
          titleTemplate: titleTemplate?.mode === "server" ? unhead._titleTemplate : void 0
        };
        if (Object.keys(unhead._ssrPayload || {}).length > 0) {
          payload = {
            ...unhead._ssrPayload,
            ...payload
          };
        }
        if (Object.values(payload).some(Boolean)) {
          ctx.tags.push({
            tag: "script",
            innerHTML: JSON.stringify(payload),
            props: { id: "unhead:payload", type: "application/json" }
          });
        }
      }
    }
  });
  return unhead;
}
// @__NO_SIDE_EFFECTS__
function createHead(options = {}) {
  const head = /* @__PURE__ */ createHead$1({
    ...options,
    propResolvers: [VueResolver]
  });
  head.install = /* @__PURE__ */ vueInstall(head);
  return head;
}
const ClientOnly = defineComponent({
  setup(props, { slots }) {
    const mounted = ref(false);
    onMounted(() => mounted.value = true);
    return () => {
      if (!mounted.value)
        return slots.placeholder && slots.placeholder({});
      return slots.default && slots.default({});
    };
  }
});
function ViteSSG(App, routerOptions, fn, options) {
  const {
    transformState,
    registerComponents = true,
    useHead: useHead2 = true,
    rootContainer = "#app"
  } = {};
  async function createApp$1(routePath) {
    const app = createSSRApp(App);
    let head;
    if (useHead2) {
      app.use(head = /* @__PURE__ */ createHead());
    }
    const router = createRouter({
      history: createMemoryHistory(routerOptions.base),
      ...routerOptions
    });
    const { routes: routes2 } = routerOptions;
    if (registerComponents)
      app.component("ClientOnly", ClientOnly);
    const appRenderCallbacks = [];
    const onSSRAppRendered = (cb) => appRenderCallbacks.push(cb);
    const triggerOnSSRAppRendered = () => {
      return Promise.all(appRenderCallbacks.map((cb) => cb()));
    };
    const context = {
      app,
      head,
      isClient: false,
      router,
      routes: routes2,
      onSSRAppRendered,
      triggerOnSSRAppRendered,
      initialState: {},
      transformState,
      routePath
    };
    await fn?.(context);
    app.use(router);
    let entryRoutePath;
    let isFirstRoute = true;
    router.beforeEach((to, from, next) => {
      if (isFirstRoute || entryRoutePath && entryRoutePath === to.path) {
        isFirstRoute = false;
        entryRoutePath = to.path;
        to.meta.state = context.initialState;
      }
      next();
    });
    {
      const route = context.routePath ?? "/";
      router.push(route);
      await router.isReady();
      context.initialState = router.currentRoute.value.meta.state || {};
    }
    const initialState = context.initialState;
    return {
      ...context,
      initialState
    };
  }
  return createApp$1;
}
const _sfc_main$o = {
  setup() {
    const activeDropdown = ref(null);
    const navItems = ref([
      { name: "About us", link: "#" },
      { name: "Services", link: "#" },
      { name: "Solutions", link: "#" },
      { name: "Network", link: "#" },
      { name: "Explore", link: "#" }
    ]);
    const toggleDropdown = (index) => {
      activeDropdown.value = activeDropdown.value === index ? null : index;
    };
    return {
      navItems,
      activeDropdown,
      toggleDropdown
    };
  }
};
const _imports_0$1 = "/ALSA_LOGO.svg";
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
function _sfc_ssrRender$l(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<header${ssrRenderAttrs(mergeProps({ class: "fixed top-4 left-0 right-0 z-50 px-4 flex justify-center w-full" }, _attrs))} data-v-f72e9f25><div class="md:hidden flex justify-between items-center w-full" data-v-f72e9f25><div class="flex items-center gap-3" data-v-f72e9f25><button class="w-12 h-12 rounded-full bg-black/60 border border-white/10 backdrop-blur-md flex flex-col gap-1.5 items-center justify-center shadow-lg active:scale-95 transition-transform" data-v-f72e9f25><span class="w-5 h-0.5 bg-gray-200 rounded-full" data-v-f72e9f25></span><span class="w-5 h-0.5 bg-gray-200 rounded-full" data-v-f72e9f25></span><span class="w-5 h-0.5 bg-gray-200 rounded-full" data-v-f72e9f25></span></button><a href="tel:+919777995101" class="w-12 h-12 rounded-full bg-black/60 border border-white/10 backdrop-blur-md flex items-center justify-center shadow-lg active:scale-95 transition-transform" data-v-f72e9f25><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500 fill-current" viewBox="0 0 24 24" data-v-f72e9f25><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 1.23 0 2.45.2 3.57.57.35.13.74.04 1.02-.24l2.2 2.2z" data-v-f72e9f25></path></svg></a></div><a href="/" class="flex items-center gap-3 bg-black/30 px-3 py-1.5 rounded-xl backdrop-blur-sm" data-v-f72e9f25><img${ssrRenderAttr("src", _imports_0$1)} alt="ALSA" class="h-10 w-auto object-contain drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" data-v-f72e9f25><div class="text-left leading-none" data-v-f72e9f25><h1 class="text-white font-bold text-[0.55rem] tracking-wider font-copperplate" data-v-f72e9f25> AYUSHMAAN<br data-v-f72e9f25>LIFE SUPPORT<br data-v-f72e9f25>AMBULANCE® </h1></div></a></div><div class="hidden md:flex header-pill rounded-full px-6 py-3 items-center justify-between w-full max-w-6xl" data-v-f72e9f25><div class="flex items-center gap-3" data-v-f72e9f25><a href="/" class="flex items-center gap-3" data-v-f72e9f25><img${ssrRenderAttr("src", _imports_0$1)} alt="Ayushmaan Life Support Ambulance" class="h-12 w-auto object-contain" data-v-f72e9f25><div class="text-left leading-tight hidden md:block" data-v-f72e9f25><h1 class="text-white font-bold text-[0.65rem] tracking-wide" data-v-f72e9f25>AYUSHMAAN<br data-v-f72e9f25>LIFE SUPPORT<br data-v-f72e9f25>AMBULANCE®</h1></div></a></div><nav class="hidden md:flex items-center gap-8 text-gray-300 text-sm font-medium" data-v-f72e9f25><!--[-->`);
  ssrRenderList(_ctx.navItems, (item, index) => {
    _push(`<div class="relative group cursor-pointer" data-v-f72e9f25><div class="nav-link flex items-center gap-1 hover:text-white transition-colors duration-300" data-v-f72e9f25>${ssrInterpolate(item.name)} <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 opacity-70 group-hover:opacity-100 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-f72e9f25><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-v-f72e9f25></path></svg></div>`);
    if (_ctx.activeDropdown === index) {
      _push(`<div class="absolute top-full left-0 mt-4 w-40 bg-gray-900/90 backdrop-blur-md rounded-xl border border-gray-700 p-2 shadow-xl animate-fade-in" data-v-f72e9f25><div class="text-xs text-gray-500 p-2" data-v-f72e9f25>Submenu for ${ssrInterpolate(item.name)}</div></div>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div>`);
  });
  _push(`<!--]--></nav><div class="liquid-button cursor-pointer" data-v-f72e9f25><span class="text-red-600 font-bold tracking-widest text-sm glow-text uppercase" data-v-f72e9f25> Emergency Call </span></div></div></header>`);
}
const _sfc_setup$o = _sfc_main$o.setup;
_sfc_main$o.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/Header/Header.vue");
  return _sfc_setup$o ? _sfc_setup$o(props, ctx) : void 0;
};
const Header = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["ssrRender", _sfc_ssrRender$l], ["__scopeId", "data-v-f72e9f25"]]);
const _sfc_main$n = {
  __name: "App",
  __ssrInlineRender: true,
  setup(__props) {
    const isScrolled = ref(false);
    const handleScroll = () => {
      isScrolled.value = window.scrollY > 50;
    };
    onMounted(() => {
      window.addEventListener("scroll", handleScroll);
    });
    onUnmounted(() => {
      window.removeEventListener("scroll", handleScroll);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_view = resolveComponent("router-view");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "antialiased text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900" }, _attrs))}>`);
      _push(ssrRenderComponent(Header, null, null, _parent));
      _push(ssrRenderComponent(_component_router_view, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$n = _sfc_main$n.setup;
_sfc_main$n.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/App.vue");
  return _sfc_setup$n ? _sfc_setup$n(props, ctx) : void 0;
};
const firebaseConfig = {
  apiKey: "demo-key",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
let db;
try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  if (location.hostname === "localhost") {
    connectFirestoreEmulator(db, "localhost", 8080);
    console.log("Main App Connected to Firestore Emulator");
  }
} catch (e) {
  console.error("Firebase init error", e);
}
const EnquiryService = {
  async submitEnquiry(enquiryData) {
    try {
      if (!db) {
        console.warn("Database not initialized, retrying...");
        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        if (location.hostname === "localhost") {
          connectFirestoreEmulator(db, "localhost", 8080);
        }
      }
      const docRef = await addDoc(collection(db, "enquiries"), {
        ...enquiryData,
        createdAt: serverTimestamp()
      });
      console.log("Enquiry submitted with ID: ", docRef.id);
      return { id: docRef.id, succes: true };
    } catch (error) {
      console.error("Enquiry Submission Error:", error);
      throw error;
    }
  }
};
const _sfc_main$m = {
  setup() {
    const pickup = ref("");
    const destination = ref("");
    const mobileNumber = ref("");
    const ambulanceType = ref("");
    const loading = ref(false);
    const errorMessage = ref("");
    const successMessage = ref("");
    const ambulanceTypes = [
      "Basic Life Support (BLS)",
      "Advanced Life Support (ALS)",
      "ICU Ambulance",
      "Patient Transport",
      "Mortuary Van"
    ];
    const getGeolocation = () => {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error("Geolocation not supported"));
        } else {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              });
            },
            (error) => {
              console.warn("Geolocation failed, defaulting to 0,0", error);
              resolve({ latitude: 0, longitude: 0 });
            },
            { timeout: 5e3 }
          );
        }
      });
    };
    const handleEstimate = async () => {
      loading.value = true;
      errorMessage.value = "";
      successMessage.value = "";
      if (!mobileNumber.value) {
        errorMessage.value = "Please enter your mobile number.";
        loading.value = false;
        alert("Please enter your mobile number.");
        return;
      }
      try {
        const location2 = await getGeolocation();
        const enquiryData = {
          callerId: mobileNumber.value.startsWith("+") ? mobileNumber.value : `+91${mobileNumber.value}`,
          // Basic formatting
          location: {
            latitude: location2.latitude,
            longitude: location2.longitude,
            address: `Pickup: ${pickup.value}, Drop: ${destination.value}, Type: ${ambulanceType.value}`
          }
        };
        await EnquiryService.submitEnquiry(enquiryData);
        successMessage.value = "Enquiry submitted successfully! We will call you shortly.";
        alert("Enquiry submitted successfully! We will call you shortly.");
        handleReset();
      } catch (error) {
        errorMessage.value = error.message || "Failed to submit enquiry.";
        alert(`Error: ${errorMessage.value}`);
      } finally {
        loading.value = false;
      }
    };
    const handleReset = () => {
      pickup.value = "";
      destination.value = "";
      mobileNumber.value = "";
      ambulanceType.value = "";
      errorMessage.value = "";
      successMessage.value = "";
    };
    const handleCall = () => {
      window.location.href = "tel:8802020245";
    };
    return {
      pickup,
      destination,
      mobileNumber,
      ambulanceType,
      ambulanceTypes,
      handleEstimate,
      handleReset,
      handleCall,
      loading
    };
  }
};
const _imports_0 = "/info_section_icon_png/Arrow-1.svg";
function _sfc_ssrRender$k(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "hero-section relative w-full overflow-hidden text-white" }, _attrs))} data-v-b9cfcb3c><div class="md:hidden relative min-h-screen flex flex-col pt-24 pb-8 bg-[#0B1215]" data-v-b9cfcb3c><div class="absolute inset-0 z-0 opacity-30 bg-cover bg-center" style="${ssrRenderStyle({ "background-image": "url('/Hero_page_gif.webp')", "filter": "grayscale(100%) contrast(1.2) brightness(0.5)" })}" data-v-b9cfcb3c></div><div class="container mx-auto px-4 z-10 flex-1 flex flex-col justify-center items-center gap-6" data-v-b9cfcb3c><div class="flex items-center gap-2 mb-2" data-v-b9cfcb3c><span class="relative flex h-3 w-3" data-v-b9cfcb3c><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" data-v-b9cfcb3c></span><span class="relative inline-flex rounded-full h-3 w-3 bg-red-600" data-v-b9cfcb3c></span></span><span class="text-gray-200 text-sm font-bold tracking-wide" data-v-b9cfcb3c>24/7 Available</span></div><div class="bg-[#1A2320] border border-white/10 p-5 rounded-[2rem] w-full max-w-[340px] shadow-2xl backdrop-blur-md relative overflow-hidden animate-fade-in-up" data-v-b9cfcb3c><div class="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" data-v-b9cfcb3c></div><h3 class="text-xl font-black mb-6 uppercase tracking-wide leading-tight text-white text-center" data-v-b9cfcb3c> Get Quick Ambulance <br data-v-b9cfcb3c><span class="text-gray-400" data-v-b9cfcb3c>Cost Instantly...</span></h3><form class="space-y-4" data-v-b9cfcb3c><div class="bg-white/5 border border-white/10 flex items-center px-4 h-[50px] rounded-full focus-within:border-green-500/50 transition-colors" data-v-b9cfcb3c><input${ssrRenderAttr("value", _ctx.pickup)} type="text" placeholder="Enter Pickup Address or area" class="w-full outline-none text-xs placeholder-gray-500 bg-transparent text-gray-200" data-v-b9cfcb3c><span class="text-green-500 ml-2" data-v-b9cfcb3c><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-b9cfcb3c><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" data-v-b9cfcb3c></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" data-v-b9cfcb3c></path></svg></span></div><div class="bg-white/5 border border-white/10 flex items-center px-4 h-[50px] rounded-full focus-within:border-green-500/50 transition-colors" data-v-b9cfcb3c><input${ssrRenderAttr("value", _ctx.destination)} type="text" placeholder="Enter Destination" class="w-full outline-none text-xs placeholder-gray-500 bg-transparent text-gray-200" data-v-b9cfcb3c><span class="text-green-500 ml-2" data-v-b9cfcb3c><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-b9cfcb3c><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" data-v-b9cfcb3c></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" data-v-b9cfcb3c></path></svg></span></div><div class="bg-white/5 border border-white/10 flex items-center px-4 h-[50px] rounded-full focus-within:border-green-500/50 transition-colors" data-v-b9cfcb3c><input${ssrRenderAttr("value", _ctx.mobileNumber)} type="tel" placeholder="Enter Mobile Number" class="w-full outline-none text-xs placeholder-gray-500 bg-transparent text-gray-200" data-v-b9cfcb3c><span class="text-green-500 ml-2 text-sm" data-v-b9cfcb3c>📞</span></div><div class="bg-white/5 border border-white/10 px-4 h-[50px] flex items-center rounded-full relative" data-v-b9cfcb3c><select class="w-full outline-none text-xs bg-transparent border-none text-gray-400 appearance-none cursor-pointer" data-v-b9cfcb3c><option value="" disabled selected data-v-b9cfcb3c>Ambulance Type</option><!--[-->`);
  ssrRenderList(_ctx.ambulanceTypes, (type) => {
    _push(`<option${ssrRenderAttr("value", type)} class="text-black" data-v-b9cfcb3c${ssrIncludeBooleanAttr(Array.isArray(_ctx.ambulanceType) ? ssrLooseContain(_ctx.ambulanceType, type) : ssrLooseEqual(_ctx.ambulanceType, type)) ? " selected" : ""}>${ssrInterpolate(type)}</option>`);
  });
  _push(`<!--]--></select><div class="pointer-events-none absolute right-4 flex items-center text-gray-500" data-v-b9cfcb3c><svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" data-v-b9cfcb3c><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" data-v-b9cfcb3c></path></svg></div></div><div class="flex gap-3 pt-2" data-v-b9cfcb3c><button type="submit"${ssrIncludeBooleanAttr(_ctx.loading) ? " disabled" : ""} class="flex-1 bg-[#4DA959] hover:bg-[#3d8b46] text-white font-bold h-[48px] rounded-full shadow-lg transition flex items-center justify-between px-2 disabled:opacity-70 group" data-v-b9cfcb3c><div class="w-8 h-8 rounded-full bg-[#1a3125] flex items-center justify-center group-hover:bg-[#254233] transition-colors" data-v-b9cfcb3c><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-b9cfcb3c><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" data-v-b9cfcb3c></path></svg></div><span class="text-xs flex-1 text-center pr-2" data-v-b9cfcb3c>See Estimated Fare</span></button><button type="button" class="w-[90px] h-[48px] rounded-full border border-gray-600 bg-transparent hover:bg-white/5 text-gray-300 font-semibold transition flex items-center justify-center gap-2" data-v-b9cfcb3c><span class="text-xs" data-v-b9cfcb3c>Reset</span><span class="text-green-500 text-xs" data-v-b9cfcb3c>↻</span></button></div><p class="text-[10px] text-center text-gray-500 mt-3 leading-tight px-1" data-v-b9cfcb3c><span class="text-gray-400 font-bold" data-v-b9cfcb3c>Note:</span> This is an estimated fare as per your requirements. For exact pricing, Call us at <a href="tel:8802020245" class="text-blue-400" data-v-b9cfcb3c>88 02 02 02 45</a>. </p><button type="button" class="w-full bg-[#C81E1E] hover:bg-[#A01818] text-white font-bold h-[48px] rounded-full shadow-lg transition-transform hover:-translate-y-0.5 flex items-center justify-center mt-2 text-sm" data-v-b9cfcb3c> Call Us </button></form></div><div class="text-center mt-auto pb-4 pt-4" data-v-b9cfcb3c><h1 class="text-xl font-black tracking-[0.2em] leading-tight text-white/50" data-v-b9cfcb3c> RACING TIME.<br data-v-b9cfcb3c><span class="text-white" data-v-b9cfcb3c>DELIVERING CARE.</span></h1></div></div></div><div class="hidden md:flex relative min-h-screen items-center justify-center pt-24 pb-12" data-v-b9cfcb3c><div class="absolute inset-0 z-0 opacity-40 bg-cover bg-center animate-scale-in" style="${ssrRenderStyle({ "background-image": "url('/Hero_page_gif.webp')" })}" data-v-b9cfcb3c></div><div class="container mx-auto px-4 z-10 grid md:grid-cols-2 gap-12 items-center" data-v-b9cfcb3c><div class="space-y-6 text-center md:text-left pt-12 md:pt-0" data-v-b9cfcb3c><h1 class="text-4xl md:text-6xl font-black tracking-widest leading-tight text-white/90 animate-slide-up" data-v-b9cfcb3c> RACING TIME. <br data-v-b9cfcb3c><span class="text-white" data-v-b9cfcb3c>DELIVERING CARE.</span></h1></div><div class="glass-card p-5 md:p-6 rounded-[2rem] w-full max-w-[360px] mx-auto relative animate-fade-in-up" data-v-b9cfcb3c><div class="absolute -top-4 left-8 bg-white text-gray-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-2 shadow-lg" data-v-b9cfcb3c><span class="w-2 h-2 rounded-full bg-red-600 animate-pulse" data-v-b9cfcb3c></span> 24/7 Available </div><h3 class="text-xl md:text-2xl font-black mb-5 uppercase tracking-wide leading-tight mt-2" data-v-b9cfcb3c> Get Quick Ambulance <br data-v-b9cfcb3c><span class="text-gray-300" data-v-b9cfcb3c>Cost Instantly...</span></h3><form class="space-y-3" data-v-b9cfcb3c><div class="input-pill flex items-center px-4 h-[48px] rounded-full" data-v-b9cfcb3c><input${ssrRenderAttr("value", _ctx.pickup)} type="text" placeholder="Enter Pickup Address or area" class="input-field w-full outline-none text-xs placeholder-gray-400 bg-transparent py-1" data-v-b9cfcb3c><span class="text-green-500 cursor-pointer text-sm" data-v-b9cfcb3c>➔</span></div><div class="input-pill flex items-center px-4 h-[48px] rounded-full" data-v-b9cfcb3c><input${ssrRenderAttr("value", _ctx.destination)} type="text" placeholder="Enter Destination" class="input-field w-full outline-none text-xs placeholder-gray-400 bg-transparent py-1" data-v-b9cfcb3c><span class="text-green-500 cursor-pointer text-sm" data-v-b9cfcb3c>➔</span></div><div class="input-pill flex items-center px-4 h-[48px] rounded-full" data-v-b9cfcb3c><input${ssrRenderAttr("value", _ctx.mobileNumber)} type="tel" placeholder="Enter Mobile Number" class="input-field w-full outline-none text-xs placeholder-gray-400 bg-transparent py-1" data-v-b9cfcb3c><span class="text-green-500 text-sm" data-v-b9cfcb3c>📞</span></div><div class="input-pill px-4 h-[48px] flex items-center rounded-full" data-v-b9cfcb3c><select class="input-field w-full outline-none text-xs bg-transparent custom-select cursor-pointer text-gray-300" data-v-b9cfcb3c><option value="" disabled selected data-v-b9cfcb3c>Ambulance Type</option><!--[-->`);
  ssrRenderList(_ctx.ambulanceTypes, (type) => {
    _push(`<option${ssrRenderAttr("value", type)} class="text-black" data-v-b9cfcb3c${ssrIncludeBooleanAttr(Array.isArray(_ctx.ambulanceType) ? ssrLooseContain(_ctx.ambulanceType, type) : ssrLooseEqual(_ctx.ambulanceType, type)) ? " selected" : ""}>${ssrInterpolate(type)}</option>`);
  });
  _push(`<!--]--></select></div><div class="flex gap-2 pt-2" data-v-b9cfcb3c><button type="submit"${ssrIncludeBooleanAttr(_ctx.loading) ? " disabled" : ""} class="w-[65%] btn-green text-white font-bold h-[48px] pr-2 pl-2 rounded-full shadow-lg transition flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed border border-green-600/50" data-v-b9cfcb3c><div class="w-8 h-8 rounded-full bg-[#1a3125] flex items-center justify-center shrink-0" data-v-b9cfcb3c><img${ssrRenderAttr("src", _imports_0)} alt="Arrow" class="w-4 h-4 object-contain" data-v-b9cfcb3c></div><span class="whitespace-nowrap text-sm flex-1 text-center" data-v-b9cfcb3c>See Estimated Fare</span></button><button type="button" class="flex-1 h-[48px] rounded-full border border-gray-600 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 font-semibold transition flex items-center justify-center gap-2 px-2" data-v-b9cfcb3c><span class="text-sm" data-v-b9cfcb3c>Reset</span> <span class="text-green-500 text-sm" data-v-b9cfcb3c>↻</span></button></div><p class="text-[12px] text-gray-400 leading-relaxed mt-1" data-v-b9cfcb3c><strong class="text-gray-300" data-v-b9cfcb3c>Note:</strong> This is an estimated fare as per your requirements. For exact pricing, Call us at <a href="tel:8802020245" class="text-blue-400 hover:underline" data-v-b9cfcb3c>88 02 02 02 45</a>. </p><div class="pt-1 flex justify-start" data-v-b9cfcb3c><button type="button" class="bg-[#C81E1E] hover:bg-[#A01818] text-white font-bold px-6 h-[48px] rounded-full shadow-lg transition-transform hover:-translate-y-1 flex items-center justify-center text-sm" data-v-b9cfcb3c> Call Us </button></div></form></div></div></div></section>`);
}
const _sfc_setup$m = _sfc_main$m.setup;
_sfc_main$m.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/HeroSection/HeroSection.vue");
  return _sfc_setup$m ? _sfc_setup$m(props, ctx) : void 0;
};
const HeroSection = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["ssrRender", _sfc_ssrRender$k], ["__scopeId", "data-v-b9cfcb3c"]]);
const _sfc_main$l = {
  setup() {
    const isVisible = ref(false);
    const sectionRef = ref(null);
    onMounted(() => {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          isVisible.value = true;
          observer.disconnect();
        }
      }, { threshold: 0.2 });
      if (sectionRef.value) {
        observer.observe(sectionRef.value);
      }
    });
    return {
      isVisible,
      sectionRef
    };
  }
};
const _imports_1 = "/info_section_icon_png/196a9f63abb30df5665582bde48905320514a824.png";
const _imports_2 = "/info_section_icon_png/b719259431920ab9c9ed371105c7e8a0f7ed4845.png";
function _sfc_ssrRender$j(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    ref: "sectionRef",
    class: "w-full"
  }, _attrs))} data-v-e973ab6a><div class="md:hidden relative min-h-screen w-full flex flex-col justify-between pt-20 pb-8 px-6 bg-cover bg-center overflow-hidden" style="${ssrRenderStyle({ "background-image": "url('/about-section/second-section.jpeg')" })}" data-v-e973ab6a><div class="absolute inset-0 bg-black/70 z-0" data-v-e973ab6a></div><div class="relative z-10 text-center space-y-4 mt-4" data-v-e973ab6a><div class="flex justify-center mb-4" data-v-e973ab6a><img${ssrRenderAttr("src", _imports_0$1)} alt="Ayushmaan Logo" class="h-16 w-auto opacity-100 drop-shadow-md" data-v-e973ab6a></div><h2 class="text-2xl font-black text-white tracking-widest uppercase leading-tight drop-shadow-lg" data-v-e973ab6a> MORE THAN A <br data-v-e973ab6a><span class="text-red-500" data-v-e973ab6a>SERVICE PROVIDER</span></h2><p class="text-gray-300 text-xs px-2 leading-relaxed max-w-xs mx-auto drop-shadow-md font-medium" data-v-e973ab6a> ALSA is a Delhi NCR based private EMS provider offering medical transport, emergency response, and critical care solutions, since 2008. </p><div class="flex justify-center gap-4 mt-6 opacity-90" data-v-e973ab6a><img${ssrRenderAttr("src", _imports_1)} alt="Certification 1" class="h-8 w-auto object-contain grayscale hover:grayscale-0 transition-all" data-v-e973ab6a><img${ssrRenderAttr("src", _imports_2)} alt="Certification 2" class="h-8 w-auto object-contain grayscale hover:grayscale-0 transition-all" data-v-e973ab6a></div></div><div class="relative z-10 space-y-3 mt-auto w-full max-w-[360px] mx-auto" data-v-e973ab6a><div class="bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-4" data-v-e973ab6a><div class="bg-white/5 p-2 rounded-full shrink-0" data-v-e973ab6a><svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-v-e973ab6a><circle cx="12" cy="12" r="10" data-v-e973ab6a></circle><line x1="2" y1="12" x2="22" y2="12" data-v-e973ab6a></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" data-v-e973ab6a></path></svg></div><div data-v-e973ab6a><h3 class="text-white font-bold text-sm leading-tight mb-1" data-v-e973ab6a>Pan-India Medical Response network</h3><p class="text-gray-400 text-[10px] leading-snug" data-v-e973ab6a> Emergency and planned medical response across cities, highways, and intercity routes. </p></div></div><div class="bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-4" data-v-e973ab6a><div class="bg-white/5 p-2 rounded-full shrink-0" data-v-e973ab6a><svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-v-e973ab6a><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" data-v-e973ab6a></path><path d="M9 12l2 2 4-4" data-v-e973ab6a></path></svg></div><div data-v-e973ab6a><h3 class="text-white font-bold text-sm leading-tight mb-1" data-v-e973ab6a>End to End Emergency &amp; Care Solutions</h3><p class="text-gray-400 text-[10px] leading-snug" data-v-e973ab6a> Emergency response, critical transfers, hospital coordination, and home care services. </p></div></div></div></div><section class="hidden md:flex mts-section min-h-[80vh] items-center py-20 relative overflow-hidden text-left" style="${ssrRenderStyle({ "background-image": "url('/about-section/second-section.jpeg')" })}" data-v-e973ab6a><div class="container mx-auto px-4 relative z-10 flex justify-end" data-v-e973ab6a><div class="${ssrRenderClass([{ "animate-slide-up": _ctx.isVisible }, "w-full md:w-1/2 space-y-8 pl-0 md:pl-12"])}" data-v-e973ab6a><div data-v-e973ab6a><h2 class="text-2xl md:text-3xl font-bold text-gray-200 tracking-[0.2em] uppercase mb-4" data-v-e973ab6a> More Than a Service Provider </h2><p class="text-gray-400 leading-relaxed text-sm md:text-base" data-v-e973ab6a> ALSA is a Trusted Life Support Ambulance Provider in Delhi NCR, offering rapid response emergency medical transport and critical care solutions since 2008. </p></div><div class="space-y-4" data-v-e973ab6a><div class="mts-card p-4 md:p-6 rounded-2xl flex items-start gap-4" data-v-e973ab6a><div class="bg-transparent p-2" data-v-e973ab6a><svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-v-e973ab6a><circle cx="12" cy="12" r="10" data-v-e973ab6a></circle><line x1="2" y1="12" x2="22" y2="12" data-v-e973ab6a></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" data-v-e973ab6a></path></svg></div><div data-v-e973ab6a><h3 class="text-white font-bold text-lg mb-1" data-v-e973ab6a>Pan-India Medical Response network</h3><p class="text-gray-400 text-sm" data-v-e973ab6a> Emergency and planned medical response across cities, highways, and intercity routes. </p></div></div><div class="mts-card p-4 md:p-6 rounded-2xl flex items-start gap-4" data-v-e973ab6a><div class="bg-transparent p-2" data-v-e973ab6a><svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-v-e973ab6a><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" data-v-e973ab6a></path><path d="M9 12l2 2 4-4" data-v-e973ab6a></path></svg></div><div data-v-e973ab6a><h3 class="text-white font-bold text-lg mb-1" data-v-e973ab6a>End to End Emergency &amp; Care Solutions</h3><p class="text-gray-400 text-sm" data-v-e973ab6a> Emergency response, critical transfers, hospital coordination, and home care services. </p></div></div></div><div class="flex items-center gap-6 pt-4 opacity-80" data-v-e973ab6a><img${ssrRenderAttr("src", _imports_1)} alt="Certification 1" class="h-16 w-auto object-contain" data-v-e973ab6a><img${ssrRenderAttr("src", _imports_2)} alt="Certification 2" class="h-16 w-auto object-contain" data-v-e973ab6a></div></div></div></section></div>`);
}
const _sfc_setup$l = _sfc_main$l.setup;
_sfc_main$l.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/MoreThanServiceSection/MoreThanServiceSection.vue");
  return _sfc_setup$l ? _sfc_setup$l(props, ctx) : void 0;
};
const MoreThanServiceSection = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["ssrRender", _sfc_ssrRender$j], ["__scopeId", "data-v-e973ab6a"]]);
const _sfc_main$k = {
  setup() {
    const partners = ref([
      "/Partners Logo/Gemini_Generated_Image_10je8t10je8t10je-Photoroom.webp",
      "/Partners Logo/Gemini_Generated_Image_fykcl8fykcl8fykc-Photoroom.webp",
      "/Partners Logo/Gemini_Generated_Image_jiyjoyjiyjoyjiyj-Photoroom.webp",
      "/Partners Logo/Gemini_Generated_Image_jt8dkjjt8dkjjt8d-Photoroom.webp",
      "/Partners Logo/Gemini_Generated_Image_n4xuoyn4xuoyn4xu-Photoroom.webp",
      "/Partners Logo/Gemini_Generated_Image_ojihsxojihsxojih-Photoroom.webp",
      "/Partners Logo/Gemini_Generated_Image_vi3ui8vi3ui8vi3u-Photoroom.webp",
      "/Partners Logo/Gemini_Generated_Image_xl3jo8xl3jo8xl3j-Photoroom.webp"
    ]);
    return {
      partners
    };
  }
};
function _sfc_ssrRender$i(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "partner-section py-16" }, _attrs))} data-v-879fc36b><div class="container mx-auto px-4 text-center" data-v-879fc36b><h3 class="text-xl md:text-2xl text-gray-400 font-semibold tracking-[0.2em] uppercase mb-12" data-v-879fc36b> Our Valued Partners </h3><div class="slider" data-v-879fc36b><div class="slide-track" data-v-879fc36b><!--[-->`);
  ssrRenderList(_ctx.partners, (logo, index) => {
    _push(`<div class="flex items-center justify-center" data-v-879fc36b><img${ssrRenderAttr("src", logo)} alt="Partner Logo" class="partner-logo" data-v-879fc36b></div>`);
  });
  _push(`<!--]--><!--[-->`);
  ssrRenderList(_ctx.partners, (logo, index) => {
    _push(`<div class="flex items-center justify-center" data-v-879fc36b><img${ssrRenderAttr("src", logo)} alt="Partner Logo" class="partner-logo" data-v-879fc36b></div>`);
  });
  _push(`<!--]--></div></div></div></section>`);
}
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/PartnerSection/PartnerSection.vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
const PartnerSection = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["ssrRender", _sfc_ssrRender$i], ["__scopeId", "data-v-879fc36b"]]);
const _sfc_main$j = {
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String,
      default: "https://placehold.co/400x600/18181b/ffffff?text=Service+Image"
    }
  }
};
function _sfc_ssrRender$h(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "service-card w-full group hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden relative h-[400px]" }, _attrs))} data-v-17a1e945><img${ssrRenderAttr("src", _ctx.image)}${ssrRenderAttr("alt", _ctx.title + " - Ayushmaan Life Support Ambulance")} class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-v-17a1e945><div class="card-overlay absolute inset-0 p-8 flex flex-col items-start justify-end text-left pointer-events-none bg-gradient-to-t from-black via-transparent to-transparent group-hover:-translate-y-2 transition-transform duration-300" data-v-17a1e945><h3 class="card-title text-xl md:text-2xl font-bold text-white uppercase mb-3 border-b-2 border-transparent group-hover:border-red-500 pb-1 transition-colors" data-v-17a1e945>${ssrInterpolate(_ctx.title)}</h3><p class="card-desc text-sm text-gray-300 leading-relaxed max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 transform translate-y-4 group-hover:translate-y-0" data-v-17a1e945>${ssrInterpolate(_ctx.description)}</p></div></div>`);
}
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ServiceCard/ServiceCard.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const ServiceCard = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["ssrRender", _sfc_ssrRender$h], ["__scopeId", "data-v-17a1e945"]]);
const _sfc_main$i = {
  components: { ServiceCard },
  setup() {
    const services = ref([
      {
        title: "Road Ambulance",
        description: "Fully equipped ambulances with trained medical staff, ready to respond when every minute matters.",
        image: "/third-section/road-ambulance.jpg"
      },
      {
        title: "Air Ambulance",
        description: "Seamless road to air medical transfers with critical care teams and advanced support.",
        image: "/third-section/air-ambulance.jpg"
      },
      {
        title: "Rail Ambulance",
        description: "Long-distance medical transfers with onboard care, monitoring, and trained medical support.",
        image: "/third-section/rail-ambulance.jpg"
      },
      {
        title: "Mortuary Transfer",
        description: "Safe and respectful transfers, with trained personnel guiding every moment.",
        image: "/third-section/morturary-van.jpg"
      },
      {
        title: "VIP Transfers",
        description: "Personalized medical assistance designed for smooth, comfortable patient transfers.",
        image: "/third-section/vip-transfer.jpg"
      }
    ]);
    const handleCall = () => {
      window.location.href = "tel:8802020245";
    };
    return {
      services,
      handleCall
    };
  }
};
function _sfc_ssrRender$g(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_ServiceCard = resolveComponent("ServiceCard");
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "our-services-section py-20" }, _attrs))} data-v-c889acb6><div class="container mx-auto px-4" data-v-c889acb6><div class="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 -mx-4 px-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:pb-0 md:mx-0 md:px-0 scrollbar-hide" data-v-c889acb6><!--[-->`);
  ssrRenderList(_ctx.services, (service, index) => {
    _push(`<div class="min-w-[85vw] sm:min-w-[350px] snap-center md:min-w-0 md:w-auto flex-shrink-0 md:flex-shrink" data-v-c889acb6>`);
    _push(ssrRenderComponent(_component_ServiceCard, {
      title: service.title,
      description: service.description,
      image: service.image
    }, null, _parent));
    _push(`</div>`);
  });
  _push(`<!--]--><div class="min-w-[85vw] sm:min-w-[350px] snap-center md:min-w-0 md:w-auto flex-shrink-0 md:flex-shrink" data-v-c889acb6><div class="cta-card p-8 text-white text-center md:text-left relative h-full rounded-2xl" data-v-c889acb6><div class="relative z-10 h-full flex flex-col justify-center items-center md:items-start" data-v-c889acb6><h3 class="text-3xl font-bold mb-4" data-v-c889acb6>Not Sure What You Need?</h3><p class="text-gray-200 mb-8 max-w-sm" data-v-c889acb6> Our experts will guide you to the right medical transfer, <a href="tel:8802020245" class="underline hover:text-white" data-v-c889acb6>88 02 02 02 45</a>. </p><button class="bg-green-700 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full inline-flex items-center gap-2 w-max transition-colors shadow-xl" data-v-c889acb6><span class="bg-white text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-sm" data-v-c889acb6>↗</span> Call Now </button></div></div></div></div></div></section>`);
}
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/OurServicesSection/OurServicesSection.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const OurServicesSection = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["ssrRender", _sfc_ssrRender$g], ["__scopeId", "data-v-c889acb6"]]);
const _sfc_main$h = {
  props: {
    image: {
      type: String,
      default: "https://placehold.co/600x400/222/FFF?text=Facility+Image"
    },
    description: {
      type: String,
      required: true
    }
  }
};
function _sfc_ssrRender$f(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "facility-card p-6 md:p-8 flex flex-col items-center text-center h-full max-w-lg mx-auto" }, _attrs))} data-v-a67b3961><div class="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 border border-gray-800" data-v-a67b3961><img${ssrRenderAttr("src", _ctx.image)} alt="Facility Image" class="w-full h-full object-cover" data-v-a67b3961></div><p class="text-gray-300 text-sm md:text-base leading-relaxed mb-8 max-w-sm" data-v-a67b3961>${ssrInterpolate(_ctx.description)}</p><button class="know-more-btn text-white font-bold py-3 px-8 rounded-full flex items-center gap-2 shadow-lg" data-v-a67b3961><span class="border-2 border-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]" data-v-a67b3961>↗</span> Know More </button></div>`);
}
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/FacilityCard/FacilityCard.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const FacilityCard = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["ssrRender", _sfc_ssrRender$f], ["__scopeId", "data-v-a67b3961"]]);
const _sfc_main$g = {
  components: { FacilityCard },
  setup() {
    const activeIndex = ref(0);
    const facilities = [
      {
        title: "Inter-Hospital Transfers",
        description: "Coordinated patient movement between healthcare facilities with medical continuity.",
        image: "https://placehold.co/800x600/222/FFF?text=Inter-Hospital"
      },
      {
        title: "Enterprise Medical Support",
        description: "Comprehensive medical solutions for corporate campuses and industrial sites.",
        image: "https://placehold.co/800x600/333/FFF?text=Enterprise+Support"
      },
      {
        title: "Event Medical Coverage",
        description: "On-site ambulance and paramedic support for large-scale public and private events.",
        image: "https://placehold.co/800x600/444/FFF?text=Event+Coverage"
      },
      {
        title: "Public Authority Healthcare",
        description: "Partnering with government bodies to strengthen public emergency response infrastructure.",
        image: "https://placehold.co/800x600/555/FFF?text=Public+Authority"
      },
      {
        title: "Home Medical Care",
        description: "Professional medical care delivered at home including nursing and equipment support.",
        image: "https://placehold.co/800x600/666/FFF?text=Home+Care"
      },
      {
        title: "Education & Training",
        description: "First aid and BLS training programs for schools, offices, and communities.",
        image: "https://placehold.co/800x600/777/FFF?text=Training"
      }
    ];
    const setActive = (index) => {
      activeIndex.value = index;
    };
    return {
      facilities,
      activeIndex,
      setActive
    };
  }
};
function _sfc_ssrRender$e(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_FacilityCard = resolveComponent("FacilityCard");
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "facilities-section py-20" }, _attrs))} data-v-8c1829b6><div class="container mx-auto px-4" data-v-8c1829b6><div class="grid lg:grid-cols-2 gap-16 items-center" data-v-8c1829b6><div class="flex flex-col space-y-2" data-v-8c1829b6><!--[-->`);
  ssrRenderList(_ctx.facilities, (facility, index) => {
    _push(`<div class="${ssrRenderClass([
      "facility-item py-6 text-xl md:text-2xl font-medium select-none",
      _ctx.activeIndex === index ? "active" : "text-gray-500"
    ])}" data-v-8c1829b6>${ssrInterpolate(facility.title)}</div>`);
  });
  _push(`<!--]--></div><div class="flex justify-center lg:justify-end" data-v-8c1829b6>`);
  _push(ssrRenderComponent(_component_FacilityCard, {
    key: _ctx.activeIndex,
    image: _ctx.facilities[_ctx.activeIndex].image,
    description: _ctx.facilities[_ctx.activeIndex].description
  }, null, _parent));
  _push(`</div></div></div></section>`);
}
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/FacilitiesSection/FacilitiesSection.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const FacilitiesSection = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["ssrRender", _sfc_ssrRender$e], ["__scopeId", "data-v-8c1829b6"]]);
const _sfc_main$f = {
  props: {
    name: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: "Patient"
    },
    review: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      default: 5
    },
    image: {
      type: String,
      default: "https://placehold.co/100x100/333/FFF?text=User"
    }
  }
};
function _sfc_ssrRender$d(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "testimonial-card p-8 flex flex-col justify-between h-full" }, _attrs))} data-v-a40a841e><div data-v-a40a841e><div class="stars flex gap-1 mb-4 text-lg" data-v-a40a841e><!--[-->`);
  ssrRenderList(5, (n) => {
    _push(`<span data-v-a40a841e>${ssrInterpolate(n <= _ctx.rating ? "★" : "☆")}</span>`);
  });
  _push(`<!--]--></div><p class="text-gray-300 text-sm leading-relaxed italic mb-6" data-v-a40a841e> &quot;${ssrInterpolate(_ctx.review)}&quot; </p></div><div class="flex items-center gap-4" data-v-a40a841e><div class="w-12 h-12 rounded-full overflow-hidden border border-gray-600" data-v-a40a841e><img${ssrRenderAttr("src", _ctx.image)} alt="User Avatar" class="w-full h-full object-cover" data-v-a40a841e></div><div data-v-a40a841e><h4 class="text-white font-bold text-sm" data-v-a40a841e>${ssrInterpolate(_ctx.name)}</h4><p class="text-gray-500 text-xs" data-v-a40a841e>${ssrInterpolate(_ctx.role)}</p></div></div></div>`);
}
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/TestimonialCard/TestimonialCard.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const TestimonialCard = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["ssrRender", _sfc_ssrRender$d], ["__scopeId", "data-v-a40a841e"]]);
const _sfc_main$e = {
  components: { TestimonialCard },
  setup() {
    const testimonials = ref([
      {
        name: "Shivani Sharma",
        role: "Patient's Daughter",
        review: "During one of the most stressful moments for our family, ALSA responded immediately. The team was calm, professional, and extremely supportive.",
        rating: 5,
        image: "https://placehold.co/150x150/444/FFF?text=Shivani"
      },
      {
        name: "Manish Chopra",
        role: "Patient, Delhi NCR",
        review: "ALSA arrived on time and took excellent control of the emergency. The staff was calm, professional, and reassuring throughout the journey.",
        rating: 5,
        image: "https://placehold.co/150x150/555/FFF?text=Manish"
      },
      {
        name: "Rajesh Gupta",
        role: "Referring Doctor",
        review: "I regularly entrust my patients to Ayushmaan for inter-hospital transfers. Their ICU ambulances are perfectly equipped.",
        rating: 5,
        image: "https://placehold.co/150x150/666/FFF?text=Rajesh"
      },
      {
        name: "Anita Desai",
        role: "Patient's Wife",
        review: "The air ambulance service was seamless. They handled all the logistics perfectly from bedside to bedside.",
        rating: 4,
        image: "https://placehold.co/150x150/777/FFF?text=Anita"
      },
      {
        name: "Vikram Singh",
        role: "Event Organizer",
        review: "Their team provided excellent medical coverage for our marathon. Very reliable and professional presence.",
        rating: 5,
        image: "https://placehold.co/150x150/888/FFF?text=Vikram"
      }
    ]);
    return {
      testimonials
    };
  }
};
function _sfc_ssrRender$c(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_TestimonialCard = resolveComponent("TestimonialCard");
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "testimonial-section py-24" }, _attrs))} data-v-40eb66f2><div class="container mx-auto px-4 mb-12 text-center" data-v-40eb66f2><h3 class="text-3xl md:text-4xl font-bold uppercase tracking-wider text-white mb-2" data-v-40eb66f2> Testimonials </h3><p class="text-gray-400" data-v-40eb66f2>What our patients say about us</p></div><div class="testimonial-track-container" data-v-40eb66f2><div class="testimonial-track px-4" data-v-40eb66f2><!--[-->`);
  ssrRenderList(_ctx.testimonials, (t, index) => {
    _push(ssrRenderComponent(_component_TestimonialCard, {
      key: `orig-${index}`,
      name: t.name,
      role: t.role,
      review: t.review,
      rating: t.rating,
      image: t.image
    }, null, _parent));
  });
  _push(`<!--]--><!--[-->`);
  ssrRenderList(_ctx.testimonials, (t, index) => {
    _push(ssrRenderComponent(_component_TestimonialCard, {
      key: `dup-${index}`,
      name: t.name,
      role: t.role,
      review: t.review,
      rating: t.rating,
      image: t.image
    }, null, _parent));
  });
  _push(`<!--]--></div></div></section>`);
}
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/TestimonialSection/TestimonialSection.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const TestimonialSection = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["ssrRender", _sfc_ssrRender$c], ["__scopeId", "data-v-40eb66f2"]]);
const _sfc_main$d = {
  setup() {
    const canvasRef = ref(null);
    let animationFrameId;
    let width, height;
    const cities = [
      { name: "Delhi NCR", x: 0.1, y: 0.55 },
      { name: "Lucknow", x: 0.18, y: 0.7 },
      { name: "Ranchi", x: 0.28, y: 0.85 },
      { name: "Himachal", x: 0.35, y: 0.8 },
      { name: "Mumbai", x: 0.45, y: 0.7 },
      { name: "Punjab", x: 0.5, y: 0.6 },
      { name: "Patna", x: 0.58, y: 0.55 },
      { name: "Rajasthan", x: 0.65, y: 0.5 },
      { name: "Bengaluru", x: 0.75, y: 0.45 },
      { name: "Pune", x: 0.82, y: 0.35 },
      { name: "Indore", x: 0.88, y: 0.2 },
      { name: "Guwahati", x: 0.92, y: 0.05 }
    ];
    const signals = [];
    const backgroundParticles = [];
    const squares = [];
    const init = () => {
      const canvas = canvasRef.value;
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      backgroundParticles.length = 0;
      for (let i = 0; i < 50; i++) {
        backgroundParticles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2,
          speed: Math.random() * 0.5 + 0.1,
          opacity: Math.random() * 0.5
        });
      }
      squares.length = 0;
      for (let i = 0; i < 8; i++) {
        squares.push({
          x: Math.random() * width * 0.8,
          y: Math.random() * height * 0.8,
          w: 50 + Math.random() * 150,
          h: 50 + Math.random() * 150,
          opacity: 0.1 + Math.random() * 0.2
        });
      }
    };
    const drawTechSquares = (ctx) => {
      squares.forEach((sq) => {
        const grd = ctx.createLinearGradient(sq.x, sq.y, sq.x, sq.y + sq.h);
        grd.addColorStop(0, `rgba(20, 80, 40, ${sq.opacity})`);
        grd.addColorStop(1, `rgba(0, 20, 10, 0.05)`);
        ctx.save();
        ctx.fillStyle = grd;
        ctx.strokeStyle = `rgba(50, 150, 80, ${sq.opacity * 0.5})`;
        ctx.lineWidth = 1;
        ctx.fillRect(sq.x, sq.y, sq.w, sq.h);
        ctx.strokeRect(sq.x, sq.y, sq.w, sq.h);
        ctx.restore();
      });
    };
    const drawMap = (ctx) => {
      const drawSpline = (w, color, shadow) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = w;
        ctx.lineCap = "round";
        ctx.shadowBlur = shadow ? 10 : 0;
        ctx.shadowColor = shadow ? color : "transparent";
        if (cities.length > 0) {
          ctx.moveTo(cities[0].x * width, cities[0].y * height);
          for (let i = 1; i < cities.length; i++) {
            const xc = (cities[i].x * width + cities[i - 1].x * width) / 2;
            const yc = (cities[i].y * height + cities[i - 1].y * height) / 2;
            ctx.quadraticCurveTo(cities[i - 1].x * width, cities[i - 1].y * height, xc, yc);
          }
          const last = cities[cities.length - 1];
          ctx.lineTo(last.x * width, last.y * height);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      };
      drawSpline(6, "#ef4444", true);
      drawSpline(2, "#000000", false);
      cities.forEach((city) => {
        const cx = city.x * width;
        const cy = city.y * height;
        const time = Date.now() * 2e-3;
        ctx.beginPath();
        ctx.arc(cx, cy, 12 + Math.sin(time * 3 + city.x * 10) * 4, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(239, 68, 68, ${0.1 + Math.sin(time) * 0.1})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, 8, 0, Math.PI * 2);
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, 5, 0, Math.PI * 2);
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, 2, 0, Math.PI * 2);
        ctx.fillStyle = "#ef4444";
        ctx.fill();
        ctx.fillStyle = "#4ade80";
        ctx.font = '500 11px "Inter", monospace';
        ctx.letterSpacing = "1px";
        ctx.fillText(city.name.toUpperCase(), cx + 20, cy + 4);
        ctx.beginPath();
        ctx.moveTo(cx + 10, cy);
        ctx.lineTo(cx + 18, cy);
        ctx.strokeStyle = "rgba(74, 222, 128, 0.5)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });
      if (Math.random() < 0.03) {
        signals.push({
          segmentIndex: Math.floor(Math.random() * (cities.length - 1)),
          progress: 0,
          speed: 5e-3 + Math.random() * 0.01
        });
      }
    };
    const drawSignals = (ctx) => {
      for (let i = signals.length - 1; i >= 0; i--) {
        const s = signals[i];
        s.progress += s.speed;
        if (s.progress >= 1) {
          s.segmentIndex++;
          s.progress = 0;
          if (s.segmentIndex >= cities.length - 1) {
            signals.splice(i, 1);
            continue;
          }
        }
        const start = cities[s.segmentIndex];
        const end = cities[s.segmentIndex + 1];
        if (!start || !end) continue;
        const lx = start.x * width + (end.x * width - start.x * width) * s.progress;
        const ly = start.y * height + (end.y * height - start.y * height) * s.progress;
        ctx.beginPath();
        ctx.arc(lx, ly, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.shadowBlur = 6;
        ctx.shadowColor = "#ffffff";
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    };
    const drawBackground = (ctx) => {
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      backgroundParticles.forEach((p) => {
        p.y -= p.speed;
        if (p.y < 0) p.y = height;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 1;
      const gridSize = 100;
      for (let x = Date.now() * 0.02 % gridSize; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    };
    const animate = () => {
      const canvas = canvasRef.value;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, width, height);
      drawBackground(ctx);
      drawTechSquares(ctx);
      drawMap(ctx);
      drawSignals(ctx);
      animationFrameId = requestAnimationFrame(animate);
    };
    onMounted(() => {
      setTimeout(() => {
        init();
        animate();
      }, 50);
      window.addEventListener("resize", init);
    });
    onUnmounted(() => {
      window.removeEventListener("resize", init);
      cancelAnimationFrame(animationFrameId);
    });
    return {
      canvasRef
    };
  }
};
function _sfc_ssrRender$b(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "alsa-network-section flex flex-col items-center justify-start py-20 relative" }, _attrs))} data-v-af09760d><canvas data-v-af09760d></canvas><div class="container mx-auto px-4 z-10 text-center pointer-events-none" data-v-af09760d><span class="live-badge text-red-500 font-mono text-sm tracking-widest border border-red-900 bg-red-900/20 px-3 py-1 rounded mb-4 inline-block" data-v-af09760d> ● LIVE NETWORK STATUS </span><h2 class="text-3xl md:text-5xl font-bold uppercase tracking-widest mb-4" data-v-af09760d> ALSA Service Network </h2><p class="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed" data-v-af09760d> A <span class="text-white bg-red-700 px-2 font-bold" data-v-af09760d>nationwide emergency response</span> network designed for speed, coverage, and clinical reliability. </p></div><div class="absolute top-10 left-10 w-16 h-16 border-t-2 border-l-2 border-red-800 opacity-50" data-v-af09760d></div><div class="absolute bottom-10 right-10 w-16 h-16 border-b-2 border-r-2 border-red-800 opacity-50" data-v-af09760d></div></section>`);
}
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/AlsaNetworkSection/AlsaNetworkSection.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const AlsaNetworkSection = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["ssrRender", _sfc_ssrRender$b], ["__scopeId", "data-v-af09760d"]]);
const _sfc_main$c = {
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String,
      default: "https://placehold.co/600x400/222/FFF?text=Event+Image"
    },
    imagePosition: {
      type: String,
      default: "bottom",
      // 'top' or 'bottom'
      validator: (value) => ["top", "bottom"].includes(value)
    }
  }
};
function _sfc_ssrRender$a(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "event-card h-full flex flex-col" }, _attrs))} data-v-9da7d9e5>`);
  if (_ctx.imagePosition === "bottom") {
    _push(`<div class="p-8 pb-4 flex-1" data-v-9da7d9e5><h3 class="text-xl md:text-2xl font-bold text-gray-100 mb-3" data-v-9da7d9e5>${ssrInterpolate(_ctx.title)}</h3><p class="text-gray-400 text-sm leading-relaxed mb-6" data-v-9da7d9e5>${ssrInterpolate(_ctx.description)}</p><button class="book-now-btn text-white font-bold py-2 px-6 rounded-full flex items-center gap-2 text-sm w-max" data-v-9da7d9e5><span class="border border-white/50 rounded-full w-4 h-4 flex items-center justify-center text-[8px]" data-v-9da7d9e5>↗</span> Book Now </button></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<div class="w-full relative h-[400px] md:h-[450px] overflow-hidden" data-v-9da7d9e5><img${ssrRenderAttr("src", _ctx.image)}${ssrRenderAttr("alt", _ctx.title)} class="w-full h-full object-cover transition-transform duration-500 hover:scale-105" data-v-9da7d9e5></div>`);
  if (_ctx.imagePosition === "top") {
    _push(`<div class="p-8 pt-6 flex-1 flex flex-col justify-end" data-v-9da7d9e5><h3 class="text-xl md:text-2xl font-bold text-gray-100 mb-3" data-v-9da7d9e5>${ssrInterpolate(_ctx.title)}</h3><p class="text-gray-400 text-sm leading-relaxed mb-6" data-v-9da7d9e5>${ssrInterpolate(_ctx.description)}</p><button class="book-now-btn text-white font-bold py-2 px-6 rounded-full flex items-center gap-2 text-sm w-max" data-v-9da7d9e5><span class="border border-white/50 rounded-full w-4 h-4 flex items-center justify-center text-[8px]" data-v-9da7d9e5>↗</span> Book Now </button></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/EventCard/EventCard.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const EventCard = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["ssrRender", _sfc_ssrRender$a], ["__scopeId", "data-v-9da7d9e5"]]);
const _sfc_main$b = {
  components: { EventCard },
  setup() {
    const events = [
      {
        title: "Concert & Festival Medical Coverage",
        description: "On ground medical teams and ICU ambulances supporting large live events.",
        imagePosition: "bottom",
        image: "/events/events_1.jpg"
      },
      {
        title: "Sports & Stadium Medical Support",
        description: "Prepared medical coverage for competitive sports and athletic events.",
        imagePosition: "top",
        image: "/events/events_2.jpg"
      },
      {
        title: "Private Event Medical Coverage",
        description: "Discreet medical readiness for hotels, resorts, and private gatherings.",
        imagePosition: "bottom",
        image: "/events/events_3.jpg"
      }
    ];
    return {
      events
    };
  }
};
function _sfc_ssrRender$9(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_EventCard = resolveComponent("EventCard");
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "event-support-section" }, _attrs))} data-v-665f2d0b><div class="container mx-auto px-4 py-20" data-v-665f2d0b><div class="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 -mx-4 px-4 md:grid md:grid-cols-3 md:gap-8 md:pb-0 md:mx-0 md:px-0 scrollbar-hide" data-v-665f2d0b><!--[-->`);
  ssrRenderList(_ctx.events, (event, index) => {
    _push(`<div class="min-w-[85vw] sm:min-w-[350px] snap-center md:min-w-0 md:w-auto flex-shrink-0 md:flex-shrink" data-v-665f2d0b>`);
    _push(ssrRenderComponent(_component_EventCard, {
      title: event.title,
      description: event.description,
      image: event.image,
      imagePosition: event.imagePosition
    }, null, _parent));
    _push(`</div>`);
  });
  _push(`<!--]--></div></div></section>`);
}
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/EventSupportSection/EventSupportSection.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const EventSupportSection = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["ssrRender", _sfc_ssrRender$9], ["__scopeId", "data-v-665f2d0b"]]);
const _sfc_main$a = {
  setup() {
    const sectionRef = ref(null);
    const progress = ref(0);
    const countProgress = ref(0);
    const milestones = [
      { date: "2005", label: "Inception" },
      { date: "2010", label: "Expansion" },
      { date: "2015", label: "Coverage" },
      { date: "2020", label: "Milestone" },
      { date: "2025", label: "Target" }
    ];
    const pathDataDesktop = computed(() => {
      const h = 600;
      const xBase = 50;
      const bulgeSize = 60;
      const bulgeDepth = 30;
      const currentY = Math.max(50, Math.min(h - 50, progress.value * h));
      return `M ${xBase} 0 
                    L ${xBase} ${currentY - bulgeSize} 
                    C ${xBase} ${currentY - bulgeSize * 0.5}, ${xBase + bulgeDepth} ${currentY - bulgeSize * 0.5}, ${xBase + bulgeDepth} ${currentY} 
                    C ${xBase + bulgeDepth} ${currentY + bulgeSize * 0.5}, ${xBase} ${currentY + bulgeSize * 0.5}, ${xBase} ${currentY + bulgeSize} 
                    L ${xBase} ${h}`;
    });
    const activeYDesktop = computed(() => {
      return Math.max(50, Math.min(600 - 50, progress.value * 600));
    });
    const pathDataMobile = computed(() => {
      const h = 500;
      const xBase = 50;
      const bulgeSize = 60;
      const bulgeDepth = 30;
      const currentY = Math.max(50, Math.min(h - 50, progress.value * h));
      return `M ${xBase} 0 
                    L ${xBase} ${currentY - bulgeSize} 
                    C ${xBase} ${currentY - bulgeSize * 0.5}, ${xBase + bulgeDepth} ${currentY - bulgeSize * 0.5}, ${xBase + bulgeDepth} ${currentY} 
                    C ${xBase + bulgeDepth} ${currentY + bulgeSize * 0.5}, ${xBase} ${currentY + bulgeSize * 0.5}, ${xBase} ${currentY + bulgeSize} 
                    L ${xBase} ${h}`;
    });
    const activeYMobile = computed(() => {
      return Math.max(50, Math.min(500 - 50, progress.value * 500));
    });
    const handleScroll = () => {
      if (!sectionRef.value) return;
      const rect = sectionRef.value.getBoundingClientRect();
      const winH = window.innerHeight;
      const totalTravel = winH + rect.height;
      const currentPos = winH - rect.top;
      let p = currentPos / totalTravel;
      p = p * 1.5 - 0.2;
      p = Math.max(0, Math.min(1, p));
      progress.value = p;
    };
    const startCounting = () => {
      const duration = 2e3;
      const startTime = performance.now();
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress2 = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress2, 3);
        countProgress.value = easeOut;
        if (progress2 < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    };
    onMounted(() => {
      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          startCounting();
          observer.disconnect();
        }
      }, { threshold: 0.3 });
      if (sectionRef.value) {
        observer.observe(sectionRef.value);
      }
    });
    onUnmounted(() => {
      window.removeEventListener("scroll", handleScroll);
    });
    return {
      sectionRef,
      pathDataDesktop,
      activeYDesktop,
      pathDataMobile,
      activeYMobile,
      milestones,
      progress,
      countProgress
    };
  }
};
function _sfc_ssrRender$8(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<section${ssrRenderAttrs(mergeProps({
    ref: "sectionRef",
    class: "stats-section py-24 min-h-[800px] flex items-center relative"
  }, _attrs))} data-v-e330fa24><div class="container mx-auto px-4 relative" data-v-e330fa24><div class="md:hidden flex flex-col items-center pt-8 pb-16" data-v-e330fa24><div class="text-center mb-12" data-v-e330fa24><p class="text-gray-300 text-sm mb-4" data-v-e330fa24><span class="font-bold text-white" data-v-e330fa24>5,00,000+</span> patients supported in critical moments </p><div class="flex justify-center -space-x-3" data-v-e330fa24><img src="https://placehold.co/40x40/333/FFF?text=U1" class="w-10 h-10 rounded-full border-2 border-black" data-v-e330fa24><img src="https://placehold.co/40x40/444/FFF?text=U2" class="w-10 h-10 rounded-full border-2 border-black" data-v-e330fa24><img src="https://placehold.co/40x40/555/FFF?text=U3" class="w-10 h-10 rounded-full border-2 border-black" data-v-e330fa24></div></div><div class="relative w-full h-[500px] flex" data-v-e330fa24><div class="w-1/3 flex flex-col justify-between py-8 text-right pr-6 text-gray-400 text-sm font-mono" data-v-e330fa24><!--[-->`);
  ssrRenderList(_ctx.milestones, (m, i) => {
    _push(`<div class="h-8 flex items-center justify-end" data-v-e330fa24>${ssrInterpolate(m.date)} <span class="w-2 h-[2px] bg-gray-600 ml-2" data-v-e330fa24></span></div>`);
  });
  _push(`<!--]--></div><div class="absolute left-1/3 top-0 bottom-0 w-1 flex flex-col items-center overflow-visible" data-v-e330fa24><svg class="h-[500px] w-40 overflow-visible -ml-20" viewBox="0 0 100 500" data-v-e330fa24><path${ssrRenderAttr("d", _ctx.pathDataMobile)} class="timeline-path" data-v-e330fa24></path><defs data-v-e330fa24><linearGradient id="lineGradientMobile" x1="0" x2="0" y1="0" y2="1" data-v-e330fa24><stop offset="0%" stop-color="#166534" data-v-e330fa24></stop><stop${ssrRenderAttr("offset", _ctx.progress * 100 + "%")} stop-color="#4ade80" data-v-e330fa24></stop><stop offset="100%" stop-color="#166534" data-v-e330fa24></stop></linearGradient></defs><path${ssrRenderAttr("d", _ctx.pathDataMobile)} stroke="url(#lineGradientMobile)" stroke-width="4" fill="none" filter="drop-shadow(0 0 5px rgba(74, 222, 128, 0.5))" data-v-e330fa24></path></svg></div><div class="absolute left-1/3 -translate-x-1/2 z-10" style="${ssrRenderStyle({ top: _ctx.activeYMobile + "px", transform: "translate(-50%, -50%)" })}" data-v-e330fa24><div class="w-16 h-16 rounded-full bg-[#1da352] border-4 border-black flex items-center justify-center shadow-[0_0_20px_rgba(74,222,128,0.5)]" data-v-e330fa24><span class="text-white text-3xl font-bold" data-v-e330fa24>↑</span></div></div><div class="flex-1 pl-12 flex flex-col justify-center" data-v-e330fa24><p class="text-gray-400 text-xs mb-2" data-v-e330fa24> A reflection of expanding access to emergency and medical services. </p><h2 class="text-4xl font-bold text-white tracking-tighter" data-v-e330fa24>${ssrInterpolate(Math.floor(5e5 * _ctx.progress).toLocaleString())}+ </h2><p class="text-gray-400 text-sm uppercase tracking-widest mt-1" data-v-e330fa24>Lives Saved</p></div></div></div><div class="hidden md:flex flex-row w-full" data-v-e330fa24><div class="w-1/4 relative h-[600px] flex justify-end pr-12" data-v-e330fa24><div class="absolute right-20 top-0 h-full flex flex-col justify-between py-12 text-right opacity-50 text-base font-mono text-green-200" data-v-e330fa24><!--[-->`);
  ssrRenderList(_ctx.milestones, (m, i) => {
    _push(`<div style="${ssrRenderStyle({ opacity: Math.abs(_ctx.progress - i / (_ctx.milestones.length - 1)) < 0.2 ? 1 : 0.3, transform: `scale(${Math.abs(_ctx.progress - i / (_ctx.milestones.length - 1)) < 0.2 ? 1.2 : 1})`, transition: "all 0.3s" })}" data-v-e330fa24>${ssrInterpolate(m.date)}</div>`);
  });
  _push(`<!--]--></div><svg class="h-full w-40 overflow-visible" viewBox="0 0 100 600" data-v-e330fa24><path${ssrRenderAttr("d", _ctx.pathDataDesktop)} class="timeline-path" data-v-e330fa24></path><defs data-v-e330fa24><linearGradient id="lineGradientDesktop" x1="0" x2="0" y1="0" y2="1" data-v-e330fa24><stop offset="0%" stop-color="#166534" data-v-e330fa24></stop><stop${ssrRenderAttr("offset", _ctx.progress * 100 + "%")} stop-color="#4ade80" data-v-e330fa24></stop><stop offset="100%" stop-color="#166534" data-v-e330fa24></stop></linearGradient></defs><path${ssrRenderAttr("d", _ctx.pathDataDesktop)} stroke="url(#lineGradientDesktop)" stroke-width="4" fill="none" filter="drop-shadow(0 0 5px rgba(74, 222, 128, 0.5))" data-v-e330fa24></path></svg><div class="absolute right-[28px] w-6 h-6 rounded-full bg-black border-2 border-green-400 z-10 icon-pulse" style="${ssrRenderStyle({ top: _ctx.activeYDesktop + "px", transform: "translate(50%, -50%)" })}" data-v-e330fa24></div></div><div class="flex-1 pl-16 flex flex-col justify-center items-start text-left" data-v-e330fa24><div class="stat-pill self-start rounded-full px-6 py-2 flex items-center gap-4 mb-12" data-v-e330fa24><div class="flex -space-x-3" data-v-e330fa24><img src="https://placehold.co/40x40/333/FFF?text=U1" class="w-8 h-8 rounded-full border border-gray-700" data-v-e330fa24><img src="https://placehold.co/40x40/444/FFF?text=U2" class="w-8 h-8 rounded-full border border-gray-700" data-v-e330fa24><img src="https://placehold.co/40x40/555/FFF?text=U3" class="w-8 h-8 rounded-full border border-gray-700" data-v-e330fa24></div><span class="text-sm text-gray-300" data-v-e330fa24>5,00,000+ patients supported in critical moments</span></div><div class="relative" data-v-e330fa24><p class="text-green-300/80 text-xl mb-4 max-w-lg" data-v-e330fa24> A reflection of expanding access to emergency and medical services. </p><div class="flex items-center gap-8" data-v-e330fa24><div class="w-20 h-20 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center shadow-2xl" data-v-e330fa24><span class="text-green-500 text-4xl font-bold animate-bounce" data-v-e330fa24>↑</span></div><div class="animate-fade-in-up" data-v-e330fa24><h2 class="stat-number text-8xl font-bold text-white tracking-tighter" data-v-e330fa24>${ssrInterpolate(Math.floor(5e5 * _ctx.countProgress).toLocaleString())}+ </h2><p class="text-gray-400 text-sm uppercase tracking-[0.2em] mt-2" data-v-e330fa24>Lives Saved</p></div></div></div></div></div></div></section>`);
}
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/StatsSection/StatsSection.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const StatsSection = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["ssrRender", _sfc_ssrRender$8], ["__scopeId", "data-v-e330fa24"]]);
const _sfc_main$9 = {
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String,
      default: "https://placehold.co/800x600/222/FFF?text=Training+Image"
    },
    buttonText: {
      type: String,
      default: "Explore"
    },
    layout: {
      type: String,
      default: "text-left",
      // 'text-left' or 'text-right'
      validator: (value) => ["text-left", "text-right"].includes(value)
    }
  }
};
function _sfc_ssrRender$7(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "training-card w-full flex flex-col md:flex-row min-h-[500px]" }, _attrs))} data-v-b02303a5><div class="${ssrRenderClass([_ctx.layout === "text-right" ? "md:order-2" : "md:order-1", "flex-1 p-8 md:p-16 flex flex-col justify-center"])}" data-v-b02303a5><h3 class="text-2xl md:text-4xl font-bold text-white mb-6 leading-tight uppercase tracking-wide" data-v-b02303a5>${ssrInterpolate(_ctx.title)}</h3><p class="text-gray-300 text-lg leading-relaxed mb-10 max-w-xl" data-v-b02303a5>${ssrInterpolate(_ctx.description)}</p><button class="action-btn text-white font-bold py-3 px-8 rounded-full flex items-center gap-3 w-max" data-v-b02303a5><span class="border border-white/50 rounded-full w-5 h-5 flex items-center justify-center text-[10px]" data-v-b02303a5>↗</span> ${ssrInterpolate(_ctx.buttonText)}</button></div><div class="${ssrRenderClass([_ctx.layout === "text-right" ? "md:order-1" : "md:order-2", "flex-1 relative min-h-[300px] md:min-h-full"])}" data-v-b02303a5><div class="absolute inset-4 md:inset-8 rounded-2xl overflow-hidden" data-v-b02303a5><img${ssrRenderAttr("src", _ctx.image)}${ssrRenderAttr("alt", _ctx.title)} class="w-full h-full object-cover transition-transform duration-700 hover:scale-110" data-v-b02303a5></div></div></div>`);
}
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/TrainingCard/TrainingCard.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const TrainingCard = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["ssrRender", _sfc_ssrRender$7], ["__scopeId", "data-v-b02303a5"]]);
const _sfc_main$8 = {
  components: { TrainingCard },
  setup() {
    const items = [
      {
        title: "Infrastructure that Powers Reliable Response",
        description: "ALSA's centralised operations workplace enables real-time coordination and reliable emergency response for hospitals and healthcare enterprises.",
        image: "https://placehold.co/800x600/111/FFF?text=Operations+Center",
        buttonText: "Explore Hospital Solutions",
        layout: "text-left"
      },
      {
        title: "Education & Training that Empower Excellence",
        description: "At ALSA, continuous education strengthens emergency readiness. This builds skilled professionals prepared to respond with clarity and precision when it matters most.",
        image: "https://placehold.co/800x600/111/FFF?text=CPR+Training",
        buttonText: "Explore Training Programs",
        layout: "text-right"
      }
    ];
    return {
      items
    };
  }
};
function _sfc_ssrRender$6(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_TrainingCard = resolveComponent("TrainingCard");
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "training-section py-24" }, _attrs))} data-v-19a71f73><div class="container mx-auto px-4 flex flex-col gap-12" data-v-19a71f73><!--[-->`);
  ssrRenderList(_ctx.items, (item, index) => {
    _push(ssrRenderComponent(_component_TrainingCard, {
      key: index,
      title: item.title,
      description: item.description,
      image: item.image,
      buttonText: item.buttonText,
      layout: item.layout
    }, null, _parent));
  });
  _push(`<!--]--></div></section>`);
}
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/TrainingSection/TrainingSection.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const TrainingSection = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["ssrRender", _sfc_ssrRender$6], ["__scopeId", "data-v-19a71f73"]]);
const _sfc_main$7 = {
  props: {
    title: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    image: {
      type: String,
      default: "https://placehold.co/600x600/222/FFF?text=Blog+Post"
    }
  }
};
function _sfc_ssrRender$5(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "blog-card aspect-square cursor-pointer group" }, _attrs))} data-v-253273a4><div class="w-full h-full relative z-0" data-v-253273a4><img${ssrRenderAttr("src", _ctx.image)}${ssrRenderAttr("alt", _ctx.title)} class="blog-image w-full h-full object-cover" data-v-253273a4></div><div class="blog-overlay absolute inset-0 flex flex-col justify-end p-6 md:p-8 opacity-90 group-hover:opacity-100 transition-opacity" data-v-253273a4><h4 class="text-white font-bold text-lg md:text-xl leading-snug mb-2 uppercase tracking-wide group-hover:text-green-400 transition-colors" data-v-253273a4>${ssrInterpolate(_ctx.title)}</h4><p class="text-gray-400 text-xs md:text-sm font-mono" data-v-253273a4>${ssrInterpolate(_ctx.date)}</p></div></div>`);
}
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/BlogCard/BlogCard.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const BlogCard = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["ssrRender", _sfc_ssrRender$5], ["__scopeId", "data-v-253273a4"]]);
const _sfc_main$6 = {
  components: { BlogCard },
  setup() {
    const blogs = [
      {
        title: "When is an Air Ambulance a Right Choice?",
        date: "12 DEC 2025",
        image: "https://placehold.co/600x600/111/FFF?text=Air+Ambulance"
      },
      {
        title: "Emergency Medical Support for Large Scale Events...",
        date: "05 DEC 2025",
        image: "https://placehold.co/600x600/222/FFF?text=Event+Support"
      },
      {
        title: "Road vs Rail: Which is Better for Long Distance?",
        date: "30 NOV 2025",
        image: "https://placehold.co/600x600/333/FFF?text=Road+vs+Rail"
      },
      {
        title: "What Happens Inside an ICU Ambulance...",
        date: "15 OCT 2025",
        image: "https://placehold.co/600x600/444/FFF?text=Inside+ICU"
      },
      {
        title: "ICU Setup at Home: Bringing ICU Care Home",
        date: "22 AUG 2025",
        image: "https://placehold.co/600x600/555/FFF?text=ICU+At+Home"
      },
      {
        title: "Improving Emergency Access Across India",
        date: "12 JUL 2025",
        image: "https://placehold.co/600x600/666/FFF?text=Emergency+Access"
      }
    ];
    return {
      blogs
    };
  }
};
function _sfc_ssrRender$4(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_BlogCard = resolveComponent("BlogCard");
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "blog-section py-24" }, _attrs))} data-v-96b68db1><div class="container mx-auto px-4" data-v-96b68db1><div class="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 -mx-4 px-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:pb-0 md:mx-0 md:px-0 scrollbar-hide" data-v-96b68db1><!--[-->`);
  ssrRenderList(_ctx.blogs, (blog, index) => {
    _push(`<div class="w-[300px] min-w-[300px] sm:w-[320px] sm:min-w-[320px] snap-center md:min-w-0 md:w-auto flex-shrink-0 md:flex-shrink" data-v-96b68db1>`);
    _push(ssrRenderComponent(_component_BlogCard, {
      title: blog.title,
      date: blog.date,
      image: blog.image
    }, null, _parent));
    _push(`</div>`);
  });
  _push(`<!--]--></div></div></section>`);
}
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/BlogSection/BlogSection.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const BlogSection = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["ssrRender", _sfc_ssrRender$4], ["__scopeId", "data-v-96b68db1"]]);
const _sfc_main$5 = {
  setup() {
    return {};
  }
};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "five-g-section h-[500px] md:h-[600px] relative flex items-center overflow-hidden" }, _attrs))} data-v-32a490b2><div class="five-g-overlay absolute inset-0 z-0" data-v-32a490b2></div><div class="container mx-auto px-4 relative z-10 h-full flex items-center" data-v-32a490b2><div class="max-w-xl" data-v-32a490b2><h2 class="text-3xl md:text-5xl font-bold text-white mb-6 uppercase leading-tight tracking-wide" data-v-32a490b2> Powering Emergency <br data-v-32a490b2> Response With <br data-v-32a490b2> <span class="text-white" data-v-32a490b2>5G Connectivity</span></h2><p class="text-gray-300 text-base md:text-lg mb-10 leading-relaxed max-w-lg" data-v-32a490b2> Seamless real time connectivity enabling faster coordination and uninterrupted emergency care on the move. </p><button class="book-btn text-white font-bold py-3 px-8 rounded-full flex items-center gap-3 shadow-lg" data-v-32a490b2><span class="border border-white/50 rounded-full w-5 h-5 flex items-center justify-center text-[10px]" data-v-32a490b2>↗</span> Book Now </button></div></div></section>`);
}
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/FiveGSection/FiveGSection.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const FiveGSection = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["ssrRender", _sfc_ssrRender$3], ["__scopeId", "data-v-32a490b2"]]);
const _sfc_main$4 = {
  setup() {
    const activeIndex = ref(null);
    const faqs = [
      { question: "How can i contact support team?", answer: 'You can reach our 24/7 support team via the "Call Now" button, our hotline 1800-ALSA-HELP, or email support@alsa.com.' },
      { question: "What types of ambulances do you operate?", answer: "We operate Basic Life Support (BLS), Advanced Life Support (ALS), ICU Ambulances, and Air Ambulances equipped with critical care facilities." },
      { question: "Do you provide inter-hospital transfers?", answer: "Yes, we specialize in seamless bed-to-bed inter-hospital transfers with continuous medical monitoring." },
      { question: "Is the service available 24×7?", answer: "Absolutely. Our emergency response network is active 24 hours a day, 365 days a year, across all our covered regions." },
      { question: "Do you operate across cities and states in India?", answer: "Yes, we have a nationwide network covering major metros and tier-2 cities, facilitating long-distance medical transport." },
      { question: "How early should we book medical support for an event?", answer: "We recommend booking at least 48 hours in advance for large events to ensure adequate resource allocation and planning." }
    ];
    const toggle = (index) => {
      activeIndex.value = activeIndex.value === index ? null : index;
    };
    return {
      faqs,
      activeIndex,
      toggle
    };
  }
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "faq-section py-24 px-4" }, _attrs))} data-v-327ccc96><div class="container mx-auto" data-v-327ccc96><div class="faq-container p-8 md:p-16 flex flex-col lg:flex-row gap-12 lg:gap-24" data-v-327ccc96><div class="lg:w-1/3 flex flex-col justify-center" data-v-327ccc96><h2 class="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight" data-v-327ccc96> All your questions, <br data-v-327ccc96><span class="text-gray-400" data-v-327ccc96>clearly answered</span></h2><p class="text-gray-400 text-lg mb-10 max-w-sm" data-v-327ccc96> Transparent answers for patients, families, and partners. </p><button class="call-btn w-max text-white font-bold py-3 px-8 rounded-full flex items-center gap-3 shadow-lg" data-v-327ccc96><span class="border border-white/50 rounded-full w-5 h-5 flex items-center justify-center text-[10px]" data-v-327ccc96>↗</span> Call Now </button></div><div class="lg:w-2/3 flex flex-col gap-4" data-v-327ccc96><!--[-->`);
  ssrRenderList(_ctx.faqs, (item, index) => {
    _push(`<div class="${ssrRenderClass([{ "is-active": _ctx.activeIndex === index }, "faq-item cursor-pointer px-8 py-5"])}" data-v-327ccc96><div class="flex items-center justify-between" data-v-327ccc96><h3 class="faq-question text-white/90 font-medium text-lg select-none" data-v-327ccc96>${ssrInterpolate(item.question)}</h3><span class="faq-icon text-gray-500" data-v-327ccc96><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-327ccc96><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-v-327ccc96></path></svg></span></div><div class="faq-answer-wrapper" data-v-327ccc96><p class="text-gray-400 pt-2 pb-1 leading-relaxed" data-v-327ccc96>${ssrInterpolate(item.answer)}</p></div></div>`);
  });
  _push(`<!--]--></div></div></div></section>`);
}
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/FaqSection/FaqSection.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const FaqSection = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["ssrRender", _sfc_ssrRender$2], ["__scopeId", "data-v-327ccc96"]]);
const _sfc_main$3 = {
  setup() {
    const form = ref({
      name: "",
      contact: "",
      message: ""
    });
    const submitForm = () => {
      alert(`Thank you ${form.value.name}! We will contact you soon.`);
      form.value = { name: "", contact: "", message: "" };
    };
    return {
      form,
      submitForm
    };
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "contact-us-section py-24" }, _attrs))} data-v-d5296060><div class="container mx-auto px-4 flex flex-col lg:flex-row gap-16 items-start lg:items-center" data-v-d5296060><div class="lg:w-1/2 text-white" data-v-d5296060><div class="mb-12" data-v-d5296060><h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4" data-v-d5296060>Official Address</h3><p class="text-lg leading-relaxed text-gray-200" data-v-d5296060> Plot No. 1114<br data-v-d5296060> Sector 38, Near Medanta, The Medicity<br data-v-d5296060> Gurugram, Haryana 122001 </p></div><div class="mb-12" data-v-d5296060><h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4" data-v-d5296060>Call Us</h3><div class="space-y-2" data-v-d5296060><p class="text-lg" data-v-d5296060><span class="text-gray-400 w-32 inline-block" data-v-d5296060>Emergency:</span><span class="font-bold tracking-wide" data-v-d5296060>+91 88 02 02 02 45</span></p><p class="text-lg" data-v-d5296060><span class="text-gray-400 w-32 inline-block" data-v-d5296060>General Enquires:</span><span class="font-bold tracking-wide" data-v-d5296060>+91 99 11 700 900</span></p></div></div><div data-v-d5296060><h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4" data-v-d5296060>Email</h3><p class="text-lg text-gray-200" data-v-d5296060> alsagurgaon@gmail.com </p></div></div><div class="lg:w-1/2 w-full" data-v-d5296060><div class="form-card p-8 md:p-12" data-v-d5296060><h3 class="text-xl text-white mb-2" data-v-d5296060>Have a question or need assistance?</h3><p class="text-gray-400 text-sm mb-8" data-v-d5296060>Share your details below and we&#39;ll respond at the earliest.</p><form class="space-y-6" data-v-d5296060><div data-v-d5296060><input${ssrRenderAttr("value", _ctx.form.name)} type="text" placeholder="Name" class="glass-input w-full px-6 py-4" required data-v-d5296060></div><div data-v-d5296060><input${ssrRenderAttr("value", _ctx.form.contact)} type="text" placeholder="Contact" class="glass-input w-full px-6 py-4" required data-v-d5296060></div><div data-v-d5296060><textarea rows="4" placeholder="Tell us how we can assist you.." class="glass-input glass-textarea w-full px-6 py-4 resize-none" required data-v-d5296060>${ssrInterpolate(_ctx.form.message)}</textarea></div><div class="flex justify-start" data-v-d5296060><button type="submit" class="submit-btn text-white font-bold py-3 px-10 rounded-full flex items-center gap-3" data-v-d5296060><span class="border border-white/50 rounded-full w-5 h-5 flex items-center justify-center text-[10px]" data-v-d5296060>↗</span> Submit </button></div></form></div></div></div></section>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ContactUsSection/ContactUsSection.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const ContactUsSection = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-d5296060"]]);
const _sfc_main$2 = {
  setup() {
    return {};
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<footer${ssrRenderAttrs(mergeProps({ class: "app-footer py-8" }, _attrs))} data-v-896bfc8f><div class="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0" data-v-896bfc8f><div class="flex items-center gap-3" data-v-896bfc8f><div class="flex flex-col items-center" data-v-896bfc8f><img${ssrRenderAttr("src", _imports_0$1)} alt="ALSA Logo" class="w-12 h-auto object-contain" data-v-896bfc8f></div><div class="text-left leading-tight" data-v-896bfc8f><h1 class="text-white font-bold text-sm tracking-wide" data-v-896bfc8f>AYUSHMAAN<br data-v-896bfc8f>LIFE SUPPORT<br data-v-896bfc8f>AMBULANCE</h1></div></div><nav class="flex items-center flex-wrap justify-center" data-v-896bfc8f><a href="#" class="footer-nav-link" data-v-896bfc8f>About us</a><div class="separator hidden md:block" data-v-896bfc8f></div><a href="#" class="footer-nav-link" data-v-896bfc8f>Services</a><div class="separator hidden md:block" data-v-896bfc8f></div><a href="#" class="footer-nav-link" data-v-896bfc8f>Solutions</a><div class="separator hidden md:block" data-v-896bfc8f></div><a href="#" class="footer-nav-link" data-v-896bfc8f>Network</a><div class="separator hidden md:block" data-v-896bfc8f></div><a href="#" class="footer-nav-link" data-v-896bfc8f>Explore</a></nav><div class="flex items-center gap-4" data-v-896bfc8f><a href="#" data-v-896bfc8f><svg class="social-icon" viewBox="0 0 24 24" data-v-896bfc8f><path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.15 5.96C15.21 5.96 16.12 6.04 16.12 6.04V8.51H15.01C13.77 8.51 13.38 9.28 13.38 10.07V12.06H16.16L15.72 14.96H13.38V21.96C15.76 21.58 17.9 20.35 19.45 18.52C21 16.69 21.9 14.43 22 12.06C22 6.53 17.5 2.04 12 2.04Z" data-v-896bfc8f></path></svg></a><a href="#" data-v-896bfc8f><svg class="social-icon" viewBox="0 0 24 24" data-v-896bfc8f><path d="M18.9 5.85H21.18L14.22 13.84L22.4 24.65H17.8L14.2 19.89L10.07 24.65H7.78L15.3 16.03L7.5 5.85H12.23L15.28 9.9L18.9 5.85ZM18.09 23.27H19.35L11.51 12.87L18.09 23.27ZM9.69 7.21H8.43L15.93 17.15L9.69 7.21Z" data-v-896bfc8f></path></svg></a><a href="#" data-v-896bfc8f><svg class="social-icon" viewBox="0 0 24 24" data-v-896bfc8f><path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M19,5A1,1 0 0,1 20,6A1,1 0 0,1 19,7A1,1 0 0,1 18,6A1,1 0 0,1 19,5Z" data-v-896bfc8f></path></svg></a></div></div><div class="border-t border-gray-900 mt-8 pt-8 pb-4 bg-black/50" data-v-896bfc8f><div class="container mx-auto px-4" data-v-896bfc8f><h4 class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4" data-v-896bfc8f>Emergency Service Directory</h4><div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px] text-gray-600" data-v-896bfc8f><a href="#" class="hover:text-green-500 transition-colors" data-v-896bfc8f>Air Ambulance Services in Gurgaon</a><a href="#" class="hover:text-green-500 transition-colors" data-v-896bfc8f>Ambulance near Medanta Hospital</a><a href="#" class="hover:text-green-500 transition-colors" data-v-896bfc8f>ICU Ambulance Delhi NCR</a><a href="#" class="hover:text-green-500 transition-colors" data-v-896bfc8f>Air Ambulance India to Nepal</a><a href="#" class="hover:text-green-500 transition-colors" data-v-896bfc8f>Rail Ambulance Services</a><a href="#" class="hover:text-green-500 transition-colors" data-v-896bfc8f>24/7 Emergency Medical Flights</a><a href="#" class="hover:text-green-500 transition-colors" data-v-896bfc8f>Private Ambulance for Hospital Transfer</a><a href="#" class="hover:text-green-500 transition-colors" data-v-896bfc8f>Road to Air Ambulance Transfer</a><a href="#" class="hover:text-green-500 transition-colors" data-v-896bfc8f>Event Medical Support Gurgaon</a><a href="#" class="hover:text-green-500 transition-colors" data-v-896bfc8f>Ventilator Ambulance Service</a><a href="#" class="hover:text-green-500 transition-colors" data-v-896bfc8f>Trusted Life Support Provider</a><a href="#" class="hover:text-green-500 transition-colors" data-v-896bfc8f>Emergency Accident Response India</a></div><p class="text-[10px] text-gray-700 mt-8 text-center" data-v-896bfc8f> © 2025 Ayushmaan Life Support Ambulance. All rights reserved. | <a href="#" class="hover:text-white" data-v-896bfc8f>Privacy Policy</a></p></div></div></footer>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/AppFooter/AppFooter.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const AppFooter = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-896bfc8f"]]);
const _sfc_main$1 = {
  __name: "HomeView",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Ayushmaan Life Support Ambulance | Air, Road & Rail Emergency Services 24/7",
      meta: [
        { name: "description", content: "Leading trusted life support ambulance provider in India. Offering 24/7 emergency medical transport via Air, Road, and Rail. ICU, Ventilator, and Critical Care services available in Delhi, Gurgaon, and Pan-India." },
        { name: "keywords", content: "ambulance service, life support ambulance, air ambulance India, road ambulance Gurgaon, rail ambulance services, emergency medical transport, ICU ambulance, patient transport, 24/7 ambulance Delhi NCR, Ayushmaan Life Support" },
        { property: "og:title", content: "Ayushmaan Life Support Ambulance | Rapid Response Expert Care" },
        { property: "og:description", content: "24/7 Emergency Medical Services (EMS) provider. Best Air, Road & Rail Ambulance services in India with ICU setup." },
        { property: "og:image", content: "https://ayushman-ambulance.web.app/alsalogo.png" },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "en_IN" },
        { name: "geo.region", content: "IN-DL" },
        // Targeting Delhi/NCR region signal
        { name: "geo.placename", content: "New Delhi" }
      ],
      script: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalOrganization",
            name: "Ayushmaan Life Support Ambulance",
            url: "https://ayushman-ambulance.web.app",
            logo: "https://ayushman-ambulance.web.app/logo.png",
            // Replace with actual logo URL if available
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+91-8802020245",
              contactType: "emergency",
              areaServed: "IN",
              availableLanguage: ["en", "hi"]
            },
            address: {
              "@type": "PostalAddress",
              streetAddress: "Plot No. 1114, Sector 38",
              addressLocality: "Gurugram",
              addressRegion: "Haryana",
              postalCode: "122001",
              addressCountry: "IN"
            },
            sameAs: [
              "https://www.facebook.com/AyushmanAmbulance",
              "https://twitter.com/AyushmanEMS",
              "https://www.instagram.com/AyushmanEMS"
            ],
            makesOffer: [
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Air Ambulance Service",
                  description: "ICU equipped air ambulance for critical patient transfer."
                }
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Road Ambulance Service",
                  description: "Advanced Life Support (ALS) and Basic Life Support (BLS) road ambulances."
                }
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Rail Ambulance Service",
                  description: "Cost-effective long-distance medical transport via train."
                }
              }
            ]
          })
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "text-white min-h-screen flex flex-col" }, _attrs))}>`);
      _push(ssrRenderComponent(HeroSection, null, null, _parent));
      _push(ssrRenderComponent(MoreThanServiceSection, null, null, _parent));
      _push(ssrRenderComponent(PartnerSection, null, null, _parent));
      _push(ssrRenderComponent(OurServicesSection, null, null, _parent));
      _push(ssrRenderComponent(FacilitiesSection, null, null, _parent));
      _push(ssrRenderComponent(TestimonialSection, null, null, _parent));
      _push(ssrRenderComponent(AlsaNetworkSection, null, null, _parent));
      _push(ssrRenderComponent(EventSupportSection, null, null, _parent));
      _push(ssrRenderComponent(StatsSection, null, null, _parent));
      _push(ssrRenderComponent(TrainingSection, null, null, _parent));
      _push(ssrRenderComponent(BlogSection, null, null, _parent));
      _push(ssrRenderComponent(FiveGSection, null, null, _parent));
      _push(ssrRenderComponent(FaqSection, null, null, _parent));
      _push(ssrRenderComponent(ContactUsSection, null, null, _parent));
      _push(ssrRenderComponent(AppFooter, null, null, _parent));
      _push(`</main>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/HomeView.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "ServiceView",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const contentMap = {
      "/services/air-ambulance-india": {
        title: "Air Ambulance Services India | International Medical Flights",
        metaDesc: "Best Air Ambulance Service in India. Low cost medical flights, ICU aircraft, and rapid international patient transfer to Nepal, Dubai, and USA.",
        heading: "Advanced Air Ambulance Services in India",
        subHeading: "Rapid. Reliable. ICU on Wings.",
        description: "When time is critical, our Air Ambulance services provide the fastest medical response. Equipped with state-of-the-art ICU setups and specialized medical teams, we ensure seamless bedside-to-bedside transfers across India and internationally.",
        features: ["ICU & Ventilator Setup", "Expert Medical Team", "Bed-to-Bed Transfer", "International Repatriation"],
        bgImage: "/morethanservice.webp"
        // Reusing existing asset or placeholder
      },
      "/services/rail-ambulance": {
        title: "Rail Ambulance Services | Cost-Effective Medical Transport",
        metaDesc: "Affordable Rail Ambulance services in India. AC train medical transport with ICU setup, doctor, and paramedic monitoring for long-distance travel.",
        heading: "Economical Rail Ambulance Solutions",
        subHeading: "Safe Long-Distance Transport.",
        description: "Our Rail Ambulance service transforms AC train compartments into mobile ICUs. It is the most cost-effective solution for stable patients requiring long-distance transport with continuous medical monitoring.",
        features: ["Cost-Effective", "ICU Setup on Train", "Doctor on Board", "Pan-India Network"],
        bgImage: "/morethanservice.webp"
      },
      "/services/road-ambulance": {
        title: "Road Ambulance Service | ACLS, BLS & ICU Ambulance",
        metaDesc: "24/7 Road Ambulance service near you. ICU, Ventilator, and Oxygen ambulances for local and outstation patient transport. Rapid response guarantee.",
        heading: "24/7 Advanced Road Ambulance Network",
        subHeading: "Every Minute Counts.",
        description: "From Basic Life Support (BLS) to Advanced Life Support (ALS) ICU ambulances, our fleet is ready 24/7. We act as mobile hospitals, stabilizing patients during critical transit to the nearest hospital.",
        features: ["Oxygen Support", "Ventilator & ICU", "GPS Tracking", "24/7 Availability"],
        bgImage: "/morethanservice.webp"
      },
      "/locations/ambulance-service-gurgaon-delhi-ncr": {
        title: "Ambulance Service Gurgaon & Delhi NCR | Near Medanta Hospital",
        metaDesc: "Top-rated Ambulance service in Gurgaon and Delhi NCR. Nearest ambulance to Medanta Hospital. ICU, Cardiac, and Emergency ambulances 24/7.",
        heading: "Emergency Ambulance Service in Gurgaon & Delhi NCR",
        subHeading: "Trusted Local Response.",
        description: "Strategically positioned in Gurgaon near Medanta Medicity, Fortis, and Max hospitals. We provide the fastest emergency response time in Delhi NCR for cardiac arrests, accidents, and critical care transfers.",
        features: ["Near Medanta Hospital", "15 Minute Response", "Trauma Care Experts", "Corporate & Event Support"],
        bgImage: "/morethanservice.webp"
      },
      "/services/event-medical-support": {
        title: "Event Medical Support & Ambulance Standby Services",
        metaDesc: "Professional medical support for corporate events, marathons, weddings, and sports in Delhi NCR. On-site ambulance and doctor standby.",
        heading: "Event Medical Support & Standby",
        subHeading: "Safety for Your Guests.",
        description: "Ensure the safety of your attendees with our on-site medical standby services. From corporate meets to large-scale sports events, our unparalleled medical coverage gives you peace of mind.",
        features: ["On-Site Doctor", "ALS Ambulance Standby", "First Aid Stations", "Rapid Evacuation Plan"],
        bgImage: "/morethanservice.webp"
      }
    };
    const defaultContent = {
      title: "All Services | Ayushmaan Life Support",
      heading: "Our Medical Services",
      description: "Comprehensive emergency medical solutions.",
      features: []
    };
    const content = computed(() => contentMap[route.path] || defaultContent);
    useHead({
      title: computed(() => content.value.title),
      meta: [
        { name: "description", content: computed(() => content.value.metaDesc) },
        { property: "og:title", content: computed(() => content.value.title) },
        { property: "og:description", content: computed(() => content.value.metaDesc) },
        { property: "og:image", content: "https://ayushman-ambulance.web.app/alsalogo.png" }
      ],
      script: [
        {
          type: "application/ld+json",
          children: computed(() => JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: content.value.heading,
            description: content.value.metaDesc,
            provider: {
              "@type": "MedicalOrganization",
              name: "Ayushmaan Life Support Ambulance",
              url: "https://ayushman-ambulance.web.app",
              logo: "https://ayushman-ambulance.web.app/logo.png"
            },
            serviceType: content.value.title,
            areaServed: {
              "@type": "Country",
              name: "India"
            },
            offers: content.value.features.map((feature) => ({
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: feature
              }
            }))
          }))
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-900 text-white" }, _attrs))}><div class="relative h-[60vh] flex items-center justify-center overflow-hidden"><div class="absolute inset-0 bg-cover bg-center opacity-40" style="${ssrRenderStyle({ backgroundImage: `url(${content.value.bgImage})` })}"></div><div class="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div><div class="container mx-auto px-4 relative z-10 text-center"><span class="text-green-500 tracking-widest uppercase text-sm font-bold mb-4 block">${ssrInterpolate(content.value.subHeading)}</span><h1 class="text-4xl md:text-6xl font-black mb-6">${ssrInterpolate(content.value.heading)}</h1><p class="text-xl text-gray-300 max-w-2xl mx-auto">${ssrInterpolate(content.value.description)}</p><div class="mt-8 flex gap-4 justify-center"><button class="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition transform hover:scale-105"> Call Now: +91 8802020245 </button></div></div></div><div class="py-20 bg-slate-900"><div class="container mx-auto px-4"><h2 class="text-center text-3xl font-bold mb-12 uppercase tracking-wide">Key Features</h2><div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8"><!--[-->`);
      ssrRenderList(content.value.features, (feature, index) => {
        _push(`<div class="p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-green-500 transition-colors"><div class="w-12 h-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4 text-xl font-bold">✓</div><h3 class="text-xl font-bold text-white">${ssrInterpolate(feature)}</h3></div>`);
      });
      _push(`<!--]--></div></div></div><div class="py-16 bg-gradient-to-r from-red-900 to-slate-900 text-center"><div class="container mx-auto px-4"><h2 class="text-3xl font-bold mb-4">Need Immediate Assistance?</h2><p class="text-gray-300 mb-8">Our emergency coordination team is available 24/7 to assist you.</p><a href="tel:+918802020245" class="inline-block bg-white text-red-900 font-black py-4 px-10 rounded-full text-lg shadow-xl hover:bg-gray-100 transition"> DIAL EMERGENCY: 88-02-02-02-45 </a></div></div>`);
      _push(ssrRenderComponent(AppFooter, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/ServiceView.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const routes = [
  { path: "/", component: _sfc_main$1 },
  { path: "/services/air-ambulance-india", component: _sfc_main },
  { path: "/services/rail-ambulance", component: _sfc_main },
  { path: "/services/road-ambulance", component: _sfc_main },
  { path: "/locations/ambulance-service-gurgaon-delhi-ncr", component: _sfc_main },
  { path: "/services/event-medical-support", component: _sfc_main },
  { path: "/blog", component: () => import("./assets/BlogListView-BGcHRw8n.js") },
  { path: "/blog/:slug", component: () => import("./assets/BlogPostView-vFytZyXM.js") }
];
const createApp = ViteSSG(
  _sfc_main$n,
  { routes },
  ({ app, router, routes: routes2, isClient, initialState }) => {
    if (isClient) {
      console.log("--- Font Loading Status ---");
      const fontsToCheck = ["16px Balthazar", "16px Copperplate"];
      const loadPromises = fontsToCheck.map((font) => document.fonts.load(font));
      Promise.all(loadPromises).then(() => {
        fontsToCheck.forEach((font) => {
          const isLoaded = document.fonts.check(font);
          console.log(`[Check] ${font}: ${isLoaded ? "LOADED ✅" : "NOT LOADED ❌"}`);
        });
        console.log("--- Detail Loaded Fonts ---");
        document.fonts.forEach((font) => {
          console.log(`Face: ${font.family}, Status: ${font.status}, Display: ${font.display}`);
        });
      });
    }
  }
);
export {
  _export_sfc as _,
  createApp
};
