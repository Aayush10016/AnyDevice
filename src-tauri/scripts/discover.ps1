# Fixed, read-only adapter. No parameters or device metadata are evaluated as code.
$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = New-Object System.Text.UTF8Encoding($false)
$errors = New-Object System.Collections.Generic.List[object]
$devices = New-Object System.Collections.Generic.List[object]
$complete = $true
function Add-CollectionError($record, $deviceId) {
    $kind = 'property'
    if ($record.CategoryInfo.Category -eq 'PermissionDenied' -or $record.Exception.Message -match 'Access.*denied|Unauthorized') { $kind = 'permission' }
    $errors.Add(@{kind=$kind;message=$record.Exception.Message;deviceId=$deviceId})
}
try {
    Import-Module PnpDevice -ErrorAction Stop
    $inventory = @(Get-PnpDevice -PresentOnly -ErrorAction Stop | Where-Object { $_.InstanceId -like 'USB\*' -or $_.Class -eq 'HIDClass' })
    if ($inventory.Count -gt 4096) { $complete=$false; $errors.Add(@{kind='enumeration';message='Inventory exceeds the 4096-entry limit.'}); $inventory=@($inventory | Select-Object -First 4096) }
    foreach ($device in $inventory) {
        $properties = @{}
        try {
            # Retrieve one property set per entry rather than launching a process per property.
            foreach ($property in @(Get-PnpDeviceProperty -InstanceId $device.InstanceId -ErrorAction Stop)) { $properties[$property.KeyName]=$property.Data }
        } catch { Add-CollectionError $_ $device.InstanceId }
        $problem = $properties['DEVPKEY_Device_ProblemCode']
        $devices.Add(@{
            instanceId=$device.InstanceId; name=$device.FriendlyName; category=$device.Class;
            status=$device.Status; problemCode=$(if($null -ne $problem){[int]$problem}else{$null});
            hardwareIds=@($properties['DEVPKEY_Device_HardwareIds'] | Where-Object { $null -ne $_ });
            manufacturer=$properties['DEVPKEY_Device_Manufacturer']; parent=$properties['DEVPKEY_Device_Parent'];
            location=$properties['DEVPKEY_Device_LocationInfo']
        })
    }
} catch {
    $complete=$false
    Add-CollectionError $_ $null
    if ($errors[$errors.Count-1].kind -ne 'permission') { $errors[$errors.Count-1].kind='enumeration' }
}
$result = @{collectedAt=[DateTimeOffset]::UtcNow.ToString('o');os=[Environment]::OSVersion.VersionString;devices=@($devices.ToArray());errors=@($errors.ToArray());complete=$complete}
ConvertTo-Json -InputObject $result -Depth 8 -Compress
