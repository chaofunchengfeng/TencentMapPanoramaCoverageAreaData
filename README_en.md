**语言 / language: [中文](README.md), [English](README_en.md)**

# Tencent Map Panorama Coverage Area Data

Much of this work is based on the research and code of [ReAnna](https://reanna.neocities.org/)

For details, please see this
blog [ReAnna - Blue lines on Tencent Maps](https://reanna.neocities.org/blog/qq-maps-lines/)

**This repository requires [Git LFS](https://git-lfs.com)**

## File Introduction

### database/mobile_street.sqlite3.db

> sqlite3 database file

To avoid duplicate crawling, save the response of ` https://mapvectors.map.qq.com/mobile_street ` API (only ` lv=18 ` )

You can use [DBeaver](https://dbeaver.io/) or other similar tools to directly open and view the database structure

Where:

| Field | Description           |
|-------|-----------------------|
| key   | API url               |
| value | API response (Base64) |

> The API response is a binary structure. To facilitate manual viewing, it is not saved as BLOB, but saved as TEXT using
> Base64.

### geoJSON/*.json

> GeoJSON format files, 299 in total. * is the idxId of the city ( ` svid.substring(0, 4) ` )

Where:

1. Convert the above API response into GeoJSON format, 280 in total.

> There are 281 in the `streetcfg.dat` configuration file, but one of them is repeated. XiangFanShi is the old name of
> XiangYangShi. They have the same idxId

2. After iterative crawling through the ` https://sv.map.qq.com/sv ` API, there are 19 idxId that are not in the above
   list.

> It is speculated that Tencent Map did not update the corresponding configuration file and API after collecting new
> data.

> If you want to know more, please submit an Issue

Their idxId are:

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

### database/mobile_street.sqlite3.db

> svid and its latitude and longitude database files, you can use the command ` npm run build ` to build the
> corresponding GeoJSON file

Where:

| Field | Description |
|-------|-------------|
| key   | svid        |
| lng   | longitude   |
| lat   | latitude    |

