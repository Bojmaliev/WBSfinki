const API = "http://127.0.0.1:5000";
const RDF = "http://localhost:5000/data#";
function getLogged() {
    return getCookie("logged-user");
}

function setLogged(name) {
    setCookie("logged-user", name, 100);
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function setLogout() {
    setCookie("logged-user", "", -1)
}

function chunk(list, size = 6) {
    let newList = [];
    while (list.length > 0) {
        newList.push(list.splice(0, size))
    }
    return newList;
}
function getRole(role) {
    switch (role) {
        case "http://purl.org/vocab/aiiso-roles/schema#Professor": return "Професор";
        case "http://purl.org/vocab/aiiso-roles/schema#Associate_Dean": return "Декан";
        case "http://purl.org/vocab/aiiso-roles/schema#Assistant": return "Асистент";
        case "Admission_Officer": return "Административец";
    }
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return null;
}

// function ontologyData(data) {
//     let newData = [];
//
//     for (let key in data) {
//         const k = key.split("_")
//         let values = data[key];
//         let t;
//         let add = {};
//         //if it is not list make it list
//         if (typeof values === "string")
//             values = [values];
//         for (let val of values) {
//             if (val.indexOf("http") === 0) {
//                 t = "uri";
//                 add["val"] = val;
//             } else {
//                 if (val.indexOf("_") === -1) {
//                     t = "literal";
//                     add["val"] = val;
//                 } else {
//                     t = "uri";
//                     const k = val.split("_");
//                     add["ont"] = k[0];
//                     add["prop"] = k[1];
//                 }
//             }
//             newData.push({
//                 key: {
//                     ont: k[0],
//                     prop: k[1]
//                 },
//                 value: {
//                     ...add,
//                     type: t
//                 }
//             })
//         }
//     }
// return newData;
// }