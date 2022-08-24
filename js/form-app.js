function submitEmailForm(form) {
    var obj = new XMLHttpRequest();
    obj.onreadystatechange = function(){
        if(obj.readyState == 4){
            // Object this.status 200 means correct
            if(obj.status == 200){
                var res = JSON.parse(obj.responseText);
                alert(res.message);
            }
            else{
                alert("XMLHttp status " + obj.status + ": " + obj.statusText);
            }
        }
    };
    obj.open("post", form.action, true);
    obj.setRequestHeader("Content-Type", "application/json"); // NOTICE: "application/json"
    obj.send(JSON.stringify({ name: form.name.value, email: form.email.value, message: form.message.value }));
    return false;
}