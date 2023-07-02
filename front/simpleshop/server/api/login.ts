import { access } from "fs";

export default defineEventHandler(async (e) => {

    interface Login {
        status: boolean,
        msg: string
    };
    interface Success extends Login {
        atoken: string,
        rtoken: string,
        rtokenTime: number,
        atokenTime: number
    };

    const data = await readBody(e);
    const checkCredentials : Login | Success = await $fetch('http://localhost/login/send', {
        method: 'POST',
        credentials: 'include',
        body: {
            email: data.email,
            password: data.password
        }
    });
    if('atoken' in checkCredentials && 'rtoken' in checkCredentials) {
        setCookie(e, 'access_token', checkCredentials.atoken, {path: '/', httpOnly: true, maxAge: checkCredentials.atokenTime});
        setCookie(e, 'refresh_token', checkCredentials.rtoken, {path: '/', httpOnly: true, maxAge: checkCredentials.rtokenTime});
        return {
            status: true,
            msg: 'loginsuccess'
        };
    }
    return {
        status: false,
        msg: 'loginfailed'
    };
});