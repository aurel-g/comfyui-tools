/* Workflow Loader Sidebar Tab */
(function () {
  function whenReady(cb) {
    if (window.app && app.registerExtension) return cb();
    document.addEventListener("comfyLoaded", () => cb(), { once: true });
  }

  whenReady(() => {
    app.registerExtension({
      name: "workflow-loader-ext",
      sidebarTabs: [
        {
          id: "workflow-loader",
          name: "Workflows",
          icon: "📂", // change to logo path if added
          type: "custom",
          render: async (element) => {
            element.innerHTML = "Loading context...";
            const ctx = await getContext();
            element.innerHTML = ""; // clear

            const ctxDiv = document.createElement("div");
            ctxDiv.innerHTML = `<strong>Context</strong><br>
              Show: ${ctx.show || "-"}<br>
              Shot: ${ctx.shot || "-"}<br>
              Task: ${ctx.task || "-"}<br>
              Version: ${ctx.version || "-"}`;
            element.appendChild(ctxDiv);

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
            element.appendChild(list);
          },
        },
      ],
    });
  });

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

  function loadWorkflow(path) {
    if (window.App && App.loadGraphFromUrl) {
      App.loadGraphFromUrl(path);
    } else {
      alert("ComfyUI frontend API not found; cannot load workflow.");
    }
  }
})();
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
