return {
  -- LSP principal
  {
    'neovim/nvim-lspconfig',
    dependencies = {
      'williamboman/mason.nvim',
      'williamboman/mason-lspconfig.nvim',
      'j-hui/fidget.nvim',
    },
    config = function()
      local lspconfig = require 'lspconfig'

      -- Detecta o Python do PDM
      local function get_pdm_python()
        local handle = io.popen 'pdm info --python 2>/dev/null'
        if handle then
          local result = handle:read '*a'
          handle:close()
          return vim.fn.trim(result)
        end
        return nil
      end

      local python_path = get_pdm_python()

      lspconfig.basedpyright.setup {
        settings = {
          basedpyright = {
            typeCheckingMode = 'basic', -- ou "strict"
            analysis = {
              autoImportCompletions = true,
              useLibraryCodeForTypes = true,
            },
            python = {
              pythonPath = python_path, -- ⚡ usa Python do PDM
            },
          },
        },
        on_attach = function(_, bufnr)
          local opts = { buffer = bufnr }
          vim.keymap.set('n', 'gd', vim.lsp.buf.definition, opts)
          vim.keymap.set('n', 'K', vim.lsp.buf.hover, opts)
          vim.keymap.set('n', '<leader>rn', vim.lsp.buf.rename, opts)
          vim.keymap.set('n', '<leader>ca', vim.lsp.buf.code_action, opts)
          vim.keymap.set('n', 'gr', vim.lsp.buf.references, opts)
        end,
      }
    end,
  },

  -- Formatadores (via PDM)
  -- {
  --   'stevearc/conform.nvim',
  --   opts = {
  --     formatters_by_ft = {
  --       python = { 'ruff_format', 'black' },
  --     },
  --     formatters = {
  --       black = {
  --         command = 'pdm',
  --         args = { 'run', 'black', '-' },
  --         stdin = true,
  --       },
  --       ruff_format = {
  --         command = 'pdm',
  --         args = { 'run', 'ruff', 'format', '-' },
  --         stdin = true,
  --       },
  --     },
  --   },
  -- },
  -- Autocomplete
  {
    'hrsh7th/nvim-cmp',
    dependencies = {
      'hrsh7th/cmp-nvim-lsp',
      'hrsh7th/cmp-buffer',
      'hrsh7th/cmp-path',
      'hrsh7th/cmp-cmdline',
      'L3MON4D3/LuaSnip',
      'saadparwaiz1/cmp_luasnip',
    },
    config = function()
      local cmp = require 'cmp'
      cmp.setup {
        snippet = {
          expand = function(args)
            require('luasnip').lsp_expand(args.body)
          end,
        },
        mapping = cmp.mapping.preset.insert {
          ['<C-Space>'] = cmp.mapping.complete(),
          ['<CR>'] = cmp.mapping.confirm { select = true },
          ['<Tab>'] = cmp.mapping.select_next_item(),
          ['<S-Tab>'] = cmp.mapping.select_prev_item(),
        },
        sources = cmp.config.sources {
          { name = 'nvim_lsp' },
          { name = 'luasnip' },
          { name = 'buffer' },
          { name = 'path' },
        },
      }
    end,
  },

  -- Mason (instalador de LSPs/formatadores)
  {
    'williamboman/mason.nvim',
    build = ':MasonUpdate',
    config = function()
      require('mason').setup()
    end,
  },
  {
    'williamboman/mason-lspconfig.nvim',
    config = function()
      require('mason-lspconfig').setup {
        ensure_installed = { 'basedpyright' },
      }
    end,
  },
}
