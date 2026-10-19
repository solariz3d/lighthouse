# D348 research (seat A): how Photoshop lays out its UI, with Blender, Affinity and Figma beside it, and 7 principles for a T-180 top menu bar

Web and docs only; no code, nothing committed, no app window opened. For learning from, not for copying names or looks.

**How I read it:** Adobe's help site returns HTTP 403 to every direct fetch here (WebFetch and curl with a browser header, six pages). I read Adobe's own help pages from web-archive copies of them (archive timestamps 2025 and 20251116), whose body text is Adobe's "Last updated Oct 27, 2025" text. Each Adobe source below gives the live URL and was read through the archive copy. The older "panels and menus" page is dated May 24, 2023. Blender, Affinity and Figma pages were fetched live.

Labels: `checked:` = I read it on the page named; `inferred:` = my reading, not on the page.

## 1. Photoshop

### 1.1 The frame: Application bar, Options bar, Tools panel, panels
checked: Adobe "Workspace overview" (helpx.adobe.com/photoshop/using/workspace-basics.html): "Application bar : Contains a workspace switcher, menus, and other controls." "Options bar : Displays settings for the currently selected tool." "Tools panel : Features tools for creating and editing images, artwork, and page elements, organized by related functions." "Panels : Provide tools to monitor and modify your work, and can be grouped or stacked."
- **Does well:** every place has one job. Menus hold commands, the Options bar holds the settings of the tool in your hand, panels hold things you watch while you work. The user learns where a kind of thing lives, not where each thing lives.
- **Costs:** four kinds of surface to learn, and a setting can legitimately live in two (a panel and the Options bar). It is a large app; the layout earns its keep from hundreds of commands.

### 1.2 The menu bar and its grouping
checked: the page says only "menus" in the Application bar; it does not list their names. inferred (from the brief and the app, not an Adobe page I read): the menus are File, Edit, Image, Layer, Type, Select, Filter, 3D, View, Plugins, Window, Help. Grouping is by the object acted on (Image, Layer, Type, Select), with File, Edit, View, Window and Help as the standard ones every desktop app has. Order runs from the document out to the screen: make and save, change the pixels, change the view, manage the windows, ask for help.
- **Does well:** by-noun grouping means you find a command by asking "what am I changing". Standard menu names (File first, Help last) cost nothing to learn.
- **Costs:** a command that touches two nouns has two plausible homes; and the menu bar is big enough that Adobe added three things to cope with it (hide items, search, shortcuts, below).

### 1.3 Submenu depth
checked, paths printed on Adobe's own pages:
- Edit > Preferences > Workspace > Restore Default Workspaces (restore-workspaces page): three levels to a menu item, then a dialog.
- Window > Workspace > Reset > Essentials (Default) (same page): four levels.
- Window > Workspace > New Workspace (save-custom-workspaces page).
- **Does well:** deep items are rare ones. The frequent command is one or two levels down and has a shortcut.
- **Costs:** a four-level path is only reachable by hunting, so Adobe prints a second route (the workspace drop-down in the Application bar) beside it on the same pages. That is a sign the deep path is poor, not a feature.

### 1.4 Shortcuts shown in the menus, and menu customisation
checked: Adobe "Customizing keyboard shortcuts" (…/customizing-keyboard-shortcuts.html): shortcuts are edited per type, "Application Menus: Lets you customize keyboard shortcuts for items in the menu bar", "Panel Menus", "Tools"; a clash raises "an alert appears" and you choose to accept (which "erase[s] the previously assigned shortcut") or "Accept and Go To Conflict"; sets can be saved, copied, deleted, and "Summarize" exports the list to an HTML file.
checked: Adobe "Panels and menus" (…/panels-menus.html, dated May 24, 2023): "Application Menus: Lets you show, hide, or add color to items in the application menus." "To hide a menu item, click the Visibility…" A menu with hidden items offers "Show All Menu Items"; "To permanently reveal all menu items, choose Window > Workspace > Essentials."; colours can be switched off with "Show Menu Colors" in Interface preferences. Context menus "are distinct from the menus across the top of the workspace."
checked: Adobe "Default keyboard shortcuts": "Instead of navigating through menus and panels, you can perform common actions with a simple key combination"; the editor opens with Edit > Keyboard Shortcuts or Alt + Shift + Ctrl + K.
- **Does well:** the menu is also the shortcut cheat-sheet, so a mouse user learns keys by looking; hide/colour lets a person thin a large menu to their own work without losing the commands.
- **Costs:** hidden items make two people's menus different (support and tutorials break; Adobe needs the "Show All" escape); colour is a second signalling system. Both only pay on an app with hundreds of items. A reassigned key silently erases the old one unless the user reads the alert.

### 1.5 Workspaces (saved layouts)
checked: Adobe "Save custom workspaces" (…/desktop/get-started/learn-the-basics/save-custom-workspaces.html): "a workspace is any arrangement of panels, tools, and windows"; saving lets you pick under Capture: "Panel Locations, Keyboard Shortcuts, Menus"; the saved name appears in the "Choose a workspace" drop-down in the Application bar. "Switch workspaces": presets "Essentials, Photography" or a custom one, also via Window > Workspace. "Restore workspaces": reset one with "Reset <Workspace Name>", or all presets from Edit > Preferences > Workspace > "Restore Default Workspaces"; "Photoshop restores to the default workspace, the Essentials workspace."
- **Does well:** one control switches the whole room for the task; a reset that always works makes experiments safe; what is captured is the user's choice.
- **Costs:** layout becomes state the user has to manage; "Essentials" as the one known-good place is a rule the user must learn.

### 1.6 The Contextual Task Bar
checked: Adobe "Contextual Task Bar in Photoshop" (…/contextual-task-bar.html): "a floating dynamic menu that appears depending on your active tool or current selection. It's designed to give quick access to relevant options without the need for navigating across multiple panels and menus." It "can be docked, floated, or hidden", "the options change depending on the active tool"; it is on by default and turned off from Window > Contextual Task Bar; its three-dot menu has "Hide the bar. Reset the bar position. Pin bar position." with the note that "hiding a bar will keep all bars hidden until reopened". The examples: a selection gives refine, mask, fill; the Gradient tool gives presets, type, reverse; Transform gives rotate and flip.
- **Does well:** the next step is next to the object. Hide, pin and reset make it a convenience, never a requirement.
- **Costs:** it duplicates what the menus and Options bar already hold, and it covers canvas (hence pin and hide). inferred: it is on by default because Adobe wants discovery; for a tool with one canvas and a handful of actions the cover would hurt more than the help.

### 1.7 Search (Discover)
checked: Adobe "Access the Discover panel" (…/access-discover-panel.html): "Select Help > Photoshop Help to access the Discover panel. You can also use the keyboard shortcut Cmd + F (macOS) or Ctrl + F (Windows) or select the Search for tools, help, and more icon in the upper-right corner"; it holds "tools, in-app tutorials, quick actions, and help articles all in one place" and "is available in Photoshop with an active internet connection".
- **Does well:** the user who cannot find a command types its name; the icon is always in the same corner.
- **Costs:** it mixes tools, tutorials and help in one list, and needs a network. A builder without a network and with one fixed set of commands would want only the command list (see Blender's menu search, which does this).

### 1.8 Preferences versus the menus
checked: Adobe "Adjust preferences" (…/preferences.html): "Select Edit > Preferences (Windows) or Photoshop > Settings (macOS) … Ctrl + K"; a dialog with categories "General, Interface, Workspace, and more"; "All settings are saved when you close the app, but they are lost if you force quit or the app crashes." Reset and backup have their own pages ("Reset preferences", "Backup and restore preferences").
- **Does well:** commands (do something to the document) and preferences (how the app behaves for me, kept between sessions) are different things, so preferences are one dialog behind one entry with one shortcut and categories, not scattered through menus. The user learns "how the app works for me lives behind Ctrl+K".
- **Costs:** a modal dialog away from the work, and some settings (a workspace, a toolbar layout) live elsewhere (Window > Workspace; Edit > Toolbar), which blurs the rule. Settings saved only on a clean exit is a trap Adobe documents rather than fixes.
- Edit > Toolbar (Adobe "Customize the toolbar", …/tools.html): tools are grouped, "Move less frequently used tools to Extra Tools", with Save Preset, Load Preset, Restore Defaults. That is the Photoshop answer to "what stays on the left": the frequent tools stay, the rest are one flyout away, and the user decides.

## 2. Blender (contrast)
checked: Blender manual "Topbar" (docs.blender.org/manual/en/latest/interface/window_system/topbar.html): the Topbar holds the Blender, File, Edit, Render, Window and Help menus, then workspace tabs, then scenes and layers. The Edit menu holds "Menu Search: Find a menu based on its name." and "Preferences Ctrl - Comma: Open the Preferences window."
checked: "Introduction" in Preferences (…/editors/preferences/introduction.html): "Edit > Preferences… Shortcut: Ctrl - Comma"; sections on the left with "A search field above the section list allows filtering preferences by name"; "By default changes to preferences are saved on exit … When disabled, a Save Preferences button is shown"; "Load Factory Preferences" resets; startup-file things (app templates, area locations) are separate and "must be reverted through File > Defaults".
checked: "Menus" (…/interface/controls/buttons/menus.html): "All menu entries show any relevant shortcut keys"; "All popup menus can be searched by pressing Spacebar and typing"; "All popup menus of an editor can be searched using the Menu Search feature."
checked: "Workspaces" (…/window_system/workspaces.html): "Workspaces are essentially predefined window layouts … geared towards a specific task such as modeling, animating, or scripting"; tabs in the Topbar, add, duplicate, delete, reorder.
checked: 3D Viewport "Introduction" (…/editors/3dview/introduction.html): the header "contains various menus and controls based on the current mode"; the menus after the mode are Select, Add, Object and others, which change with the mode.
- **Does well:** menus belong to the editor (area) they act on, and change with the mode, so a short menu holds only what applies. Every item shows its key; every menu is searchable. App-wide things stay in a short Topbar.
- **Costs:** the shortcut depends on which editor the cursor is over ("many depend on which editor the mouse cursor is hovering over"); a first-time user does not know which menu is "theirs" at the moment.

## 3. Affinity (contrast)
checked: Affinity Photo 2 help "Context toolbar" (affinity.help/photo2/en-US.lproj/pages/Workspace/contextBar.html): "The context toolbar always updates to show the options available for the currently selected tool"; it "appears below the Toolbar and immediately above the document view"; "In some cases, the commands shown by the context toolbar change depending on selection type and the active Persona."; Toolbar and context toolbar can be shown or hidden from View.
inferred: the menu bar stays the standard set; the context toolbar plays the role of Photoshop's Options bar and is fixed in place, not floating.
- **Does well:** one fixed strip for the active tool's settings, in the same place every time, so the eye learns where to look. Nothing floats over the canvas.
- **Costs:** the strip's width is limited, so crowded tools need a "more" overflow (inferred); a Persona adds a mode the user must know about.

## 4. Figma (contrast)
checked: Figma help "Turn on accessibility settings" (help.figma.com/hc/en-us/articles/35063862380311): "the main menu in the top left" holds Preferences as a submenu ("navigate to Preferences … open the submenu … Accessibility settings"); "Press Command K on Mac or Control K on Windows to open the Actions menu, then type relevant keywords … For example, typing 'align' will show all alignment-related actions."; F6 moves between "top-level areas of the interface".
checked: Figma "Navigate the UI in Figma Design" (…/360041064174-Navigate-the-UI-in-Figma-Design): the toolbar is "the hub for interacting with—and adding objects—to the canvas" with tools grouped into menus (Move, Region, Shape, Creation); the Actions menu holds "AI tools … A search tool for finding library assets … Plugins and widgets … Commands for common actions in Figma, like collapsing all layers … or toggling rulers on and off".
- **Does well:** one menu, one corner, small; the toolbar is the frequent actions and a command search covers the rest. A designer in a hurry never needs the menu.
- **Costs:** discoverability: a command not in the toolbar or the menu is found by search only if you know what it is called. A community request (forum) notes preference items are not searchable in Actions; not an official source, so I state it as a report only.

## 5. Principles that carry to a track builder
These are for T-180, which (checked in the brief, plan lines 1141-1165 and 1221-1231) has a left panel of per-piece values and commands, a "⋯" menu that already holds mute and volume, and a Close and an Export.

1. **Separate "do" from "how it behaves for me".** Commands go in menus; settings kept between sessions go behind one Settings entry. Photoshop (one Preferences dialog, one shortcut) and Blender (Ctrl+Comma) do exactly this. Carries as it is: it is where the keeper's Settings dropdown (sound on/off, volume, camera, units, checker options) belongs.
2. **Menus by the thing acted on, with the standard names at the ends.** File first (New, Open, Save, Close, Export), Help last, and nouns between (Piece, Pit, Spawns, View). All four products do this. Carries; the noun menus come from the inventory, not from Photoshop's list. A command that touches two nouns gets one home and no duplicate.
3. **Keep on the left only what you touch every few seconds; everything else is a menu item one click away.** Photoshop's toolbar keeps the frequent tools and parks the rest in Extra Tools; Figma's toolbar holds the frequent actions. Carries, but "frequent" has to be measured per control (the inventory's how-often column), and a value you set per piece differs from a command you run once. inferred: per-piece values (the numbers you drag) stay in a panel or a context strip; run-once commands move to menus.
4. **Show each command's key beside it in the menu.** Photoshop, Blender and Figma all do; the menu teaches the keys. Carries at no cost: the builder already has shortcuts.
5. **Keep depth to two levels, three at most, and give any deeper item a second route.** Photoshop's four-level Window > Workspace > Reset path has a duplicate in the Application bar on the same help page. For a small app, two levels suffice and Blender's expanding menus show the cost of more.
6. **Add search only for commands, and only when the menu has grown past one screen.** Blender's Menu Search and Figma's Actions (Ctrl+K) are local command lists; Photoshop's Discover mixes help and tutorials and needs a network. **Partly carries:** a command search is worth it if the menus become long; a Discover-style help search does not carry (no network need, no tutorials in the app). inferred: a first menu bar with eight or so menus does not need it yet.
7. **A strip for the active tool's settings, in one fixed place.** Photoshop's Options bar and Affinity's context toolbar. Carries if the builder has tool modes (Sculpt, pieces, pit) with different settings; the fixed strip is the safer form than a floating bar.
8. **Do NOT carry: the Contextual Task Bar, hide-and-colour menu customisation, and saved Workspaces.** Reasons: the task bar floats over the canvas and duplicates the Options strip (Adobe itself ships pin, hide and reset to manage it); per-user hidden menu items split support (Adobe needs "Show All Menu Items" to escape them); workspaces earn their keep with dozens of panels and many jobs, and the builder has one job and one panel. If a layout choice is wanted later, a single "reset layout" is the Photoshop piece worth keeping (restore always works). These three are the ones I would argue against, for a first menu bar.

Two choices for the keeper, flagged from the research (the librarian's mockup picks the final list): where **Close and Export** live (File, as in all four products, is the safe answer), and whether Settings is a menu-bar item or an icon in the top right (Photoshop and Figma put search and settings at the corner; Blender puts Preferences in Edit). The keeper asked for the menus "on the top right"; Photoshop's own menus sit on the left and its search icon on the right (checked, Discover page), so top-right placement is his own, not Photoshop's.

## Limits, said plainly
- Photoshop's menu names and the full menu contents were not on any Adobe page I could read; the names above are from the brief and common knowledge, marked inferred.
- Adobe pages were read from archive copies (live fetch is refused). The text carries Adobe's own "Last updated" stamps (Oct 27, 2025; Apr 24, 2025; May 24, 2023 for the menu-customisation page, so that page may be older than the others).
- Affinity's menu bar page was not read (the help site refused a direct fetch for the index); the Context toolbar page was. Affinity's menu grouping is not claimed.
- Figma's main menu contents were not read in full: the page that lists them was not found; only the Preferences submenu and the Actions/toolbar pages were.
- Nothing here was tried in the builder; the principles are about layout, not measured against how the keeper works.

## Corrections to myself
(1) My first WebFetch calls to Adobe returned 403 and I nearly reported "unreadable"; the archive copies were readable. (2) My first Figma fetch returned an unrelated article; I re-fetched the accessibility and navigate pages.

NEXT: librarian read this hand-back, merge it with C's inventory into the mockup (menu names, what moves, what stays on the left, the Close/Export and Settings-placement choices); plan default after it: A is free for the next lap
