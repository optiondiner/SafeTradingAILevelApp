Get-ChildItem -Path $env:USERPROFILE -Recurse -Include *.jks, *.keystore -ErrorAction SilentlyContinue | ForEach-Object {
    Write-Host "Checking: $($_.FullName)"
    try {
        keytool -list -v -keystore $_.FullName -storepass Duggu117750 | Select-String "SHA1"
    } catch {
        Write-Host "Could not open keystore: $($_.FullName)"
    }
}
