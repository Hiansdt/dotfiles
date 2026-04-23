return {
  {
    'aserowy/tmux.nvim',
    config = function()
      return require('tmux').setup {
        resize = {
          enable_default_keybindings = true,
        },
      }
    end,
  },
  {
    'christoomey/vim-tmux-navigator',
    cmd = {
      'TmuxNavigateLeft',
      'TmuxNavigateDown',
      'TmuxNavigateUp',
      'TmuxNavigateRight',
      'TmuxNavigatePrevious',
      'TmuxNavigatorProcessList',
    },
    keys = {
      { '<C-h>',  '<cmd><C-U>TmuxNavigateLeft<CR>',     'window left' },
      { '<C-j>',  '<cmd><C-U>TmuxNavigateDown<CR>',     'window down' },
      { '<C-k>',  '<cmd><C-U>TmuxNavigateUp<CR>',       'window up' },
      { '<C-l>',  '<cmd><C-U>TmuxNavigateRight<CR>',    'window right' },
      { '<C-\\>', '<cmd><C-U>TmuxNavigatePrevious<CR>', 'window previous' },
    },
  },
}
