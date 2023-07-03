export default defineEventHandler(async (e) => {
    //const categoryDetails = await readBody(e);
    
    const access_token : any = getCookie(e, 'access_token'); // If token is empty then backend will generate new token from refresh token
    const refresh_token : any = getCookie(e, 'refresh_token');
    const data = await readBody(e);
    if(typeof refresh_token === 'string') {
        const authHeader = `Bearer ${access_token}`;
        const createCategory = await $fetch.raw('http://localhost/admin/category/create', {
            method: 'POST',
            credentials: 'include',
            body: {
                name: data.name
            },
            headers: {
                Authorization: authHeader,
                'X-Refresh-Token': refresh_token
            }
        });
        if(createCategory.headers.get('token') !== null) {
            const token : any = createCategory.headers.get('token');
            setCookie(e, 'access_token', token, {path: '/', httpOnly: true, maxAge: 1800});
        }
        return createCategory._data;
    }
    return {
        status: false,
        msg: 'sessionexpired'
    };
});