import { ref, onMounted, resolveComponent, mergeProps, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
import { d as db } from "./firebase-Crgu2wtc.js";
import { query, collection, orderBy, getDocs } from "firebase/firestore";
import { _ as _export_sfc } from "../main.mjs";
import "firebase/app";
import "hookable";
import "vue-router";
import "@vueuse/head";
const _sfc_main = {
  __name: "BlogListView",
  __ssrInlineRender: true,
  setup(__props) {
    const posts = ref([]);
    const loading = ref(true);
    onMounted(async () => {
      try {
        const q = query(collection(db, "blogs"), orderBy("publishedDate", "desc"));
        const querySnapshot = await getDocs(q);
        posts.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      } catch (e) {
        console.error("Error fetching blogs: ", e);
      } finally {
        loading.value = false;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "blog-list" }, _attrs))} data-v-31c3175b><h1 data-v-31c3175b>Our Blog</h1>`);
      if (loading.value) {
        _push(`<div data-v-31c3175b>Loading...</div>`);
      } else {
        _push(`<div class="grid" data-v-31c3175b><!--[-->`);
        ssrRenderList(posts.value, (post) => {
          _push(`<div class="blog-card" data-v-31c3175b><h2 data-v-31c3175b>${ssrInterpolate(post.title)}</h2><p data-v-31c3175b>${ssrInterpolate(post.summary)}</p>`);
          _push(ssrRenderComponent(_component_router_link, {
            to: `/blog/${post.slug}`
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Read More`);
              } else {
                return [
                  createTextVNode("Read More")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/BlogListView.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const BlogListView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-31c3175b"]]);
export {
  BlogListView as default
};
