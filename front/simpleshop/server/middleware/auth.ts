export default defineEventHandler(async (event) => {
    const refresh_token : string | undefined = getCookie(event, 'refresh_token');
    const access_token : string | undefined = getCookie(event, 'access_token');

    if(access_token === undefined && typeof refresh_token === 'string') {
        const authHeader : string = `Bearer ${access_token}`;
        const checkToken : any = await $fetch.raw('http://localhost/users/auth', {
            method: 'POST',
            headers: {
                Authorization: authHeader,
                'X-Refresh-Token': refresh_token
            }
        });
        let token : string | null = checkToken.headers.get('token');
        // Sorry about these multiple if statements. We just have to be sure that everything goes right before setting any cookies to client.
        if(typeof token === 'string' && checkToken !== undefined) {
            if('msg' in checkToken._data) {
                if(checkToken._data.msg === 'tokenrenewed') {
                    setCookie(event, 'access_token', token, {path: '/', httpOnly: true, maxAge: 1800});
                }
            }
        }
    }
});