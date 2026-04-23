return {
  {
    'neovim/nvim-lspconfig',
    dependencies = {
      'hrsh7th/cmp-nvim-lsp',
      'L3MON4D3/LuaSnip',
      'saadparwaiz1/cmp_luasnip',
    },
    lazy = false,
    config = function()
      local cmp_nvim_lsp = require 'cmp_nvim_lsp'
      local util = require 'lspconfig.util'

      -- Mix NeoVim built-in LSP capabilities com nvim-cmp
      local capabilities = vim.tbl_deep_extend(
        'force',
        {},
        vim.lsp.protocol.make_client_capabilities(),
        cmp_nvim_lsp.default_capabilities()
      )

      local function disable_formatting(client)
        client.server_capabilities.documentFormattingProvider = false
        client.server_capabilities.documentRangeFormattingProvider = false
      end

      ----------------------------------------------------------------------
      -- Servidores simples
      ----------------------------------------------------------------------
      vim.lsp.config('html', { capabilities = capabilities })
      vim.lsp.config('cssls', { capabilities = capabilities })
      vim.lsp.config('jsonls', { capabilities = capabilities })
      vim.lsp.config('lua_ls', { capabilities = capabilities })
      -- vim.lsp.config('eslint', { capabilities = capabilities })
      vim.lsp.config('ast_grep', { capabilities = capabilities })

      ----------------------------------------------------------------------
      -- Vue / TypeScript
      ----------------------------------------------------------------------
      local vue_path = vim.fn.expand '$MASON/packages/vue-language-server'
        .. '/node_modules/@vue/language-server'

      local vue_plugin = {
        name = '@vue/typescript-plugin',
        location = vue_path,
        languages = { 'vue' },
        configNamespace = 'typescript',
      }

      -- vtsls com vue plugin
      vim.lsp.config('vtsls', {
        capabilities = capabilities,
        on_attach = function(client)
          disable_formatting(client)
        end,
        settings = {
          vtsls = {
            tsserver = { globalPlugins = { vue_plugin } },
          },
        },
        filetypes = { 'typescript', 'javascript', 'vue' },
      })

      ----------------------------------------------------------------------
      -- ts_ls com suporte Vue (se package.json existir)
      ----------------------------------------------------------------------
      local root = util.root_pattern('jsconfig.json', 'package.json', '.git')(
        vim.fn.getcwd()
      )
      if root and vim.fn.filereadable(root .. '/package.json') == 1 then
        local vue_plugin_path = root .. '/node_modules/@vue/typescript-plugin'
        local ts_path = root .. '/node_modules/typescript/lib'

        if vim.fn.isdirectory(vue_plugin_path) == 1 then
          vim.lsp.config('ts_ls', {
            capabilities = capabilities,
            root_dir = root,
            init_options = {
              plugins = {
                {
                  name = '@vue/typescript-plugin',
                  location = vue_plugin_path,
                  languages = { 'vue' },
                },
              },
              ts_ls = { tsdk = ts_path },
            },
            filetypes = {
              'typescript',
              'javascript',
              'javascriptreact',
              'typescriptreact',
              'vue',
            },
            cmd = { 'typescript-language-server', '--stdio' },
          })
        end
      end

      ----------------------------------------------------------------------
      -- Python (pylsp com ruff, black, isort etc.)
      ----------------------------------------------------------------------
      vim.lsp.config('pylsp', {
        capabilities = capabilities,
        settings = {
          pylsp = {
            plugins = {
              pycodestyle = { enabled = false },
              mccabe = { enabled = false },
              pyflakes = { enabled = false },
              pylint = { enabled = false },
              ruff = { enabled = true },
              black = { enabled = true },
              isort = { enabled = true },
              rope_autoimport = { enabled = true },
              rope_completion = { enabled = true },
            },
          },
        },
        root_dir = util.root_pattern('manage.py', '.git'),
      })

      ----------------------------------------------------------------------
      -- Ativar todos
      ----------------------------------------------------------------------
      vim.lsp.enable {
        'html',
        'cssls',
        'jsonls',
        'lua_ls',
        'eslint',
        'ast_grep',
        -- 'vtsls',
        'ts_ls',
        'pylsp',
      }

      ----------------------------------------------------------------------
      -- Keymaps LSP
      ----------------------------------------------------------------------
      vim.keymap.set('n', 'K', vim.lsp.buf.hover, {})
      vim.keymap.set('n', '<leader>cD', vim.lsp.buf.definition, {})
      vim.keymap.set('n', '<leader>gr', vim.lsp.buf.references, {})
      vim.keymap.set('n', '<leader>ca', vim.lsp.buf.code_action, {})
      vim.keymap.set('n', '<leader>gf', vim.lsp.buf.format, {})
      vim.keymap.set('n', '<leader>md', vim.lsp.buf.rename, {})
      vim.keymap.set('n', '<leader>cd', vim.diagnostic.open_float, {})
    end,
  },
}
