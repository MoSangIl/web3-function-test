const getAccountsAndBalances = () => {
    web3.eth.getAccounts()
    .then(accounts => {
        let span_account = document.getElementById("accounts");
        span_account.innerText = accounts.join('\n');
        
        let span_accountWithBalance = document.getElementById("accounts_with_balance");
        span_accountWithBalance.innerText = ""
        accounts.forEach(account => {
            web3.eth.getBalance(account)
            .then(balance => {
                span_accountWithBalance.innerHTML += `
                <div class="card border-secondary  mb-3" style="max-width: 50rem;">
                <div class="card-header">${account}</div>
                <div class="card-body">
                  <h5 class="card-title">ETH 수량: ${Math.round(web3.utils.fromWei(balance))}ETH</h5>
                </div>
              </div>`
            })
        });
    }) // 계정 및 잔액 가져오기

    const data = web3.eth.abi.encodeFunctionCall({
			"inputs": [
				{
					"internalType": "address",
					"name": "to",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "value",
					"type": "uint256"
				}
			],
			"name": "transfer",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "nonpayable",
			"type": "function"
		}, ["0x4d5a528692eBE30E64f81cd96b5B7cfbD3835D05", "111"])
    console.log(data);
}

getAccountsAndBalances();