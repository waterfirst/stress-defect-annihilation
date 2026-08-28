param(
    [Parameter(Mandatory = $true)]
    [string]$InputPath,
    [string]$OutputPath
)

$docx = (Resolve-Path -LiteralPath $InputPath).Path
if (-not $OutputPath) {
    $OutputPath = [System.IO.Path]::ChangeExtension($docx, ".pdf")
}
$pdf = [System.IO.Path]::GetFullPath($OutputPath)

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0

try {
    $document = $word.Documents.Open($docx, $false, $true)
    $document.ExportAsFixedFormat($pdf, 17)
    $document.Close($false)
    Write-Output $pdf
}
finally {
    $word.Quit()
}
