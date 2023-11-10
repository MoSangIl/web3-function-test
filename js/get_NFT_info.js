let requestJSONInfoBtn = document.getElementById("get_json_info");
let weaponInfoDiv = document.getElementById("weapon_info");

let requestJSONInfoEvent = async () => {
    let tokenIdInput = document.getElementById("token_id");
    let tokenId = tokenIdInput.value
    if (!tokenId){
        alert("토큰 아이디를 입력해주세요.");
        tokenIdInput.focus();
        return;
    }
    let contract = await getContractInstance()

    contract.methods.tokenURI(tokenId).call()
    .then((requestURL) => {
        // let request = new XMLHttpRequest();
        // request.open('GET', requestURL);
        // request.responseType = 'json';
        // request.send();
        fetch(requestURL)
        .then(response => response.json())
        .then(weaponInfoJson => {
            console.log(weaponInfoJson);
            weaponInfoDiv.innerHTML = `<span>아이템 정보</span>
            <div>
            <img src="${weaponInfoJson.image}" alt="${weaponInfoJson.name}" width="20%">
            </div>
            <div>
            ${weaponInfoJson.name}
            </div>
            <div>
            ${weaponInfoJson.description}
            </div>
            <div>
            능력치(힘): ${weaponInfoJson.strength}</div>`;
        })        
        .catch(error => {
            alert("유효하지 않은 URL 입니다.")
        })
    })
    .catch(error => {
        alert("유효하지 않은 토큰 입니다.");
    })
}

requestJSONInfoBtn.addEventListener("click", requestJSONInfoEvent);