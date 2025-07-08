#!/usr/bin/env bash
DIR="$HOME/.config/polybar"
killall -q polybar
while pgrep -u "$UID" -x polybar >/dev/null; do sleep 0.1; done

polybar -q main -c "$DIR"/config.ini &
polybar -q secondary -c "$DIR"/config.ini &
