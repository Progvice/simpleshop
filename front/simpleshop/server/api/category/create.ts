export default defineEventHandler(async (e: any) => {
    //const categoryDetails = await readBody(e);
    
    const access_token : any = getCookie(e, 'access_token'); // If token is empty then backend will generate new token from refresh token
    const refresh_token : any = getCookie(e, 'refresh_token');
    const data = await readBody(e);
    if(typeof refresh_token !== 'string') {
        return {
            status: false,
            msg: 'sessionexpired'
        };
    }
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
    return createCategory._data;
});