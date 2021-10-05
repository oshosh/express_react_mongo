import React, { useCallback } from "react";
import useInput from "../../../utils/hook/useInput";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../_action/user_action";
import { withRouter } from 'react-router-dom';

const formStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "100vh",
};

const formSortStyle = { display: "flex", flexDirection: "column" };

function LoginPage(props) {
  const dispatch = useDispatch()
  const [email, emailOnChange] = useInput("");
  const [password, passwordOnChange] = useInput("");

  const onSubmitHandler = useCallback(
    (e) => {
      e.preventDefault();

      const body = {
        email, password
      }
      dispatch(loginUser(body))
        .then((response) => {
          if (response.payload.loginSuccess) {
            props.history.push('/')
          } else {
            alert('Error')
          }
        })
    },
    [dispatch, email, password, props.history]
  );

  return (
    <div style={formStyle}>
      <form style={formSortStyle} onSubmit={onSubmitHandler}>
        <label>Email</label>
        <input type="email" value={email} onChange={emailOnChange} />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={passwordOnChange}
        />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default withRouter(LoginPage);
