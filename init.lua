vim.g.mapleader = ' '
vim.g.maplocalleader = ' '

vim.g.have_nerd_font = true
vim.o.winborder = "none"
vim.o.shell = "/usr/bin/fish"
vim.g.neovide_cursor_animation_length = 0
vim.g.neovide_cursor_trail_size = 0
vim.g.neovide_cursor_animate_in_insert_mode = false
vim.g.neovide_scale_factor = .8
vim.g.neovide_hide_mouse_when_typing = true
vim.g.neovide_refresh_rate = 60
vim.g.neovide_confirm_quit = true
vim.opt.termguicolors = true
vim.opt.linespace = 8
vim.o.guifont = "Droid Sans Mono:style=Regular:h15"
vim.g.neovide_text_gamma = 0.8
vim.g.neovide_text_contrast = 0.7
-- vim.g.neovide_transparency = 0.9

local function change_scale(delta)
	vim.g.neovide_scale_factor = vim.g.neovide_scale_factor + delta
end

vim.keymap.set("n", "<C-=>", function() change_scale(0.1) end)
vim.keymap.set("n", "<C-->", function() change_scale(-0.1) end)
vim.keymap.set("n", "<C-0>", function() vim.g.neovide_scale_factor = 1.0 end)
-- .nvim.lua
-- vim.g.autoformat = false

require 'globals'
require 'options'
require 'keymaps'
require 'lazy-init'

require('devcontainer').setup {}
