'use strict';
// Assignment 02 - PRF192x_2.1-A_VN Kỹ thuật lập trình với Javascript
// Author: Phạm Quang Hoàn

// [I]. KHAI BÁO
const out_petsCount = document.getElementById('out__pets-count');
const out_dogCount = document.getElementById('out__dog-count');
const out_catCount = document.getElementById('out__cat-count');


// [II]. DATABASES & GLOBAL
const pets = dataGet('pets') !== null ? dataGet('pets') : [];
const breeds = dataGet('breeds') !== null ? dataGet('breeds') : [];

// [III]. FUNCTION

// [IV]. CORE
// 1. Display data
//    Kích hoạt: tụ động
out_petsCount.innerHTML = pets.length;
out_dogCount.innerHTML = pets.filter(x => x.type.toLowerCase() === 'dog').length;
out_catCount.innerHTML = pets.filter(x => x.type.toLowerCase() === 'cat').length;

// 2. Tính năng Export
//    Kích hoạt: exportData(option) được gọi
const exportData = function () {
    const data = JSON.stringify(pets);
    const date = new Date();
    const today = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
    const ex = new Blob([data],{ type: "text/json;charset=utf-8" });
    saveAs(ex, "Export-" + today + ".json");
}

// 3. Tính năng import data
//    Kích hoạt: importFile() được gọi
const importFile = function () {
    const file = document.getElementById("in__import-file");
    const fileExtension = file.value.split('.').pop();

    if(fileExtension.toLowerCase() !== 'json') {
        alert('Please select a JSON file!')
    } else {
        const reader = new FileReader();
        reader.readAsText(file.files[0], "UTF-8");
        reader.onload = function (evt) {
            const importData = JSON.parse(evt.target.result); 
            importData.forEach(obj => {
                // Kiểm tra xem chủng loại đã tồn tại chưa
                let bid = breeds.find(x => x.name === obj.breed && x.type === obj.type);
                if(bid) {
                    // Nếu đã tồn tại thì gán lại cat-id cho đối tượng
                    obj.cat = bid.id;
                } else {
                    // Nếu chưa tồn tại, cần tạo chủng loại mới
                    // Kiểm tra xem có chủng loại nào chưa, nếu có thì lấy id phần tử cuối cùng + 1 để tạo chủng loại mới
                    // Nếu chưa có thì mặc định là 100
                    let newid = breeds.length > 0 ? (breeds.slice(-1))[0].id + 1 : 100;
                    breeds.push({
                        id: newid,
                        type: obj.type,
                        name: obj.breed
                    });
                    obj.cat = newid;
                }
                
                // Kiểm tra xem id pet đã tồn tại hay chưa, nếu có thì ghi đè, nếu chưa có thì thêm vào
                let idx = pets.findIndex(x => x.id == obj.id);
                if(idx !== -1) {
                    pets[idx] = obj;
                } else {
                    pets.push(obj);
                }
                
            });
            // Update CSDL
            dataSet('pets', pets);
            dataSet('breeds', breeds);
            // reload
            location.reload();
        }
        reader.onerror = function (evt) {
            alert("error reading file");
        }
    }
} 