[Console]::OutputEncoding=[System.Text.UTF8Encoding]::new($false)
$ErrorActionPreference='Stop'
$errorsFound=[System.Collections.Generic.List[string]]::new()
$system=$null; $bios=$null; $services=@(); $classes=@()
try { $system=Get-CimInstance Win32_ComputerSystem -OperationTimeoutSec 4 | Select-Object Manufacturer,Model,SystemFamily } catch { $errorsFound.Add("System identity: $($_.Exception.Message)") }
try { $bios=Get-CimInstance Win32_BIOS -OperationTimeoutSec 4 | Select-Object Manufacturer,SMBIOSBIOSVersion } catch { $errorsFound.Add("BIOS identity: $($_.Exception.Message)") }
try { $services=@(Get-CimInstance Win32_Service -Filter "Name LIKE 'Lenovo%' OR Name LIKE 'ImController%' OR Name LIKE 'Lighting%' OR Name LIKE 'iCUE%' OR Name LIKE 'Razer%'" -OperationTimeoutSec 4 | Select-Object -First 32 Name,DisplayName,State) } catch { $errorsFound.Add("Vendor service hints: $($_.Exception.Message)") }
try { $classes=@(Get-CimClass -Namespace root/wmi -ClassName '*Keyboard*' -OperationTimeoutSec 4 | Select-Object -First 32 -ExpandProperty CimClassName) } catch { $errorsFound.Add("Keyboard WMI class discovery: $($_.Exception.Message)") }
@{system=$system;bios=$bios;services=$services;wmiClasses=$classes;errors=@($errorsFound.ToArray());source='Fixed read-only CIM queries; service/class presence is not control compatibility'} | ConvertTo-Json -Depth 6 -Compress
