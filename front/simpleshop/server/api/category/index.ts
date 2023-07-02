export default defineEventHandler(async (e) => {
    const access_token : any = getCookie(e, 'access_token');
    const refresh_token : any = getCookie(e, 'refresh_token');

    if(typeof refresh_token === 'string') {
        const authHeader = `Bearer ${access_token}`;
        const readCategory : any = await $fetch.raw('http://localhost/admin/category', {
            method: 'GET',
            credentials: 'include',
            headers: {
                Authorization: authHeader,
                'X-Refresh-Token': refresh_token
            }
        });
        if(readCategory.headers.get('token') !== null) {
            const token : any = readCategory.headers.get('token');
            setCookie(e, 'access_token', token, {path: '/', httpOnly: true, maxAge: 1800});
        }
        console.log(readCategory._data);
        return readCategory._data;
    }
    return {
        status: false,
        msg: 'sessionexpired'
    };
});