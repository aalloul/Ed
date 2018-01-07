## API

### Request
POST https://table-builder-dot-linear-asset-184705.appspot.com
with params
- `points` <Array> Array of Points

`Point` is <Object> { from_x: <Number>, to_x: <Number>, from_y: <Number>, to_y: <Number>, word: <String>

### Response
Response is just HTML with the formatted table

## Example
curl -XPOST https://table-builder-dot-linear-asset-184705.appspot.com -H "Content-Type: application/json" --data '[{ "from_x": 0, "to_x": 400, "from_y": 0, "to_y": 20, "word": "Top left" },{ "from_x": 1200, "to_x": 1500, "from_y": 0, "to_y": 140, "word": "Top right" },{ "from_x": 0, "to_x": 400, "from_y": 30, "to_y": 90, "word": "Second top left" },{ "from_x": 0, "to_x": 500, "from_y": 140, "to_y": 180, "word": "Third top left" }, { "from_x": 0, "to_x": 1550, "from_y": 210, "to_y": 900, "word": "Main content" }]'