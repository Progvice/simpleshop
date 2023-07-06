export default defineEventHandler(async (e : any) => {

    const access_token : string | undefined = getCookie(e, 'access_token');
    const refresh_token : string | undefined = getCookie(e, 'refresh_token');

    if(typeof refresh_token !== 'string') {
        return {
            status: false,
            msg: 'sessionexpired'
        };
    }
    const authHeader = `Bearer ${access_token}`;
    const readCategory = await $fetch.raw('http://localhost/admin/category', {
        method: 'GET',
        credentials: 'include',
        headers: {
            Authorization: authHeader,
            'X-Refresh-Token': refresh_token
        }
    });
    return readCategory._data;
});