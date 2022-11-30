import React from 'react';
import * as PropTypes from 'prop-types';
import {FormGroup, Input, Label} from "reactstrap";

const LoginPwdInputs = ({email, pwdChkErr}) => {
    return (
        <React.Fragment>
            <FormGroup>
                <Label htmlFor="email">логин (e-mail)</Label>
                <Input
                    type="text"
                    id="email"
                    placeholder="Введите e-mail"
                    defaultValue={email} />
            </FormGroup>
            <FormGroup>
                <Label htmlFor="password">новый пароль</Label>
                <Input
                    autoComplete="new-password"
                    type="password"
                    id="password" />
            </FormGroup>
            <FormGroup>
                <Label htmlFor="pwdChk">повторите пароль</Label>
                <Input
                    autoComplete="new-password"
                    type="password"
                    id="pwdChk" />
                {pwdChkErr && (
                    <span className="invalid-feedback d-inline-block">пароли не совпадают</span>
                )}
            </FormGroup>
        </React.Fragment>
    );
};

LoginPwdInputs.propTypes = {
    email: PropTypes.string,
    pwdChkErr: PropTypes.bool,
};

export default LoginPwdInputs;
