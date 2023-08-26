import { useCallback, useState } from "react";
import { User, userLogin, aaa } from "./interface";



function App() {
  const [user, setUser] = useState<User>()
  const [userName, setUserName] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const login = useCallback(async () => {
    console.log(userName)
    const res = await userLogin(userName, password)
    const data = res.data
    setUser({ username: data.userInfo.username, email: data.userInfo.email })

    localStorage.setItem('access_token', data.accessToken)
    localStorage.setItem('refresh_token', data.refreshToken)
  }, [userName, password])

  const loginOut = () => {

  }

  const onUserName = (e: any) => {
    console.log(e)
    setUserName(e.target.value)
  }
  const onPassword = (e: any) => {
    setPassword(e.target.value)
  }

  return (
    <div>
      账号<input type="text" onInput={onUserName} />
      <br></br>
      密码<input type="text" onInput={onPassword} />
      <br></br>
      {
        user?.username
          ? <div>
              当前登录用户: {user.username}
              <button onClick={loginOut}>退出</button>
            </div> 
          : <button onClick={login}>登录</button>
      }
      <br></br>
      <button onClick={aaa}>aaa</button>
    </div>
  )
}

export default App;
