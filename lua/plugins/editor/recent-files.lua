return {
  {
    'nvim-telescope/telescope.nvim',
    dependencies = {
      'neovim/nvim-lspconfig',
    },
    keys = {
      {
        '<leader>fr',
        function()
          require('telescope.builtin').oldfiles {
            prompt_title = 'Recent Files',
            cwd_only = true, -- only show files under current working dir
          }
        end,
        desc = 'Find Recent Files',
      },
    },
  },
}
