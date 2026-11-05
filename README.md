# GRE 填空练习

这是目前 GRE 填空练习网站的静态源码。打开 `dist/index.html` 即可使用；建议在本地用静态服务器运行，例如在仓库根目录执行 `python -m http.server 8000`，然后访问 `http://localhost:8000/dist/`。

- Section 1–35 可以按 Section 作答与批改；其中 Section 1–4 包含已有的讲解。
- Section 36 起的原书页面目前仅供浏览，尚未实现按 Section 作答、批改和讲解。
- 做题记录保存在当前浏览器，下载备份后可在其他设备恢复；没有自动跨设备同步。

本仓库仅包含网站程序，不包含从题目 PDF 生成的原书扫描图片。相关页面需要这些本地图片：把已授权使用的原题 PDF 放在本地，安装 Poppler 后运行 `bash scripts/render-pages.sh /path/to/book.pdf`。生成的图片位于 `dist/pages/`，默认不会加入 Git。不要把原始 PDF 或扫描图片提交到公开仓库，除非你确认有权公开分享。
