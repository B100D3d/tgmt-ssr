
export default (device: string, ip: string, time: string, name: string, role: string): string => {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <title>Авторизация</title>
    <style>
    * {
      color: white;
      font-family: Arial;
    }
    
    .root {
      width: 100%;
      background-color: #201e1e;
      padding: 20px 0;
    }
    .root .content {
      width: 70%;
      background-color: #2c2a2a;
      border-radius: 20px;
      padding: 20px;
      margin: 0 auto;
      box-sizing: border-box;
    }
    .root .content .header {
      display: flex;
      width: 100%;
      height: 150px;
      border-bottom: 2px solid #19ccf3;
      padding-bottom: 20px;
    }
    .root .content .header a {
      margin: auto;
      width: 160px;
      height: 112px;
    }
    .root .content .header a img {
      width: 100%;
    }
    .root .content .header .title {
      width: 70%;
      padding-left: 20%;
      box-sizing: border-box;
      text-align: right;
      margin: auto;
    }
    .root .content .header .title p {
      margin: 5px 0;
      text-align: right;
      font-size: 16px;
    }
    .root .content h1 {
      text-align: center;
      color: #19ccf3;
    }
    .root .content p {
      text-align: center;
      font-style: italic;
    }
    .root .content ul {
      width: 100%;
      list-style: none;
      box-sizing: border-box;
    }
    .root .content ul p {
      text-align: left;
      font-size: 20px;
    }
    .root .content .warn {
      text-align: center;
      color: red;
      font-size: 18px;
      font-style: italic;
    }
    .root .content .warn a {
      font-weight: bold;
    }
    
    @media (max-width: 1105px) {
      .root .content .header .title {
        padding-left: 5%;
      }
    }
    @media (max-width: 855px) {
      .root .content .header a {
        width: 100px;
        height: 70px;
      }
      .root .content .header .title {
        padding-left: 0;
        width: 70%;
      }
      .root .content .header .title p {
        font-size: 12px;
      }
    }
    @media (max-width: 600px) {
      .root .content {
        width: 95%;
        padding: 2px;
        padding-top: 10px;
      }
      .root .content .header {
        display: block;
        padding: 0;
      }
      .root .content .header a {
        display: block;
        margin: auto;
      }
      .root .content .header .title {
        padding-top: 20px;
        text-align: center;
        width: 100%;
      }
      .root .content .header .title p {
        text-align: center;
        font-size: 12px;
      }
      .root .content h1 {
        font-size: 18px;
      }
      .root .content p {
        font-size: 12px;
      }
      .root .content ul {
        padding: 0;
      }
      .root .content ul p {
        font-size: 12px;
      }
      .root .content .warn {
        font-size: 12px;
      }
    }
    
    /*# sourceMappingURL=style.css.map */
    
    </style>
</head>
<body>
    <div class="root">
        <div class="content">
            <div class="header">
                <a href="https://тгмт.рф" target="_blank"><img src="cid:logo" alt="Логотип"></a>
                <div class="title">
                    <p>Информатор пользователя личного кабинета</p>
                    <p>Туапсинского Гидрометеорологического Техникума</p>
                </div>
            </div>
            <h1>Выполнен вход с нового устройства</h1>
            <p>В аккаунт ${name} (${role}) был выполнен вход</p>
            <ul>
                <li>
                    <p>Устройство: ${device}</p>
                </li>
                <li>
                    <p>IP: ${ip}</p>
                </li>
                <li>
                    <p>Время входа: ${time}</p>
                </li>
            </ul>
            <p class="warn">Если вы не совершали данное действие, перейдите в 
            <a href="https://тгмт.рф/user/settings" target="_blank">настройки аккаунта</a> 
            и нажмите "Выйти на всех устройствах"</p>
        </div>
    </div>
</body>
</html>
    `
}