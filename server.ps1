$port = 4000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Prefixes.Add("http://127.0.0.1:$port/")
$listener.Start()
Write-Host "Royal Cars Server running at http://localhost:$port/ with Auto-Device Routing"
$basePath = (Get-Location).Path

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        try {
            $rawUrl = $request.Url.LocalPath
            $ua = $request.UserAgent
            $isMobile = $false
            if ($ua -and ($ua -match "Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile")) {
                $isMobile = $true
            }

            # Root path auto routing
            if ($rawUrl -eq '/' -or [string]::IsNullOrWhiteSpace($rawUrl)) { 
                if ($isMobile) {
                    $rawUrl = '/mobile.html'
                } else {
                    $rawUrl = '/index.html'
                }
            }
            $cleanRelPath = $rawUrl.TrimStart('/').Replace('/', '\')
            $filePath = Join-Path $basePath $cleanRelPath

            if (Test-Path $filePath -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                $contentType = switch ($ext) {
                    '.html' { 'text/html; charset=utf-8' }
                    '.css'  { 'text/css; charset=utf-8' }
                    '.js'   { 'application/javascript; charset=utf-8' }
                    '.jpg'  { 'image/jpeg' }
                    '.jpeg' { 'image/jpeg' }
                    '.png'  { 'image/png' }
                    '.svg'  { 'image/svg+xml' }
                    '.mp4'  { 'video/mp4' }
                    '.json' { 'application/json' }
                    Default { 'application/octet-stream' }
                }
                $response.ContentType = $contentType
                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $response.StatusCode = 404
                $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
                $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
            }
        } catch {
            $response.StatusCode = 500
        } finally {
            $response.Close()
        }
    }
} finally {
    $listener.Stop()
    $listener.Close()
}
