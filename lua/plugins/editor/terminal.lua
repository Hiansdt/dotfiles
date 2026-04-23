return {
  'akinsho/toggleterm.nvim',
  version = '*',
  config = function()
    require('toggleterm').setup {
      size = 20,
      -- open_mapping = [[<c-/>]], -- atalho padrão (Ctrl+\)
      open_mapping = [[<Space>']],
      -- open_mapping = [[<'>]],
      hide_numbers = true,
      shade_terminals = true,
      shading_factor = 2,
      start_in_insert = true,
      insert_mappings = true,
      persist_size = true,
      direction = 'float', -- pode ser: "vertical" | "horizontal" | "tab" | "float"
      close_on_exit = true,
      shell = vim.o.shell,
      float_opts = {
        border = 'curved',
        winblend = 0,
      },
      highlights = {
        Normal = { link = "NormalFloat" },
        NormalFloat = { link = "Normal" },
        FloatBorder = { link = "FloatBorder" },
      },
    }

    -- atalhos extras (igual estilo LazyVim)
    vim.keymap.set(
      'n',
      '<leader>tt',
      '<cmd>ToggleTerm direction=float<cr>',
      { desc = 'Float terminal' }
    )
    vim.keymap.set(
      'n',
      '<leader>th',
      '<cmd>ToggleTerm size=15 direction=horizontal<cr>',
      { desc = 'Horizontal terminal' }
    )
    vim.keymap.set(
      'n',
      '<leader>tv',
      '<cmd>ToggleTerm size=50 direction=vertical<cr>',
      { desc = 'Vertical terminal' }
    )

    -- terminal modo insert com ESC
    function _G.set_terminal_keymaps()
      local opts = { buffer = 0 }
      vim.keymap.set('t', '<esc>', [[<C-\><C-n>]], opts)
      vim.keymap.set('t', 'jk', [[<C-\><C-n>]], opts)
    end

    vim.cmd 'autocmd! TermOpen term://* lua set_terminal_keymaps()'
  end,
}
