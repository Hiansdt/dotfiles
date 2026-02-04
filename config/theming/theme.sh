#!/usr/bin/env sh

THEME_DIR="$HOME/.config/theming/themes"
CURRENT="$HOME/.config/theming/current"
POLYBAR_CONFIG_MAIN="$HOME/.config/polybar/config-main.ini"
POLYBAR_CONFIG_SECONDARY="$HOME/.config/polybar/config-secondary.ini"
NVIM_CONFIG="$HOME/.config/nvim/init.lua"

if [ $# -eq 0 ]; then
    echo "Usage: $0 <theme|list>"
    exit 1
fi

if [ "$1" = "list" ]; then
    ls "$THEME_DIR" | sed 's/\.conf$//'
    exit 0
fi

THEME="$1"
THEME_CONF="$THEME_DIR/$THEME.conf"

if [ ! -f "$THEME_CONF" ]; then
    echo "Theme '$THEME' does not exist."
    exit 1
fi

# Load theme variables
. "$THEME_CONF"

# Save current theme
echo "$THEME" >"$CURRENT"

# Set Kitty theme
kitty +kitten themes --reload-in=all "$KITTY_THEME"

# Set Polybar colorscheme
sed -i "s|include-file = \$HOME/.config/polybar/colors.*\.ini|$POLYBAR_INCLUDE|" "$POLYBAR_CONFIG_MAIN"
sed -i "s|include-file = \$HOME/.config/polybar/colors.*\.ini|$POLYBAR_INCLUDE|" "$POLYBAR_CONFIG_SECONDARY"

# Set Neovim colorscheme
sed -i "s|vim.cmd.colorscheme(\".*\")|vim.cmd.colorscheme(\"$NVIM_COLORSCHEME\")|" "$NVIM_CONFIG"

# Reload Polybar
bash "$HOME/.config/polybar/launch.sh"

# Set wallpaper
feh --no-fehbg --bg-fill "$WALLPAPER"

echo "Theme switched to $THEME"
