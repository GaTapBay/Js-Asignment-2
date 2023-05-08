'use strict';
// Assignment 02 - PRF192x_2.1-A_VN Kỹ thuật lập trình với Javascript
// Author: Phạm Quang Hoàn

// [I]. KHAI BÁO
const in_newId = document.getElementById("in__new-id");
const in_newName = document.getElementById("in__new-name");
const in_newAge = document.getElementById("in__new-age");
const in_newType = document.getElementById("in__new-type");
const in_newWeight = document.getElementById("in__new-weight");
const in_newLength = document.getElementById("in__new-length");
const in_newColor = document.getElementById("in__new-color");
const in_newBreed = document.getElementById("in__new-breed");
const in_newVaccinated = document.getElementById("in__new-vaccinated");
const in_newDewormed = document.getElementById("in__new-dewormed");
const in_newSterilized = document.getElementById("in__new-sterilized");

const area_addNewError = document.getElementById("area__add-new-error");
const area_petsTable = document.getElementById("area__pets-table");
const area_noData = document.getElementById("area__no-data");
const area_addNewForm = document.getElementById('area__add-new-form');
const area_addNewFooter = document.getElementById('area__add-new-footer');
const area_filterOptions = document.getElementById('area__filter-options');
const area_filterClear = document.getElementById('area__filter-clear');

const btn_newPet = document.getElementById('action__new-pet');
const btn_submitNewPet = document.getElementById('action__submit-new-pet');



// [II]. DATABASES & GLOBAL
const pets = dataGet('pets') !== null ? dataGet('pets') : [];
const breeds = dataGet('breeds') !== null ? dataGet('breeds') : [];
let selects = []; // Tính năng mở rộng phần export


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
// Kiểm tra thông tin pet bởi id
const checkPet = function (id) {
    const petIndex = pets.findIndex(x => x.id == id);
    if(petIndex !== -1) {
        // Trả về thông tin pet nếu có
        return pets[petIndex];
    } else {
        // Trả về false nếu breed không tồn tại
        return false;
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
            <td><button type="button" class="btn red" onclick="deletePet('${obj['id']}')">Delete</button>
            </td>`;
            area_petsTable.appendChild(row);
        });
    }
}



// [IV]. CORE
// 1. Nếu có dữ liệu pets, triển khai hiển thị
//    Kích hoạt: Tự động
if( pets.length > 0 ) renderPets();

// 2. Xử lý sự kiện nút thêm pet
//    Kích hoạt: btn_newPet được click
btn_newPet.addEventListener('click', function(e) {
    // Kiểm tra csdl có breed nào chưa, nếu chưa có => Vô hiệu hóa form
    if(breeds.length === 0) {
        area_addNewForm.classList.add('freeze');
        btn_submitNewPet.classList.add('hidden');
        area_addNewFooter.innerHTML = '<div style="text-align: center; padding: 10px">Bạn cần thêm ít nhất 1 loại giống trước khi thực hiện hành động này!</div>';
    }
    // POPUP Form
    popup('popup__add-new');
});

// 3. Xử lý sự kiện người dùng submit form thêm pet
//    Kích hoạt: btn_submitNewPet được click
btn_submitNewPet.addEventListener('click', function () {

    const error = [];
    area_addNewError.classList.add('hidden');

    // Kiem tra id
    in_newId.value = in_newId.value.trim();
    if(in_newId.value === '' ||  in_newId.value == 0) {
        error.push('Pet ID không được để trống');
    } else {
        // Kiem tra id da ton tai chua
        if(checkPet(in_newId.value)) error.push('ID must be unique!')
    }
    // Kiem tra ten thu cung
    in_newName.value = in_newName.value.trim();
    if(in_newName.value === '') {
        error.push('Tên thú cưng không được để trống');
    }
    // Kiem tr age
    if(in_newAge.value === '') {
        error.push('Age không được để trống!');
    } else {
        in_newAge.value = parseInt(in_newAge.value);
        if(in_newAge < 1 || in_newAge > 15) error.push('Age must be between 1 and 15!');
    }
    // Kiem tr weight
    in_newWeight.value = Number(in_newWeight.value);
    if(in_newWeight.value < 1 || in_newWeight.value > 15) {
        error.push('Weight must be between 1 and 15!');
    }
    // Kiem tr length
    in_newLength.value = Number(in_newLength.value);
    if(in_newLength.value < 1 || in_newLength.value > 100) {
        error.push('Length must be between 1 and 100!');
    }
    // Kiem tra type
    if(in_newType.value === '') {
        error.push('Please select Type!');
    }
    // Kiem tra breed
    if(in_newBreed.value === '') {
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
        area_addNewError.innerHTML = errorMessage;
        area_addNewError.classList.remove('hidden');
    } else {
        // Nếu không phát sinh lỗi, tiến hành đóng gói và thêm vào databases
        // Lấy thông tin về catalog
        const breed = checkBreed(in_newBreed.value);
        const date = new Date();
        const today = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
        const ins = {
            id: in_newId.value,
            age: in_newAge.value,
            name: in_newName.value,
            weight: in_newWeight.value,
            length: in_newLength.value,
            color: in_newColor.value,
            vaccinated: in_newVaccinated.checked,
            dewormed: in_newDewormed.checked,
            sterilized: in_newSterilized.checked,
            cat: breed.id,
            type: breed.type,
            breed: breed.name,
            bmi: bmi(in_newWeight.value, in_newLength.value, in_newType.value),
            date: today
        }
          
        // Them vao pets và update CSDL
        pets.push(ins);
        dataSet('pets', pets);

        // Render bảng
        renderPets();

        // Clean form
        in_newId.value = '';
        in_newName.value = '';
        in_newAge.value = '';
        in_newType.value = '';
        in_newWeight.value = '';
        in_newLength.value = '';
        in_newColor.value = '#888888';
        in_newBreed.value = '';
        in_newVaccinated.checked = false;
        in_newDewormed.checked = false;
        in_newSterilized.checked = false;

        // Close popup
        popdown('popup__add-new');
    }
});

// 4. Xử lý sự kiện chọn type => hiển thị breed tương ứng
//    Kích hoạt: showBreed() được gọi.
const showBreed = function() {
    const filters = breeds.filter(x => x.type === in_newType.value);
    // nếu có kết quả sẽ unlock breed select và in danh sách breed ra option
    if(filters.length > 0) {
        let options = '';
        filters.forEach(obj => {
            options += `<option value="${obj.id}">${obj.name}</option>`;
        });
        in_newBreed.removeAttribute("disabled");
        in_newBreed.innerHTML = options;
    } else {
        // nếu không có kết quả, vô hiệu hóa bộ chọn breed
        in_newBreed.setAttribute("disabled", "disabled");
        in_newBreed.innerHTML = '';
    }
};

// 5. Xử lý sự kiện xóa pet
//    Kick hoạt: deletePet() được gọi
const deletePet = function (id) {
    const pidx = pets.findIndex(x => x.id == id);
    if (pidx !== -1) {
        if (confirm('Bạn thực sự muốn xóa pet: ' + id + '?')) {
            // Xoa phần tử thỏa mãn, render lại data, trả về true
            pets.splice(pidx, 1);
            dataSet('pets', pets);
            renderPets();
            return true;
        }
    }
    return false;
}

// 6. Tính năng bộ lọc healthy pet
//    Kích hoạt: showHealthyPet() được gọi
const showHealthyPet = function() {
    area_filterOptions.classList.add('hidden');
    area_filterClear.classList.remove('hidden');
    // Tạo danh sách tạm thời
    selects = pets.filter(x => x.vaccinated === true && x.dewormed === true && x.sterilized === true);
    renderPets(selects);
}

// 7. Tính năng bộ lọc ( mở rộng )
//    Kích hoạt: gọi hàm filterPet với att so sánh với value
const filterPet = function(att,value) {
    area_filterOptions.classList.add('hidden');
    area_filterClear.classList.remove('hidden');
    selects = pets.filter(x => x[att] === value);
    renderPets(selects);
}
//    Tắt bộ lọc
const clearFilter = function () {
    area_filterOptions.classList.remove('hidden');
    area_filterClear.classList.add('hidden');
    selects = [];
    renderPets(pets);
}

//console.log(pets);