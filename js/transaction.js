let sendTxBtn = document.getElementById("sendTx");
let sendSignTxBtn = document.getElementById("sendSignTx")

let fromSelect = document.getElementById('from-select');
let sendToSelect = document.getElementById('send-to');

web3.eth.getAccounts()
.then(accounts => {
    accounts.forEach(account => {
        fromSelect.innerHTML += `<option value="${account}">${account}</option>`
    })
})

let sendTxEvent = async () => {
    let from = fromSelect.value,
        to = sendToSelect.value,
        eth = document.getElementById('eth-amount').value;
    if (!from || !to || !eth){
        alert("양식을 올바르게 채워주세요");
        return;
    }

    const password = prompt(`account: ${from} 의 비밀번호 입력`);
    if (!password){
        console.log("canceled");
        return;
    }

    // sendTransaction
    await web3.eth.personal.unlockAccount(from, password, 600).then(console.log("Unlocked!"))
    let txsStatusDiv = document.getElementById("txs-status");
    txsStatusDiv.innerText = "상태 : "
    const changeStatusText = (state) => {txsStatusDiv.innerText += `\n${state}`}
    web3.eth.sendTransaction({from: from, to: to, value: web3.utils.toWei(eth)})
    .once('sending', (payload) => { console.log(payload);  changeStatusText(payload.method + " - 보내는 중")})
    .once('sent', (payload) => { console.log(payload); changeStatusText(payload.method + " - 보내짐") })
    .once('transactionHash', (hash) => { console.log(hash); changeStatusText(hash + " - 트랜젝션 해쉬") })
    // .once('receipt', (receipt) => { console.log(receipt); changeStatusText(receipt + " - 영수증") })
    // .on('confirmation', (confNumber, receipt, latestBlockHash) => { 
    //     console.log(confNumber, receipt, latestBlockHash);
    //     changeStatusText("confirm block" + " - 마이닝 완료");
    //     // location.reload()
    //  })
    .on('error', (error) => { console.error(error); changeStatusText(error) })
    .then((receipt) => {
        // will be fired once the receipt is mined
        console.log(receipt)
        changeStatusText("마이닝 한 블록: " + receipt.blockNumber + " - 완료")
        getAccountsAndBalances();
    });
}

let sendSignTxEvent = async () => {
    let accounts = await web3.eth.getAccounts();
    let from = accounts[0]
    let to = accounts[2]
    let nonce = await web3.eth.getTransactionCount(from);

    await web3.eth.personal.unlockAccount(from, "1234", 600).then(console.log("Unlocked!"))

    let gasPrice = await web3.eth.getGasPrice()
    web3.eth.signTransaction({
        from: from, 
        to: to, 
        value: web3.utils.toWei('10'),
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
}

sendTxBtn.addEventListener("click", sendTxEvent)
sendSignTxBtn.addEventListener("click", sendSignTxEvent)
