import React from "react";

function Signin() {
  return (
    <div class="container">
      <div class="row">
        <div class="col">
          <img class="signup-img" src="../img/image-3.png" alt="" />
          <img class="signup-img" src="../img/image-1.png" alt="" />
        </div>
        <div class="col section-signup">
          <div class="row">
            <form class="signup-form" action="" method="post">
              <h1>LOGO</h1>
              <label for="username">
                <div class="form-register__input">
                  <input id="username" type="text" placeholder="Tên đăng nhập*" oninput="" required />
                  <span id="username-error" class="error-message"></span>
                </div>
              </label>
              <label for="password">
                <div class="form-register__input">
                  <input id="password" type="text" placeholder="Mật khẩu*" oninput="" required />
                  <span id="password-error" class="error-message"></span>
                </div>
              </label>
            </form>
          </div>
          <div class="row">
            <a href="#">
              <p>Quên mật khẩu?</p>
            </a>
          </div>
          <div class="row">
            <button type="submit">
              <p>Đăng nhập</p>
            </button>
          </div>
          <hr />
          <div class="row">
            <button type="submit">
              <p>Đăng ký</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signin;
