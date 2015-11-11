PTT Best Buy
=============

先開 Repo 再說，反正開很多不用錢 Zzz

## Progress

* 伺服器：搭了基本的爬文章還有 resource api 功能，並且能部屬到 heroku。
* 客戶端：Not yet

### TODOs

* <del>價格解析（各種狀況，先最簡單通用版）</del>
* 文章標題搜尋 API
* 價格搜尋 API
* Chrome Extension 客戶端

## Development

### Run

```bash
mongod& # be sure to install mongodb
npm install && npm run build && npm start # setup application
```

### Debug

```bash
node-inspector
node --debug-brk ./build/app.js # in another terminal session
```
