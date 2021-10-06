import React from "react";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router";
import useInput from "../../../utils/hook/useInput";
import { registerUser } from "../../../_action/user_action";

const formStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100vh",
};

const formSortStyle = { display: "flex", flexDirection: "column" };

function RegisterPage(props) {
    const dispatch = useDispatch();
    const [email, emailOnChange] = useInput("");
    const [name, nameOnChange] = useInput("");
    const [password, passwordOnChange] = useInput("");
    const [confirmPassword, confirmPasswordOnChange] = useInput("");

    const onSubmitHandler = useCallback(
        (e) => {
            e.preventDefault();

            if (password !== confirmPassword) {
                return alert("패스워드가 일치하지 않습니다.");
            }
            const body = {
                email,
                name,
                password,
                confirmPassword,
            };
            dispatch(registerUser(body))
                .then((response) => {
                    if (response.payload.success) {
                        props.history.push("/login");
                    } else {
                        alert("failed sign up");
                    }
                })
                .catch((e) => {
                    console.log(e);
                });
        },
        [confirmPassword, dispatch, email, name, password, props.history]
    );

    return (
        <div style={formStyle}>
            <form style={formSortStyle} onSubmit={onSubmitHandler}>
                <label>Email</label>
                <input type="email" value={email} onChange={emailOnChange} />

                <label>Name</label>
                <input type="text" value={name} onChange={nameOnChange} />

                <label>Password</label>
                <input type="password" value={password} onChange={passwordOnChange} />

                <label>Confirm Password</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={confirmPasswordOnChange}
                />

                <br />
                <button type="submit">회원 가입</button>
            </form>
        </div>
    );
}

export default withRouter(RegisterPage);
