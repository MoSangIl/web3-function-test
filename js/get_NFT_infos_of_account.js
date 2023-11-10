// contract 불러오기
const getContractInstance = async () => {
    let contract;
    // Contract 불러오기 및 NFT 정보 확인
    await fetch('../contract_ABI/GameItem.json')
    .then(response => response.json())
    .then(data => {
        console.log(data)
        
        let contract_abi = data.abi;
        let contract_address = "0xd5e67b50463329A3CC37a7Da31b092B3c665a291";
        
        contract = new web3.eth.Contract(contract_abi, contract_address)
    });

    return contract
}

// NFT 잔액 확인
const showNFTBalancesEachAccount = (contract) => {
    
    web3.eth.getAccounts()
    .then(accounts => {
        let accountWithNftSpan = document.getElementById('account_with_nft_count');
        accountWithNftSpan.innerText = ""
        accounts.forEach(async account => {
            let nft_balance = await contract.methods.balanceOf(account).call();
            accountWithNftSpan.innerHTML += `
            <div class="card border-dark mb-3" style="width: 100rem;">
            <div class="card-header">${account}</div>
            <div class="card-body text-dark">
            <h5 class="card-title">토큰 개수 : ${nft_balance}</h5>
            </div>
        </div>`
        });
    })
}

// NFT 정보 불러오기
const showNFTInfoEachAccount = async (contract) => {
    // 정보 저장할 배열
    let nfts = [];
    // NFT 토큰 아이디(1, 2, ..., n) 차례로 확인
    // 존재하지 않으면 종료
    let i = 1;
    while (true) {
        try {
            // NFT id 별 account 불러오기
            let ntf_infos = {account: null, token_id: 0};

            let account_of_nft = await contract.methods.ownerOf(i).call();
            ntf_infos.account = account_of_nft;
            ntf_infos.token_id = i;

            nfts.push(ntf_infos);
            i += 1;
        }catch{
            console.log("not existed")
            break;
        }
    }

    // 중복된 account 같은 정보로 합치기
    let result = nfts.reduce((prev, current) => {
        let found = false;
        
        for (let i = 0; i < prev.length; i++){
            if(prev[i].account === current.account){
                prev[i].nft_count += 1;
                prev[i].token_id.push(current.token_id);
                found = true;
            }
        }
        if(!found){
            current.nft_count = 1;
            current.token_id = [current.token_id];
            prev.push(current);
        }
        return prev;
    }, [])
    console.log(result);

    let accountWithNftInfoSpan = document.getElementById("account_with_nft_info");
    accountWithNftInfoSpan.innerText = "";
    result.forEach(res => {
        accountWithNftInfoSpan.innerHTML += `
        <div class="card border-secondary  mb-3" style="max-width: 50rem;">
        <div class="card-header">${res.account}</div>
        <div class="card-body">
          <h5 class="card-title">토큰 개수 : ${res.nft_count} 개</h5>
          <p class="card-text">보유한 토큰 아이디 = \n${res.token_id.join('\n')}</p>
        </div>
      </div>`
    })
}


// NFT 정보 확인
(async () => {
    const contract = await getContractInstance();
    showNFTBalancesEachAccount(contract);
    showNFTInfoEachAccount(contract);
})();

