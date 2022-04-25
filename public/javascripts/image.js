// script.js
const form = document.getElementById("form");

form.addEventListener("submit", submitForm);

var getBase64fromFile = function (file) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            resolve(reader.result);
        };
        reader.onerror = function (error) {
            reject(error);
        };
    });
};

async function submitForm(e) {
    e.preventDefault();
    const name = document.getElementById("name");
    const image = document.getElementById("image").files[0];
    const base64 = await getBase64fromFile(image);
    sendRequest(base64);
}

function convertToArabic(englishWord){
    switch (englishWord) {
        case "sunday":
            
            return "الأحد";
        case "chair":
            return "كرسي";

        case "doctor":
            return "طبيب";
        case "good":
            return "جيد";
        case "student":
            return "طالب";
        case "hello":
            return "مرحبا";
    }
}

function insertWord(word) {
    $.ajax({
        url: "https://arabic-sign-language-translate.herokuapp.com/createWord",
        method: "POST",
        data: {
            word: word
        },
        type: "json",
        success: function (data) {
            console.log("success: "+data);
        },
        error: function(data) {
            console.log("error: "+data);
        }
     });
     return false;    
 }

function sendRequest(base64) {
    var url = "https://detect.roboflow.com/saudi-sign-language/1?api_key=KG7qCG83imlTN93yMf8s";
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open("POST", url);

    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            console.log(xhr.response.predictions[0]);
            const pred = xhr.response.predictions[0];
            var word;
            const predictions = document.getElementById("predictions");
            if (pred != null) {
                word = convertToArabic(pred.class);

                predictions.innerHTML = "<div>" + "الفئة: " +word + "</div>" + "<div>" + " (%)نسبة الثقة: " + xhr.response.predictions[0].confidence + "</div>";
                insertWord(word);
            } else {
                predictions.innerHTML = "لم يتم العثور على نتائج";
            }

            var img = $('<img/>');

            img.attr('height', 400);
            img.attr('width', 400);
            img.attr('src', base64);

            canvas = $('<canvas/>');

            ctx = canvas[0].getContext("2d");
            canvas[0].width = pred.width;
            canvas[0].height = pred.height;

            canvas.css({
                width: pred.width,
                height: pred.height,
                left: ($(window).width() - pred.width) / 2,
                top: ($(window).height() - pred.height) / 2
            });

            $('#output').html("").append(img);
            img.append(canvas);
        }
    };

    var data = base64;

    xhr.send(data);


}
