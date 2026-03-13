# Windows 上某些机器的 DNS 注册表项编码异常，会让 Bundler 在解析源地址前崩掉。
# 这里提前重载 Win32 DNS 读取逻辑，绕过系统注册表读取。
require "win32/resolv"

module Win32
  module Resolv
    def self.get_resolv_info
      [[], ["1.1.1.1", "8.8.8.8"]]
    end
  end
end
