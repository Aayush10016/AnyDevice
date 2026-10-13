# Discovery, identity and dedicated workspace milestone

This is an incremental implementation with physical acceptance still pending. See DISCOVERY-ROOT-CAUSES.md for the audit performed before changes. Prior candidate 5 is not evidence that this new UI or native counting changes pass physical tests.

## Discovery rules

Default native scope is all present PnP nodes. The ordinary inventory separates external candidates, internal hardware, uncertain placement and infrastructure. Raw nodes remain in the advanced Windows table. Mapped mouse/keyboard collections create separate category candidates; a composite USB parent may have both categories. Matching native instance IDs supplies collection kind rather than a friendly-name guess.

Same-kind input collections group only through the nearest concrete USB VID/PID ancestor, including MI interface parents, with cycle/depth guards and hub boundaries. They remain logical candidate associations. Containers, names and VID/PID are never sufficient to merge different instances or authorize input collection. A receiver can represent more than one wireless peripheral; no physicalDeviceId is fabricated.

USB topology is probable external evidence because embedded laptop devices also use USB. Native capabilities/removal policy/enumerator metadata is available in advanced evidence; removability does not prove external enclosure placement. Known PCI/ACPI processor/firmware/computer classes identify internal system hardware. Other PCI and ACPI devices remain uncertain, including potentially external docks/GPUs. Class/enumerator and compatible IDs identify supporting software/root nodes, system nodes, hubs and composite parents. Generic unmapped HID collections stay in advanced inventory. No confirmed-external classification is manufactured from these properties alone.

Names are generic for unverified mouse/keyboard candidates. Reported Windows names/manufacturer are retained in advanced evidence; they are not a verified model. Cameras, audio, Bluetooth and other categories offer read-only diagnostics, without irrelevant testers. Classification depends on metadata completeness and has no universal enclosure detector. Full discovery with another provider retains its documented scope limitations.

Real-host review found that USB ancestry through the Bluetooth host adapter was promoting radio/service nodes to external candidates. Bluetooth radio/service classes now stay in infrastructure; remote BTHENUM device entries remain uncertain because a paired Windows node does not prove a live radio connection. Repeated non-input USB interfaces group by bounded root and category, without claiming one physical object. Availability wording is explicitly Windows-entry presence, with physical connection unverified. On the reviewed 258-node response this separates 157 infrastructure candidates and leaves 30 probable external candidates; those are not 30 confirmed physical devices. Non-input identity/connection providers and further grouping refinements remain future work.

## Attribution and measurement

The workspace filters freshly inspected sources by exact candidate member instance IDs and input kind. Shared-container or ancestor/sibling relationships are evidence only, not collection permission. Several associated sources require explicit selection; test them separately. The native helper re-enumerates and requires exactly one matching instance/kind and then filters actual hDevice/type. Duplicate matching collections are unsupported, never merged into global input. Unknown sources cannot start tests. Advanced raw node selection is diagnostic-only.

Native held/repeat detection uses VK, scan code and E0/E1 identity, preserving two simultaneous Enter variants sharing a virtual key. Presentation and export retain aggregate virtual-key counts: they do not identify individual physical switch positions. Repeated down messages are distinct from new down transitions, but the API does not establish whether a repeat came from Windows or device firmware. Key-up messages are observations; orphan ups and interrupted pairs remain limitations. Held state clears on cancellation/cleanup. Absolute mouse reports at (0,0) are preserved.

Explicit focus/editable-field, navigation and reset cancellation reasons survive finalization. Interrupted sessions cannot pass the collection/key-pair checks as ordinary completion. Nonce guards exclude older session snapshots. Focus gating, ownership verification, time/packet limits, child cleanup and bounded volatile histories are preserved. No browser event counts substitute for native counts.

## Navigation, results and privacy

A workspace replaces the main inventory within the same window. Back returns to the inventory with its filters retained and stops/discards the collector. Refresh remounts changed observations and removed candidates disappear. Discovery is point-in-time; refresh is required to detect a disconnect outside an active native test. Failed/partial scans retain stale warnings. Automatic continuous PnP monitoring is not implemented.

Keyboard uses a US ANSI reference with fixed rows, modifiers, punctuation, function/navigation keys and a grid numpad. Actual national/model geometry is not detected. Enter/keypad Enter share aggregate VK state and some keypad VKs vary with Num Lock; these limits are stated. Deliberate horizontal keyboard/table scrolling is contained; the page itself clips overflow without global input/gesture interception. Real trackpad/WebView/DPI behavior needs manual acceptance.

Passed means a specifically named observation criterion was met (e.g. a down/up pair was observed). It never means the entire device is good. Results show collection, transition pairs/movement/wheels, a separately reported X-attempt discrepancy, and untested lighting. Focused X-only collection is optional under Targeted test; comprehensive keyboard mode is the default. A discrepancy is an issue in observations, not proof of a defective switch or a performed repair.

Stats for nerds contains identifiers, mapping/parent evidence, lifecycle details, timestamps, bounded recent events, key counts and export previews. Empty events are explained. Back to top collapses details and focuses the heading without resetting/stopping the session. Export previews invalidate when target/mode, text or sanitization changes. History remains bounded to eight tests and exports omit ordered key events. No keyboard text translation, hidden monitoring, uploads, hardware writes or repair provider was introduced.

## Physical/manual acceptance — all pending

1. Open the new unsigned portable build, scan all present devices, and check external/uncertain/internal views against peripherals you can physically identify. Treat a receiver candidate as unresolved until controlled actions establish a responding logical source.
2. Open the mouse candidate. Verify the inventory is replaced within the same window. If several sources exist, try each separately while moving only the intended mouse; an unrelated mouse must not increment its counts.
3. Start a fresh mouse session. Perform 10 left down/up pairs, then separately right/middle/available extra buttons; move and scroll up/down/horizontally if supported. Record expected actions independently on paper. Stop and compare the named observations and advanced timestamps. Do not infer sensor/mechanical accuracy from event counts alone.
4. Open a keyboard candidate and test each available source. Press/release X 10 times slowly, hold X to observe repeats, press simultaneous A/X and both Enter variants if present, test modifiers/arrows/functions. An unrelated keyboard must not increment this source. Compare full mode with X-only mode on the same responding source. User attempts are independent observations.
5. For an independent reference, separately repeat a fixed ten-X procedure in a trusted simple text editor, then return to a fresh AnyDevice session. This compares separate trials, not guaranteed identical packets or device identity. Do not type secrets or export unrelated text.
6. While a test runs, switch apps, focus an editable field, navigate tabs/back, disconnect the selected device, stop and reset. Confirm counts stop, held markers clear, and subsequent sessions show no stale measurements. Background input after leaving must not be collected.
7. Check every visible row/keyboard group, keyboard focus/Tab/Stop controls, Back to top, details collapse, report save/cancel and sanitization. Try horizontal trackpad gestures at ordinary laptop widths and 100/125/150% display scales. Confirm intentional scrollers still work.
8. LEDs, repairs, firmware, model-specific protocols and guaranteed radio identity are not implemented. Do not mark them passed.

No automated or launch-only check satisfies these physical acceptance gates. The agent has not pressed keys, moved/clicked/scrolled the user's mouse or physically identified their wireless peripherals.
