return {
  {
    'echasnovski/mini.icons',
    lazy = false,
    opts = {
      file = {
        ['.env'] = { glyph = '󰒓' },
        ['.gitignore'] = { glyph = '󰊢' },
        ['package.json'] = { glyph = '󰎙' },
        ['tsconfig.json'] = { glyph = '󰛦' },
        ['yarn.lock'] = { glyph = '󰏗' },
      },
      filetype = {
        javascript = { glyph = '󰌞' },
        json = { glyph = '󰘦' },
        lua = { glyph = '󰢱' },
        markdown = { glyph = '󰍔' },
        typescript = { glyph = '󰛦' },
        yaml = { glyph = '󰈙' },
      },
    },
    config = function(_, opts)
      local icons = require 'mini.icons'
      icons.setup(opts)

      -- Make plugins that use `nvim-web-devicons` consume mini.icons instead.
      icons.mock_nvim_web_devicons()
    end,
  },
}
