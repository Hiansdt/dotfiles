local keymap = vim.keymap
local opts = { noremap = true, silent = true }

-- Clear highlights on search when pressing <Esc> in normal mode
keymap.set('n', '<Esc>', '<cmd>nohlsearch<CR>')

-- Split windows
keymap.set('n', 'sh', ':vsplit<Return>', opts)
keymap.set('n', 'sv', ':split<Return>', opts)

-- Tabs
keymap.set('n', 'te', ':tabedit', opts)
keymap.set('n', '<tab>', ':tabnext<Return>', opts)
keymap.set('n', '<s-tab>', ':tabprev<Return>', opts)
keymap.set('n', '<leader><tab>d', ':tabclose<Return>', opts)
keymap.set("n", "<leader>rn", vim.lsp.buf.rename, { desc = "Rename symbol" })

-- LSP Rename
vim.keymap.set('n', '<leader>cr', function()
  vim.lsp.buf.rename()
end, { expr = true, desc = 'LSP Rename' })

-- Buffer functions
local function delete_other_buffers()
  local current_buf = vim.api.nvim_get_current_buf()
  local buffers = vim.api.nvim_list_bufs()

  for _, buf in ipairs(buffers) do
    if buf ~= current_buf and vim.api.nvim_buf_is_loaded(buf) then
      vim.api.nvim_buf_delete(buf, {})
    end
  end
end

-- Buffers
keymap.set('n', '<S-h>', '<cmd>bprevious<cr>', { desc = 'Prev Buffer' })
keymap.set('n', '<S-l>', '<cmd>bnext<cr>', { desc = 'Next Buffer' })
keymap.set('n', '[b', '<cmd>bprevious<cr>', { desc = 'Prev Buffer' })
keymap.set('n', ']b', '<cmd>bnext<cr>', { desc = 'Next Buffer' })
keymap.set('n', '<leader>bd', '<cmd>bdelete<CR>', { desc = 'Delete Buffer' })
keymap.set(
  'n',
  '<leader>bo',
  delete_other_buffers,
  { desc = 'Delete Other Buffers' }
)
keymap.set(
  'n',
  '<leader>bD',
  '<cmd>:bd<cr>',
  { desc = 'Delete Buffer and Window' }
)

-- Highlight when yanking (copying) text
vim.api.nvim_create_autocmd('TextYankPost', {
  desc = 'Highlight when yanking (copying) text',
  group = vim.api.nvim_create_augroup(
    'kickstart-highlight-yank',
    { clear = true }
  ),
  callback = function()
    vim.highlight.on_yank()
  end,
})

-- Better indenting
keymap.set('v', '<', '<gv')
keymap.set('v', '>', '>gv')

-- Movimentar linhas no modo normal
vim.api.nvim_set_keymap(
  'n',
  '<A-j>',
  ':m .+1<CR>==',
  { noremap = true, silent = true }
)
vim.api.nvim_set_keymap(
  'n',
  '<A-k>',
  ':m .-2<CR>==',
  { noremap = true, silent = true }
)

-- Movimentar linhas no modo visual
vim.api.nvim_set_keymap(
  'v',
  '<A-j>',
  ":m '>+1<CR>gv=gv",
  { noremap = true, silent = true }
)
vim.api.nvim_set_keymap(
  'v',
  '<A-k>',
  ":m '<-2<CR>gv=gv",
  { noremap = true, silent = true }
)


-- put this after colorscheme (or anywhere if you don’t link it to a scheme)
vim.g.terminal_color_0  = "#000000"
vim.g.terminal_color_1  = "#ff5555"
vim.g.terminal_color_2  = "#50fa7b"
vim.g.terminal_color_3  = "#f1fa8c"
vim.g.terminal_color_4  = "#bd93f9"
vim.g.terminal_color_5  = "#ff79c6"
vim.g.terminal_color_6  = "#8be9fd"
vim.g.terminal_color_7  = "#bbbbbb"
vim.g.terminal_color_8  = "#44475a"
vim.g.terminal_color_9  = "#ff6e6e"
vim.g.terminal_color_10 = "#69ff94"
vim.g.terminal_color_11 = "#ffffa5"
vim.g.terminal_color_12 = "#d6acff"
vim.g.terminal_color_13 = "#ff92df"
vim.g.terminal_color_14 = "#a4ffff"
vim.g.terminal_color_15 = "#ffffff"
