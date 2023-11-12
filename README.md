Light Node를 운영하고 코인 전송, ERC-20, 721, 1155 토큰 전송을 테스트 합니다.

# Ethereum Test Web

## Functions

- 계정 생성
  - geth 활용 (account new)
  - seed를 통한 알고리즘을 활용하여 생성
- 계정 추가
  - private key
    → import 하고 새로운 비밀번호를 주어서 pem file 생성가능
  - secret key file
- 잔액조회
- 송금하기
  - ETH
  - Token
- 컨트랙트
  - 컨트랙트 인스턴스 생성
  - 컨트랙트 값 변경
  - 컨트랙트 값 읽기

MAC (Message Atuthentication Code) → 부인방지패스워드 : 대칭키 알고리즘

MDC (Message Digest Code) → 해쉬알고리즘만 비교 / 코드 자체가 변경이 되었는지만 체크!

Check Sum → 에러를 찾을 때,

## Abstraction

1. HTTPProvider를 통해 web3와 ethereum node를 Inject (연결)한다.
2. 연결된 Network 에 node가 가진 계정을 불러온다.
3. 불러온 계정의 잔액을 조회한다.
4. UI 환경에서 버튼을 통해 private key를 import / export 한다.
5. UI 환경에서 버튼을 통해 계정 생성을 진행한다.
6. 송금 Transaction을 발생시킨다. (ETH / Token)
7. 배포한 Contract 불러오기 (contract instance 생성)
8. 불러온 contract의 method 호출하기

## Implementation

Web3 cdn link
https://www.jsdelivr.com/package/npm/web3?path=dist

### Web3 inject!

**snippet**

```bash
// Setting for HttpProvider
let web3 = new Web3(Web3.givenProvider ) // 웹에서 감지된 provider(ex, metamask)
// or
let web3 = new Web3('http://localhost:8545'); // local network node (ex geth, ganache)
// or
let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
// or
let web3 = new Web3(Web3.givenProvider || 'http://localhost:8545') // metamask 등 감지된 provider가 없으면, 로컬 노드로 시도
```

_http rpc 통신 허용 Node 실행 옵션 "--http"_

```bash
geth --datadir . --networkid 8192021 --syncmode light --http --http.corsdomain *
```

### Account 가져오기

**snippet**

```bash
web3.eth.getAccounts().then(console.log) // 계정 담은 배열 반환

let func = async () => {
    let accounts = await web3.eth.getAccounts();
    console.log(accounts);
};
func();
```

### 잔액 조회하기

**snippet**

```bash
web3.eth.getBalance([account]).then(console.log) // 계정의 잔액 반환 (단위: Wei)

let func = async () => {
		let accounts = await web3.eth.getAccounts();
		let balance = web3.eth.getBalance(accounts[0]) // 단위 Wei
		console.log(web3.utils.fromWei(balance)) // 단위 변경 Wei -> ETH
};
func();
```

### 트랜젝션 생성 하기

**snippet**

```bash
await web3.eth.personal.unlockAccount([어카운트 입력], [패스워드 입력], 600).then(console.log("Unlocked!"))
    web3.eth.sendTransaction({from: '0x45d07e182d7A9e0834720098aD644BEa00D16115', to: '0xfcF42D311bdB1B5A01BB6107dB4A5d883F0B244B', value: web3.utils.toWei('1')})
    .once('sending', function(payload){ console.log(payload) })
    .once('sent', function(payload){ console.log(payload) })
    .once('transactionHash', function(hash){ console.log(hash) })
    .once('receipt', function(receipt){ console.log(receipt) })
    .on('confirmation', function(confNumber, receipt, latestBlockHash){
        console.log(confNumber, receipt, latestBlockHash);
     })
    .on('error', function(error){ console.error(error) })
    .then(function(receipt){
        // will be fired once the receipt is mined
        console.log(receipt)
    });

```

**snippet**

```bash
let accounts = await web3.eth.getAccounts();
    let account = accounts[0]
    let nonce = await web3.eth.getTransactionCount(account);

    await web3.eth.personal.unlockAccount(account, "1234", 600).then(console.log("Unlocked!"))

    let gasPrice = await web3.eth.getGasPrice()
    web3.eth.signTransaction({
        from: account,
        to: '0xfcF42D311bdB1B5A01BB6107dB4A5d883F0B244B',
        value: web3.utils.toWei('1'),
        gas: "21000",
        gasPrice: gasPrice,
        nonce: nonce
    })
    .then(data => {
        // console.log(data)
        // console.log(data.raw)
        // console.log(data.tx)
        // console.log(data.tx.serialize()) -> error
        web3.eth.sendSignedTransaction(data.raw)
        .once('receipt', function(receipt){ console.log(receipt) })
        .on('confirmation', function(confNumber, receipt, latestBlockHash){
            console.log(confNumber, receipt, latestBlockHash);
            location.reload()
        })
        .on('error', function(error){ console.error(error) })
    })
```

- nonce는 transaction 개수로 하면 된다.

### Import Account

- private key 활용하여 넣기
  **snippet**

  ```bash
  let importAccountEvent = async () => {

      let prv_key = importAccountForm.private_key.value;
      let password = importAccountForm.password.value;

      let importedAccount = await web3.eth.personal.importRawKey(prv_key, password);

  }
  ```

### Contract Instance 가져오기

**snippet**

```jsx
const getContractInstance = async () => {
  let contract;
  // Contract 불러오기 및 NFT 정보 확인
  await fetch('compiledFile.json') // json 파일은 contract compile시에 생성됩니다. (remix / truffle)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      let contract_abi = data.abi; // 추출한 json data에서 abi 가져오기
      let contract_address = '[contract_address]'; // 배포한 contract Address

      contract = new web3.eth.Contract(contract_abi, contract_address);
    });

  return contract;
};
```

- contract abi 데이터, contract address

### Contract Method 실행하기

- 데이터를 저장하거나 변경하는 함수

**snippet**

```jsx
const contract = await getContractInstance();

contract.methods.[contract Method 이름]([...params]).send({from, to, value ...등 transaction 정보})
```

- 데이터를 읽어오는 함수 (view, pure)

**snippet**

```jsx
const contract = await getContractInstance();

contract.methods.[contract Method 이름]([...params]).call()
```

## Page Capture
| Transaction & Account | ERC-20 | ERC-721 | ERC-1155 |
|:---:|:---:|:---:|:---:|
| ![Transaction_Account](https://github.com/MoSangIl/calculate-fee-by-EIP1559/assets/45113627/91628b03-71f4-490c-bc5f-326089ea3b56) | ![ERC20](https://github.com/MoSangIl/calculate-fee-by-EIP1559/assets/45113627/1f5069b5-16c9-482a-b676-8578abca5224) | ![ERC721](https://github.com/MoSangIl/calculate-fee-by-EIP1559/assets/45113627/9d010397-5945-4769-843f-aab18676df67) | ![ERC1155](https://github.com/MoSangIl/calculate-fee-by-EIP1559/assets/45113627/5d492341-fc75-4426-a1c1-08e0334ac7e5)

## Detailed Information
[블로그 페이지](https://faithmo.notion.site/Ethereum-Web3-js-Web-Page-Transaction-Account-Management-ERC-20-ERC-721-ERC-1155-086e0167ad5f4fa29a363fbb5728ef69)

## Resource

https://julien-maffre.medium.com/what-is-an-ethereum-keystore-file-86c8c5917b97
https://metamask.zendesk.com/hc/en-us/articles/360060826432
https://metamask.zendesk.com/hc/en-us/articles/360015289932
