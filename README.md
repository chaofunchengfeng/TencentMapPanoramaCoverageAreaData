**语言 / language: [中文](README.md), [English](README_en.md)**

# 腾讯地图街景覆盖区域数据

此项目大部分工作基于 [ReAnna](https://reanna.neocities.org/) 的研究和代码

详情请看这篇博客 [ReAnna - Blue lines on Tencent Maps](https://reanna.neocities.org/blog/qq-maps-lines/)

**此版本库需要 [Git LFS](https://git-lfs.com)**

## 文件介绍

### database/mobile_street.sqlite3.db

> sqlite3 数据库文件

为避免重复爬取，将 ` https://mapvectors.map.qq.com/mobile_street ` API 的返回值保存 (仅 ` lv=18 ` )

可以使用 [DBeaver](https://dbeaver.io/) 或其他类似工具直接打开以查看数据库结构

其中:

| 字段    | 含义                |
|-------|-------------------|
| key   | API url           |
| value | API 返回值 (Base64后) |

> API 返回值是二进制结构，为方便手动查看，并没有保存为 BLOB，而是将其 Base64 后保存为 TEXT

### geoJSON/*.json

> GeoJSON 格式文件，共计 299 个。其中 * 是该城市的 idxId ( ` svid.substring(0, 4) ` )

其中:

1. 将上述 API 返回值转换为 GeoJSON 格式，共计 280 个。

> ` streetcfg.dat ` 配置文件中有 281 个，但其中一个重复，襄樊是襄阳旧名，它们拥有相同的 idxId

2. 通过 ` https://sv.map.qq.com/sv ` API 迭代爬取后，不在上述中的 idxId，共计 19 个。

> 猜测是腾讯地图在采集新数据后并没有更新对应的配置文件和 API

> 如果你想知道更多，请提交 Issues

它们的 idxId 分别是:

- 2212
- 2416
- 2418
- 2513
- 2608
- 2611
- 2613
- 2617
- 2618
- 2619
- 2705
- 2706
- 2707
- 2708
- 2709
- 2815
- 2817
- 3011
- 3604

