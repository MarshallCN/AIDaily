$ErrorActionPreference = "Stop"

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$rubyBin = "C:\Ruby33-x64\bin"
$ucrtBin = "C:\Ruby33-x64\msys64\ucrt64\bin"
$rubyExe = Join-Path $rubyBin "ruby.exe"
$bundleBat = Join-Path $rubyBin "bundle.bat"
$dnsPatch = (Join-Path $PSScriptRoot "bundler_dns_patch.rb") -replace "\\", "/"

if (-not (Test-Path $rubyExe)) {
  throw "Ruby 未安装到 C:\\Ruby33-x64。先安装 RubyInstaller DevKit 3.3。"
}

$env:Path = "$rubyBin;$ucrtBin;$env:Path"
$env:RUBYOPT = "-r$dnsPatch"

if (-not $env:https_proxy) {
  $internetSettings = Get-ItemProperty "HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings" -ErrorAction SilentlyContinue

  if ($internetSettings.ProxyEnable -eq 1 -and $internetSettings.ProxyServer) {
    $proxy = $internetSettings.ProxyServer
    if ($proxy -notmatch "^[a-z]+://") {
      $proxy = "http://$proxy"
    }

    $env:http_proxy = $proxy
    $env:https_proxy = $proxy
    $env:HTTP_PROXY = $proxy
    $env:HTTPS_PROXY = $proxy
  }
}

Set-Location $projectRoot

& $bundleBat check | Out-Null
if ($LASTEXITCODE -ne 0) {
  & $bundleBat install
  if ($LASTEXITCODE -ne 0) {
    throw "bundle install 失败。"
  }
}

& $bundleBat exec jekyll serve --host 127.0.0.1 --port 4000 --livereload
