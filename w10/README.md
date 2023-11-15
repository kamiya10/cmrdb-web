# 留言板

1. 安裝模塊 `npm i`
2. 開啟網頁伺服器 `node main.js`
3. 到 http://localhost:3000

## API

### 建立留言

```http
POST /api/create
```

#### Body

```json
{
  "title"   : "Some title",           // title   (string)* 留言標題
  "author"  : "Someone",              // author  (string)* 留言作者
  "content" : "Something interesting" // content (string)* 留言內容
}
```

### 抓取所有留言

```http
GET /api/posts
```

Return: [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)<[Post](#Post)> 

#### Parms

| key | 說明 | 預設值 |
| -- | -- | -- |
| `limit` | 回傳留言數量 | `10` |
| `skip` | 跳過前面留言數量 | `0` |


### 抓取指定留言

```http
GET /api/post/:postId
```

Return: [Post](#Post) 

## 資料型態

### Post
```json
{
  "id"        : "khzgetf",               // 留言 ID
  "title"     : "Some title",            // 留言標題
  "author"    : "Someone",               // 留言作者
  "content"   : "Something interesting", // 留言內容
  "timestamp" : 1700043812632,           // 留言創建時間
}
```
