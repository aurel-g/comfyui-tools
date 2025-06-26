/* Workflow Loader Sidebar Tab */

(async function register() {
  // Wait until the ComfyUI frontend exposes the sidebar API
  function ready() {
    return new Promise((res) => {
      if (window.ComfySidebarTabs) return res();
      document.addEventListener("comfy-sidebar-tabs-ready", () => res(), {
        once: true,
      });
    });
  }

  await ready();
  const { registerSidebarTab } = window.ComfySidebarTabs;

  registerSidebarTab({
    id: "workflow-loader",
    label: "Workflows",
    icon: "📂",
    element: createPanel,
  });

  async function createPanel() {
    const root = document.createElement("div");
    root.style.padding = "8px";
    root.style.fontFamily = "sans-serif";

    const ctx = await getContext();

    // Context summary
    const ctxDiv = document.createElement("div");
    ctxDiv.innerHTML = `<strong>Context</strong><br>
      Show: ${ctx.show || "-"}<br>
      Shot: ${ctx.shot || "-"}<br>
      Task: ${ctx.task || "-"}<br>
      Version: ${ctx.version || "-"}`;
    root.appendChild(ctxDiv);

    // Workflow list
    const list = document.createElement("ul");
    list.style.paddingLeft = "1em";
    list.style.marginTop = "8px";

    if (ctx.workflows && ctx.workflows.length) {
      ctx.workflows.forEach((fname) => {
        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.textContent = fname;
        btn.style.cursor = "pointer";
        btn.onclick = () => loadWorkflow(ctx.workflow_dir + "/" + fname);
        li.appendChild(btn);
        list.appendChild(li);
      });
    } else {
      list.innerHTML = "<em>No workflows found</em>";
    }
    root.appendChild(list);

    return root;
  }

  async function getContext() {
    try {
      const resp = await fetch("static/custom_nodes/comfyui-tools/web/runtime/context.json?v=" + Date.now());
      if (!resp.ok) throw new Error(resp.statusText);
      return await resp.json();
    } catch (err) {
      console.error("Workflow loader: unable to fetch context.json", err);
      return {};
    }
  }

  // Attempt to invoke ComfyUI frontend load
  async function loadWorkflow(path) {
    if (window.App && App.loadGraphFromUrl) {
      App.loadGraphFromUrl(path);
    } else {
      alert("ComfyUI frontend API not found; cannot load workflow.");
    }
  }
})();
