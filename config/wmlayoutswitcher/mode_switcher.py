#!/usr/bin/env python3

import yaml
import subprocess
import sys
import os
from time import sleep
from i3ipc import Connection, Event

CONFIG = os.path.expanduser("~/.config/wmlayoutswitcher/modes.yaml")

def load_mode(mode):
    cfg = yaml.safe_load(open(CONFIG))
    return cfg['modes'].get(mode, [])

def main(mode_name):
    mode = load_mode(mode_name)
    if not mode:
        print(f"Mode '{mode_name}' not found in ~/.config/wmlayouts/modes.yaml")
        sys.exit(1)

    i3 = Connection()

    pending = []
    for w in mode:
        entry = w.copy()
        # choose match key
        entry['match'] = w.get('match_class') or w.get('mark')
        pending.append(entry)

    moved = []
    def on_new(i3conn, e):
        con = e.container
        cls = con.window_class
        title = con.name or ""
        for ent in pending.copy():
            if con.type == "con" and (
                ent.get('match') in cls or (type(ent.get('match')) == str and ent['match'] in title)
            ):
                if 'mark' in ent:
                    con.command(f'mark {ent["mark"]}')
                if 'layout' in ent:
                    con.command(f'layout {ent["layout"]}')
                if isinstance(ent['workspace'], str):
                    con.command(f'move to workspace {ent["workspace"]}')
                pending.remove(ent)
                moved.append(ent)
                break
        if not pending:
            i3conn.main_quit()

    i3.on(Event.WINDOW_NEW, on_new)

    # Launch each program
    for ent in mode:
        cmd = [ent['cmd']] + ent.get('args', [])
        subprocess.Popen(cmd)

    i3.main(timeout=10)

    if pending:
        print("Warnings: Some windows didn't appear in time:")
        for e in pending:
            print(" • didn't migrate", e.get('label'))
    else:
        print(f"Mode '{mode_name}' complete.")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: wmswitch.py <mode>")
        sys.exit(1)
    main(sys.argv[1])

