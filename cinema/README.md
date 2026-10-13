# 冷色系放映室

观众统一访问 https://node2tree.github.io/ ，不需要房间链接或房间编号。

主机入口：https://node2tree.github.io/host/

## 主机口令

在 Cloudflare 的 `kino-room` Worker 中打开 **Settings → Runtime variables and secrets → Add variable**：

- 类型选择 **Secret**。
- 名称填 `HOST_PASSWORD`。
- 值填你自己决定的主机口令，然后保存并部署。

口令不写入网页或 GitHub。主机入口会把口令通过加密连接交给服务端验证。主机口令由你自己设置，部署时不会预置口令。

## 放映

1. 打开主机入口，输入口令，点击「接管放映」。
2. 选择本地影片，可以修改显示的电影名。
3. 点击「开始放映」。主机可以暂停和跳转进度，观众会跟随。
4. 把首页网址发给朋友，观众打开首页即可观看。如果浏览器阻止自动播放，在视频窗口里点击「播放」。
5. 新主机用正确口令登录后，旧主机立即失去服务端权限，供片连接关闭；观众在同一个首页自动切换。

供片时保持电脑联网、避免休眠，并保持主机页面打开。视频不上传云盘；浏览器只读取你选择的文件。推荐 H.264/AAC 的 MP4 或浏览器支持的 WebM。

## 连接

连接服务部署在你自己的 Cloudflare 账号。它只传递房间状态和建立连接所需的信息，不保存影片。Cloudflare TURN 的长期密钥保存为 Worker secrets `TURN_KEY_ID` 和 `TURN_API_TOKEN`；网页获取有时限的连接凭据，直连失败时使用中继。

TURN 已配置，双方强制使用中继的实际影片测试通过。正常访问会尝试直连，无法直连时自动使用 Cloudflare 中继。视频不占云盘空间，中继会产生流量；按 Cloudflare 订阅页面，每月包含 1,000 GB，超出 $0.05/GB。

## 源码

观众首页 `index.html`，主机页 `host/index.html`，共享播放器 `cinema/app.js`，按需读取桥接 `sw.js`。服务端源码在 `cloudflare/worker.js`，配置在 `cloudflare/wrangler.toml`。本地测试用 `.dev.vars` 不包含在发布文件中。

已经验证：简洁界面、实际本地分片播放、全屏、错误口令拒绝、唯一主机接管和撤销、消息角色隔离，以及双方强制中继播放。强制中继测试使用两个浏览器页面及真实 Cloudflare 中继；尚未使用两台处于不同网络的设备测试。

旧站存档：https://node2tree.github.io/archive/2026-10-12/

原定时放映页存档：https://node2tree.github.io/screenings/2026-10-12/
