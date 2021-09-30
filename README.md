# imcData

imcData enable to create various type of data easily.

## Installation

Use npm or yarn.

```bash
npm install imcData
```

## Usage

```js
import Data from "imcData"

# send 'authObj' i.e. list and setting about data and return 'onChange'
<Data authObj={data} onChange={onChange} />

# onChange 'return' has 'dtlist' (data list made of json object) and 'dtsetting' ie composed of
various data form setting (excel, cut & paste, or api)

# receive return data from parent page...
const onChange=(return)=>{
//return={dtlist:[...], dtsetting={}}
}
# 'return' example
{ dtlist: [
{OrderDate: 41883, Region: 'Central', Rep: 'Smith', Item: 'Desk', Units: 2},
{OrderDate: 42172, Region: 'Central', Rep: 'Kivell', Item: 'Desk', Units: 5},
{OrderDate: 42257, Region: 'Central', Rep: 'Gill', Item: 'Penc', Units:3}],
dtsetting: {dtype: 'paste'}}
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
