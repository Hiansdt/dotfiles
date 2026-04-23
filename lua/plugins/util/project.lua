return {
  "josephschmitt/pj.nvim",
  dependencies = {
    "nvim-telescope/telescope.nvim",
  },
  cmd = { "Pj", "PjCd" },
  keys = {
    { "<leader>P", function() require("pj").open({ no_cache = true }) end, desc = "Find Projects" },
  },
  opts = {
    pj = {
      cmd = "pj",
      args = {},
      icons = true,
      cache = false,
      auto = {
        prefer_system = true,
        check_updates = false,
        auto_update = false,
      },
    },
    picker = {
      type = "telescope",
      telescope = {
        previewer = false,
        layout_config = {
          width = 0.8,
          height = 0.9,
        },
      },
    },
    behavior = {
      cd_on_select = true,
      cd_scope = "tab",
      close_on_select = true,
      notify_on_error = true,
      session_manager = nil,
    },
  },
}
