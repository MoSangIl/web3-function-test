// import * as balance from './get_erc20_balance.js'

let fromSelect = document.getElementById('from-erc20-account');
let toSelect = document.getElementById('to-erc20-account');

let allowanceInfo = document.getElementById("allowance-account-info")
let allowance = document.getElementById("allowance")
let allowanceBtn = document.getElementById("check-allowance-btn")

let approveInfo = document.getElementById("approve-info")
let approveBtn = document.getElementById("approve-btn")

let transferInfo = document.getElementById("transfer-info")
let sendTxBtn = document.getElementById("transfer-btn");

let transferfromInfo = document.getElementById("transferfrom-info")
let transferfromBtn = document.getElementById("transferfrom-btn");


web3.eth.getAccounts()
.then(async accounts => {
    const contract = await getERC20ContractInstance();
    let span_accountWithBalance = document.getElementById("account-erc20-balance");
    span_accountWithBalance.innerText = ""

    let balance = await contract.methods.balanceOf(accounts[0]).call();
    accounts.forEach(account => {
        fromSelect.innerHTML += `<option value="${account}">${account}</option>`
        toSelect.innerHTML += `<option value="${account}">${account}</option>`
    });
})

let allowanceEvent = async () => {
    let from = fromSelect.value,
        to = toSelect.value;

    const contract = await getERC20ContractInstance();
    web3.eth.getAccounts().then((accounts) => {
        contract.methods.allowance(
            from,
            to
            ).call()
            .then((receipt) => {
                allowanceInfo.innerHTML =`from [${from}] to [${to}] <br>`
                allowance.innerHTML = receipt
                console.log("----------------------allowance----------------------",receipt)
            })
        });
}

allowanceBtn.addEventListener("click", allowanceEvent)

let approveEvent = async () => {
    approveInfo.innerHTML = `변경중`

    let from = fromSelect.value,
        to = toSelect.value,
        erc20 = document.getElementById('approve-amount').value;

    const contract = await getERC20ContractInstance();
    await web3.eth.personal.unlockAccount(from, '1234', 600).then(console.log("Unlocked!"))

    web3.eth.getAccounts().then((accounts) => {
        contract.methods.approve(
            to, 
            erc20
        ).send({from: from})
        .once('transactionHash', (hash) => { console.log(hash); })
        .once('receipt', (receipt) => { console.log(receipt); })
        .then((receipt) => {
            console.log("----------------------approve----------------------",receipt)
            approveInfo.innerHTML = `완료`
            allowanceEvent()
        })
      });
}

approveBtn.addEventListener("click", approveEvent)

let sendErc20TxEvent = async () => {
    transferInfo.innerHTML = `전송중`
    
    let from = fromSelect.value,
        to = toSelect.value,
        erc20 = document.getElementById('erc20-transfer-amount').value;
    
    if (!from || !to || erc20<0 ){
        alert("올바르지 않은 양식");
        return;
    }

    const contract = await getERC20ContractInstance();

    console.log('-----------from-----------------');
    console.log(from);
    console.log('-----------to-----------------');
    console.log(to);
    console.log('-----------erc20-----------------');
    console.log(erc20);

    await web3.eth.personal.unlockAccount(from, '1234', 600).then(console.log("Unlocked!"))

    web3.eth.getAccounts().then((accounts) => {
        contract.methods.transfer(
            to, 
            erc20
        ).send({from})
        .once('transactionHash', (hash) => { console.log("----------------------transferhash----------------------",hash); })
        .once('receipt', (receipt) => { console.log(receipt); })
        .then((receipt) => {
            console.log("----------------------transfer----------------------",receipt)
            location.reload()
        })
      });

}

sendTxBtn.addEventListener("click", sendErc20TxEvent)

let erc20transferfromEvent = async () => {
    transferfromInfo.innerHTML = `전송중`
    
    let from = fromSelect.value,
        to = toSelect.value,
        erc20 = document.getElementById('erc20-transferfrom-amount').value;
    
    if (!from || !to || erc20<0 ){
        alert("올바르지 않은 양식");
        return;
    }

    const contract = await getERC20ContractInstance();

    await web3.eth.personal.unlockAccount(from, '1234', 600).then(console.log("Unlocked!"))
    await web3.eth.personal.unlockAccount(to, '1234', 600).then(console.log("Unlocked!"))


    await web3.eth.getAccounts().then((accounts) => {
        contract.methods.transferFrom(
            from,
            to, 
            erc20
        ).send({from: to})
        .once('transactionHash', (hash) => { console.log(hash); })
        .once('receipt', (receipt) => { console.log(receipt); })
        .then((receipt) => {
            console.log(receipt)
            location.reload()
        })
      });

}

transferfromBtn.addEventListener("click", erc20transferfromEvent)