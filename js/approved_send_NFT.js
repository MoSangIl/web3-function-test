let fromsApproveTokens = document.getElementsByClassName("approve-from"),
    fromApproveAToken = fromsApproveTokens[0],
    fromApporveTokens = fromsApproveTokens[1];

const approveATokenTo = document.getElementById("approve-a-token-to"),
      approveTokensTo = document.getElementById("approve-tokens-to")

const tokenOption = document.getElementById("token-be-approved"),
      tokensBeApproved = document.getElementById("tokens-apprve-1");

const approveATokenBtn = document.getElementById("approve-a-token"),
      approveTokensBtn = document.getElementById("approve-tokens"),
      delegatedSendNFTBtn = document.getElementById("delegated-send-nft");

const delegatedSendFromStrong = document.getElementById("delegated-send-from"),
      delegatedSendToInput = document.getElementById("delegated-send-to"),
      delegatedSendTidInput = document.getElementById("delegated-send-tid");

let owner = "",
    delegatedSendFrom = "",
    delegatedSendTo = "",
    delegatedSendTid = "";
// let sendToSelect = document.getElementById('send-to');

web3.eth.getAccounts()
.then(accounts => {
    accounts.forEach(account => {
        fromApproveAToken.innerHTML += `<option value="${account}">${account}</option>`
        fromApporveTokens.innerHTML += `<option value="${account}">${account}</option>`
        // sendToSelect.innerHTML += `<option value="${account}">${account}</option>`
    })
})
const getTokensOfAccount = async (account) => {
    const contract = await getContractInstance();

    let tokens = [];
    let i = 1;
    while (true) {
        try {
            // NFT id 별 account 불러오기

            let account_of_nft = await contract.methods.ownerOf(i).call();

            if (account === account_of_nft) {
                tokens.push(i);
                console.log(i)
            }
            i += 1;
        }catch{
            console.log("not existed")
            break;
        }
    }
    return tokens;
}

fromApproveAToken.addEventListener("change", async (event) => {
    const account = event.target.value;

    const tokens = await getTokensOfAccount(account);

    tokenOption.innerHTML ="<option value=''>--Please choose A Token--</option>";
    tokens.forEach(token => {
        tokenOption.innerHTML += `<option value="${token}">${token}</option>`
    })
})

fromApporveTokens.addEventListener("change", async (event) => {
    const account = event.target.value;

    const tokens = await getTokensOfAccount(account);

    tokensBeApproved.innerText = "승인될 토큰들 = " + tokens.join(", ")
})

// let sendNFTBtn = document.getElementById('send-nft');

const approveAToken = async () => {
    let contract = await getContractInstance();

    let from = fromApproveAToken.value,
        to = approveATokenTo.value,
        tid = tokenOption.value;
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

    // let sendNftStatusDiv = document.getElementById("send-nft-status");
    // sendNftStatusDiv.innerText = "상태 : "
    const changeStatusText = (state) => {
        // sendNftStatusDiv.innerText += `\n${state}`
        console.log(state)
    }

    contract.methods.approve(to, tid).send({from: from})
    .once('sending', (payload) => { console.log(payload);  changeStatusText(payload.method + " - 보내는 중")})
    .once('sent', (payload) => { console.log(payload); changeStatusText(payload.method + " - 보내짐") })
    .once('transactionHash', (hash) => { console.log(hash); changeStatusText(hash + " - 트랜젝션 해쉬") })
    .on('error', function(error){ console.error(error) })
    .then((receipt)=>{
        // will be fired once the receipt is mined
        // location.reload()
        console.log(receipt)
        changeStatusText("마이닝 한 블록: " + receipt.blockNumber + " - 완료")
        // showNFTBalancesEachAccount(contract);
        // showNFTInfoEachAccount(contract);
        approveTokensBtn.setAttribute("disabled", true);
        owner = from
        delegatedSendFromStrong.innerText = to;
        delegatedSendFrom = to;
    });
}

const approveTokens = async () => {
    let contract = await getContractInstance();

    let from = fromApporveTokens.value,
        to = approveTokensTo.value;
    if (!from || !to ){
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
        console.log(state)
    }

    contract.methods.setApprovalForAll(to, "true").send({from: from})
    .once('sending', (payload) => { console.log(payload);  changeStatusText(payload.method + " - 보내는 중")})
    .once('sent', (payload) => { console.log(payload); changeStatusText(payload.method + " - 보내짐") })
    .once('transactionHash', (hash) => { console.log(hash); changeStatusText(hash + " - 트랜젝션 해쉬") })
    .on('error', function(error){ console.error(error) })
    .then((receipt)=>{
        // will be fired once the receipt is mined
        // location.reload()
        console.log(receipt)
        changeStatusText("마이닝 한 블록: " + receipt.blockNumber + " - 완료")
        approveATokenBtn.setAttribute("disabled", true);
        owner = from;
        delegatedSendFromStrong.innerText = to;
        delegatedSendFrom = to;
        // showNFTBalancesEachAccount(contract);
        // showNFTInfoEachAccount(contract);
    });
}

const delegatedSendNFT = async () => {
    let contract = await getContractInstance();
    
    delegatedSendTo = delegatedSendToInput.value;
    delegatedSendTid = delegatedSendTidInput.value;
    console.log(delegatedSendFrom, delegatedSendTo, delegatedSendTid)
    if (!delegatedSendFrom || !delegatedSendTo || !delegatedSendTid){
        alert("양식을 올바르게 채워주세요");
        return;
    }

    const password = prompt(`account: ${delegatedSendFrom} 의 비밀번호 입력`);
    if (!password){
        console.log("canceled");
        return;
    }
    await web3.eth.personal.unlockAccount(
        delegatedSendFrom, 
        password, 
        600)
    .then(console.log("Unlocked!"))

    // let sendNftStatusDiv = document.getElementById("send-nft-status");
    // sendNftStatusDiv.innerText = "상태 : "
    const changeStatusText = (state) => {
        // sendNftStatusDiv.innerText += `\n${state}`
        console.log(state)
    }

    contract.methods.safeTransferFrom(owner, delegatedSendTo, delegatedSendTid).send({from: delegatedSendFrom})
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
        approveATokenBtn.removeAttribute("disabled")
        approveTokensBtn.removeAttribute("disabled")
        fromApproveAToken.innerHTML = "<option value=''>--Please choose An Account--</option>";
        fromApporveTokens.innerHTML = "<option value=''>--Please choose An Account--</option>";
        approveATokenTo.innerText = "";
        approveTokensTo.innerText = "";
        tokenOption.innerHTML = "<option value=''>--Please choose A Token--</option>";
        tokensBeApproved.innerText = "승인될 토큰들 = "
        delegatedSendFromStrong = "";
        delegatedSendToInput.innerText = "";
        delegatedSendTidInput.innerText = "";
        delegatedSendFrom = "";
        delegatedSendTo = "";
        delegatedSendTid = ""

    });
}

approveATokenBtn.addEventListener("click", approveAToken);
approveTokensBtn.addEventListener("click", approveTokens);
delegatedSendNFTBtn.addEventListener('click', delegatedSendNFT);
