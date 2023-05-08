'use strict';
// Assignment 02 - PRF192x_2.1-A_VN Kỹ thuật lập trình với Javascript
// Author: Phạm Quang Hoàn

// [I]. KHAI BÁO
const in_searchId = document.getElementById('in__search-id');
const in_searchName = document.getElementById('in__search-name');
const in_searchType = document.getElementById('in__search-type');
const in_searchBreed = document.getElementById('in__search-breed');
const in_searchVaccinated = document.getElementById('in__search-vaccinated');
const in_searchDewormed = document.getElementById('in__search-dewormed');
const in_searchSterilized = document.getElementById('in__search-sterilized');

const area_petsTable = document.getElementById('area__pets-table');
const area_petsResult = document.getElementById('area__pets-result');
const area_noData = document.getElementById('area__no-data');

// [II]. DATABASES & GLOBAL
const pets = dataGet('pets') !== null ? dataGet('pets') : [];
const breeds = dataGet('breeds') !== null ? dataGet('breeds') : [];
let selects = []; // Bộ chọn hiện tại

// [III]. FUNCTION
// render data bởi array
const renderPets = function (arr = selects) {
    // Hiển thị thông báo chưa có dữ liệu
    area_petsResult.innerHTML = '';
    area_noData.classList.remove('hidden');

    if(arr.length > 0) {
        area_noData.classList.add('hidden');
        arr.forEach(obj => {
            let row = document.createElement('tr');
            row.innerHTML = `<td>${obj['id']}</td>
            <td>${obj['name']}</td>
            <td>${obj['age']}</td>
            <td>${obj['type']}</td>
            <td>${obj['weight']} kg</td>
            <td>${obj['length']} cm</td>
            <td>${obj['bmi']}</td>
            <td>${obj['breed']}</td>
            <td style="color: ${obj['color']};"><i class="fa fa-square icon-border"></i></td>
            <td>${obj['vaccinated']? '<i class="fa fa-check green--color"></i>':'<i class="fa fa-times red--color"></i>'}</td>
            <td>${obj['dewormed']? '<i class="fa fa-check green--color"></i>':'<i class="fa fa-times red--color"></i>'}</td>
            <td>${obj['sterilized']? '<i class="fa fa-check green--color"></i>':'<i class="fa fa-times red--color"></i>'}</td>
            <td>${obj['date']}</td>
            </td>`;
            area_petsResult.appendChild(row);
        });
    }
}

// [IV]. CORE
// 1. Hiển thị danh sách breed đang có sau khi tải trang
//    Kích hoạt: tự động
// Tạo danh sách chứa tất cả tên giống, không phân biệt viết hoa, không có giá trị trùng nhau
let breedList = [];
breeds.forEach(obj => {
    if(!breedList.includes((obj.name.toLowerCase()))) breedList.push(obj.name);
});
// in ra form
let options = '<option value="">Select Type</option>';
breedList.forEach(breed => {
    options += `<option value="${breed}">${breed}</option>`;
});
in_searchBreed.innerHTML = options;

// 2. Xử lý sự kiện submit form
//    Kích hoạt: form được submit
const searchSubmit = function () {
    let error = true;
    let limit = [];

    // reset bộ lọc
    selects = [];

    // Lần lượt kiểm tra các trường dữ liệu vào
    in_searchId.value = in_searchId.value.trim();
    if(in_searchId.value) {
        error = false;
        // Tạo một phạm vi tìm kiếm động, lấy selects hiện tại làm cơ sở, nếu chưa có selects thì lấy tất cả pets
        // Ý nghĩa phần này là sẽ liên tục gán selects cho limit, kiểm tra với trường hiện tại rồi lại ghi đè lại select, cho đến khi không còn điều kiện cần so sánh nữa
        limit = selects.length > 0 ? selects : pets;
        // Tìm kiếm phần tử trong phạm vi động, gán trả lại về selects
        selects = limit.filter(x => x.id.toLowerCase().indexOf(in_searchId.value.toLowerCase()) != -1);
    }
    in_searchName.value = in_searchName.value.trim();
    if(in_searchName.value) {
        error = false;
        // Tương tụ như trên
        limit = selects.length > 0 ? selects : pets;
        selects = limit.filter(x => x.name.toLowerCase().indexOf(in_searchName.value.toLowerCase()) != -1);
    }
    if(in_searchType.value) {
        error = false;
        // Tương tụ như trên
        limit = selects.length > 0 ? selects : pets;
        selects = limit.filter(x => x.type.toLowerCase().indexOf(in_searchType.value.toLowerCase()) != -1);
    }
    if(in_searchBreed.value) {
        error = false;
        // Tương tụ như trên
        limit = selects.length > 0 ? selects : pets;
        selects = limit.filter(x => x.breed.toLowerCase().indexOf(in_searchBreed.value.toLowerCase()) != -1);
    }
    if(in_searchVaccinated.checked) {
        error = false;
        // Tương tụ như trên
        limit = selects.length > 0 ? selects : pets;
        selects = limit.filter(x => x.vaccinated === true);
    }
    if(in_searchDewormed.checked) {
        error = false;
        // Tương tụ như trên
        limit = selects.length > 0 ? selects : pets;
        selects = limit.filter(x => x.dewormed === true);
    }
    if(in_searchSterilized.checked) {
        error = false;
        // Tương tụ như trên
        limit = selects.length > 0 ? selects : pets;
        selects = limit.filter(x => x.sterilized === true);
    }
    
    if(error) {
        // Nếu không có bất kì giá trị nào được nhập, thông báo lỗi
        alert('Bạn cần nhập nội dung tìm kiếm.');
    } else {
        // Ngược lại, hiển thị danh sách kết quả
        renderPets(selects);
        area_petsTable.classList.remove('hidden');
    }
}

// 3. Xử lý sự kiện reset form
//    Kích hoạt: hàm resetSearch() được gọi
const resetSearch = function () {
    in_searchId.value = '';
    in_searchName.value = '';
    in_searchType.value = '';
    in_searchBreed.value = '';
    in_searchVaccinated.checked = false;
    in_searchDewormed.checked = false;
    in_searchSterilized.checked = false;
    area_petsTable.classList.add('hidden');
}

// 4. Xử lý sự kiện export bảng hiện tại
//    Kích hoạt: #action__export được click
document.getElementById('action__export').addEventListener('click', function() {
    if(selects.length > 0) {
        if(confirm('Bạn muốn export danh sách hiện tại đúng không?')) {
            const data = JSON.stringify(selects);
            const ex = new Blob([data],{ type: "text/json;charset=utf-8" });
            saveAs(ex, "Search-results.json");
        }
    } else {
        alert('Chưa có danh sách được chọn')
    }
});