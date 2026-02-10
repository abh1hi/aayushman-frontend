import { ref, onMounted, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate } from "vue/server-renderer";
import { useRoute } from "vue-router";
import { d as db } from "./firebase-Crgu2wtc.js";
import { query, collection, where, getDocs } from "firebase/firestore";
import { useHead } from "@vueuse/head";
import { _ as _export_sfc } from "../main.mjs";
import "firebase/app";
import "hookable";
const _sfc_main = {
  __name: "BlogPostView",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const post = ref(null);
    onMounted(async () => {
      const slug = route.params.slug;
      const q = query(collection(db, "blogs"), where("slug", "==", slug));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        post.value = querySnapshot.docs[0].data();
        useHead({
          title: post.value.title,
          meta: [
            { name: "description", content: post.value.summary },
            { property: "og:title", content: post.value.title },
            { property: "og:description", content: post.value.summary },
            { property: "og:image", content: post.value.coverImage || "https://ayushman-ambulance.web.app/alsalogo.png" }
          ]
        });
      }
    });
    const formatDate = (timestamp) => {
      if (!timestamp) return "";
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString();
    };
    return (_ctx, _push, _parent, _attrs) => {
      if (post.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "blog-post" }, _attrs))} data-v-9b37108d><h1 data-v-9b37108d>${ssrInterpolate(post.value.title)}</h1><div class="meta" data-v-9b37108d>Published on ${ssrInterpolate(formatDate(post.value.publishedDate))}</div><div class="content" data-v-9b37108d>${post.value.content ?? ""}</div></div>`);
      } else {
        _push(`<div${ssrRenderAttrs(_attrs)} data-v-9b37108d>Loading...</div>`);
      }
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/BlogPostView.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const BlogPostView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-9b37108d"]]);
export {
  BlogPostView as default
};
