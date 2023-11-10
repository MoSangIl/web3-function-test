let fromSelect = document.getElementById('from-select');
let sendToSelect = document.getElementById('send-to');

web3.eth.getAccounts()
.then(accounts => {
    accounts.forEach(account => {
        fromSelect.innerHTML += `<option value="${account}">${account}</option>`
        // sendToSelect.innerHTML += `<option value="${account}">${account}</option>`
    })
})


let sendNFTBtn = document.getElementById('send-nft');

const sendNFTEvent = async () => {
    let contract = await getContractInstance();

    let from = fromSelect.value,
        to = sendToSelect.value,
        tid = document.getElementById('token-id').value;
    if (!from || !to || !tid){
        alert("양식을 올바르게 채워주세요");
        return;
    }

    const password = prompt(`account: ${from} 의 비밀번호 입력`);
    if (!password){
        console.log("canceled");
        return;
    }
    await web3.eth.personal.unlockAccount(
        from, 
        password, 
        600)
    .then(console.log("Unlocked!"))

    let sendNftStatusDiv = document.getElementById("send-nft-status");
    sendNftStatusDiv.innerText = "상태 : "
    const changeStatusText = (state) => {sendNftStatusDiv.innerText += `\n${state}`}

    contract.methods.safeTransferFrom(from, to, tid).send({from: from})
    .once('sending', (payload) => { console.log(payload);  changeStatusText(payload.method + " - 보내는 중")})
    .once('sent', (payload) => { console.log(payload); changeStatusText(payload.method + " - 보내짐") })
    .once('transactionHash', (hash) => { console.log(hash); changeStatusText(hash + " - 트랜젝션 해쉬") })
    .on('error', function(error){ console.error(error) })
    .then((receipt)=>{
        // will be fired once the receipt is mined
        // location.reload()
        console.log(receipt)
        changeStatusText("마이닝 한 블록: " + receipt.blockNumber + " - 완료")
        showNFTBalancesEachAccount(contract);
        showNFTInfoEachAccount(contract);
    });
}

sendNFTBtn.addEventListener('click', sendNFTEvent);