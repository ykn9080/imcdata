# imcData

api, excel, cut & paste 형태의 데이터를 가져올수 있다.

### ✨ [Demo](http://imcmaster.iptime.org:7009)

[English](./README.md) | 한글

## Install

```sh
# Github
git clone https://github.com/ykn9080/imcTable
npm start //local init
docker-compose up //using docker

# npm
npm install imcdata
```

## Usage

```js
import Data from "imcData"

const DataSample=()=>{
    const onChange=(val)=>{
    //val={dtlist:[...], dtsetting={}}
    }

    return(
    <Data authObj={data} onChange={onChange} />
    )
}

# 'return' example
{ dtlist: [
{OrderDate: 41883, Region: 'Central', Rep: 'Smith', Item: 'Desk', Units: 2},
{OrderDate: 42172, Region: 'Central', Rep: 'Kivell', Item: 'Desk', Units: 5},
{OrderDate: 42257, Region: 'Central', Rep: 'Gill', Item: 'Penc', Units:3}],
dtsetting: {dtype: 'paste'}}

```

<p> 'authObj'에 데이터와 셋팅정보를 입력할 수 있고, 이때 초기값으로 설정된다. </p>
<p>데이터 작업의 결과는 onChange 이벤트의 값으로 리턴되며 datalist값과 setting값으로 구성된 object형태이다. </p>
<p> 리턴된 값으로 다음 스텝을 진행할 수 있다.</p>

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
