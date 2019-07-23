
    var message = document.getElementById('message');
    // var message = message.parentNode;
    var index = 0;
    var interval = null;
    var messages = ['Sistema de registro de términos de referencia', 'ágil y práctico...']; // Cada posicion del array es un mensaje
    var countMessage = messages.length - 1;
    var sleepTimeout = 1000;
    var sleepInterval = 250;

    function update(func) {
        message.classList.toggle('animate-cursor');
        setTimeout(function () {
            message.classList.toggle('animate-cursor');
            interval = setInterval(func, sleepInterval);
        }, sleepTimeout);
    }

    function clear() {
        var count = message.innerHTML.length;
        if (count === 0) {
            clearInterval(interval);
            message.innerHTML = '';
            index = (index >= countMessage) ? 0 : index + 1;
            update(write);
        } else {
            message.innerHTML = message.innerHTML.toString().substr(0, count - 1);
        }
    }

    function write() {
        var count = message.innerHTML.length;
        var countCharacter = messages[index].length - 1;
        message.innerHTML += messages[index][(count > 0) ? count : 0];

        if (countCharacter === count) {
            clearInterval(interval);
            update(clear);
        }
    }

    update(write);

