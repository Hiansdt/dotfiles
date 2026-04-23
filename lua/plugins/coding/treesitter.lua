return {
  { -- Highlight, edit, and navigate code
    'nvim-treesitter/nvim-treesitter',
    build = ':TSUpdate',
    main = 'nvim-treesitter.config',
    dependencies = {
      'nvim-treesitter/nvim-treesitter-textobjects', -- <--- adicione isso
    },
    opts = {
      ensure_installed = {
        'astro',
        'bash',
        'blade',
        'c',
        'caddy',
        'css',
        'diff',
        'dockerfile',
        'editorconfig',
        'gitignore',
        'html',
        'javascript',
        'json',
        'lua',
        'luadoc',
        'nginx',
        'python',
        'sql',
        'typescript',
        'vim',
        'vimdoc',
        'ninja',
        'rst',
      },
      auto_install = true,
      highlight = {
        enable = true,
        additional_vim_regex_highlighting = { 'ruby' },
      },
      indent = { enable = true, disable = { 'ruby' } },
      textobjects = { -- <--- configure os text objects
        select = {
          enable = true,
          lookahead = true,         -- seleção automática do próximo
          keymaps = {
            ['ag'] = '@file.outer', -- around file
            ['ig'] = '@file.inner', -- inner file
            ['ac'] = '@class.outer',
            ['ic'] = '@class.inner',
            ['am'] = '@function.outer',
            ['im'] = '@function.inner',
          },
        },
      },
    },
    config = function(_, opts)
      require('nvim-treesitter.config').setup(opts)

      vim.filetype.add {
        pattern = {
          ['config'] = 'dosini',
        },
      }
    end,
  },
}
