import React from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router';
import { auth } from '../_action/user_action'

// eslint-disable-next-line import/no-anonymous-default-export
export default function (SpecifiComponent, option, adminRoute = null) {

    // option
    // null => 아무나 출입 가능 페이지
    // true => 로그인한 유저만 출입이 가능한 페이지
    // false => 로그인한 유저는 출입 불가능한 페이지
    function AuthenticationCheck(props) {
        const dispatch = useDispatch()

        useEffect(() => {
            dispatch(auth()).then((response) => {
                console.log(response)

                // 로그인 하지 않은 상태
                if (!response.payload.isAuth) {
                    if (option) {
                        props.history.push('/login')
                    }
                } else {
                    // 로그인 한 상태

                    if (adminRoute && !response.payload.isAdmin) {
                        // 어드민 페이지 접속시 (어드민 유무 판단)
                        props.history.push('/login')
                    } else {
                        // 나머지 일반 유저 중에서 다시 회원가입페이지나 로그인 페이지로 갈라고 하면 랜딩 페이지로 보냄
                        if (option === false) {
                            props.history.push('/')
                        }
                    }
                }
            })
        }, [dispatch, props.history])

        return (
            // children
            <SpecifiComponent />
        )
    }
    return withRouter(AuthenticationCheck)
}