const getERC1155Contract = async () => {
    let contract;
    // Contract 불러오기 및 NFT 정보 확인
    await fetch('../contract_ABI/GameItems.json')
    .then(response => response.json())
    .then(data => {
        
        let contract_abi = data.abi;
        let contract_address = "0x8996C7cfee2b69Ba5C2d002712809e796B81fc9c";
        
        contract = new web3.eth.Contract(contract_abi, contract_address)
    });

    return contract
}

const itmesDiv = document.getElementById("items");

const showERC1155TokenItems = async () => {
    const contract = await getERC1155Contract();

    const token_uri = await contract.methods.uri(0).call();

    fetch(token_uri)
    .then(res => res.json())
    .then(data => {
        const tokens = data.TokenInfos;

        itmesDiv.innerText = "";
        tokens.forEach(tokenInfo => {
            itmesDiv.innerHTML += `<div style="border: 1px solid black; margin: 10px"><div>아이템 이름: <strong class="item-name">${tokenInfo.name}</strong></div>
            <div>개수: <strong class="item-amount">${Math.pow(10, tokenInfo.decimals)}</strong>개</div>
            <div><img class="item-image" width="20%" src="${tokenInfo.image ? tokenInfo.image : ""}" alt="이미지 없음"></div>
            <div>설명: <strong class="item-description">${tokenInfo.description}</strong></div></div>`
        })
    })
}

showERC1155TokenItems();