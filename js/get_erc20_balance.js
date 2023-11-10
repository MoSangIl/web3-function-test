const getAccountsAndERC20Balances = () => {
    web3.eth.getAccounts()
    .then(async accounts => {
        const contract = await getERC20ContractInstance();

        // console.log(contract)
        // console.log(accounts)
        let span_accountWithBalance = document.getElementById("account-erc20-balance");
        span_accountWithBalance.innerText = ""
        
        let balance = await contract.methods.balanceOf(accounts[0]).call();
        accounts.forEach(account => {
        contract.methods.balanceOf(account).call()
            .then(balance => {
                span_accountWithBalance.innerHTML += `
                <div class="card border-secondary  mb-3" style="max-width: 20rem; margin:10px;">
                <div class="card-header">${account}</div>
                <div class="card-body">
                  <h5 class="card-title">BOM 수량: ${balance} B</h5>
                </div>
              </div>`
            })
        });
        
        let encode = await contract.methods.transfer("0xc73f861cc14F16C80C4781825c8FB5b106eDB046", 1).encodeABI();
        console.log(encode)
    }) // 계정 및 잔액 가져오기
}

getAccountsAndERC20Balances();