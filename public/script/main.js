window.onload = () => {
    let publish = document.getElementById("publish");
    let messages = document.getElementById("messages");
    let times = document.getElementById("times");

    publish.onsubmit = function () {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/publish", true);
        xhr.send(JSON.stringify({message: this.elements.message.value}));
        this.elements.message.value = '';
        return false;
    };

    (function subscribe() {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/subscribe", true);
        xhr.onreadystatechange = function () {
            if (this.readyState !== 4) return;
            if (this.status !== 200) {
                setTimeout(subscribe, 500);
                return;
            }
            let li = document.createElement('li');
            li.appendChild(document.createTextNode(this.responseText));
            messages.appendChild(li);

            date();
            subscribe();
        };
        xhr.send(null);
    })();
};


function date() {
    $.ajax({
        url: "date/",
        type: "GET",
        contentType: "text/plain",
        success: function (date) {
            let li = document.createElement('li');
            li.appendChild(document.createTextNode( date ));
            times.appendChild(li);
        }
    });
}