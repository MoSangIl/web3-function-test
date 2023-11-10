const tokensForAccountDiv = document.getElementById("tokens-for-account");

const showTokensForAccount = async () => {
    const contract = await getERC1155Contract();

    const tokenUri = await contract.methods.uri(0).call();

    fetch(tokenUri)
    .then(res => res.json())
    .then(async data => {
        const tokens = data.TokenInfos;
        const accounts = await web3.eth.getAccounts();
        tokensForAccountDiv.innerText = "";
        for(let i = 0; i < accounts.length; i++){
            let tokenBalanceInfos = ""
            for(let j = 0; j < tokens.length; j++){
                const name = tokens[j].name;
                const _id = tokens[j].properties.id;
                const balance = await contract.methods.balanceOf(accounts[i], _id).call();
                tokenBalanceInfos += `id ${_id}. ${name}: ${balance}개 <br>`;
            }
            tokensForAccountDiv.innerHTML += `
            <div class="card border-secondary  mb-3" style="max-width: 50rem;">
            <div class="card-header">${accounts[i]}</div>
            <div class="card-body">
              <p class="card-text">${tokenBalanceInfos}</p>
            </div>
          </div>`
        }
    })
}

showTokensForAccount();