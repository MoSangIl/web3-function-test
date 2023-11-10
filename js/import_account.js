let importAccountBtn = document.getElementById("import_account");
let exportAccountBtn = document.getElementById("export_account");

let importAccountForm = document.getElementById("import_account_form");

let importAccountEvent = async (event) => {
    event.preventDefault();
    
    let prv_key = importAccountForm.private_key.value;
    let password = importAccountForm.password.value;
    let password_confirm = importAccountForm.password_confirm.value;
    
    if (password === password_confirm){
        let importedAccount = await web3.eth.personal.importRawKey(prv_key, password);
    }else {
        alert("password not matched!")
        importAccountForm.password_confirm.value = ""
    }
    
}

importAccountBtn.addEventListener("click", importAccountEvent);