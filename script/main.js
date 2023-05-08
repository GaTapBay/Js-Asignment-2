'use strict';
//* ASIDE -- NAVBAR
// ở phiên bản này, phần menu được đưa vào tiêu chí đánh giá nên em sẽ sửa lại hệ thống hơn
// Thay vì thêm class active, em sẽ chỉ định rõ ràng rằng aside sẽ đóng hay mở ở body class
// Việc chỉ định trên body sẽ logic hơn về tính ảnh hưởng đến toàn bộ các thành phần khác trên trang
// Ví dụ: body.aside--close có khả năng tác động lên cả main, header, footer
const aside = {
    collapsePoint: 1200, // Thu gọn một phần nếu màn hình nhỏ hơn
    open: function() {
        document.body.classList.remove('aside--close');
        document.body.classList.add('aside--open');
        document.querySelector('.qh-aside').classList.add('active');
        // lưu cài đặt, nếu load lại trang, aside sẽ dựa trên thiết lập này
        dataSet('aside-open','1'); 
    },
    close: function() {
        document.body.classList.remove('aside--open');
        document.body.classList.add('aside--close');
        document.querySelector('.qh-aside').classList.remove('active');
        dataDel('aside-open'); 
    },
    toggle: function() {
        if( document.body.classList.contains('aside--open') ){
            this.close();
        } else {
            this.open();
        }
    }
};

// Khởi tạo aside
if(window.innerWidth >= aside.collapsePoint) {
	
		aside.open();
	
} else {
    aside.close();
}

// Toggle aside
let asideBtn = document.querySelectorAll('.JS--ToggleAside');
if(asideBtn.length > 0) {
    asideBtn.forEach(el => {
        el.addEventListener('click', function() {
            aside.toggle();
        });
    });
}

// Thu nhỏ aside khi màn hình bị thu lại
window.addEventListener("resize", function() {
    if(window.innerWidth < aside.collapsePoint) {
        aside.close();
    }
}, false);

// Xử lý sự kiện mở rông aside khi click vào vùng trống trên aside, chỉ hoạt động khi aside đang thu nhỏ
document.querySelector('.qh-aside').addEventListener('click', function(e) {
    if(e.target.classList.contains('qh-aside')) {
        if(window.innerWidth >= 992 && document.body.classList.contains('aside--close')) {
            aside.open();
        }
    }
});


//* DB
function dataSet(name,value) {
    const json = JSON.stringify(value);
    localStorage.setItem(name, json);
    return;
}
function dataGet(name) {
    const out = localStorage.getItem(name) ?? null;
    return JSON.parse(out);
}
function dataDel(name) {
    localStorage.removeItem(name);
    return;
}


//* POPUP
const popup = function (id) {
    const popupId = document.getElementById(id);
    const closeEl = document.querySelectorAll('.close');
    const overlays = document.querySelectorAll('.overlay');

    popupId.classList.remove('hidden');
    for (let i = 0; i < closeEl.length; i++) {
        closeEl[i].addEventListener('click', function () {
            popupId.classList.add('hidden');
        });
    }
    overlays.forEach(el => {
        el.addEventListener('click', function () {
            popupId.classList.add('hidden');
        });
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !popupId.classList.contains('hidden')) {
            popupId.classList.add('hidden');
        }
    });
};
const popdown = function (id) {
    document.getElementById(id).classList.add('hidden');
    return;
}