const $ = document.querySelector.bind(document);

let totalListUser = [];

fetch("user_data.txt")
  .then((response) => response.text())
  .then((text) => convertTextToData(text));

const loadData = () => {
  let template = "";
  for (let i = 0; i < totalListUser.length; i++) {
    template += `
    <tr class="table-body">
    <td>${totalListUser[i].id + ""}</td>
    <td>${totalListUser[i].ten_dang_nhap}</td>
    <td>${totalListUser[i].ten_nguoi_dung}</td>
    <td>${totalListUser[i].vai_tro}</td>
    <td>${totalListUser[i].ngay_bat_dau}</td>
    <td>${totalListUser[i].so_dien_thoai}</td>
    <td>${totalListUser[i].ngay_sinh}</td>
    <td>
      <button class="btn btn-update" onclick = {handleUpdateUser(${
        totalListUser[i].id
      })}>Sửa</button>
      <button class="btn btn-remove" onclick = {handleDeleteUser(${
        totalListUser[i].id
      })} >Xóa</button>
    </td>
  </tr>
    `;
  }

  $("#table").innerHTML = `
  <tr class="table-head">
  <th>STT</th>
  <th>Tên Đăng Nhập</th>
  <th>Tên Người Dùng</th>
  <th>Vai trò</th>
  <th>Ngày Bắt Đầu</th>
  <th>Số Điện Thoại</th>
  <th>Ngày Sinh</th>
  <th>Tùy Chỉnh</th>
</tr>
${template}
  `;
};

const convertTextToData = async (text) => {
  const array = text.split(";");
  for (let i = 0; i < array.length - 1; i++) {
    const eachItem = array[i].split("-");
    const itemObject = {
      id: eachItem[0][eachItem[0].length - 1],
      ten_dang_nhap: eachItem[1],
      ten_nguoi_dung: eachItem[2],
      vai_tro: eachItem[3],
      ngay_bat_dau: eachItem[4],
      so_dien_thoai: eachItem[5],
      ngay_sinh: eachItem[6],
    };
    totalListUser.push(itemObject);
  }

  loadData();
};

//Add new user
$("#form-add-user").onsubmit = function () {
  const ten_dang_nhap = $("#ten_dang_nhap").value;
  const ten_nguoi_dung = $("#ten_nguoi_dung").value;
  const vai_tro = $("#vai_tro").value;
  const ngay_bat_dau = $("#ngay_bat_dau").value;
  const so_dien_thoai = $("#so_dien_thoai").value;
  const ngay_sinh = $("#ngay_sinh").value;
  const id = Math.floor(Math.random() * 999999) + "";

  const itemObject = {
    id,
    ten_dang_nhap,
    ten_nguoi_dung,
    vai_tro,
    ngay_bat_dau,
    so_dien_thoai,
    ngay_sinh,
  };

  totalListUser.push(itemObject);
  loadData();
  $("#form-add-user").reset();
  modal.style.transform = "translateY(-100%)";
  alert("Thêm một người dùng mới thành công ");
};

/*Delete user is existed*/

const handleDeleteUser = (userId) => {
  const isDelete = confirm("Bạn chắc chắn sẽ xóa người dùng này chứ ?");
  if (isDelete) {
    const position = totalListUser.map((e) => e.id).indexOf(userId + "");

    if (position > -1) {
      totalListUser.splice(position, 1);
    }

    loadData();
  }
};

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.querySelector(".btn-add");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close");

// When the user clicks on the button, open the modal
btn.onclick = function () {
  modal.style.transform = "translateY(0)";
};

/* Update form */

var modalUpdate = $(".modal-update");

const buttonUpdate = $(".btn-update");

// When the user clicks on <span> (x), close the modal
span[0].onclick = function () {
  modal.style.transform = "translateY(-100%)";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

const handleUpdateUser = (userId) => {
  const userIsFound = totalListUser.find(
    (userInfor) => userInfor.id === userId + ""
  );

  const {
    ten_dang_nhap,
    ten_nguoi_dung,
    so_dien_thoai,
    ngay_bat_dau,
    ngay_sinh,
    vai_tro,
    id,
  } = userIsFound;

  //Enable the Modal
  $(".modal-update").style.transform = "translateY(0%)";

  $(".ten_dang_nhap").defaultValue = ten_dang_nhap;
  $(".ten_nguoi_dung").defaultValue = ten_nguoi_dung;
  $(".so_dien_thoai").defaultValue = so_dien_thoai;
  $(".ngay_bat_dau").defaultValue = ngay_bat_dau;
  $(".ngay_sinh").defaultValue = "22/03/2023";
  $(".vai_tro").defaultValue = vai_tro;
  $(".user-id").defaultValue = id;
};

const executeUpdate = () => {
  const ten_dang_nhap = $(".ten_dang_nhap").value;
  const ten_nguoi_dung = $(".ten_nguoi_dung").value;
  const so_dien_thoai = $(".so_dien_thoai").value;
  const ngay_bat_dau = $(".ngay_bat_dau").value;
  const ngay_sinh = $(".ngay_sinh").value;
  const vai_tro = $(".vai_tro").value;
  const id = $(".user-id").value;

  const userUpdate = {
    id,
    ten_dang_nhap,
    ten_nguoi_dung,
    so_dien_thoai,
    ngay_bat_dau,
    ngay_sinh,
    vai_tro,
  };

  const position = totalListUser.map((item) => item.id).indexOf(id);

  if (position > -1) {
    totalListUser[position] = userUpdate;

    loadData();

    alert("Cập nhật thông tin người dùng thành công");
    $(".modal-update").style.transform = "translateY(-100%)";
  }
};
$("#form-update-user").onsubmit = executeUpdate;

$(".search-user").addEventListener("keypress", function (event) {
  const keySearched = event.target.value;

  if (event.key === "Enter") {
    event.preventDefault();

    if (keySearched === "") {
      loadData();
    } else {
      const result = totalListUser.filter((data) => {
        if (data.ten_dang_nhap.search(keySearched) > -1) {
          return data;
        }
        return null;
      });

      if (result.length > 0) {
        let template = "";
        for (let i = 0; i < result.length; i++) {
          template += `
    <tr class="table-body">
    <td>${result[i].id + ""}</td>
    <td>${result[i].ten_dang_nhap}</td>
    <td>${result[i].ten_nguoi_dung}</td>
    <td>${result[i].vai_tro}</td>
    <td>${result[i].ngay_bat_dau}</td>
    <td>${result[i].so_dien_thoai}</td>
    <td>${result[i].ngay_sinh}</td>
    <td>
      <button class="btn btn-update" onclick = {handleUpdateUser(${
        result[i].id
      })}>Sửa</button>
      <button class="btn btn-remove" onclick = {handleDeleteUser(${
        result[i].id
      })} >Xóa</button>
    </td>
  </tr>
    `;
        }

        $("#table").innerHTML = `
  <tr class="table-head">
  <th>STT</th>
  <th>Tên Đăng Nhập</th>
  <th>Tên Người Dùng</th>
  <th>Vai trò</th>
  <th>Ngày Bắt Đầu</th>
  <th>Số Điện Thoại</th>
  <th>Ngày Sinh</th>
  <th>Tùy Chỉnh</th>
</tr>
${template}
  `;
      }
    }
  }
});

span[1].onclick = () => {
  $(".modal-update").style.transform = "translateY(-100%)";
};
