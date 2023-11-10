// Setting for HttpProvider
// let web3 = new Web3(Web3.givenProvider )
// let web3 = new Web3('http://localhost:8545');
// // or
// let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// web3 객체 생성, 웹에 연결된 provider(metamask) 혹은 로컬 노드(http port 8545)로 연결한다.
let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));