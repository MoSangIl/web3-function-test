const sendOneFromSelect = document.getElementById("send-one-from"),
      sendOneToInput = document.getElementById("send-one-to"),
      sendOneTidInput = document.getElementById("send-one-tid"),
      sendOneAmountInput = document.getElementById("send-one-value"),
      sendSomeFromSelect = document.getElementById("send-some-from"),
      sendSomeToInput = document.getElementById("send-some-to"),
      sendSomeTidsdiv = document.getElementById("send-some-tid");

web3.eth.getAccounts().then(accounts => {
    accounts.forEach(account => {
        sendOneFromSelect.innerHTML += `<option value="${account}">${account}</option>`
        sendSomeFromSelect.innerHTML += `<option value="${account}">${account}</option>`
    })
})

const presetTokenIds = async () => {
    const contract = await getERC1155Contract();
    const uri = await contract.methods.uri(0).call();

    await fetch(uri)
    .then(res => res.json())
    .then(data => {
        const tokens = data.TokenInfos;

        tokens.forEach(async token => {
            sendSomeTidsdiv.innerText = "";
            tokens.forEach(async token => {
                const _id = token.properties.id;
                sendSomeTidsdiv.innerHTML += `<label>id-${_id} <input style="margin-right:10px; " class="tid-checkbox" type="checkbox" value="${_id}" id="tid-${_id}"><input type="number" id="amount-token-${_id}" value="1" min="1" placeholder="수량을 입력" hidden></label>`
            })
        })
    })

    sendSomeTidsdiv.childNodes.forEach(label => {
        const checkBox = label.childNodes[1];

        checkBox.addEventListener("change", (event) => {
            const checkBox = event.target,
                  tid = checkBox.value;

            const amountInput = document.getElementById(`amount-token-${tid}`);
            if (checkBox.checked){
                amountInput.removeAttribute("hidden");
            }else{
                amountInput.setAttribute("hidden", true);
            }
        })
    })
}
presetTokenIds();

const changeSomeFromEvent = async (event) => {
    const account = event.target.value;
    const contract = await getERC1155Contract();

    await presetTokenIds();
    sendSomeTidsdiv.childNodes.forEach(async label => {
        const checkBox = label.childNodes[1],
              tid = checkBox.value;
        const balance = await contract.methods.balanceOf(account, tid).call();
        if (balance === "0"){
            checkBox.setAttribute("disabled", true);
        }else{
            checkBox.removeAttribute("disabled");
        }
    })
    
    // console.log(sendSomeTidsdiv.childNodes[0].childNodes[1].checked)
}
sendSomeFromSelect.addEventListener("change", changeSomeFromEvent);


const safeTransferBtn = document.getElementById("safe-transfer");
const safeBatchTransferBtn = document.getElementById("safe-batch-transfer");
// safeTransferFrom
const safeTransferFrom = async () => {
    const contract = await getERC1155Contract();

    let from = sendOneFromSelect.value,
        to = sendOneToInput.value,
        tid = sendOneTidInput.value,
        amount = sendOneAmountInput.value;
    if (!from || !to || !tid || !amount){
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
    
    // let sendNftStatusDiv = document.getElementById("send-nft-status");
    // sendNftStatusDiv.innerText = "상태 : "
    const changeStatusText = (state) => {
        // sendNftStatusDiv.innerText += `\n${state}`
        console.log(state);
    }

    contract.methods.safeTransferFrom(from, to, tid, amount, "0x0000").send({from: from})
    .once('sending', (payload) => { console.log(payload);  changeStatusText(payload.method + " - 보내는 중")})
    .once('sent', (payload) => { console.log(payload); changeStatusText(payload.method + " - 보내짐") })
    .once('transactionHash', (hash) => { console.log(hash); changeStatusText(hash + " - 트랜젝션 해쉬") })
    .on('error', function(error){ console.error(error) })
    .then((receipt)=>{
        // will be fired once the receipt is mined
        // location.reload()
        console.log(receipt)
        changeStatusText("마이닝 한 블록: " + receipt.blockNumber + " - 완료")
        showTokensForAccount();
    });
}

// safeBatchTransferFrom
const safeBatchTransferFrom = async () => {
    const contract = await getERC1155Contract();

    const from = sendSomeFromSelect.value,
          to = sendSomeToInput.value;

    let tidBatch = [],
        amountBatch = [];

    sendSomeTidsdiv.childNodes.forEach(label => {
        const checkBox = label.childNodes[1],
              tid = checkBox.value,
              amount = label.childNodes[2].value;

        if(checkBox.checked){
            tidBatch.push(tid);
            amountBatch.push(amount);
        }
    })
    if (!from || !to || !tidBatch || !amountBatch){
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
    
    // let sendNftStatusDiv = document.getElementById("send-nft-status");
    // sendNftStatusDiv.innerText = "상태 : "
    const changeStatusText = (state) => {
        // sendNftStatusDiv.innerText += `\n${state}`
        console.log(state);
    }

    contract.methods.safeBatchTransferFrom(from, to, tidBatch, amountBatch, "0x0000").send({from: from})
    .once('sending', (payload) => { console.log(payload);  changeStatusText(payload.method + " - 보내는 중")})
    .once('sent', (payload) => { console.log(payload); changeStatusText(payload.method + " - 보내짐") })
    .once('transactionHash', (hash) => { console.log(hash); changeStatusText(hash + " - 트랜젝션 해쉬") })
    .on('error', function(error){ console.error(error) })
    .then((receipt)=>{
        // will be fired once the receipt is mined
        // location.reload()
        console.log(receipt)
        changeStatusText("마이닝 한 블록: " + receipt.blockNumber + " - 완료")
        showTokensForAccount();
        presetTokenIds();
    });
}

safeTransferBtn.addEventListener("click", safeTransferFrom);
safeBatchTransferBtn.addEventListener("click", safeBatchTransferFrom);