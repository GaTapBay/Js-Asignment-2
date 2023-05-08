'use strict';
// Assignment 02 - PRF192x_2.1-A_VN Kỹ thuật lập trình với Javascript
// Author: Phạm Quang Hoàn

// [I]. KHAI BÁO
const in_newBreedName = document.getElementById('in__new-breed-name');
const in_newBreedType = document.getElementById('in__new-breed-type');
const in_editBreedId = document.getElementById('in__edit-breed-id');
const in_editBreedName = document.getElementById('in__edit-breed-name');
const out_editBreedType = document.getElementById('out__edit-breed-type');

const area_breedsTable = document.getElementById('area__breeds-table');
const area_noData = document.getElementById('area__no-data');
const area_addBreedError = document.getElementById('area__add-breed-error');
const area_editBreedError = document.getElementById('area__edit-breed-error');

const btn_newBreed = document.getElementById('action__new-breed');
const btn_newBreedSubmit = document.getElementById('action__submit-new-breed');
const btn_editBreedSubmit = document.getElementById('btn__edit-breed-submit');


// [II]. DATABASES && GLOBAL
const pets = dataGet('pets') !== null ? dataGet('pets') : [];
const breeds = dataGet('breeds') !== null ? dataGet('breeds') : [];


// [III]. FUNCTION
// Kiểm tra thông tin breed bởi breed-id
const checkBreed = function (id) {
    const bidx = breeds.findIndex(x => x.id == id);
    if(bidx !== -1) {
        // Trả về thông tin breed nếu có
        return breeds[bidx];
    } else {
        // Trả về false nếu breed không tồn tại
        return false;
    }
}
// render breed
const renderBreedsTable = function(arr = breeds) {
    // Nếu không có data chỉ định, mặc định lấy danh sách tổng
    area_breedsTable.innerHTML = '';
    area_noData.classList.remove('hidden');
    if(arr.length > 0) {
        area_noData.classList.add('hidden');
        arr.forEach(obj => {
            // Lấy số lượng pet đang có trong chủng loại này
            let subCount = pets.filter(x => x.cat === obj.id).length;
            // Create row
            let row = document.createElement('tr');
            row.innerHTML = `<td>${obj['id']}</td>
            <td>${obj['name']}</td>
            <td>${obj['type']}</td>
            <td>${subCount}</td>
            <td>
                <button type="button" class="btn violet" onclick="editBreed('${obj['id']}')">Edit</button>
                <button type="button" class="btn red" onclick="deleteBreed('${obj['id']}')">Delete</button>
            </td>`;
            area_breedsTable.appendChild(row);
        });
    }
}

// [IV]. CORE
// 1. Render breeds data khi page load
//    Kích hoạt: Tự động
if(breeds.length > 0) renderBreedsTable();

// 2. Xử lý sự kiện hiển thị form thêm pet
//    Kích hoạt: btn_newBreed được click
btn_newBreed.addEventListener('click', function() {
    // Khởi động popup
    popup('popup__add-breed');
})

// 3. Xử lý sự kiện add breed form được submit
btn_newBreedSubmit.addEventListener('click', function() {
    const error = [];
    area_addBreedError.classList.add('hidden');

    // Kiem tra breed
    in_newBreedName.value = in_newBreedName.value.trim();
    if(in_newBreedName.value === '' ||  in_newBreedName.value == 0) {
        error.push('Tên giống không được để trống');
    }
    // Kiem tra type
    if(in_newBreedType.value === '') {
        error.push('Please select Type!');
    }
    // Kiểm tra giống đã có chưa
    if(breeds.findIndex(x => x.name === in_newBreedName.value && x.type === in_newBreedType.value) !== -1) {
        error.push('Giống đã tồn tại');
    }
    
    // Display error
    if(error.length > 0) {
        let errorMessage = '<ul>';
        error.forEach(er => {
            errorMessage += '<li>' + er + '</li>';
        });
        errorMessage += '</ul>';
        // Hiển thị danh sách các lỗi và ra màn hình
        area_addBreedError.innerHTML = errorMessage;
        area_addBreedError.classList.remove('hidden');
    } else {
        // Nếu không phát sinh lỗi, tiến hành đóng gói và thêm vào databases
        // Lấy breed.id cuối cùng trong cơ sở + 1 để luôn có id duy nhất và tăng dần
        const bid = (breeds.length > 0)? (breeds.slice(-1))[0].id + 1 : 100;
    
        const ins = {
            id: bid,
            name: in_newBreedName.value,
            type: in_newBreedType.value,
        }
        
        // Thêm vào csdl
        breeds.push(ins);
        dataSet('breeds',breeds);
        // Clean form
        in_newBreedName.value = '';
        in_newBreedType.value = '';
        area_addBreedError.innerHTML = '';
        // Render table
        renderBreedsTable();

        popdown('popup__add-breed');
    }
});

// 4. Xử lý sự kiên xóa breed bởi id
//    Kích hoạt: hàm deleteBreed được gọi
const deleteBreed = function (id) {
    if (confirm('Bạn thực sự muốn xóa giống: ' + id + '?\nTẤT CẢ THÚ NUÔI THUỘC CHỦNG LOẠI NÀY CŨNG SẼ BỊ XÓA THEO')) {
		const bidx = breeds.findIndex(x => x.id == id);
        if (bidx !== -1) {
            // Nếu tìm thấy breed tương ứng thì loại bỏ khỏi CSDL
            breeds.splice(bidx, 1);
            // Update CSDL
            dataSet('breeds', breeds);

            // Xóa tất cả pet thuộc chủng loại này
            const filters = pets.filter(x => x.cat == id);
            filters.forEach(obj => {
                let i = pets.findIndex(x => x.id === obj.id);
                pets.splice(i,1);
            });
            dataSet('pets', pets);

            renderBreedsTable();
            return true;
        }
        return false;
	}
    return false;
};

// 5. Xử lý sự kiện chỉnh sửa breed
//    Kích hoạt: hàm editBreed() được gọi
const editBreed = function(id) {
    const breed = checkBreed(id);
    if(breed) {
        // Nhập thông tin hiện tại lên form
        in_editBreedId.value = breed.id;
        in_editBreedName.value = breed.name;
        out_editBreedType.innerHTML = breed.type;
        popup('popup__edit-breed');
    } else {
        console.log('Breed không tồn tại hoặc đã bị xóa.');
    }
}

// 6. Xử lý sự kiện form edit được submit
//    Kích hoạt: btn_editBreedSubmit được click
btn_editBreedSubmit.addEventListener('click', function() {
    const error = [];
    area_editBreedError.classList.add('hidden');

    // Kiem tra breed
    in_editBreedName.value = in_editBreedName.value.trim();
    if(in_editBreedName.value === '' ||  in_editBreedName.value == 0) {
        error.push('Tên giống không được để trống');
    }
    
    // Display error
    if(error.length > 0) {
        let errorMessage = '<ul>';
        error.forEach(er => {
            errorMessage += '<li>' + er + '</li>';
        });
        errorMessage += '</ul>';
        // Hiển thị danh sách các lỗi ra màn hình
        area_editBreedError.innerHTML = errorMessage;
        area_editBreedError.classList.remove('hidden');
    } else {
        // Nếu không phát sinh lỗi, tiến hành đóng gói và update databases
        const bidx = breeds.findIndex(x => x.id == in_editBreedId.value);
        breeds[bidx].name = in_editBreedName.value;
        dataSet('breeds',breeds);

        // Chỉnh sửa tất cả pet thuộc danh mục này
        // Với mỗi kết quả được tìm thấy, tìm index của đối tượng chứa kết quả đó, chỉnh sửa lại pets dựa trên các index
        const filters = pets.filter(x => x.cat == breeds[bidx].id);
        filters.forEach(obj => {
            let pidx = pets.findIndex(x => x.id === obj.id);
            pets[pidx].type = breeds[bidx].type;
            pets[pidx].breed = breeds[bidx].name;
        });
        dataSet('pets', pets);

        // Render table
        renderBreedsTable();

        // Close popup
        popdown('popup__edit-breed');
    }
});