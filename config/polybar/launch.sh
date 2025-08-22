#!/usr/bin/env bash
DIR="$HOME/.config/polybar"
killall -q polybar
while pgrep -u "$UID" -x polybar >/dev/null; do sleep 0.1; done

polybar -q main -c "$DIR"/config-main.ini &
polybar -q main_2 -c "$DIR"/config-main.ini &
polybar -q main_3 -c "$DIR"/config-main.ini &
polybar -q main_4 -c "$DIR"/config-main.ini &
polybar -q main_5 -c "$DIR"/config-main.ini &
polybar -q secondary -c "$DIR"/config-secondary.ini &
polybar -q secondary_2 -c "$DIR"/config-secondary.ini &
polybar -q secondary_3 -c "$DIR"/config-secondary.ini &
polybar -q secondary_4 -c "$DIR"/config-secondary.ini &
polybar -q secondary_5 -c "$DIR"/config-secondary.ini &



# for terminal testing
#
# polybar -q main -c ./.config/polybar/config-main.ini &
# polybar -q main_2 -c ./.config/polybar/config-main.ini &
# polybar -q main_3 -c ./.config/polybar/config-main.ini &
# polybar -q main_4 -c ./.config/polybar/config-main.ini &
# polybar -q main_5 -c ./.config/polybar/config-main.ini &
# polybar -q secondary -c ./.config/polybar/config-secondary.ini &
# polybar -q secondary_2 -c ./.config/polybar/config-secondary.ini &
# polybar -q secondary_3 -c ./.config/polybar/config-secondary.ini &
# polybar -q secondary_4 -c ./.config/polybar/config-secondary.ini &
# polybar -q secondary_5 -c ./.config/polybar/config-secondary.ini &
