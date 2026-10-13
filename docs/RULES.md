# Diagnostic rules v0.1

Every finding carries classification, confidence, facts, explanation, evidence, safe next test and limitations. Confidence describes the observation, not confidence in an untested hardware cause.

| Rule | Required evidence / trigger | Severity / confidence | Safe test and abstention |
| --- | --- | --- | --- |
| Windows problem | Nonzero numeric problem code or status ERROR/DEGRADED | Error / high; Windows-reported error | Review Device Manager, known-good cable/port, refresh; abstain from naming root cause |
| Missing metadata | Missing name, class, status or problem code | Info / high; confirmed absence of a property | Refresh or compare Device Manager; never claim device fault |
| Collection error | Structured permission/property/enumeration error | Warning / high observation | Review policy/error and refresh; do not claim device failed or request automatic elevation |
| No longer present | Present in previous complete inventory, absent in current complete inventory | Info / limited | Reconnect and compare interface/mode; abstain on incomplete inventory, first scan, cancellation or timeout |

Codes 22 and 28 describe Windows-reported disabled / drivers-not-installed conditions. Other codes get generic problem wording with their numeric evidence. No rule automatically alters drivers. Unknown status is not treated as healthy or defective. A zero code is no proof of full hardware health.

Android transfer, connection-attempt failure, battery and circuit rules abstain because v0.1 does not collect reliable evidence for them. A synthetic Android fixture triggers only its Windows problem code rule. No MTP diagnosis is inferred from a name or VID. No AI or non-deterministic classifier is used.

0.2.0 comparisons abstain when either collection is incomplete or the provider/scope differs. Finding facts include collection source/scope/time. Investigation property changes report exactly which observable fields changed, with no inferred root cause. All entries are logical nodes; OK does not establish physical health. No Bluetooth/ADB/storage-health-specific rule is added without a dedicated data source.
