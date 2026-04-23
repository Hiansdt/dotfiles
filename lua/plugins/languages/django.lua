return {
  -- LSP para Python (Pyright)
  {
    'neovim/nvim-lspconfig',
    opts = {
      servers = {
        pyright = {
          settings = {
            python = {
              analysis = {
                autoImportCompletions = true,
                typeCheckingMode = 'basic', -- pode mudar para "strict"
              },
            },
          },
        },
      },
    },
  },

  -- Formatter + Linter (black + ruff)
  {
    'nvimtools/none-ls.nvim',
    opts = function(_, opts)
      local nls = require 'null-ls'
      opts.sources = vim.list_extend(opts.sources or {}, {
        nls.builtins.formatting.black, -- formatador
        -- nls.builtins.diagnostics.ruff, -- linter
        -- nls.builtins.formatting.ruff, -- formatador rápido
      })
    end,
  },

  -- Snippets (inclui Django + DRF customizados)
  {
    'rafamadriz/friendly-snippets',
    config = function()
      require('luasnip.loaders.from_vscode').lazy_load()
      local ls = require 'luasnip'

      -- Snippet para Serializer DRF
      ls.add_snippets('python', {
        ls.snippet('drfser', {
          ls.text_node 'class ',
          ls.insert_node(1, 'MySerializer'),
          ls.text_node { '(serializers.ModelSerializer):', '\tclass Meta:' },
          ls.text_node { '', '\t\tmodel = ' },
          ls.insert_node(2, 'MyModel'),
          ls.text_node { '', "\t\tfields = '__all__'" },
        }),
      })

      -- Snippet para ViewSet DRF
      ls.add_snippets('python', {
        ls.snippet('drfview', {
          ls.text_node 'class ',
          ls.insert_node(1, 'MyViewSet'),
          ls.text_node { '(viewsets.ModelViewSet):', '\tqueryset = ' },
          ls.insert_node(2, 'MyModel.objects.all()'),
          ls.text_node { '', '\tserializer_class = ' },
          ls.insert_node(3, 'MySerializer'),
        }),
      })
    end,
  },

  -- Debugger para Python (Django)
  {
    'mfussenegger/nvim-dap',
    dependencies = { 'mfussenegger/nvim-dap-python' },
    config = function()
      local dap_python = require 'dap-python'
      dap_python.setup '~/.venv/bin/python' -- ajuste para seu venv
    end,
  },
}
