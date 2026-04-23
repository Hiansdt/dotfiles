return {
  'mluders/comfy-line-numbers.nvim',
  event = 'VeryLazy',
  config = function()
    require('comfy-line-numbers').setup()
  end,
}
