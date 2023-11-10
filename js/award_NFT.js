const nftTable = document.getElementById('nft_table');
const awardToSelect = document.getElementById("award-to");
let jsonFiles;

fetch("./NFTokens/NFTpaths.json")
.then(res => res.json())
.then(data => {
    console.log(data)
    console.log(data.fileNames)
    jsonFiles = data.fileNames;
    const nft_files = data.fileNames;

    nft_files.forEach(async (file, index) => {
        const data = await fetch(`./NFTokens/${file}`).then(res => res.json())
        nftTable.innerHTML += `<tr>
        <td>
            ${index + 1}
        </td>
        <td> <img 
            src="${data.image}" 
            alt="${data.name}" 
            width="20%"
            ></td>
        <td>
            <span>${data.name}</span>
        </td>
        <td>
            <span>${data.description}</span>
        </td>
        <td>
            <span>힘: ${data.strength}</span>
        </td>
    </tr>`
    })
    web3.eth.getAccounts()
    .then(accounts => {
        accounts.forEach(account => {
            awardToSelect.innerHTML += `<option value="${account}">${account}</option>`
        })
    })
})

const AwardItemBtn = document.getElementById('award_item');
const awardItemEvent = async () => {
    let contract = await getContractInstance();

    const from = await web3.eth.getAccounts().then(accounts => accounts[0]),
        to = awardToSelect.value,
        number = document.getElementById("item_number").value;
    console.log(from)
    if (!from || !to || !number){
        alert("양식을 올바르게 채워주세요");
        return;
    }

    const password = "1234";
    await web3.eth.personal.unlockAccount(
        "0xBc666142637915564511970d753f8946C9718f4b", 
        password, 
        600)
    .then(console.log("Unlocked!"))
    
    const nftURI = `http://127.0.0.1:5500/NFTokens/${jsonFiles[number-1]}`

    let awardNftStatusDiv = document.getElementById("award-nft-status");
    awardNftStatusDiv.innerText = "상태 : "
    const changeStatusText = (state) => {awardNftStatusDiv.innerText += `\n${state}`}

    contract.methods.awardItem(to, nftURI).send({from: "0xBc666142637915564511970d753f8946C9718f4b"})
    .once('sending', (payload) => { console.log(payload);  changeStatusText(payload.method + " - 보내는 중")})
    .on('error', function(error){ console.error(error) })
    .then(function(receipt){
        // will be fired once the receipt is mined
        // location.reload()
        console.log(receipt)
        changeStatusText("마이닝 한 블록: " + receipt.blockNumber + " - 완료\n new NFT ID: " + receipt.events.Transfer.returnValues.tokenId)
        showNFTBalancesEachAccount(contract);
        showNFTInfoEachAccount(contract);
    });
}
AwardItemBtn.addEventListener("click", awardItemEvent);