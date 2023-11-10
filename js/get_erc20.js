// contract 불러오기
const getERC20ContractInstance = async () => {
    let contract;
    // Contract 불러오기 및 NFT 정보 확인
    await fetch('../contract_ABI/BOMToken.json')
    .then(response => response.json())
    .then(data => {
        console.log(data)
        
        let contract_abi = data.abi;
        let contract_address = "0x458dede45B77C8523a6fE70ee2FBC9B917BEd9c4";
        
        contract = new web3.eth.Contract(contract_abi, contract_address)
    });

    return contract
}