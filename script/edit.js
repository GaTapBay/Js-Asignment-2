'use strict';
// Assignment 02 - PRF192x_2.1-A_VN Kỹ thuật lập trình với Javascript
// Author: Phạm Quang Hoàn

// [I]. KHAI BÁO
const in_editId = document.getElementById("in__edit-id");
const in_editName = document.getElementById("in__edit-name");
const in_editAge = document.getElementById("in__edit-age");
const in_editType = document.getElementById("in__edit-type");
const in_editWeight = document.getElementById("in__edit-weight");
const in_editLength = document.getElementById("in__edit-length");
const in_editColor = document.getElementById("in__edit-color");
const in_editBreed = document.getElementById("in__edit-breed");
const in_editVaccinated = document.getElementById("in__edit-vaccinated");
const in_editDewormed = document.getElementById("in__edit-dewormed");
const in_editSterilized = document.getElementById("in__edit-sterilized");

const area_petsTable = document.getElementById("area__pets-table");
const area_noData = document.getElementById("area__no-data");
const area_editError = document.getElementById("area__edit-error");

const btn_submitEditPet = document.getElementById('action__submit-edit-pet');

// [II]. DATABASE && GLOBAL
const pets = dataGet('pets') !== null ? dataGet('pets') : [];
const breeds = dataGet('breeds') !== null ? dataGet('breeds') : [];

// [III]. FUNCTION
// Tính chỉ số bmi
const bmi = function (wh, lg, type = 'Dog') {
    type = type.toLowerCase();
    // Sử dụng switch để dễ phát triển ứng dụng hơn
    switch(type) {
        case 'dog':
            return ((wh * 703) / lg ** 2).toFixed(2);;
        break;
        case 'cat':
            return ((wh * 886) / lg ** 2).toFixed(2);;
        break;
        default:
            return '?';
    }
}

// render data bởi array, nếu không có dữ liệu vào, mặc định lấy danh sách pets từ global
const renderPets = function (arr = pets) {
    // Hiển thị thông báo chưa có dữ liệu
    area_petsTable.innerHTML = '';
    area_noData.classList.add('hidden');

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
            <td><button type="button" class="btn orange" onclick="editPet('${obj['id']}')">Edit</button>
            </td>`;
            area_petsTable.appendChild(row);
        });
    }
}

// Kiểm tra thông tin breed bởi breed-id
const checkBreed = function (id) {
    const breedIndex = breeds.findIndex(x => x.id == id);
    if(breedIndex !== -1) {
        // Trả về thông tin breed nếu có
        return breeds[breedIndex];
    } else {
        // Trả về false nếu breed không tồn tại
        return false;
    }
}

// [IV]. CORE
// 1. Hiển thị danh sách pet khi tải trang
//    Kích hoạt: tự động
if( pets.length > 0 ) renderPets();

// 2. Xử lý sự kiện nút Edit được bấm
//    Kích hoạt: editPet(id)
const editPet = function (id) {
    const pet = pets.find(x => x.id == id);
    area_editError.classList.add('hidden');
    // Khởi động popup form chỉnh sửa
    popup('popup__edit-pet');
    // Nhập thông thin hiện tại vào form
    in_editId.value = pet.id;
    in_editName.value = pet.name;
    in_editAge.value = pet.age;
    in_editColor.value = pet.color;
    in_editWeight.value = pet.weight;
    in_editLength.value = pet['length'];
    in_editType.value = pet.type;
    in_editBreed.value = pet.breed;
    in_editVaccinated.checked = pet.vaccinated;
    in_editDewormed.checked = pet.dewormed;
    in_editSterilized.checked = pet.sterilized;
    showBreed();
}

// 3. Xử lý sự kiện chọn type => hiển thị breed tương ứng
//    Kích hoạt: showBreed() được gọi.
const showBreed = function() {
    const filters = breeds.filter(x => x.type === in_editType.value);
    // nếu có kết quả sẽ unlock breed select và in danh sách breed ra option
    if(filters.length > 0) {
        let options = '';
        filters.forEach(obj => {
            options += `<option value="${obj.id}">${obj.name}</option>`;
        });
        in_editBreed.removeAttribute("disabled");
        in_editBreed.innerHTML = options;
    } else {
        // nếu không có kết quả, vô hiệu hóa bộ chọn breed
        in_editBreed.setAttribute("disabled", "disabled");
        in_editBreed.innerHTML = '';
    }
};

// 4. Xử lý sự kiện người dùng submit form edit pet
//    Kích hoạt: btn_submitEditPet được click
btn_submitEditPet.addEventListener('click', function () {
    
    const error = [];
    area_editError.classList.add('hidden');

    // Kiem tra ten thu cung
    in_editName.value = in_editName.value.trim();
    if(in_editName.value === '') {
        error.push('Tên thú cưng không được để trống');
    }
    // Kiem tr age
    if(in_editAge.value === '') {
        error.push('Age không được để trống!');
    } else {
        in_editAge.value = parseInt(in_editAge.value);
        if(in_editAge < 1 || in_editAge > 15) error.push('Age must be between 1 and 15!');
    }
    // Kiem tr weight
    in_editWeight.value = Number(in_editWeight.value);
    if(in_editWeight.value < 1 || in_editWeight.value > 15) {
        error.push('Weight must be between 1 and 15!');
    }
    // Kiem tr length
    in_editLength.value = Number(in_editLength.value);
    if(in_editLength.value < 1 || in_editLength.value > 100) {
        error.push('Length must be between 1 and 100!');
    }
    // Kiem tra breed
    if(in_editBreed.value === '') {
        error.push('Please select Breed!');
    }
    
    // Display error
    if(error.length > 0) {
        // Hiển thị danh sách các lỗi ra màn hình
        let errorMessage = '<ul>';
        error.forEach(er => {
            errorMessage += '<li>' + er + '</li>';
        });
        errorMessage += '</ul>';
        area_editError.innerHTML = errorMessage;
        area_editError.classList.remove('hidden');
    } else {
        // Nếu không phát sinh lỗi, tiến hành đóng gói và thêm vào databases
        // Lấy thông tin về catalog
        const pidx = pets.findIndex(x => x.id == in_editId.value);
        const breed = checkBreed(in_editBreed.value);
        const upd = {
            id: in_editId.value,
            age: in_editAge.value,
            name: in_editName.value,
            weight: in_editWeight.value,
            length: in_editLength.value,
            color: in_editColor.value,
            vaccinated: in_editVaccinated.checked,
            dewormed: in_editDewormed.checked,
            sterilized: in_editSterilized.checked,
            cat: breed.id,
            type: breed.type,
            breed: breed.name,
            bmi: bmi(in_editWeight.value, in_editLength.value, in_editType.value),
            date: pets[pidx].date
        }
          
        // update CSDL
        pets[pidx] = upd;
        dataSet('pets', pets);

        // Render bảng
        renderPets();

        // Clean form
        in_editId.value = '';
        in_editName.value = '';
        in_editAge.value = '';
        in_editType.value = '';
        in_editWeight.value = '';
        in_editLength.value = '';
        in_editColor.value = '#888888';
        in_editBreed.value = '';
        in_editVaccinated.checked = false;
        in_editDewormed.checked = false;
        in_editSterilized.checked = false;

        // Close popup
        popdown('popup__edit-pet');
    }
});