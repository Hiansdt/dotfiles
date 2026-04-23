return {
  {
    'catppuccin/nvim',
    lazy = false,
    priority = 1000,
    config = function()
      require("catppuccin").setup({
        flavour = "mocha",
        transparent_background = false,
        term_colors = false,
        no_italic = true,
        no_bold = true,
        styles = {
          comments = {},
          keywords = {},
          functions = {},
          variables = {},
        },
        integrations = {
          treesitter = true,
          native_lsp = {
            enabled = true,
            underlines = {
              errors = {},
              hints = {},
              warnings = {},
              information = {},
            },
          },

        },
        vim.cmd.colorscheme("catppuccin")
      })
    end,
  },
  {
    {
      "diegoulloao/neofusion.nvim",
      priority = 1000,
      config = function()
        -- Default options:
        require("neofusion").setup({
          terminal_colors = false, -- add neovim terminal colors
          undercurl = true,
          underline = true,
          bold = true,
          italic = {
            strings = true,
            emphasis = true,
            comments = true,
            operators = false,
            folds = true,
          },
          strikethrough = true,
          invert_selection = false,
          invert_signs = false,
          invert_tabline = false,
          invert_intend_guides = false,
          inverse = true, -- invert background for search, diffs, statuslines and errors
          palette_overrides = {},
          overrides = {},
          dim_inactive = false,
          transparent_mode = true,
        })
      end
    }
  },
  {
    'olivercederborg/poimandres.nvim',
    lazy = false,
    priority = 1000,
    config = function()
      require('poimandres').setup {
        -- leave this setup function empty for default config
        -- or refer to the configuration section
        -- for configuration options
      }
    end,
  }
}
