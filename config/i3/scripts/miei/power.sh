#!/usr/bin/env bash
# power.sh — battery % + icon + time, colored for i3blocks
# with “Full” never overriding a live charge

# 1) pick BAT0 and ADP/AC adapter
BAT=$(ls -d /sys/class/power_supply/BAT* 2>/dev/null | head -n1)
AC=$(ls -d /sys/class/power_supply/ADP* /sys/class/power_supply/AC* 2>/dev/null | head -n1)
[[ -z "$BAT" ]] && {
    echo "🔋 N/A"
    exit 0
}

# 2) detect AC online
if [[ -r "$AC/online" ]]; then
    ac_online=$(<"$AC/online")
else
    ac_online=0
fi

# 3) read & override status
if [[ -r "$BAT/status" ]]; then
    status=$(<"$BAT/status")
else
    status=$(acpi -b 2>/dev/null | awk '{print $3}' | tr -d ',')
fi
[[ "$ac_online" -eq 1 ]] && status="Charging"

# 4) capacity (sysfs → acpi fallback)
if [[ -r "$BAT/capacity" ]]; then
    cap=$(<"$BAT/capacity")
else
    cap=$(acpi -b 2>/dev/null | grep -o '[0-9]\+%' | head -n1 | tr -d '%')
fi
cap=${cap:-0}

# 5) time remaining (acpi only)
tr=""
if command -v acpi &>/dev/null; then
    t=$(acpi -b | head -n1 | grep -oP '[0-9]{1,2}:[0-9]{2}')
    [[ -n "$t" ]] && tr=" ($t)"
fi

# 6) icons (swap in your Nerd glyphs)
bat_icon=""
chg_icon=""
if [[ "$status" == "Charging" ]]; then
    icon=$chg_icon
else
    icon=$bat_icon
fi

# 7) color logic
if [[ "$status" == "Charging" ]]; then
    color="#00AFE3"
elif ((cap >= 100)); then
    color="#FFFFFF"
elif ((cap < 20)); then
    color="#FF0000"
elif ((cap < 40)); then
    color="#FFAE00"
elif ((cap < 60)); then
    color="#FFFF00"
elif ((cap < 80)); then
    color="#00FF00"
else
    color="#00D8D8"
fi

# 8) output
echo "<span foreground=\"$color\">$icon ${cap}%${tr}</span>"
